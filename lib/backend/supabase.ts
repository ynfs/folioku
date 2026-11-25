import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Page, PortfolioData, Project, Role, Section, Template, TemplateCategory, Theme } from "@/lib/types";
import type { AuthResult, Backend } from "./types";

interface TemplateRow {
  id: string;
  name: string;
  category: string;
  description: string | null;
  tags: string[] | null;
  data: { theme: Theme; sections: Section[]; pages?: Page[] };
  published: boolean;
  updated_at: string;
}

const TEMPLATE_COLUMNS = "id, name, category, description, tags, data, published, updated_at";

function toTemplate(r: TemplateRow): Template {
  return {
    id: r.id,
    name: r.name,
    category: r.category as TemplateCategory,
    description: r.description ?? "",
    tags: r.tags ?? [],
    theme: r.data.theme,
    sections: r.data.sections,
    pages: r.data.pages ?? [],
    published: r.published,
    builtin: false,
    updatedAt: r.updated_at,
  };
}

// MODE SUPABASE: Supabase Auth untuk login, PostgreSQL untuk data, Storage untuk gambar.
// Skema tabel dan kebijakan keamanan (RLS) ada di supabase/schema.sql.

export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Dipanggil dari Server Component: cookie diperbarui oleh proxy.ts.
        }
      },
    },
  });
}

interface ProjectRow {
  id: string;
  owner_id: string;
  template_id: string;
  name: string;
  data: PortfolioData;
  created_at: string;
  updated_at: string;
  publications: { slug: string; published: boolean } | { slug: string; published: boolean }[] | null;
}

const PROJECT_COLUMNS = "id, owner_id, template_id, name, data, created_at, updated_at, publications(slug, published)";

function toProject(r: ProjectRow): Project {
  const pub = Array.isArray(r.publications) ? r.publications[0] : r.publications;
  return {
    id: r.id,
    ownerId: r.owner_id,
    templateId: r.template_id,
    name: r.name,
    data: r.data,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    slug: pub?.slug ?? null,
    published: pub?.published ?? false,
  };
}

function translateAuthError(message: string): string {
  if (/already registered|already been registered/i.test(message)) return "Email sudah terdaftar.";
  if (/invalid login credentials/i.test(message)) return "Email atau password salah.";
  if (/email not confirmed/i.test(message)) return "Email belum dikonfirmasi. Cek kotak masuk email kamu.";
  return message;
}

