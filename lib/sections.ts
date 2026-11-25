import { CANVAS_WIDTH, newElementId } from "./canvas";
import type { PropValue, Section, SectionType } from "./types";

// Skema field yang dipakai panel properti editor untuk setiap jenis section.

export type Field =
  | { key: string; label: string; kind: "text" | "textarea" | "image" | "url" }
  | { key: string; label: string; kind: "select"; options: { value: string; label: string }[] }
  | { key: string; label: string; kind: "number"; min: number; max: number }
  | { key: string; label: string; kind: "size"; min: number; max: number; step?: number; unit?: string }
  | { key: string; label: string; kind: "color" }
  | {
      key: string;
      label: string;
      kind: "list";
      itemLabel: string;
      itemFields: { key: string; label: string; kind: "text" | "textarea" | "image" | "url" }[];
    };

export interface SectionDef {
  type: SectionType;
  label: string;
  description: string;
  fields: Field[];
  defaults: Record<string, PropValue>;
}

const IMG = (n: number) => `/placeholder/img-${n}.svg`;

export const SECTION_DEFS: Record<SectionType, SectionDef> = {
  canvas: {
    type: "canvas",
    label: "Desain Bebas",
    description: "Kanvas ala Figma: taruh teks, gambar, bentuk di mana saja",
    fields: [
      { key: "height", label: "Tinggi frame", kind: "size", min: 120, max: 3000, step: 10, unit: "px" },
      { key: "background", label: "Warna latar", kind: "color" },
      { key: "backgroundImage", label: "Gambar latar", kind: "image" },
    ],
    defaults: {
      height: 640,
      background: "theme:surface",
      backgroundImage: "",
      elements: [
        { id: "el-a", type: "shape", name: "Lingkaran", x: 700, y: 90, w: 420, h: 420, radius: 999, fill: "theme:accent", opacity: 0.9, rotation: 0 },
        { id: "el-b", type: "image", name: "Foto", x: 760, y: 150, w: 300, h: 380, src: "/placeholder/portrait.svg", fit: "cover", radius: 16, rotation: -4, opacity: 1 },
        { id: "el-c", type: "text", name: "Judul", x: 80, y: 180, w: 560, h: 150, text: "Desain bebas,\nsesuka hati.",fontFamily: "heading", fontSize: 64, fontWeight: 800, lineHeight: 1.05, align: "left", color: "theme:text", rotation: 0, opacity: 1 },
        { id: "el-d", type: "text", name: "Deskripsi", x: 80, y: 350, w: 480, h: 60, text: "Geser, ubah ukuran, dan susun elemen seperti di Figma.", fontFamily: "body", fontSize: 20, fontWeight: 400, lineHeight: 1.4, align: "left", color: "theme:text", opacity: 0.75, rotation: 0 },
        { id: "el-e", type: "button", name: "Tombol", x: 80, y: 440, w: 220, h: 60, text: "Lihat karya", fontFamily: "body", fontSize: 20, fontWeight: 600, align: "center", color: "theme:bg", fill: "theme:text", radius: 999, link: "#karya", rotation: 0, opacity: 1 },
      ],
    },
  },
  hero: {
    type: "hero",
    label: "Hero",
    description: "Pembuka besar dengan nama dan peran",
    fields: [
      { key: "eyebrow", label: "Teks kecil di atas judul", kind: "text" },
      { key: "title", label: "Judul", kind: "text" },
      { key: "subtitle", label: "Subjudul", kind: "text" },
      { key: "description", label: "Deskripsi", kind: "textarea" },
      { key: "image", label: "Gambar", kind: "image" },
      {
        key: "align",
        label: "Tata letak",
        kind: "select",
        options: [
          { value: "left", label: "Teks kiri, gambar kanan" },
          { value: "center", label: "Tengah" },
          { value: "cover", label: "Gambar penuh di belakang" },
        ],
      },
      { key: "buttonText", label: "Teks tombol", kind: "text" },
      { key: "buttonLink", label: "Link tombol", kind: "url" },
    ],
    defaults: {
      eyebrow: "Portofolio",
      title: "Halo, saya Nama Kamu",
      subtitle: "Desainer Grafis",
      description: "Saya membantu brand bercerita lewat visual yang jelas dan berkesan.",
      image: "/placeholder/hero.svg",
      align: "left",
      buttonText: "Lihat karya",
      buttonLink: "#karya",
    },
  },
  about: {
    type: "about",
    label: "Tentang",
    description: "Cerita singkat tentang kamu",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      { key: "body", label: "Isi", kind: "textarea" },
      { key: "image", label: "Foto", kind: "image" },
    ],
    defaults: {
      heading: "Tentang saya",
      body: "Tulis cerita singkat tentang dirimu: latar belakang, cara kerja, dan apa yang membuatmu bersemangat.",
      image: "/placeholder/portrait.svg",
    },
  },
  gallery: {
    type: "gallery",
    label: "Galeri",
    description: "Kumpulan gambar karya",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      { key: "columns", label: "Jumlah kolom", kind: "number", min: 2, max: 4 },
      {
        key: "items",
        label: "Gambar",
        kind: "list",
        itemLabel: "Gambar",
        itemFields: [
          { key: "image", label: "Gambar", kind: "image" },
          { key: "caption", label: "Keterangan", kind: "text" },
        ],
      },
    ],
    defaults: {
      heading: "Galeri",
      columns: 3,
      items: [1, 2, 3, 4, 5, 6].map((n) => ({ image: IMG(n), caption: `Karya ${n}` })),
    },
  },
  projects: {
    type: "projects",
    label: "Proyek",
    description: "Studi kasus atau proyek pilihan",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      {
        key: "items",
        label: "Proyek",
        kind: "list",
        itemLabel: "Proyek",
        itemFields: [
          { key: "title", label: "Nama proyek", kind: "text" },
          { key: "description", label: "Deskripsi", kind: "textarea" },
          { key: "image", label: "Gambar", kind: "image" },
          { key: "link", label: "Link", kind: "url" },
        ],
      },
    ],
    defaults: {
      heading: "Proyek pilihan",
      items: [
        { title: "Identitas Kopi Lokal", description: "Logo, kemasan, dan panduan brand.", image: IMG(1), link: "" },
        { title: "Aplikasi Kasir UMKM", description: "Desain UI untuk kasir sederhana.", image: IMG(2), link: "" },
        { title: "Kampanye Festival", description: "Poster dan konten media sosial.", image: IMG(3), link: "" },
      ],
    },
  },
  experience: {
    type: "experience",
    label: "Pengalaman",
    description: "Riwayat kerja atau pendidikan",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      {
        key: "items",
        label: "Pengalaman",
        kind: "list",
        itemLabel: "Pengalaman",
        itemFields: [
          { key: "role", label: "Posisi", kind: "text" },
          { key: "place", label: "Tempat", kind: "text" },
          { key: "period", label: "Periode", kind: "text" },
          { key: "description", label: "Deskripsi", kind: "textarea" },
        ],
      },
    ],
    defaults: {
      heading: "Pengalaman",
      items: [
        { role: "Desainer Senior", place: "Studio Kreatif", period: "2023 – sekarang", description: "Memimpin proyek identitas brand." },
        { role: "Desainer Grafis", place: "Agensi Digital", period: "2020 – 2023", description: "Membuat materi kampanye digital." },
      ],
    },
  },
  skills: {
    type: "skills",
    label: "Keahlian",
    description: "Daftar keahlian atau layanan",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      {
        key: "items",
        label: "Keahlian",
        kind: "list",
        itemLabel: "Keahlian",
        itemFields: [
          { key: "name", label: "Nama", kind: "text" },
          { key: "detail", label: "Keterangan", kind: "text" },
        ],
      },
    ],
    defaults: {
      heading: "Keahlian",
      items: [
        { name: "Identitas brand", detail: "Logo, warna, tipografi" },
        { name: "Desain UI", detail: "Web dan aplikasi" },
        { name: "Ilustrasi", detail: "Editorial dan kemasan" },
        { name: "Fotografi", detail: "Produk dan potret" },
      ],
    },
  },
  testimonial: {
    type: "testimonial",
    label: "Testimoni",
    description: "Kutipan dari klien",
    fields: [
      { key: "quote", label: "Kutipan", kind: "textarea" },
      { key: "author", label: "Nama", kind: "text" },
      { key: "role", label: "Jabatan", kind: "text" },
    ],
    defaults: {
      quote: "Kerjanya rapi, cepat, dan hasilnya melampaui harapan kami.",
      author: "Nama Klien",
      role: "Pemilik Usaha",
    },
  },
  contact: {
    type: "contact",
    label: "Kontak",
    description: "Cara menghubungi kamu",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      { key: "text", label: "Teks", kind: "textarea" },
      { key: "email", label: "Email", kind: "text" },
      { key: "phone", label: "Telepon / WhatsApp", kind: "text" },
      {
        key: "links",
        label: "Tautan",
        kind: "list",
        itemLabel: "Tautan",
        itemFields: [
          { key: "label", label: "Label", kind: "text" },
          { key: "url", label: "URL", kind: "url" },
        ],
      },
    ],
    defaults: {
      heading: "Mari bekerja sama",
      text: "Punya proyek? Kirim pesan dan saya akan membalas dalam 1–2 hari.",
      email: "halo@email.com",
      phone: "",
      links: [
        { label: "Instagram", url: "https://instagram.com/" },
        { label: "LinkedIn", url: "https://linkedin.com/" },
      ],
    },
  },
};

export const SECTION_ORDER: SectionType[] = [
  "canvas",
  "hero",
  "about",
  "projects",
  "gallery",
  "experience",
  "skills",
  "testimonial",
  "contact",
];

export function newId(prefix = "sec"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createSection(type: SectionType): Section {
  const props = structuredClone(SECTION_DEFS[type].defaults);
  // ID elemen kanvas harus unik di setiap salinan.
  if (Array.isArray(props.elements)) {
    props.elements = (props.elements as { id: string }[]).map((e) => ({ ...e, id: newElementId() })) as typeof props.elements;
  }
  return { id: newId(), type, props };
}

/** Kanvas kosong untuk template baru. */
export function blankCanvas(height = 720): Section {
  return { id: newId(), type: "canvas", props: { height, background: "theme:bg", backgroundImage: "", elements: [] } };
}

export { CANVAS_WIDTH };
