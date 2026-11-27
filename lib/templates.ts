import type { ProductKind, Template, TemplateCategory } from "./types";
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

// Template bawaan disimpan sebagai file JSON di folder /templates.
// Untuk menambah template: buat file JSON baru dengan format yang sama lalu
// daftarkan di sini. Template undangan memakai "kind": "invitation".
export const TEMPLATES = (
  [
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
  ] as unknown as Template[]
).map((t) => ({ ...t, kind: t.kind ?? "portfolio", builtin: true }));

/** Produk Safantara. */
export const PRODUCTS: { value: ProductKind; label: string; short: string; description: string }[] = [
  { value: "portfolio", label: "Portofolio & Company Profile", short: "Portofolio", description: "Situs portofolio pribadi atau profil perusahaan." },
  { value: "invitation", label: "Undangan Digital", short: "Undangan", description: "Undangan pernikahan, ulang tahun, khitanan, dan acara." },
];

export const CATEGORIES: { value: TemplateCategory; label: string; kind: ProductKind }[] = [
  { value: "modern", label: "Modern", kind: "portfolio" },
  { value: "minimalis", label: "Minimalis", kind: "portfolio" },
  { value: "klasik", label: "Klasik", kind: "portfolio" },
  { value: "retro", label: "Retro", kind: "portfolio" },
  { value: "editorial", label: "Editorial", kind: "portfolio" },
  { value: "kreatif", label: "Kreatif", kind: "portfolio" },
  { value: "pernikahan", label: "Pernikahan", kind: "invitation" },
  { value: "adat", label: "Pernikahan Adat", kind: "invitation" },
  { value: "ulang-tahun", label: "Ulang Tahun", kind: "invitation" },
  { value: "khitanan", label: "Khitanan & Aqiqah", kind: "invitation" },
  { value: "acara", label: "Acara & Event", kind: "invitation" },
];

export const kindOf = (t: { kind?: ProductKind }): ProductKind => t.kind ?? "portfolio";

export function parseKind(v: unknown): ProductKind {
  return v === "invitation" || v === "undangan" ? "invitation" : "portfolio";
}

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
