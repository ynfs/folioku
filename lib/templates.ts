import type { Template, TemplateCategory } from "./types";
import minimalis from "@/templates/tpl-minimalis-01.json";
import klasik from "@/templates/tpl-klasik-01.json";
import retro from "@/templates/tpl-retro-01.json";
import editorial from "@/templates/tpl-editorial-01.json";
import modernGelap from "@/templates/tpl-modern-gelap-01.json";
import kreatif from "@/templates/tpl-kreatif-01.json";

// Template bawaan disimpan sebagai file JSON di folder /templates.
// Untuk menambah template: buat file JSON baru dengan format yang sama lalu
// daftarkan di sini.
export const TEMPLATES = [minimalis, klasik, retro, editorial, modernGelap, kreatif] as unknown as Template[];

export const CATEGORIES: { value: TemplateCategory; label: string }[] = [
  { value: "modern", label: "Modern" },
  { value: "minimalis", label: "Minimalis" },
  { value: "klasik", label: "Klasik" },
  { value: "retro", label: "Retro" },
  { value: "editorial", label: "Editorial" },
  { value: "kreatif", label: "Kreatif" },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
