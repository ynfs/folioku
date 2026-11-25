"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backend, requireUser } from "@/lib/backend";
import { getTemplate } from "@/lib/templates";
import type { PortfolioData } from "@/lib/types";

export type FormState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeNext(value: FormDataEntryValue | null): string {
  const v = typeof value === "string" ? value : "";
  // Hanya izinkan path internal agar tidak bisa dipakai untuk mengalihkan ke situs lain.
  return v.startsWith("/") && !v.startsWith("//") ? v : "/dashboard";
}

// ---------- Akun ----------

export async function signUpAction(_: FormState, form: FormData): Promise<FormState> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!name) return { error: "Nama wajib diisi." };
  if (!EMAIL_RE.test(email)) return { error: "Format email tidak valid." };
  if (password.length < 8) return { error: "Password minimal 8 karakter." };

  const res = await backend.signUp(name, email, password);
  if (!res.ok) return { error: res.error };
  redirect(safeNext(form.get("next")));
}

export async function signInAction(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Isi email dan password." };

  const res = await backend.signIn(email, password);
  if (!res.ok) return { error: res.error };
  redirect(safeNext(form.get("next")));
}

export async function signOutAction() {
  await backend.signOut();
  redirect("/");
}

// ---------- Proyek ----------

export async function createProjectAction(form: FormData) {
  const templateId = String(form.get("templateId") ?? "");
  const user = await requireUser(`/templates`);
  const template = getTemplate(templateId);
  if (!template) throw new Error("Template tidak ditemukan");

  const project = await backend.createProject(user.id, {
    name: `Portofolio ${template.name}`,
    templateId: template.id,
    data: { theme: structuredClone(template.theme), sections: structuredClone(template.sections) },
  });
  redirect(`/editor/${project.id}`);
}

function isPortfolioData(d: unknown): d is PortfolioData {
  if (!d || typeof d !== "object") return false;
  const x = d as PortfolioData;
  return (
    typeof x.theme === "object" &&
    x.theme !== null &&
    typeof x.theme.fontHeading === "string" &&
    Array.isArray(x.sections) &&
    x.sections.every((s) => s && typeof s.id === "string" && typeof s.type === "string" && typeof s.props === "object")
  );
}

export async function saveProjectAction(id: string, data: PortfolioData): Promise<{ ok: boolean; error?: string }> {
  const user = await backend.getCurrentUser();
  if (!user) return { ok: false, error: "Sesi berakhir. Silakan masuk lagi." };
  if (!isPortfolioData(data)) return { ok: false, error: "Data tidak valid." };
  if (JSON.stringify(data).length > 500_000) return { ok: false, error: "Data terlalu besar." };
  try {
    await backend.updateProject(id, user.id, { data });
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menyimpan." };
  }
}

export async function renameProjectAction(id: string, name: string) {
  const user = await requireUser();
  const clean = name.trim().slice(0, 80);
  if (!clean) return;
  await backend.updateProject(id, user.id, { name: clean });
  revalidatePath("/dashboard");
}

export async function deleteProjectAction(form: FormData) {
  const user = await requireUser();
  await backend.deleteProject(String(form.get("id")), user.id);
  revalidatePath("/dashboard");
}

// ---------- Publish ----------

const RESERVED = new Set(["admin", "api", "app", "login", "daftar", "dashboard", "editor", "templates", "www"]);

export async function publishAction(id: string, rawSlug: string): Promise<{ error?: string; slug?: string }> {
  const user = await requireUser();
  const slug = rawSlug.trim().toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/.test(slug)) {
    return { error: "Gunakan 3–40 karakter: huruf kecil, angka, dan tanda hubung (-)." };
  }
  if (RESERVED.has(slug)) return { error: "Alamat ini tidak bisa dipakai." };
  const error = await backend.publish(id, user.id, slug);
  if (error) return { error };
  revalidatePath(`/p/${slug}`);
  revalidatePath("/dashboard");
  return { slug };
}

export async function unpublishAction(id: string, slug: string | null) {
  const user = await requireUser();
  await backend.unpublish(id, user.id);
  if (slug) revalidatePath(`/p/${slug}`);
  revalidatePath("/dashboard");
}
