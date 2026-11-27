import type { ProductKind, Template, TemplateCategory, TemplateStyle } from "./types";
import minimalis from "@/templates/tpl-minimalis-01.json";
import klasik from "@/templates/tpl-klasik-01.json";
import retro from "@/templates/tpl-retro-01.json";
import editorial from "@/templates/tpl-editorial-01.json";
import modernGelap from "@/templates/tpl-modern-gelap-01.json";
import kreatif from "@/templates/tpl-kreatif-01.json";
import kanvas from "@/templates/tpl-kanvas-01.json";
import undanganElegan from "@/templates/tpl-undangan-elegan.json";
import undanganRustic from "@/templates/tpl-undangan-rustic.json";
import undanganUltah from "@/templates/tpl-undangan-ultah.json";
import undanganKhitanan from "@/templates/tpl-undangan-khitanan.json";
import undanganAcara from "@/templates/tpl-undangan-acara.json";
import adatJawa from "@/templates/tpl-adat-jawa.json";
import adatSunda from "@/templates/tpl-adat-sunda.json";
import adatMinang from "@/templates/tpl-adat-minang.json";
import adatBali from "@/templates/tpl-adat-bali.json";
import adatBatak from "@/templates/tpl-adat-batak.json";
import retroPernikahan from "@/templates/tpl-retro-pernikahan.json";
import retroUltah from "@/templates/tpl-retro-ultah.json";
import retroKhitanan from "@/templates/tpl-retro-khitanan.json";
import retroReuni from "@/templates/tpl-retro-reuni.json";
import retroCompany from "@/templates/tpl-retro-company.json";
import retroStudioFoto from "@/templates/tpl-retro-studio-foto.json";
// 100 template hasil generator (lihat scripts/generate-koleksi.mjs)
import koleksi from "@/templates/koleksi-100.json";

// ---------------- Klasifikasi ----------------

/** Produk Safantara (tingkat 1). */
export const PRODUCTS: { value: ProductKind; label: string; short: string; description: string }[] = [
  { value: "portfolio", label: "Portofolio & Company Profile", short: "Portofolio", description: "Situs portofolio pribadi atau profil perusahaan." },
  { value: "invitation", label: "Undangan Digital", short: "Undangan", description: "Undangan pernikahan, ulang tahun, khitanan, wisuda, dan acara." },
];

/** Kategori (tingkat 2): jenis acara untuk undangan, bidang untuk portofolio. */
export const CATEGORIES: { value: TemplateCategory; label: string; kind: ProductKind }[] = [
  { value: "pernikahan", label: "Pernikahan", kind: "invitation" },
  { value: "adat", label: "Pernikahan Adat", kind: "invitation" },
  { value: "lamaran", label: "Lamaran & Tunangan", kind: "invitation" },
  { value: "ulang-tahun", label: "Ulang Tahun", kind: "invitation" },
  { value: "khitanan", label: "Khitanan & Aqiqah", kind: "invitation" },
  { value: "wisuda", label: "Wisuda", kind: "invitation" },
  { value: "syukuran", label: "Syukuran & Pengajian", kind: "invitation" },
  { value: "acara", label: "Acara & Event", kind: "invitation" },
  { value: "grand-opening", label: "Grand Opening", kind: "invitation" },
  { value: "personal", label: "Personal & Kreatif", kind: "portfolio" },
  { value: "fotografer", label: "Fotografer", kind: "portfolio" },
  { value: "teknologi", label: "Teknologi & Developer", kind: "portfolio" },
  { value: "penulis", label: "Penulis & Pembicara", kind: "portfolio" },
  { value: "arsitek", label: "Arsitek & Interior", kind: "portfolio" },
  { value: "bisnis", label: "Bisnis & UMKM", kind: "portfolio" },
  { value: "kuliner", label: "Kuliner & Kafe", kind: "portfolio" },
  { value: "kesehatan", label: "Kesehatan & Kecantikan", kind: "portfolio" },
  { value: "pendidikan", label: "Pendidikan & Les", kind: "portfolio" },
  { value: "seni", label: "Seni & Musik", kind: "portfolio" },
];

