import { blankCanvas, createSection, newId } from "./sections";
import type { Page, PortfolioData, PropValue, Section } from "./types";

// Multi-halaman. Link ke halaman lain disimpan sebagai "page:<id>" (atau
// "page:home" untuk beranda) lalu diubah menjadi URL saat dirender.

export const HOME = "home";
export const PAGE_PREFIX = "page:";

export const pageLink = (id: string) => `${PAGE_PREFIX}${id}`;
export const linkedPageId = (link: string | undefined): string | null =>
  link && link.startsWith(PAGE_PREFIX) ? link.slice(PAGE_PREFIX.length) : null;

export function getPages(d: PortfolioData): Page[] {
  return d.pages ?? [];
}

/** Bagian milik halaman tertentu (HOME = beranda). */
export function pageSections(d: PortfolioData, pageId: string): Section[] {
  if (pageId === HOME) return d.sections;
  return getPages(d).find((p) => p.id === pageId)?.sections ?? d.sections;
}

export function setPageSections(d: PortfolioData, pageId: string, fn: (s: Section[]) => Section[]): PortfolioData {
  if (pageId === HOME || !getPages(d).some((p) => p.id === pageId)) return { ...d, sections: fn(d.sections) };
  return { ...d, pages: getPages(d).map((p) => (p.id === pageId ? { ...p, sections: fn(p.sections) } : p)) };
}

/** Menerapkan fn ke setiap section di semua halaman (ID section unik di seluruh portofolio). */
export function mapAllSections(d: PortfolioData, fn: (s: Section) => Section): PortfolioData {
  return {
    ...d,
    sections: d.sections.map(fn),
    ...(d.pages ? { pages: d.pages.map((p) => ({ ...p, sections: p.sections.map(fn) })) } : {}),
  };
}

export function findSection(d: PortfolioData, id: string | null): Section | undefined {
  if (!id) return undefined;
  return [d.sections, ...getPages(d).map((p) => p.sections)].flat().find((s) => s.id === id);
}

export function slugifyPage(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40)
      .replace(/-+$/, "") || "halaman"
  );
}

/** Slug unik di antara halaman yang ada. */
export function uniquePageSlug(d: PortfolioData, base: string, exceptId?: string): string {
  const taken = new Set(getPages(d).filter((p) => p.id !== exceptId).map((p) => p.slug));
  let slug = slugifyPage(base);
  for (let i = 2; taken.has(slug); i++) slug = `${slugifyPage(base).slice(0, 36)}-${i}`;
  return slug;
}

/** Halaman baru berisi kanvas judul dan tombol kembali ke beranda. */
export function createPage(d: PortfolioData, title: string): Page {
  const canvas = blankCanvas(420);
  canvas.props.elements = [
    { id: newId("el"), type: "text", name: "Judul", x: 80, y: 120, w: 900, h: 90, text: title, fontFamily: "heading", fontSize: 72, fontWeight: 800, lineHeight: 1.05, color: "theme:text", rotation: 0, opacity: 1 },
    { id: newId("el"), type: "text", name: "Deskripsi", x: 80, y: 230, w: 640, h: 60, text: "Tulis isi halaman ini. Tambah bagian lain dari panel kiri.", fontFamily: "body", fontSize: 20, lineHeight: 1.4, color: "theme:text", opacity: 0.75, rotation: 0 },
    { id: newId("el"), type: "button", name: "Kembali", x: 80, y: 320, w: 220, h: 56, text: "← Beranda", fontFamily: "body", fontSize: 18, fontWeight: 600, align: "center", color: "theme:bg", fill: "theme:text", radius: 999, link: pageLink(HOME), rotation: 0, opacity: 1 },
  ];
  return { id: newId("page"), title, slug: uniquePageSlug(d, title), sections: [canvas, createSection("contact")] };
}

/** Mengganti semua link "page:<id>" di props menjadi URL nyata. */
export function resolvePageLinks(d: PortfolioData, base: string): PortfolioData {
  const pages = getPages(d);
  const url = (v: string) => {
    const id = linkedPageId(v);
    if (id === null) return v;
    if (id === HOME) return base || "/";
    const p = pages.find((x) => x.id === id);
    return p ? `${base}/${p.slug}` : "#";
  };
  const walk = (v: PropValue): PropValue => {
    if (typeof v === "string") return url(v);
    if (Array.isArray(v)) {
      return v.map((item) =>
        Object.fromEntries(Object.entries(item).map(([k, x]) => [k, typeof x === "string" ? url(x) : x])),
      ) as PropValue;
    }
    return v;
  };
  return mapAllSections(d, (s) => ({ ...s, props: Object.fromEntries(Object.entries(s.props).map(([k, v]) => [k, walk(v)])) }));
}
