// Tipe data inti Safantara. Template dan proyek memakai format JSON yang sama:
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
  /** Gambar ornamen pemisah judul (mis. motif adat). Kosong = simbol ❦ */
  ornament?: string;
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
  | "canvas"
  // ---- khusus undangan digital ----
  | "cover"
  | "couple"
  | "event"
  | "countdown"
  | "story"
  | "rsvp"
  | "gift"
  | "music"
  | "ceremony"
  | "dresscode";

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

/** Halaman tambahan. Halaman utama (beranda) memakai PortfolioData.sections. */
export interface Page {
  id: string;
  title: string;
  /** Bagian URL: /p/<slug-portofolio>/<slug-halaman> */
  slug: string;
  sections: Section[];
}

export interface PortfolioData {
  theme: Theme;
  /** Bagian-bagian halaman beranda */
  sections: Section[];
  pages?: Page[];
}

/** Produk Safantara: portofolio/company profile atau undangan digital. */
export type ProductKind = "portfolio" | "invitation";

/**
 * Kategori template.
 *  - Undangan: jenis acara
 *  - Portofolio: bidang/profesi
 * Nilai lama (modern, minimalis, …) masih diterima untuk template buatan admin lama.
 */
export type TemplateCategory =
  // undangan
  | "pernikahan"
  | "adat"
  | "lamaran"
  | "ulang-tahun"
  | "khitanan"
  | "wisuda"
  | "syukuran"
  | "acara"
  | "grand-opening"
  // portofolio
  | "personal"
  | "fotografer"
  | "teknologi"
  | "penulis"
  | "arsitek"
  | "bisnis"
  | "kuliner"
  | "kesehatan"
  | "pendidikan"
  | "seni"
  // lama
  | "modern"
  | "minimalis"
  | "klasik"
  | "retro"
  | "editorial"
  | "kreatif";

/** Gaya visual template (klasifikasi lintas kategori). */
export type TemplateStyle =
  | "minimalis"
  | "modern"
  | "elegan"
  | "klasik"
  | "retro"
  | "rustic"
  | "floral"
  | "islami"
  | "nusantara"
  | "ceria"
  | "gelap"
  | "pastel"
  | "editorial"
  | "kreatif";

export interface Template extends PortfolioData {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  tags: string[];
  /** Jenis produk; kosong = portofolio */
  kind?: ProductKind;
  /** Gaya visual */
  style?: TemplateStyle;
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
  /** Jenis produk; kosong = portofolio */
  kind?: ProductKind;
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

/** Konfirmasi kehadiran + ucapan dari tamu undangan. */
export type Attendance = "hadir" | "tidak" | "ragu";

export interface Rsvp {
  id: string;
  name: string;
  attendance: Attendance;
  guests: number;
  message: string;
  createdAt: string;
}

/** Ucapan yang boleh ditampilkan publik di halaman undangan. */
export type Wish = Pick<Rsvp, "id" | "name" | "attendance" | "message" | "createdAt">;
