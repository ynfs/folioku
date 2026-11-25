// Tipe data inti Folioku. Template dan proyek memakai format JSON yang sama:
// sebuah `theme` dan daftar `sections`. Saat klien mengedit, hanya data ini yang
// berubah, lalu halaman dirender ulang.

export type Radius = "none" | "sm" | "lg";
export type HeadingCase = "normal" | "uppercase";

export interface Theme {
  fontHeading: string;
  fontBody: string;
  /** Warna teks utama dan judul */
  colorPrimary: string;
  colorAccent: string;
  colorBackground: string;
  /** Warna latar kartu / blok sekunder */
  colorSurface?: string;
  radius?: Radius;
  headingCase?: HeadingCase;
}

export type SectionType =
  | "hero"
  | "about"
  | "gallery"
  | "projects"
  | "experience"
  | "skills"
  | "testimonial"
  | "contact"
  | "canvas";

/** Elemen di bagian "Desain Bebas" (kanvas ala Figma). Satuan posisi = piksel desain
 *  pada frame selebar CANVAS_WIDTH, lalu diskalakan proporsional saat ditampilkan. */
export type CanvasElementType = "text" | "image" | "shape" | "button";

export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  name?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
  opacity?: number;
  hidden?: boolean;
  locked?: boolean;
  // teks & tombol
  text?: string;
  fontFamily?: string; // "heading" | "body" | nama font
  fontSize?: number;
  fontWeight?: number;
  italic?: boolean;
  uppercase?: boolean;
  align?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
  color?: string; // hex atau token tema "theme:text" dst.
  // bentuk & tombol
  fill?: string;
  radius?: number;
  borderColor?: string;
  borderWidth?: number;
  // gambar
  src?: string;
  fit?: "cover" | "contain";
  // tombol
  link?: string;
}

export type PropValue = string | number | boolean | Record<string, string>[] | CanvasElement[];

export interface Section {
  id: string;
  type: SectionType;
  props: Record<string, PropValue>;
}

export interface PortfolioData {
  theme: Theme;
  sections: Section[];
}

export type TemplateCategory =
  | "modern"
  | "minimalis"
  | "klasik"
  | "retro"
  | "editorial"
  | "kreatif";

export interface Template extends PortfolioData {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  tags: string[];
  /** true untuk template bawaan (file JSON), false untuk buatan admin */
  builtin?: boolean;
  /** Template buatan admin hanya tampil di galeri jika diterbitkan */
  published?: boolean;
  updatedAt?: string;
}

export type Role = "admin" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Project {
  id: string;
  ownerId: string;
  templateId: string;
  name: string;
  data: PortfolioData;
  createdAt: string;
  updatedAt: string;
  /** Slug publik jika pernah dipublish */
  slug: string | null;
  published: boolean;
}

export interface Publication {
  slug: string;
  name: string;
  data: PortfolioData;
  ownerName: string;
}
