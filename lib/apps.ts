import type { AppIconName } from "@/components/ui/AppIcons";

// Daftar aplikasi di menu "Aplikasi": fitur Safantara + karya (website) yang sudah dibuat.

export interface SafantaraApp {
  key: string;
  title: string;
  desc: string;
  href: string;
  icon: AppIconName;
}

export const SAFANTARA_APPS: SafantaraApp[] = [
  { key: "undangan", title: "Undangan Digital", desc: "Pernikahan, ulang tahun, khitanan, wisuda, acara", href: "/templates?jenis=undangan", icon: "undangan" },
  { key: "adat", title: "Undangan Adat Nusantara", desc: "Jawa, Sunda, Minang, Bali, Batak, dan lainnya", href: "/templates?jenis=undangan&kategori=adat", icon: "adat" },
  { key: "proposal", title: "Proposal", desc: "Penawaran, sponsorship, kegiatan, pitch deck", href: "/templates?jenis=proposal", icon: "proposal" },
  { key: "portofolio", title: "Portofolio & Company Profile", desc: "Situs pribadi, UMKM, studio, kafe", href: "/templates?jenis=portofolio", icon: "portofolio" },
  { key: "rsvp", title: "RSVP & Buku Tamu", desc: "Link per tamu, kehadiran, ucapan, CSV", href: "/dashboard?jenis=undangan", icon: "rsvp" },
  { key: "persetujuan", title: "Persetujuan Proposal", desc: "Klien setuju online, unduh PDF", href: "/dashboard?jenis=proposal", icon: "persetujuan" },
  { key: "editor", title: "Editor Desain Bebas", desc: "Kanvas ala Figma, layer, snap, Aksara Jawa", href: "/templates?jenis=portofolio&kategori=personal", icon: "editor" },
  { key: "custom", title: "Layanan Custom", desc: "Dibuatkan profil & desain khusus", href: "/#custom", icon: "custom" },
];

export interface Karya {
  key: string;
  name: string;
  desc: string;
  category: string;
  /** Alamat situs; kosong = belum online */
  url: string;
  /** Logo di /public/karya, atau ikon bila belum ada logo */
  logo?: string;
  icon?: AppIconName;
  /** Warna latar ubin logo */
  tile: string;
}

export const KARYA: Karya[] = [
  {
    key: "interlude", name: "Interlude Entertainment", category: "Wedding & Event Organizer",
    desc: "Situs resmi jasa sound system, lighting, dan paket pernikahan.", url: "https://interludeentertainment.com", logo: "/karya/interlude.png", tile: "#1A1410",
  },
  {
    key: "bale-seni", name: "Bale Seni Tepa Slira", category: "Sanggar Seni & Pentas",
    desc: "Company profile dan galeri pentas sanggar seni.", url: "https://bale-seni-tepa-slira.interlude-cloudflare.workers.dev", logo: "/karya/bale-seni.jpg", tile: "#000000",
  },
  {
    key: "dcm", name: "DCM Engineering", category: "Bengkel Spesialis Mesin",
    desc: "Company profile bengkel spesialis mesin motor di Banyumas.", url: "https://dcm-engineering.interlude-cloudflare.workers.dev", logo: "/karya/dcm-engineering.jpg", tile: "#000000",
  },
  {
    key: "sanfantara", name: "Sanfantara", category: "Induk Usaha",
    desc: "Payung beberapa usaha kecil: les privat, fotokopi, desain banner.", url: "https://sanfantara.interlude-cloudflare.workers.dev", logo: "/karya/sanfantara.svg", tile: "#1F4D3A",
  },
  {
    key: "paket-web", name: "Interlude Media — Paket Web", category: "Jasa Website & Aplikasi",
    desc: "Daftar harga pembuatan website, aplikasi, dan IoT.", url: "https://paket-web.interlude-cloudflare.workers.dev", logo: "/karya/interlude-media.svg", tile: "#14110F",
  },
  {
    key: "cafe88", name: "Cafe 88", category: "Kafe & Kuliner",
    desc: "Situs kafe dengan menu dan album foto.", url: "", icon: "kopi", tile: "#4A2A16",
  },
];
