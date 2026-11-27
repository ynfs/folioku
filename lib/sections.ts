import { CANVAS_WIDTH, newElementId } from "./canvas";
import type { PropValue, Section, SectionType } from "./types";

// Skema field yang dipakai panel properti editor untuk setiap jenis section.

type ItemKind = "text" | "textarea" | "image" | "url" | "datetime";

export type Field =
  | { key: string; label: string; kind: "text" | "textarea" | "image" | "url" | "datetime" | "audio" | "aksara" }
  | { key: string; label: string; kind: "select"; options: { value: string; label: string }[] }
  | { key: string; label: string; kind: "number"; min: number; max: number }
  | { key: string; label: string; kind: "size"; min: number; max: number; step?: number; unit?: string }
  | { key: string; label: string; kind: "color" }
  | {
      key: string;
      label: string;
      kind: "list";
      itemLabel: string;
      itemFields: { key: string; label: string; kind: ItemKind }[];
    };

export interface SectionDef {
  type: SectionType;
  label: string;
  description: string;
  /** Produk yang paling cocok (dipakai untuk mengurutkan daftar "Tambah bagian"). */
  for?: "portfolio" | "invitation";
  fields: Field[];
  defaults: Record<string, PropValue>;
}

const IMG = (n: number) => `/placeholder/img-${n}.svg`;

const ZONES = [
  { value: "WIB", label: "WIB" },
  { value: "WITA", label: "WITA" },
  { value: "WIT", label: "WIT" },
];

