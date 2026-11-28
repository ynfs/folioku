"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { backend, requireUser } from "@/lib/backend";
import { ORDER_PAY_HOURS, PLANS, invitationAccess, isPlanKey, isPremiumTemplate, publishBlock } from "@/lib/billing";
import { blankCanvas } from "@/lib/sections";
import { CATEGORIES, STYLES, TEMPLATES, parseKind } from "@/lib/templates";
import { findTemplate } from "@/lib/templates-server";
import type { PortfolioData, ProductKind, Template, TemplateCategory, TemplateStyle } from "@/lib/types";

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
  const template = await findTemplate(templateId, { allowDraft: user.role === "admin" });
  if (!template) throw new Error("Template tidak ditemukan");

  const project = await backend.createProject(user.id, {
    name: `${{ invitation: "Undangan", proposal: "Proposal", portfolio: "Portofolio" }[template.kind ?? "portfolio"]} ${template.name}`,
    templateId: template.id,
    kind: template.kind ?? "portfolio",
    data: { theme: structuredClone(template.theme), sections: structuredClone(template.sections), pages: structuredClone(template.pages ?? []) },
  });
  redirect(`/editor/${project.id}`);
}

function validSections(list: unknown): boolean {
  return Array.isArray(list) && list.every((s) => s && typeof s.id === "string" && typeof s.type === "string" && typeof s.props === "object");
}