/** Gaya visual (tingkat 3), berlaku untuk kedua produk. */
export const STYLES: { value: TemplateStyle; label: string }[] = [
  { value: "minimalis", label: "Minimalis" },
  { value: "modern", label: "Modern" },
  { value: "elegan", label: "Elegan" },
  { value: "klasik", label: "Klasik" },
  { value: "retro", label: "Retro" },
  { value: "rustic", label: "Rustic" },
  { value: "floral", label: "Floral" },
  { value: "islami", label: "Islami" },
  { value: "nusantara", label: "Nusantara" },
  { value: "ceria", label: "Ceria" },
  { value: "gelap", label: "Gelap" },
  { value: "pastel", label: "Pastel" },
  { value: "editorial", label: "Editorial" },
  { value: "kreatif", label: "Kreatif" },
];

/** Klasifikasi template bawaan lama ke sistem kategori + gaya. */
const LEGACY: Record<string, { category: TemplateCategory; style: TemplateStyle }> = {
  "tpl-kanvas-01": { category: "personal", style: "kreatif" },
  "tpl-minimalis-01": { category: "personal", style: "minimalis" },
  "tpl-klasik-01": { category: "penulis", style: "klasik" },
  "tpl-retro-01": { category: "personal", style: "retro" },
  "tpl-editorial-01": { category: "fotografer", style: "editorial" },
  "tpl-modern-gelap-01": { category: "teknologi", style: "gelap" },
  "tpl-kreatif-01": { category: "arsitek", style: "pastel" },
  "tpl-retro-company": { category: "kuliner", style: "retro" },
  "tpl-retro-studio-foto": { category: "fotografer", style: "retro" },
  "tpl-undangan-elegan": { category: "pernikahan", style: "elegan" },
  "tpl-undangan-rustic": { category: "pernikahan", style: "rustic" },
  "tpl-undangan-ultah": { category: "ulang-tahun", style: "ceria" },
  "tpl-undangan-khitanan": { category: "khitanan", style: "islami" },
  "tpl-undangan-acara": { category: "acara", style: "gelap" },
  "tpl-adat-jawa": { category: "adat", style: "nusantara" },
  "tpl-adat-sunda": { category: "adat", style: "nusantara" },
  "tpl-adat-minang": { category: "adat", style: "nusantara" },
  "tpl-adat-bali": { category: "adat", style: "nusantara" },
  "tpl-adat-batak": { category: "adat", style: "nusantara" },
  "tpl-retro-pernikahan": { category: "pernikahan", style: "retro" },
  "tpl-retro-ultah": { category: "ulang-tahun", style: "retro" },
  "tpl-retro-khitanan": { category: "khitanan", style: "retro" },
  "tpl-retro-reuni": { category: "acara", style: "retro" },
};

// ---------------- Template bawaan ----------------
// Template bawaan disimpan sebagai file JSON di folder /templates.
const ORIGINAL = [
  kanvas,
  retroCompany,
  retroStudioFoto,
  minimalis,
  klasik,
  retro,
  editorial,
  modernGelap,
  kreatif,
  undanganElegan,
  retroPernikahan,
  adatJawa,
  adatSunda,
  adatMinang,
  adatBali,
  adatBatak,
  undanganRustic,
  undanganUltah,
  retroUltah,
  undanganKhitanan,
  retroKhitanan,
  undanganAcara,
  retroReuni,
] as unknown as Template[];

export const TEMPLATES: Template[] = [...ORIGINAL.map((t) => ({ ...t, ...LEGACY[t.id] })), ...(koleksi as unknown as Template[])].map((t) => ({
  ...t,
  kind: t.kind ?? "portfolio",
  builtin: true,
}));

export const kindOf = (t: { kind?: ProductKind }): ProductKind => t.kind ?? "portfolio";

export function parseKind(v: unknown): ProductKind {
  return v === "invitation" || v === "undangan" ? "invitation" : "portfolio";
}

export const categoryLabel = (v: string) => CATEGORIES.find((c) => c.value === v)?.label ?? v;
export const styleLabel = (v: string | undefined) => (v ? (STYLES.find((s) => s.value === v)?.label ?? v) : "");

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
