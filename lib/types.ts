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
  | "contact";

export type PropValue = string | number | boolean | Record<string, string>[];

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
