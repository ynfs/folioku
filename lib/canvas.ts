import type { CanvasElement, CanvasElementType, PropValue, Theme } from "./types";

// Utilitas bagian "Desain Bebas" (kanvas ala Figma).

/** Lebar frame desain. Semua posisi elemen memakai satuan ini. */
export const CANVAS_WIDTH = 1200;

export const THEME_COLORS: { token: string; label: string; key: keyof Theme }[] = [
  { token: "theme:text", label: "Teks", key: "colorPrimary" },
  { token: "theme:accent", label: "Aksen", key: "colorAccent" },
  { token: "theme:bg", label: "Latar", key: "colorBackground" },
  { token: "theme:surface", label: "Kartu", key: "colorSurface" },
];

/** Mengubah warna (hex atau token tema) menjadi nilai CSS. */
export function cssColor(value: string | undefined, fallback = "transparent"): string {
  if (!value) return fallback;
  const vars: Record<string, string> = {
    "theme:text": "var(--c-text)",
    "theme:accent": "var(--c-accent)",
    "theme:bg": "var(--c-bg)",
    "theme:surface": "var(--c-surface)",
  };
  if (vars[value]) return vars[value];
  return /^#[0-9a-f]{3,8}$/i.test(value) || value === "transparent" ? value : fallback;
}

export function resolveColor(value: string | undefined, theme: Theme): string {
  const t = THEME_COLORS.find((c) => c.token === value);
  if (t) return (theme[t.key] as string) || theme.colorBackground;
  return value || "#000000";
}

export function canvasElements(v: PropValue | undefined): CanvasElement[] {
  return Array.isArray(v) ? (v as CanvasElement[]).filter((e) => e && typeof e === "object" && "type" in e) : [];
}

export function newElementId(): string {
  return `el-${Math.random().toString(36).slice(2, 10)}`;
}

const LABELS: Record<CanvasElementType, string> = { text: "Teks", image: "Gambar", shape: "Bentuk", button: "Tombol" };
export const elementLabel = (el: CanvasElement) => el.name || (el.type === "text" && el.text ? el.text.slice(0, 24) : LABELS[el.type]);

/** Elemen baru di tengah frame. */
export function createElement(type: CanvasElementType, frameHeight: number): CanvasElement {
  const base = { id: newElementId(), type, rotation: 0, opacity: 1 };
  const center = (w: number, h: number) => ({ x: Math.round((CANVAS_WIDTH - w) / 2), y: Math.round((frameHeight - h) / 2), w, h });
  switch (type) {
    case "text":
      return { ...base, ...center(480, 72), text: "Ketik teks di sini", fontFamily: "heading", fontSize: 48, fontWeight: 700, align: "left", lineHeight: 1.15, color: "theme:text" };
    case "image":
      return { ...base, ...center(360, 360), src: "/placeholder/img-1.svg", fit: "cover", radius: 12 };
    case "shape":
      return { ...base, ...center(240, 240), fill: "theme:accent", radius: 24, borderWidth: 0, borderColor: "theme:text" };
    case "button":
      return { ...base, ...center(220, 60), text: "Hubungi saya", fontFamily: "body", fontSize: 20, fontWeight: 600, align: "center", color: "theme:bg", fill: "theme:accent", radius: 12, link: "#kontak" };
  }
}

/** Font tambahan yang dipakai elemen kanvas (untuk dimuat dari Google Fonts). */
export function canvasFonts(elements: CanvasElement[]): string[] {
  return elements.map((e) => e.fontFamily).filter((f): f is string => !!f && f !== "heading" && f !== "body");
}