export const SECTION_DEFS: Record<SectionType, SectionDef> = {
  // ================= Undangan digital =================
  cover: {
    type: "cover",
    for: "invitation",
    label: "Sampul",
    description: "Pembuka dengan nama tamu & tombol Buka Undangan",
    fields: [
      { key: "topImage", label: "Hiasan atas (mis. gunungan)", kind: "image" },
      { key: "tagline", label: "Tagline aksara (mis. Aksara Jawa)", kind: "aksara" },
      { key: "eyebrow", label: "Teks kecil", kind: "text" },
      { key: "title", label: "Judul (mis. nama mempelai)", kind: "text" },
      { key: "subtitle", label: "Tanggal / keterangan", kind: "text" },
      { key: "greeting", label: "Sapaan tamu", kind: "text" },
      { key: "image", label: "Foto latar", kind: "image" },
      {
        key: "tone",
        label: "Nada sampul",
        kind: "select",
        options: [
          { value: "gelap", label: "Gelap (teks putih)" },
          { value: "terang", label: "Terang (teks warna tema)" },
        ],
      },
      { key: "buttonText", label: "Teks tombol", kind: "text" },
      { key: "buttonLink", label: "Tombol menuju (kosong = bagian berikutnya)", kind: "url" },
    ],
    defaults: {
      eyebrow: "The Wedding of",
      title: "Rina & Dimas",
      subtitle: "Sabtu, 20 Desember 2026",
      greeting: "Kepada Yth. Bapak/Ibu/Saudara/i",
      topImage: "",
      tagline: "",
      image: "/placeholder/cover.svg",
      buttonText: "Buka Undangan",
      buttonLink: "",
    },
  },
  couple: {
    type: "couple",
    for: "invitation",
    label: "Mempelai",
    description: "Profil kedua mempelai dan orang tua",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      { key: "intro", label: "Kalimat pembuka", kind: "textarea" },
      { key: "name1", label: "Mempelai 1 — nama panggilan", kind: "text" },
      { key: "script1", label: "Mempelai 1 — nama dalam aksara", kind: "aksara" },
      { key: "full1", label: "Mempelai 1 — nama lengkap", kind: "text" },
      { key: "parents1", label: "Mempelai 1 — orang tua", kind: "textarea" },
      { key: "photo1", label: "Mempelai 1 — foto", kind: "image" },
      { key: "ig1", label: "Mempelai 1 — Instagram", kind: "url" },
      { key: "name2", label: "Mempelai 2 — nama panggilan", kind: "text" },
      { key: "script2", label: "Mempelai 2 — nama dalam aksara", kind: "aksara" },
      { key: "full2", label: "Mempelai 2 — nama lengkap", kind: "text" },
      { key: "parents2", label: "Mempelai 2 — orang tua", kind: "textarea" },
      { key: "photo2", label: "Mempelai 2 — foto", kind: "image" },
      { key: "ig2", label: "Mempelai 2 — Instagram", kind: "url" },
    ],
    defaults: {
      heading: "Mempelai",
      intro: "Dengan memohon rahmat Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami:",
      name1: "Rina",
      full1: "Rina Wulandari, S.Ds.",
      parents1: "Putri dari Bapak Ahmad\n& Ibu Siti",
      photo1: "/placeholder/portrait.svg",
      ig1: "",
      name2: "Dimas",
      full2: "Dimas Pratama, S.T.",
      parents2: "Putra dari Bapak Budi\n& Ibu Ani",
      photo2: "/placeholder/hero.svg",
      ig2: "",
    },
  },
  event: {
    type: "event",
    for: "invitation",
    label: "Acara",
    description: "Waktu, tempat, dan peta acara",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      { key: "zone", label: "Zona waktu", kind: "select", options: ZONES },
      {
        key: "items",
        label: "Acara",
        kind: "list",
        itemLabel: "Acara",
        itemFields: [
          { key: "name", label: "Nama acara", kind: "text" },
          { key: "start", label: "Mulai", kind: "datetime" },
          { key: "end", label: "Selesai (mis. 11.00 atau Selesai)", kind: "text" },
          { key: "place", label: "Tempat", kind: "text" },
          { key: "address", label: "Alamat", kind: "textarea" },
          { key: "map", label: "Link Google Maps", kind: "url" },
        ],
      },
    ],
    defaults: {
      heading: "Waktu & Tempat",
      zone: "WIB",
      items: [
        { name: "Akad Nikah", start: "2026-12-20T08:00", end: "10.00", place: "Masjid Agung", address: "Jl. Jenderal Sudirman No. 1, Purwokerto", map: "https://maps.google.com/?q=Purwokerto" },
        { name: "Resepsi", start: "2026-12-20T11:00", end: "Selesai", place: "Gedung Serbaguna", address: "Jl. Gatot Subroto No. 10, Purwokerto", map: "https://maps.google.com/?q=Purwokerto" },
      ],
    },
  },
  countdown: {
    type: "countdown",
    for: "invitation",
    label: "Hitung Mundur",
    description: "Hari, jam, menit menuju acara",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      { key: "target", label: "Tanggal & jam acara", kind: "datetime" },
      { key: "zone", label: "Zona waktu", kind: "select", options: ZONES },
      { key: "doneText", label: "Teks setelah acara dimulai", kind: "text" },
    ],
    defaults: { heading: "Menuju hari bahagia", target: "2026-12-20T08:00", zone: "WIB", doneText: "Acara sedang berlangsung / telah selesai" },
  },
  story: {
    type: "story",
    for: "invitation",
    label: "Kisah",
    description: "Perjalanan kisah (love story) atau linimasa",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      {
        key: "items",
        label: "Momen",
        kind: "list",
        itemLabel: "Momen",
        itemFields: [
          { key: "date", label: "Waktu", kind: "text" },
          { key: "title", label: "Judul", kind: "text" },
          { key: "description", label: "Cerita", kind: "textarea" },
          { key: "image", label: "Foto", kind: "image" },
        ],
      },
    ],
    defaults: {
      heading: "Kisah Kami",
      items: [
        { date: "2019", title: "Pertama bertemu", description: "Kami bertemu di sebuah acara kampus.", image: IMG(1) },
        { date: "2023", title: "Lamaran", description: "Dengan restu keluarga, kami melangkah lebih serius.", image: IMG(2) },
        { date: "2026", title: "Menikah", description: "Dan kini kami memulai babak baru bersama.", image: IMG(3) },
      ],
    },
  },
  rsvp: {
    type: "rsvp",
    for: "invitation",
    label: "RSVP & Ucapan",
    description: "Tamu mengisi kehadiran dan ucapan",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      { key: "text", label: "Teks", kind: "textarea" },
      { key: "maxGuests", label: "Maksimal jumlah orang per tamu", kind: "number", min: 1, max: 4 },
      {
        key: "showWishes",
        label: "Tampilkan ucapan tamu",
        kind: "select",
        options: [
          { value: "ya", label: "Ya" },
          { value: "tidak", label: "Tidak" },
        ],
      },
    ],
    defaults: { heading: "Konfirmasi Kehadiran", text: "Mohon konfirmasi kehadiran dan kirimkan doa restu untuk kami.", maxGuests: 2, showWishes: "ya" },
  },
  gift: {
    type: "gift",
    for: "invitation",
    label: "Amplop Digital",
    description: "Nomor rekening/e-wallet dengan tombol salin",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      { key: "text", label: "Teks", kind: "textarea" },
      {
        key: "items",
        label: "Rekening / dompet digital",
        kind: "list",
        itemLabel: "Rekening",
        itemFields: [
          { key: "bank", label: "Bank / e-wallet", kind: "text" },
          { key: "number", label: "Nomor", kind: "text" },
          { key: "holder", label: "Atas nama", kind: "text" },
          { key: "qr", label: "Gambar QR (opsional)", kind: "image" },
        ],
      },
      { key: "address", label: "Alamat kirim kado (opsional)", kind: "textarea" },
    ],
    defaults: {
      heading: "Amplop Digital",
      text: "Doa restu Anda adalah karunia yang sangat berarti. Jika ingin memberi tanda kasih, dapat melalui:",
      items: [{ bank: "Nama Bank", number: "0000000000", holder: "Nama Pemilik", qr: "" }],
      address: "",
    },
  },
  ceremony: {
    type: "ceremony",
    for: "invitation",
    label: "Prosesi Adat",
    description: "Rangkaian upacara adat beserta maknanya",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      { key: "intro", label: "Pengantar", kind: "textarea" },
      { key: "zone", label: "Zona waktu", kind: "select", options: ZONES },
      {
        key: "items",
        label: "Prosesi",
        kind: "list",
        itemLabel: "Prosesi",
        itemFields: [
          { key: "name", label: "Nama prosesi", kind: "text" },
          { key: "description", label: "Makna / keterangan", kind: "textarea" },
          { key: "start", label: "Waktu (opsional)", kind: "datetime" },
          { key: "place", label: "Tempat (opsional)", kind: "text" },
        ],
      },
    ],
    defaults: {
      heading: "Rangkaian Adat",
      intro: "Pernikahan kami dilangsungkan dengan rangkaian adat sebagai wujud penghormatan kepada leluhur dan orang tua.",
      zone: "WIB",
      items: [
        { name: "Siraman", description: "Memandikan calon pengantin sebagai simbol penyucian diri.", start: "", place: "" },
        { name: "Ijab Kabul", description: "Akad nikah yang mengikat kedua mempelai.", start: "", place: "" },
        { name: "Resepsi", description: "Syukuran bersama keluarga, kerabat, dan sahabat.", start: "", place: "" },
      ],
    },
  },
  dresscode: {
    type: "dresscode",
    for: "invitation",
    label: "Dress Code",
    description: "Anjuran busana dan warna untuk tamu",
    fields: [
      { key: "heading", label: "Judul", kind: "text" },
      { key: "text", label: "Keterangan busana", kind: "textarea" },
      {
        key: "colors",
        label: "Warna yang dianjurkan",
        kind: "list",
        itemLabel: "Warna",
        itemFields: [
          { key: "color", label: "Kode warna (mis. #8B5E34)", kind: "text" },
          { key: "label", label: "Nama warna", kind: "text" },
        ],
      },
      { key: "image", label: "Contoh busana (opsional)", kind: "image" },
    ],
    defaults: {
      heading: "Dress Code",
      text: "Tamu dianjurkan mengenakan batik atau kebaya dengan nuansa warna berikut:",
      colors: [
        { color: "#8B5E34", label: "Cokelat sogan" },
        { color: "#C9A66B", label: "Emas" },
        { color: "#F4EBDD", label: "Krem" },
      ],
      image: "",
    },
  },
  music: {
    type: "music",
    for: "invitation",
    label: "Musik Latar",
    description: "Tombol musik mengambang (mp3)",
    fields: [
      { key: "src", label: "File lagu (mp3)", kind: "audio" },
      { key: "title", label: "Judul lagu", kind: "text" },
    ],
    defaults: { src: "", title: "" },
  },

  // ================= Umum / portofolio =================
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
  "cover",
  "couple",
  "event",
  "countdown",
  "story",
  "rsvp",
  "gift",
  "ceremony",
  "dresscode",
  "music",
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

/** Nama yang mudah dibaca untuk sebuah section, mis. "Kontak · Mari bekerja sama". */
export function sectionLabel(s: Section): string {
  const def = SECTION_DEFS[s.type];
  const p = s.props;
  const t = p.title ?? p.heading ?? p.quote ?? p.author;
  const text = typeof t === "string" ? t.trim() : "";
  return text ? `${def.label} · ${text.length > 32 ? text.slice(0, 32) + "…" : text}` : def.label;
}
