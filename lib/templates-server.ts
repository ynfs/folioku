import "server-only";
import { backend } from "@/lib/backend";
import { TEMPLATES } from "@/lib/templates";
import type { Template } from "@/lib/types";

// Template bawaan (file JSON) + template buatan admin (database).

/** Template yang tampil di galeri: bawaan dan buatan admin yang sudah diterbitkan. */
export async function galleryTemplates(): Promise<Template[]> {
  const custom = await backend.listTemplates().catch(() => []);
  return [...custom, ...TEMPLATES];
}

/** Mencari template untuk dipakai. Draf hanya bisa dipakai admin. */
export async function findTemplate(id: string, opts?: { allowDraft?: boolean }): Promise<Template | null> {
  const builtin = TEMPLATES.find((t) => t.id === id);
  if (builtin) return builtin;
  const t = await backend.getTemplate(id);
  if (!t || (!t.published && !opts?.allowDraft)) return null;
  return t;
}