function isPortfolioData(d: unknown): d is PortfolioData {
  if (!d || typeof d !== "object") return false;
  const x = d as PortfolioData;
  return (
    typeof x.theme === "object" &&
    x.theme !== null &&
    typeof x.theme.fontHeading === "string" &&
    Array.isArray(x.sections) &&
    validSections(x.sections) &&
    (x.pages === undefined ||
      (Array.isArray(x.pages) &&
        x.pages.length <= 30 &&
        x.pages.every((p) => p && typeof p.id === "string" && typeof p.title === "string" && /^[a-z0-9-]{1,40}$/.test(p.slug) && validSections(p.sections))))
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

export async function publishAction(
  id: string,
  rawSlug: string,
): Promise<{ error?: string; slug?: string; upgrade?: { href: string; cta: string } }> {
  const user = await requireUser();
  const slug = rawSlug.trim().toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/.test(slug)) {
    return { error: "Gunakan 3–40 karakter: huruf kecil, angka, dan tanda hubung (-)." };
  }
  if (RESERVED.has(slug)) return { error: "Alamat ini tidak bisa dipakai." };

  // Cek paket: template premium, masa aktif gratis, dan batas proyek terbit.
  const project = await backend.getProject(id, user.id);
  if (!project) return { error: "Proyek tidak ditemukan." };
  const [template, paidOrders, all] = await Promise.all([
    findTemplate(project.templateId, { allowDraft: true }),
    backend.paidOrders(user.id),
    backend.listProjects(user.id),
  ]);
  const kind = project.kind ?? "portfolio";
  const block = publishBlock({
    kind,
    projectId: project.id,
    publishedAt: project.publishedAt,
    templatePremium: template ? isPremiumTemplate(template) : false,
    paidOrders,
    isAdmin: user.role === "admin",
    otherPublished: all.filter((p) => p.id !== project.id && p.published && (p.kind ?? "portfolio") !== "invitation").length,
  });
  if (block) return { error: block.error, upgrade: { href: block.href, cta: block.cta } };

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

// ---------- Paket & pembayaran ----------

/** Membuat pesanan paket lalu membuka halaman pembayaran DANA. */
export async function createOrderAction(form: FormData) {
  const plan = form.get("plan");
  const rawProject = String(form.get("projectId") ?? "");
  const user = await requireUser("/harga");
  if (!isPlanKey(plan)) redirect("/harga");
  const isInvitationPlan = PLANS[plan].product === "undangan";

  let projectId: string | null = null;
  if (isInvitationPlan) {
    const project = rawProject ? await backend.getProject(rawProject, user.id) : null;
    if (!project || project.kind !== "invitation") redirect(`/bayar?paket=${plan}`);
    projectId = project.id;
    if (plan === "upgrade-premium") {
      const access = invitationAccess(await backend.paidOrders(user.id), project.id, project.publishedAt);
      if (access.tier !== "basic") redirect(`/bayar?paket=premium&proyek=${project.id}`);
    }
  }

  // Pakai lagi pesanan yang masih menunggu pembayaran untuk paket & proyek yang sama.
  const open = (await backend.listOrders(user.id)).find(
    (o) => o.plan === plan && o.projectId === projectId && o.status === "menunggu" && Date.now() - Date.parse(o.createdAt) < ORDER_PAY_HOURS * 3_600_000,
  );
  const order = open ?? (await backend.createOrder(user.id, { plan, projectId }));
  revalidatePath("/dashboard/tagihan");
  redirect(`/bayar/${order.id}`);
}

/** Bukti transfer harus berupa file yang diunggah pengguna ini lewat /api/upload. */
function isOwnUpload(url: string, userId: string): boolean {
  if (/^\/api\/files\/[0-9a-f-]{36}\.(png|jpg|webp|gif)$/.test(url)) return true;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!base && url.startsWith(`${base}/storage/v1/object/public/assets/${userId}/`);
}

export async function submitProofAction(orderId: string, proofUrl: string, senderName: string): Promise<{ ok: boolean; error?: string }> {
  const user = await backend.getCurrentUser();
  if (!user) return { ok: false, error: "Sesi berakhir. Silakan masuk lagi." };
  const name = senderName.trim().slice(0, 80);
  if (!name) return { ok: false, error: "Isi nama atau nomor DANA pengirim." };
  if (!isOwnUpload(proofUrl, user.id)) return { ok: false, error: "Unggah foto bukti transfer dulu." };
  const ok = await backend.submitOrderProof(orderId, user.id, { proofUrl, senderName: name });
  if (!ok) return { ok: false, error: "Pesanan tidak bisa diperbarui." };
  revalidatePath(`/bayar/${orderId}`);
  revalidatePath("/admin/pembayaran");
  return { ok: true };
}

/** Admin: tandai pesanan lunas (paket langsung aktif) atau tolak. */
export async function reviewOrderAction(form: FormData) {
  const admin = await requireAdmin();
  const status = String(form.get("status"));
  if (status !== "lunas" && status !== "ditolak") return;
  await backend.setOrderStatus(String(form.get("id")), admin.id, status, String(form.get("note") ?? "").trim());
  revalidatePath("/admin/pembayaran");
  revalidatePath("/dashboard");
}

// ---------- Template (khusus admin) ----------

async function requireAdmin() {
  const user = await requireUser("/admin");
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

const DEFAULT_THEME = TEMPLATES[0].theme;

/** Membuat template baru: kosong, salinan template lain, atau dari proyek. */
export async function createTemplateAction(form: FormData) {
  const user = await requireAdmin();
  const source = String(form.get("source") ?? "blank");
  const projectId = String(form.get("projectId") ?? "");

  let base: { name: string; category: TemplateCategory; kind: ProductKind; style?: TemplateStyle; description: string; tags: string[]; data: PortfolioData };
  if (projectId) {
    const project = await backend.getProject(projectId, user.id);
    if (!project) throw new Error("Proyek tidak ditemukan");
    const kind = project.kind ?? "portfolio";
    base = { name: project.name, category: kind === "invitation" ? "pernikahan" : kind === "proposal" ? "penawaran" : "personal", kind, description: "", tags: [], data: project.data };
  } else if (source !== "blank") {
    const t = await findTemplate(source, { allowDraft: true });
    if (!t) throw new Error("Template sumber tidak ditemukan");
    base = { name: `${t.name} (salinan)`, category: t.category, kind: t.kind ?? "portfolio", style: t.style, description: t.description, tags: t.tags, data: { theme: t.theme, sections: t.sections, pages: t.pages } };
  } else {
    const kind = parseKind(form.get("kind"));
    base = {
      name: kind === "invitation" ? "Template undangan baru" : kind === "proposal" ? "Template proposal baru" : "Template baru",
      category: kind === "invitation" ? "pernikahan" : kind === "proposal" ? "penawaran" : "personal",
      kind,
      description: "",
      tags: [],
      data: { theme: DEFAULT_THEME, sections: [blankCanvas()] },
    };
  }

  const template: Template = {
    id: `tpl-custom-${randomUUID().slice(0, 8)}`,
    name: base.name,
    category: base.category,
    kind: base.kind,
    style: base.style,
    description: base.description,
    tags: base.tags,
    theme: structuredClone(base.data.theme),
    sections: structuredClone(base.data.sections),
    pages: structuredClone(base.data.pages ?? []),
    published: false,
  };
  await backend.createTemplate(user.id, template);
  redirect(`/admin/templates/${template.id}`);
}

export async function saveTemplateAction(id: string, data: PortfolioData): Promise<{ ok: boolean; error?: string }> {
  const user = await backend.getCurrentUser();
  if (!user || user.role !== "admin") return { ok: false, error: "Hanya admin yang bisa mengubah template." };
  if (!isPortfolioData(data)) return { ok: false, error: "Data tidak valid." };
  if (JSON.stringify(data).length > 500_000) return { ok: false, error: "Data terlalu besar." };
  try {
    await backend.updateTemplate(id, { theme: data.theme, sections: data.sections, pages: data.pages ?? [] });
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menyimpan." };
  }
}

export interface TemplateMeta {
  name: string;
  category: TemplateCategory;
  style?: TemplateStyle;
  description: string;
  tags: string[];
  published: boolean;
}

export async function updateTemplateMetaAction(id: string, meta: TemplateMeta): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const name = meta.name.trim().slice(0, 80);
  if (!name) return { ok: false, error: "Nama template wajib diisi." };
  if (!CATEGORIES.some((c) => c.value === meta.category)) return { ok: false, error: "Kategori tidak valid." };
  await backend.updateTemplate(id, {
    name,
    category: meta.category,
    // Jenis produk mengikuti kategori (mis. "pernikahan" → undangan).
    kind: CATEGORIES.find((c) => c.value === meta.category)?.kind ?? "portfolio",
    ...(meta.style && STYLES.some((s) => s.value === meta.style) ? { style: meta.style } : {}),
    description: meta.description.trim().slice(0, 200),
    tags: meta.tags.map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 10),
    published: !!meta.published,
  });
  revalidatePath("/templates");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteTemplateAction(form: FormData) {
  await requireAdmin();
  await backend.deleteTemplate(String(form.get("id")));
  revalidatePath("/admin");
  revalidatePath("/templates");
}

export async function toggleTemplatePublishAction(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const t = await backend.getTemplate(id);
  if (!t) return;
  await backend.updateTemplate(id, { published: !t.published });
  revalidatePath("/admin");
  revalidatePath("/templates");
}