export const supabaseBackend: Backend = {
  mode: "supabase",

  async getCurrentUser() {
    const sb = await supabaseServer();
    const { data } = await sb.auth.getUser();
    if (!data.user) return null;
    const { data: profile } = await sb.from("users").select("name, role").eq("id", data.user.id).maybeSingle();
    return {
      id: data.user.id,
      email: data.user.email ?? "",
      name: profile?.name ?? (data.user.user_metadata?.name as string) ?? "",
      role: (profile?.role as Role) ?? "client",
    };
  },

  async signUp(name, email, password): Promise<AuthResult> {
    const sb = await supabaseServer();
    const { data, error } = await sb.auth.signUp({ email, password, options: { data: { name } } });
    if (error) return { ok: false, error: translateAuthError(error.message) };
    if (!data.session) {
      return { ok: false, error: "Akun dibuat. Cek email kamu untuk konfirmasi, lalu masuk." };
    }
    return { ok: true };
  },

  async signIn(email, password): Promise<AuthResult> {
    const sb = await supabaseServer();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return error ? { ok: false, error: translateAuthError(error.message) } : { ok: true };
  },

  async signOut() {
    const sb = await supabaseServer();
    await sb.auth.signOut();
  },

  async listProjects(userId) {
    const sb = await supabaseServer();
    const { data, error } = await sb
      .from("projects")
      .select(PROJECT_COLUMNS)
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as unknown as ProjectRow[]).map(toProject);
  },

  async getProject(id, userId) {
    const sb = await supabaseServer();
    const { data } = await sb.from("projects").select(PROJECT_COLUMNS).eq("id", id).eq("owner_id", userId).maybeSingle();
    return data ? toProject(data as unknown as ProjectRow) : null;
  },

  async createProject(userId, { name, templateId, data }) {
    const sb = await supabaseServer();
    const { data: row, error } = await sb
      .from("projects")
      .insert({ owner_id: userId, template_id: templateId, name, data })
      .select(PROJECT_COLUMNS)
      .single();
    if (error) throw error;
    return toProject(row as unknown as ProjectRow);
  },

  async updateProject(id, userId, patch) {
    const sb = await supabaseServer();
    const { error } = await sb
      .from("projects")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("owner_id", userId);
    if (error) throw error;
  },

  async deleteProject(id, userId) {
    const sb = await supabaseServer();
    const { error } = await sb.from("projects").delete().eq("id", id).eq("owner_id", userId);
    if (error) throw error;
  },

  async publish(projectId, userId, slug) {
    const sb = await supabaseServer();
    const { error } = await sb.from("publications").upsert(
      { project_id: projectId, owner_id: userId, slug, published: true, published_at: new Date().toISOString() },
      { onConflict: "project_id" },
    );
    if (error) {
      if (error.code === "23505") return "Alamat ini sudah dipakai. Coba yang lain.";
      return error.message;
    }
    return null;
  },

  async unpublish(projectId, userId) {
    const sb = await supabaseServer();
    await sb.from("publications").update({ published: false }).eq("project_id", projectId).eq("owner_id", userId);
  },

  async getPublication(slug) {
    const sb = await supabaseServer();
    const { data } = await sb
      .from("publications")
      .select("slug, projects(name, data), users(name)")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (!data) return null;
    const row = data as unknown as {
      slug: string;
      projects: { name: string; data: PortfolioData } | null;
      users: { name: string } | null;
    };
    if (!row.projects) return null;
    return { slug: row.slug, name: row.projects.name, data: row.projects.data, ownerName: row.users?.name ?? "" };
  },

  async uploadImage(userId, file) {
    const sb = await supabaseServer();
    const ext = (file.type.split("/")[1] || "png").replace("jpeg", "jpg");
    const objectPath = `${userId}/${randomUUID()}.${ext}`;
    const { error } = await sb.storage.from("assets").upload(objectPath, file, { contentType: file.type });
    if (error) throw error;
    const url = sb.storage.from("assets").getPublicUrl(objectPath).data.publicUrl;
    await sb.from("assets").insert({ owner_id: userId, path: objectPath, url });
    return url;
  },

  async listTemplates(opts) {
    const sb = await supabaseServer();
    let q = sb.from("templates").select(TEMPLATE_COLUMNS).order("updated_at", { ascending: false });
    if (!opts?.includeDrafts) q = q.eq("published", true);
    const { data, error } = await q;
    if (error) throw error;
    return (data as unknown as TemplateRow[]).map(toTemplate);
  },

  async getTemplate(id) {
    const sb = await supabaseServer();
    const { data } = await sb.from("templates").select(TEMPLATE_COLUMNS).eq("id", id).maybeSingle();
    return data ? toTemplate(data as unknown as TemplateRow) : null;
  },

  async createTemplate(userId, t) {
    const sb = await supabaseServer();
    const { data, error } = await sb
      .from("templates")
      .insert({
        id: t.id,
        name: t.name,
        category: t.category,
        description: t.description,
        tags: t.tags,
        data: { theme: t.theme, sections: t.sections, pages: t.pages ?? [] },
        published: !!t.published,
        created_by: userId,
      })
      .select(TEMPLATE_COLUMNS)
      .single();
    if (error) throw error;
    return toTemplate(data as unknown as TemplateRow);
  },

  async updateTemplate(id, patch) {
    const sb = await supabaseServer();
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const k of ["name", "category", "description", "tags", "published"] as const) {
      if (patch[k] !== undefined) row[k] = patch[k];
    }
    if (patch.theme || patch.sections || patch.pages) {
      const current = await this.getTemplate(id);
      if (!current) throw new Error("Template tidak ditemukan");
      row.data = { theme: patch.theme ?? current.theme, sections: patch.sections ?? current.sections, pages: patch.pages ?? current.pages ?? [] };
    }
    const { error } = await sb.from("templates").update(row).eq("id", id);
    if (error) throw error;
  },

  async deleteTemplate(id) {
    const sb = await supabaseServer();
    const { error } = await sb.from("templates").delete().eq("id", id);
    if (error) throw error;
  },

  async adminStats() {
    const sb = await supabaseServer();
    const [users, projects, published] = await Promise.all([
      sb.from("users").select("id", { count: "exact", head: true }),
      sb.from("projects").select("template_id"),
      sb.from("publications").select("project_id", { count: "exact", head: true }).eq("published", true),
    ]);
    const usage: Record<string, number> = {};
    for (const p of (projects.data ?? []) as { template_id: string }[]) usage[p.template_id] = (usage[p.template_id] ?? 0) + 1;
    return { users: users.count ?? 0, projects: projects.data?.length ?? 0, published: published.count ?? 0, usage };
  },
};
