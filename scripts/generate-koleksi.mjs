// Generator 100 template Safantara (60 undangan + 40 portofolio) beserta gambar sampulnya.
// Jalankan dari folder proyek:  node scripts/generate-koleksi.mjs
// Hasil: templates/koleksi-100.json dan public/koleksi/*.svg (deterministik).
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ART_DIR = path.join(ROOT, "public", "koleksi");
fs.mkdirSync(ART_DIR, { recursive: true });

// ---------- acak deterministik ----------
let seed = 20270611;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const r1 = (n) => Math.round(n * 10) / 10;

// ---------- gaya: palet, font, motif ----------
const STYLE = {
  minimalis: {
    label: "Minimalis", desc: "bersih dan lapang, fokus pada isi",
    palettes: [["Monokrom", "#111111", "#FF5A36", "#FFFFFF", "#F4F4F2"], ["Biru Laut", "#1F2937", "#2563EB", "#FFFFFF", "#EEF2F7"], ["Zaitun", "#1E2A1F", "#5B7F3A", "#FCFCF9", "#EEF1E8"]],
    fonts: [["Plus Jakarta Sans", "Inter"], ["Manrope", "Inter"], ["DM Sans", "DM Sans"]],
    motifs: ["frame", "lines"], radius: "sm",
  },
  modern: {
    label: "Modern", desc: "tegas dan kekinian dengan aksen berani",
    palettes: [["Neon Mint", "#0F172A", "#10B981", "#F8FAFC", "#E2F5EE"], ["Ungu Elektrik", "#1E1B4B", "#7C3AED", "#FAF9FF", "#EDE9FE"], ["Jingga Kota", "#18181B", "#F97316", "#FAFAF9", "#FDEBD8"]],
    fonts: [["Space Grotesk", "Inter"], ["Bricolage Grotesque", "DM Sans"], ["Syne", "Manrope"]],
    motifs: ["blobs", "grid"], radius: "lg",
  },
  elegan: {
    label: "Elegan", desc: "mewah dan anggun dengan sentuhan emas",
    palettes: [["Champagne", "#3B2F2F", "#B08D57", "#FFFBF5", "#F4EBDD"], ["Dusty Rose", "#4A2C33", "#B76E79", "#FFF8F8", "#F6E4E6"], ["Navy Emas", "#1C2541", "#C9A227", "#FBF9F3", "#E9E4D4"]],
    fonts: [["Playfair Display", "Lora"], ["Cormorant Garamond", "Manrope"], ["Great Vibes", "Lora"]],
    motifs: ["deco", "frame"], radius: "sm",
  },
  klasik: {
    label: "Klasik", desc: "berwibawa dengan huruf serif tradisional",
    palettes: [["Burgundi", "#3A0F14", "#8C1C2B", "#FBF6EF", "#EFE2D2"], ["Hijau Botol", "#13261D", "#2F5D44", "#F8F5EC", "#E4E8DA"], ["Sepia", "#2E2418", "#8A6A3F", "#F7F1E6", "#E9DDC7"]],
    fonts: [["Cinzel", "Lora"], ["Libre Baskerville", "Lora"], ["DM Serif Display", "Libre Baskerville"]],
    motifs: ["frame"], radius: "none", grain: true,
  },
  retro: {
    label: "Retro", desc: "nostalgia 70-an yang hangat",
    palettes: [["Terakota", "#4A2512", "#C8562B", "#FBF1DE", "#F3E3C3"], ["Mustard Teal", "#1F3A38", "#D9A441", "#FBF3E4", "#DCE9E4"], ["Cokelat Jeruk", "#3A2414", "#E07A2E", "#F7EBD7", "#EED6B2"]],
    fonts: [["Fraunces", "DM Sans"], ["Abril Fatface", "Lora"], ["Righteous", "Space Grotesk"]],
    motifs: ["sunburst", "arches"], radius: "lg", grain: true,
    ornaments: ["/ornamen/retro-divider-bintang.svg", "/ornamen/retro-divider-gelombang.svg", "/ornamen/retro-divider-matahari.svg"],
  },
  rustic: {
    label: "Rustic", desc: "natural dan hangat bernuansa kayu dan daun",
    palettes: [["Sage", "#2F3A2F", "#6F8F72", "#F7F5EF", "#E6EBDD"], ["Kayu", "#3B2A1E", "#8B5E3C", "#F6F0E6", "#E8DCC8"], ["Pasir Terakota", "#3D2B22", "#B4654A", "#FAF4EC", "#EFDFD0"]],
    fonts: [["DM Serif Display", "DM Sans"], ["Fraunces", "Manrope"]],
    motifs: ["botanical"], radius: "lg", grain: true,
  },
  floral: {
    label: "Floral", desc: "lembut dengan rangkaian bunga",
    palettes: [["Peony", "#4A2335", "#D4668A", "#FFF7FA", "#FBE3EC"], ["Lavender", "#2E2A47", "#8E7CC3", "#FAF8FF", "#ECE7FA"], ["Blush Sage", "#2F3B33", "#C98B8B", "#FBF8F4", "#E7EEE6"]],
    fonts: [["Cormorant Garamond", "Lora"], ["Great Vibes", "Lora"], ["Playfair Display", "DM Sans"]],
    motifs: ["floral"], radius: "lg",
  },
  islami: {
    label: "Islami", desc: "teduh dengan ornamen geometri islami",
    palettes: [["Hijau Zamrud", "#123A2E", "#1F7A57", "#F6FBF8", "#DCEFE5"], ["Emas Malam", "#F4EFE2", "#D4AF37", "#0F2A24", "#173B33"], ["Biru Firdaus", "#13304A", "#2B7A9B", "#F5FAFD", "#DDEDF5"]],
    fonts: [["Cormorant Garamond", "Manrope"], ["Libre Baskerville", "Lora"]],
    motifs: ["geometric"], radius: "sm",
  },
  nusantara: {
    label: "Nusantara", desc: "kaya motif tenun dan warna khas daerah",
    palettes: [],
    fonts: [["Cinzel", "Lora"], ["Cormorant Garamond", "Lora"]],
    motifs: ["tenun"], radius: "sm", grain: true,
  },
  ceria: {
    label: "Ceria", desc: "penuh warna dan menyenangkan",
    palettes: [["Pelangi", "#2B1B3D", "#FF5DA2", "#FFF5FB", "#FFE0F0"], ["Kuning Cerah", "#2D2A1F", "#F59E0B", "#FFFBEB", "#FEF3C7"], ["Biru Langit", "#0C2D48", "#0EA5E9", "#F0F9FF", "#DFF1FC"]],
    fonts: [["Bricolage Grotesque", "Poppins"], ["Shrikhand", "Poppins"], ["Syne", "Poppins"]],
    motifs: ["confetti", "waves"], radius: "lg",
  },
  gelap: {
    label: "Gelap", desc: "dramatis dengan latar gelap",
    palettes: [["Hitam Emas", "#F2EBDD", "#D4AF37", "#0E0E10", "#1A1A1E"], ["Biru Malam", "#E6EDF7", "#60A5FA", "#0B1220", "#141D30"], ["Merah Anggur", "#F4E6E6", "#E0577C", "#160B10", "#26131B"]],
    fonts: [["Space Grotesk", "Inter"], ["Cinzel", "Manrope"], ["DM Serif Display", "Inter"]],
    motifs: ["deco", "waves"], radius: "lg",
  },
  pastel: {
    label: "Pastel", desc: "lembut dan manis dengan warna pastel",
    palettes: [["Permen", "#3B3355", "#9D8DF1", "#FBF9FF", "#EFEAFE"], ["Peach", "#4A3428", "#F49B7A", "#FFF8F4", "#FDE6DC"], ["Mint", "#24403A", "#5FB8A0", "#F6FDFB", "#DDF4EE"]],
    fonts: [["Syne", "Manrope"], ["Fraunces", "DM Sans"], ["Poppins", "Poppins"]],
    motifs: ["blobs", "arches"], radius: "lg",
  },
  editorial: {
    label: "Editorial", desc: "tata letak ala majalah",
    palettes: [["Koran", "#141414", "#B4232A", "#FFFFFF", "#F2F0EB"], ["Kertas Krem", "#1E1B16", "#7A5C3A", "#FAF7F0", "#EDE6D8"], ["Arang", "#EDEDED", "#F5C542", "#151515", "#222222"]],
    fonts: [["DM Serif Display", "DM Sans"], ["Playfair Display", "Inter"]],
    motifs: ["grid", "frame"], radius: "none",
  },
  kreatif: {
    label: "Kreatif", desc: "berani dan unik untuk jiwa kreatif",
    palettes: [["Pop", "#1F1A17", "#E4572E", "#F6E7C8", "#F2C14E"], ["Kobalt", "#0B1B3F", "#2D5BFF", "#F5F3EE", "#FFD84D"], ["Lime", "#13221A", "#7CC242", "#FBFFF6", "#E7F6D8"]],
    fonts: [["Archivo Black", "Space Grotesk"], ["Syne", "DM Sans"], ["Bricolage Grotesque", "Inter"]],
    motifs: ["blobs", "confetti"], radius: "lg",
  },
};

const isDark = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 110;
};
const mix = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map((s) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t));
  return "#" + c.map((x) => x.toString(16).padStart(2, "0")).join("");
};

// ---------- motif gambar sampul (SVG 1600 × 1000) ----------
const W = 1600, H = 1000;
const grainDef = `<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0"/></filter>`;
const star4 = (cx, cy, s, f, o = 1) => `<path d="M ${cx} ${r1(cy - s)} Q ${r1(cx + s * 0.18)} ${r1(cy - s * 0.18)} ${r1(cx + s)} ${cy} Q ${r1(cx + s * 0.18)} ${r1(cy + s * 0.18)} ${cx} ${r1(cy + s)} Q ${r1(cx - s * 0.18)} ${r1(cy + s * 0.18)} ${r1(cx - s)} ${cy} Q ${r1(cx - s * 0.18)} ${r1(cy - s * 0.18)} ${cx} ${r1(cy - s)} Z" fill="${f}" fill-opacity="${o}"/>`;
const flower = (cx, cy, s, f, center, rot = 0, o = 1) =>
  [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${cx}" cy="${r1(cy - s * 0.52)}" rx="${r1(s * 0.32)}" ry="${r1(s * 0.52)}" transform="rotate(${a + rot} ${cx} ${cy})" fill="${f}" fill-opacity="${o}"/>`).join("") + `<circle cx="${cx}" cy="${cy}" r="${r1(s * 0.18)}" fill="${center}" fill-opacity="${o}"/>`;
const leaf = (x, y, s, rot, f, o = 1) => `<path d="M ${x} ${y} q ${r1(s * 0.5)} ${r1(-s * 0.5)} ${s} 0 q ${r1(-s * 0.5)} ${r1(s * 0.5)} ${-s} 0 Z" transform="rotate(${rot} ${x} ${y})" fill="${f}" fill-opacity="${o}"/>`;

const MOTIF = {
  frame: (c) => `<rect width="${W}" height="${H}" fill="${c.base}"/>
    <rect x="60" y="60" width="${W - 120}" height="${H - 120}" fill="none" stroke="${c.deco}" stroke-width="7"/>
    <rect x="86" y="86" width="${W - 172}" height="${H - 172}" fill="none" stroke="${c.deco}" stroke-opacity=".6" stroke-width="3"/>
    ${[[60, 60], [W - 60, 60], [60, H - 60], [W - 60, H - 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${c.deco}"/>`).join("")}
    <path d="M 600 150 H 1000 M 600 ${H - 150} H 1000" stroke="${c.deco}" stroke-width="4"/>` + star4(800, 150, 18, c.deco) + star4(800, H - 150, 18, c.deco) + ``,
  lines: (c) => `<rect width="${W}" height="${H}" fill="${c.base}"/>` + Array.from({ length: 40 }, (_, i) => `<path d="M ${i * 60 - 400} ${H} L ${i * 60 + 200} 0" stroke="${c.deco2}" stroke-opacity=".12" stroke-width="3"/>`).join("") + `<rect x="0" y="${H - 18}" width="${W}" height="18" fill="${c.deco}"/>`,
  blobs: (c) => `<rect width="${W}" height="${H}" fill="${c.base}"/>
    <path d="M -80 220 C 120 40 420 120 460 320 C 500 520 260 600 80 560 C -100 520 -200 380 -80 220 Z" fill="${c.deco}" fill-opacity=".85"/>
    <path d="M 1180 640 C 1300 520 1560 520 1680 660 C 1780 800 1640 1060 1420 1040 C 1220 1020 1080 780 1180 640 Z" fill="${c.deco2}" fill-opacity=".14"/>
    <path d="M 1240 80 C 1340 20 1480 60 1500 170 C 1520 280 1400 330 1310 290 C 1220 250 1160 130 1240 80 Z" fill="${c.deco}" fill-opacity=".35"/>
    <circle cx="300" cy="860" r="70" fill="${c.deco2}" fill-opacity=".12"/>`,
  grid: (c) => `<rect width="${W}" height="${H}" fill="${c.base}"/>` + Array.from({ length: 20 }, (_, i) => `<path d="M ${i * 80} 0 V ${H}" stroke="${c.deco2}" stroke-opacity=".12" stroke-width="2"/>`).join("") + Array.from({ length: 13 }, (_, i) => `<path d="M 0 ${i * 80} H ${W}" stroke="${c.deco2}" stroke-opacity=".12" stroke-width="2"/>`).join("") + `<circle cx="1300" cy="260" r="200" fill="none" stroke="${c.deco}" stroke-width="6"/><rect x="120" y="760" width="420" height="16" fill="${c.deco}"/>`,
  deco: (c) => {
    let fan = "";
    for (let i = 0; i < 6; i++) fan += `<path d="M ${800 - (520 - i * 80)} ${H} A ${520 - i * 80} ${520 - i * 80} 0 0 1 ${800 + 520 - i * 80} ${H}" fill="none" stroke="${c.deco}" stroke-opacity="${0.95 - i * 0.1}" stroke-width="7"/>`;
    for (let a = 200; a <= 340; a += 10) fan += `<path d="M 800 ${H} L ${r1(800 + Math.cos((a * Math.PI) / 180) * 560)} ${r1(H + Math.sin((a * Math.PI) / 180) * 560)}" stroke="${c.deco}" stroke-opacity=".45" stroke-width="3"/>`;
    return `<rect width="${W}" height="${H}" fill="${c.base}"/>${fan}<path d="M 0 70 H ${W} M 0 90 H ${W}" stroke="${c.deco}" stroke-width="5" stroke-opacity=".85"/>` + star4(800, 150, 30, c.deco);
  },
  sunburst: (c) => {
    let s = `<rect width="${W}" height="${H}" fill="${c.base}"/>`;
    for (let i = 0; i < 26; i++) {
      const a1 = ((180 + i * (180 / 26)) * Math.PI) / 180, a2 = ((180 + (i + 1) * (180 / 26)) * Math.PI) / 180;
      s += `<path d="M 800 ${H + 60} L ${r1(800 + Math.cos(a1) * 1500)} ${r1(H + 60 + Math.sin(a1) * 1500)} L ${r1(800 + Math.cos(a2) * 1500)} ${r1(H + 60 + Math.sin(a2) * 1500)} Z" fill="${i % 2 ? c.deco : c.base}" fill-opacity="${i % 2 ? 0.35 : 0}"/>`;
    }
    return s + `<circle cx="800" cy="${H + 60}" r="380" fill="${c.deco}"/><circle cx="800" cy="${H + 60}" r="310" fill="${c.base}"/>` + star4(230, 200, 34, c.deco2, 0.8) + star4(1380, 240, 26, c.deco2, 0.8);
  },
  arches: (c) => {
    const cols = [c.deco, mix(c.deco, c.base, 0.35), mix(c.deco2, c.base, 0.55), c.deco2];
    return `<rect width="${W}" height="${H}" fill="${c.base}"/>` + [620, 540, 460, 380].map((rad, i) => `<path d="M ${800 - rad} ${H} A ${rad} ${rad} 0 0 1 ${800 + rad} ${H}" fill="none" stroke="${cols[i]}" stroke-width="76" stroke-opacity=".9"/>`).join("") + star4(200, 170, 30, c.deco) + star4(1420, 210, 36, c.deco2, 0.7);
  },
  waves: (c) => {
    const cols = [c.deco, mix(c.deco, c.base, 0.4), mix(c.deco2, c.base, 0.6)];
    return `<rect width="${W}" height="${H}" fill="${c.base}"/>` + cols.map((col, i) => {
      const y = 700 + i * 90;
      return `<path d="M 0 ${y} C 300 ${y - 110} 520 ${y + 110} 800 ${y} S 1300 ${y - 110} 1600 ${y} V ${H} H 0 Z" fill="${col}" fill-opacity=".85"/>`;
    }).join("") + star4(260, 220, 24, c.deco) + star4(1340, 180, 30, c.deco);
  },
  botanical: (c) => {
    let s = `<rect width="${W}" height="${H}" fill="${c.base}"/>`;
    const branch = (x, y, dir, rot) => {
      let b = `<path d="M ${x} ${y} q ${dir * 160} -120 ${dir * 330} -110" stroke="${c.deco}" stroke-width="5" fill="none" transform="rotate(${rot} ${x} ${y})"/>`;
      for (let i = 1; i <= 7; i++) b += `<g transform="rotate(${rot} ${x} ${y})">${leaf(x + dir * i * 44, y - i * 15 - 6, 60, dir > 0 ? -40 - i * 4 : 220 + i * 4, c.deco, 0.85)}${leaf(x + dir * i * 44, y - i * 15 + 6, 52, dir > 0 ? 30 : 150, c.deco, 0.55)}</g>`;
      return b;
    };
    return s + branch(40, 260, 1, -20) + branch(W - 40, H - 140, -1, -20) + branch(80, H - 60, 1, -45) + branch(W - 60, 200, -1, 30);
  },
  floral: (c) => {
    let s = `<rect width="${W}" height="${H}" fill="${c.base}"/>`;
    const cluster = (cx, cy) => [[0, 0, 90], [110, 40, 66], [-50, 110, 70], [60, 150, 48], [150, -60, 44]].map(([dx, dy, sz], i) => leaf(cx + dx - 60, cy + dy + 40, sz * 1.4, 160 + i * 40, c.deco2, 0.25) + flower(cx + dx, cy + dy, sz, i % 2 ? c.deco : mix(c.deco, c.base, 0.45), mix(c.deco2, "#ffffff", 0.3), i * 20, 0.9)).join("");
    return s + cluster(120, 90) + `<g transform="translate(${W} ${H}) rotate(180)">${cluster(120, 90)}</g>`;
  },
  geometric: (c) => {
    let s = `<rect width="${W}" height="${H}" fill="${c.base}"/>`;
    for (let y = 0; y <= H; y += 120) for (let x = (y / 120) % 2 ? 60 : 0; x <= W; x += 120) s += `<g fill="none" stroke="${c.deco}" stroke-opacity=".22" stroke-width="2"><rect x="${x - 26}" y="${y - 26}" width="52" height="52"/><rect x="${x - 26}" y="${y - 26}" width="52" height="52" transform="rotate(45 ${x} ${y})"/></g>`;
    return s + `<path d="M 560 ${H} V 420 A 240 240 0 0 1 1040 420 V ${H} Z" fill="${c.base}"/><path d="M 580 ${H} V 430 A 220 220 0 0 1 1020 430 V ${H}" fill="none" stroke="${c.deco}" stroke-width="6"/>`;
  },
  confetti: (c) => {
    const cols = [c.deco, c.deco2, mix(c.deco, "#FFD166", 0.5), mix(c.deco2, "#06D6A0", 0.5), "#FFD166"];
    let s = `<rect width="${W}" height="${H}" fill="${c.base}"/>`;
    for (let i = 0; i < 90; i++) {
      const x = r1(rnd() * W), y = r1(rnd() * H);
      if (x > 420 && x < 1180 && y > 220 && y < 780) continue; // ruang kosong untuk teks
      const col = pick(cols), k = rnd();
      s += k < 0.4 ? `<circle cx="${x}" cy="${y}" r="${r1(6 + rnd() * 10)}" fill="${col}"/>` : k < 0.75 ? `<rect x="${x}" y="${y}" width="${r1(10 + rnd() * 16)}" height="${r1(6 + rnd() * 8)}" fill="${col}" transform="rotate(${Math.round(rnd() * 180)} ${x} ${y})"/>` : `<path d="M ${x} ${y} q 12 -16 24 0 t 24 0" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    }
    return s;
  },
  tenun: (c) => {
    let s = `<rect width="${W}" height="${H}" fill="${c.base}"/>`;
    for (let y = 0; y <= H; y += 90) for (let x = (y / 90) % 2 ? 45 : 0; x <= W; x += 90) s += `<path d="M ${x} ${y - 26} L ${x + 26} ${y} L ${x} ${y + 26} L ${x - 26} ${y} Z" fill="none" stroke="${c.deco}" stroke-opacity=".22" stroke-width="3"/><circle cx="${x}" cy="${y}" r="5" fill="${c.deco}" fill-opacity=".3"/>`;
    const band = (y) => `<rect x="0" y="${y}" width="${W}" height="60" fill="${c.deco}"/>` + Array.from({ length: 40 }, (_, i) => `<path d="M ${i * 40} ${y + 50} L ${i * 40 + 20} ${y + 10} L ${i * 40 + 40} ${y + 50} Z" fill="${c.deco2}" fill-opacity=".55"/>`).join("");
    return s + band(30) + band(H - 90);
  },
};

function writeArt(file, motif, c, grain) {
  const body = MOTIF[motif](c);
  const vig = `<radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="${c.deco2}" stop-opacity="0"/><stop offset="1" stop-color="${c.deco2}" stop-opacity=".16"/></radialGradient>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${grain ? grainDef : ""}${vig}</defs>${body}<rect width="100%" height="100%" fill="url(#vg)"/>${grain ? `<rect width="100%" height="100%" filter="url(#gr)" opacity=".18"/>` : ""}</svg>`;
  fs.writeFileSync(path.join(ART_DIR, file), svg);
  return `/koleksi/${file}`;
}

// ---------- data contoh ----------
const COUPLES = [["Nadia", "Fajar"], ["Salsa", "Rendi"], ["Intan", "Yusuf"], ["Maya", "Dimas"], ["Putri", "Arif"], ["Citra", "Bima"], ["Laras", "Galih"], ["Dewi", "Rizky"], ["Ayu", "Hendra"], ["Tiara", "Reza"], ["Anisa", "Fikri"], ["Sekar", "Raka"], ["Melati", "Aditya"], ["Dinda", "Yoga"], ["Rani", "Ilham"], ["Vina", "Andre"], ["Hana", "Farhan"], ["Wulan", "Satria"], ["Karin", "Bagus"], ["Nisa", "Hafiz"], ["Zahra", "Kevin"], ["Fitri", "Agung"]];
const SURNAME = ["Pratama", "Wulandari", "Saputra", "Lestari", "Nugroho", "Rahmawati", "Hidayat", "Kusuma", "Permata", "Santoso", "Maharani", "Wibowo"];
const PARENT_M = ["Bapak Ahmad", "Bapak Budi", "Bapak Sutrisno", "Bapak Hartono", "Bapak Suryadi", "Bapak Joko", "Bapak Agus", "Bapak Rahmat"];
const PARENT_F = ["Ibu Siti", "Ibu Ani", "Ibu Lestari", "Ibu Wati", "Ibu Endang", "Ibu Nurul", "Ibu Ratna", "Ibu Yuli"];
const CITIES = ["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Semarang", "Malang", "Medan", "Makassar", "Denpasar", "Purwokerto", "Bogor", "Solo", "Palembang", "Balikpapan"];
const VENUES = ["Gedung Serbaguna", "Ballroom Hotel Nusantara", "Taman Bunga Kota", "Pendopo Agung", "Villa Kebun", "Rumah Makan Taman Sari", "Aula Graha"];
const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const IMG = (i) => `/placeholder/img-${((i - 1) % 6) + 1}.svg`;

let dateIdx = 0;
function nextDate(hour = 9) {
  // Tanggal di akhir pekan sepanjang 2027
  const m = dateIdx % 12, d = 6 + ((dateIdx * 7) % 20);
  dateIdx++;
  let dt = new Date(Date.UTC(2027, m, d));
  while (dt.getUTCDay() !== 6 && dt.getUTCDay() !== 0) dt = new Date(dt.getTime() + 86400000);
  const iso = (h, mi = 0) => `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}T${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
  return { iso, text: `${HARI[dt.getUTCDay()]}, ${dt.getUTCDate()} ${BULAN[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`, hour };
}
const maps = (city) => `https://maps.google.com/?q=${encodeURIComponent(city)}`;

// ---------- pembuat bagian ----------
let sec = 0;
const S = (type, props) => ({ id: `kol-s${++sec}`, type, props });
const E = (o) => ({ id: `kol-e${++sec}`, rotation: 0, opacity: 1, ...o });

const cover = (o) => S("cover", { topImage: "", tagline: "", greeting: "Kepada Yth. Bapak/Ibu/Saudara/i", buttonText: "Buka Undangan", buttonLink: "", ...o });
const rsvp = (o = {}) => S("rsvp", { heading: "Konfirmasi Kehadiran", text: "Kehadiran dan doa restu Anda sangat berarti bagi kami.", maxGuests: 2, showWishes: "ya", ...o });
const gift = (h = "Amplop Digital") => S("gift", { heading: h, text: "Jika ingin memberi tanda kasih, dapat melalui:", items: [{ bank: "Nama Bank", number: "0000000000", holder: "Nama Pemilik", qr: "" }], address: "" });
const countdown = (date, h = "Menuju hari bahagia", done = "Acara sedang berlangsung / telah selesai") => S("countdown", { heading: h, target: date.iso(date.hour), zone: "WIB", doneText: done });
const gallery = (h = "Galeri", cols = 3, n = 6) => S("gallery", { heading: h, columns: cols, items: Array.from({ length: n }, (_, i) => ({ image: IMG(i + 1), caption: "" })) });
const music = () => S("music", { src: "", title: "" });
const poster = (big, small, line, dark) =>
  S("canvas", {
    height: 420, background: "theme:bg", backgroundImage: "",
    elements: [
      E({ type: "shape", name: "Garis atas", x: 520, y: 70, w: 160, h: 4, fill: "theme:accent", radius: 2 }),
      E({ type: "text", name: "Judul besar", x: 100, y: 110, w: 1000, h: 120, text: big, fontFamily: "heading", fontSize: 80, align: "center", lineHeight: 1.05, color: "theme:text" }),
      E({ type: "text", name: "Sub judul", x: 200, y: 250, w: 800, h: 40, text: small, fontFamily: "body", fontSize: 20, fontWeight: 600, align: "center", letterSpacing: 4, uppercase: true, color: "theme:accent" }),
      E({ type: "text", name: "Keterangan", x: 220, y: 300, w: 760, h: 60, text: line, fontFamily: "body", fontSize: 18, italic: true, align: "center", lineHeight: 1.5, color: "theme:text", opacity: dark ? 0.85 : 0.75 }),
    ],
  });
const closing = (title, sub, art) =>
  S("canvas", {
    height: 400, background: "theme:surface", backgroundImage: art,
    elements: [
      E({ type: "text", name: "Penutup", x: 100, y: 120, w: 1000, h: 100, text: title, fontFamily: "heading", fontSize: 64, align: "center", lineHeight: 1.1, color: "theme:text" }),
      E({ type: "text", name: "Ucapan", x: 200, y: 235, w: 800, h: 80, text: sub, fontFamily: "body", fontSize: 20, align: "center", lineHeight: 1.5, color: "theme:text", opacity: 0.85 }),
    ],
  });
const event1 = (name, date, end, place, addr, city) => ({ name, start: date.iso(date.hour), end, place, address: `${addr}, ${city}`, map: maps(city) });

// ---------- resep undangan ----------
const QUOTES = [
  ["Dua jiwa, satu perjalanan.", "Untuk selamanya"],
  ["Cinta yang sederhana, doa yang tak pernah putus.", ""],
  ["Bersama, kami memulai cerita baru.", ""],
  ["Dan di antara tanda-tanda kebesaran-Nya, Dia menciptakan pasangan untukmu agar kamu merasa tenteram.", "QS. Ar-Rum: 21"],
];

let coupleIdx = 0;
const nextCouple = () => COUPLES[coupleIdx++ % COUPLES.length];
const full = (first) => `${first} ${pick(SURNAME)}`;

const INV = {
  pernikahan(t, i) {
    const [a, b] = nextCouple();
    const d = nextDate(8), city = pick(CITIES);
    const gereja = i % 4 === 3;
    const q = t.style === "islami" ? QUOTES[3] : QUOTES[i % 3];
    const sections = [
      cover({ eyebrow: pick(["The Wedding of", "Pernikahan", "Save the Date"]), title: `${a} & ${b}`, subtitle: d.text, image: t.art, tone: t.tone }),
      music(),
      i % 2 ? poster(`${a} & ${b}`, d.text, q[0], t.dark) : S("testimonial", { quote: q[0], author: q[1] || `${a} & ${b}`, role: "" }),
      S("couple", { heading: "Mempelai", intro: gereja ? "Dengan penuh sukacita dan atas kasih Tuhan, kami mengundang Anda pada pernikahan kami:" : "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami:", name1: a, script1: "", full1: full(a), parents1: `Putri dari ${pick(PARENT_M)}\n& ${pick(PARENT_F)}`, photo1: "/placeholder/portrait.svg", ig1: "", name2: b, script2: "", full2: full(b), parents2: `Putra dari ${pick(PARENT_M)}\n& ${pick(PARENT_F)}`, photo2: "/placeholder/hero.svg", ig2: "" }),
      countdown(d),
      S("event", { heading: "Waktu & Tempat", zone: "WIB", items: [event1(gereja ? "Pemberkatan Nikah" : "Akad Nikah", d, "10.00", gereja ? "Gereja Kristus Raja" : "Masjid Raya", "Jl. Merdeka No. 1", city), { ...event1("Resepsi", { ...d, iso: d.iso }, "Selesai", pick(VENUES), "Jl. Sudirman No. 10", city), start: d.iso(11) }] }),
    ];
    if (i % 3 === 0) sections.push(S("story", { heading: "Kisah Kami", items: [{ date: "2019", title: "Pertama bertemu", description: "Sebuah pertemuan sederhana yang menjadi awal segalanya.", image: IMG(1) }, { date: "2024", title: "Lamaran", description: "Dengan restu keluarga, kami melangkah lebih serius.", image: IMG(2) }, { date: "2027", title: "Menikah", description: "Kini kami siap memulai babak baru bersama.", image: IMG(3) }] }));
    if (i % 4 === 1) sections.push(S("dresscode", { heading: "Dress Code", text: "Tamu dianjurkan mengenakan pakaian formal dengan nuansa warna berikut:", colors: [{ color: t.theme.colorAccent, label: "Aksen" }, { color: t.theme.colorSurface, label: "Lembut" }, { color: t.theme.colorPrimary, label: "Gelap" }], image: "" }));
    sections.push(gallery(), rsvp(), gift(), closing("Terima Kasih", `Atas kehadiran dan doa restunya, kami ucapkan terima kasih.\n${a} & ${b}`, t.art));
    return { title: `${a} & ${b}`, sections };
  },
  lamaran(t) {
    const [a, b] = nextCouple();
    const d = nextDate(10), city = pick(CITIES);
    return {
      title: `${a} & ${b}`,
      sections: [
        cover({ eyebrow: pick(["Engagement", "Acara Lamaran", "Tunangan"]), title: `${a} & ${b}`, subtitle: d.text, image: t.art, tone: t.tone }),
        S("about", { heading: "Dengan penuh syukur", body: `Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan acara lamaran ${a} dan ${b}. Semoga niat baik ini dilancarkan hingga ke jenjang pernikahan.`, image: "/placeholder/portrait.svg" }),
        S("couple", { heading: "Kami berdua", intro: "", name1: a, script1: "", full1: full(a), parents1: `Putri dari ${pick(PARENT_M)}\n& ${pick(PARENT_F)}`, photo1: "/placeholder/portrait.svg", ig1: "", name2: b, script2: "", full2: full(b), parents2: `Putra dari ${pick(PARENT_M)}\n& ${pick(PARENT_F)}`, photo2: "/placeholder/hero.svg", ig2: "" }),
        S("event", { heading: "Waktu & Tempat", zone: "WIB", items: [event1("Acara Lamaran", d, "13.00", "Kediaman Keluarga Wanita", "Jl. Melati No. 8", city)] }),
        countdown(d, "Menuju hari lamaran"),
        gallery("Momen Kami", 3, 3),
        rsvp({ text: "Mohon konfirmasi kehadiran untuk persiapan acara." }),
        closing("Terima Kasih", `Doa Anda adalah hadiah terbaik untuk kami.\n${a} & ${b}`, t.art),
      ],
    };
  },
  "ulang-tahun"(t, i) {
    const names = ["Kayla", "Arka", "Naura", "Rafa", "Alesha", "Bima", "Zahra", "Keenan", "Oma Ratna"];
    const ages = [1, 5, 7, 10, 17, 21, 30, 40, 60];
    const nm = names[i % names.length], age = ages[i % ages.length];
    const d = nextDate(16), city = pick(CITIES);
    const big = age === 17 ? "Sweet Seventeen" : age >= 40 ? `${age} Tahun Penuh Syukur` : `${nm} ke-${age}!`;
    return {
      title: `${nm} ${age} tahun`,
      sections: [
        cover({ eyebrow: "Undangan Ulang Tahun", title: age >= 40 ? `${age} Tahun ${nm}` : `${nm} ke-${age}`, subtitle: d.text, greeting: "Halo,", image: t.art, tone: t.tone, buttonText: "Lihat Undangan" }),
        music(),
        poster(big, `Rayakan bersama ${nm}`, age >= 40 ? "Dengan rasa syukur atas usia dan keluarga yang hangat" : "Ada kue, permainan seru, dan banyak tawa!", t.dark),
        S("event", { heading: "Pesta", zone: "WIB", items: [event1("Pesta Ulang Tahun", d, "19.00", pick(["Rumah Keluarga", "Kafe Ceria", "Taman Bermain Kota", "Restoran Keluarga"]), "Jl. Kenanga No. 7", city)] }),
        countdown(d, "Pesta dimulai dalam", "Pestanya sudah dimulai! 🎉"),
        ...(i % 2 ? [S("dresscode", { heading: "Dress Code", text: "Pakai baju dengan warna ceria ya!", colors: [{ color: t.theme.colorAccent, label: "Utama" }, { color: t.theme.colorSurface, label: "Lembut" }], image: "" })] : []),
        gallery("Foto Kenangan", 3, 3),
        rsvp({ heading: "Kamu datang?", text: "Kabari kami supaya kue dan hadiahnya cukup!", maxGuests: 4 }),
      ],
    };
  },
  khitanan(t, i) {
    const aqiqah = i % 2 === 1;
    const nm = aqiqah ? pick(["Aisyah Putri", "Muhammad Zayn", "Hafsah Azzahra"]) : pick(["Muhammad Alif", "Ahmad Fauzan", "Raffasya Putra", "Abdullah Faris"]);
    const d = nextDate(10), city = pick(CITIES);
    const ayah = pick(PARENT_M), ibu = pick(PARENT_F);
    return {
      title: nm,
      sections: [
        cover({ eyebrow: aqiqah ? "Tasyakuran Aqiqah" : "Tasyakuran Khitanan", title: nm, subtitle: d.text, image: t.art, tone: t.tone }),
        S("about", { heading: "Assalamu’alaikum Wr. Wb.", body: `Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan ${aqiqah ? "aqiqah" : "khitanan"} ${aqiqah ? "buah hati" : "putra"} kami:\n\n${nm}\n${aqiqah ? "Buah hati" : "Putra"} dari ${ayah} & ${ibu}\n\nMerupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.`, image: "/placeholder/portrait.svg" }),
        S("event", { heading: "Waktu & Tempat", zone: "WIB", items: [event1(aqiqah ? "Tasyakuran Aqiqah" : "Tasyakuran Khitanan", d, "Selesai", "Kediaman Keluarga", "Jl. Cempaka No. 9", city)] }),
        countdown(d, "Menuju hari tasyakuran"),
        rsvp({ text: "Mohon doa dan kehadirannya." }),
        gift("Tanda Kasih"),
        closing("Jazakumullah Khairan", `Atas doa dan kehadirannya, kami ucapkan terima kasih.\nKeluarga ${ayah}`, t.art),
      ],
    };
  },
  wisuda(t, i) {
    const nm = full(pick(["Rizka", "Daffa", "Nabila", "Fadhil", "Salma", "Yudha"]));
    const gelar = ["S.Kom.", "S.E.", "S.T.", "S.Psi.", "S.H."][i % 5];
    const d = nextDate(9), city = pick(CITIES);
    return {
      title: nm,
      sections: [
        cover({ eyebrow: "Undangan Wisuda", title: `${nm}, ${gelar}`, subtitle: d.text, greeting: "Teruntuk", image: t.art, tone: t.tone, buttonText: "Lihat Undangan" }),
        poster("Akhirnya, Lulus!", `${nm}, ${gelar}`, "Terima kasih atas doa dan dukungan selama perjalanan ini", t.dark),
        S("about", { heading: "Sepatah kata", body: "Perjalanan panjang ini tidak akan selesai tanpa doa orang tua, bimbingan dosen, dan semangat dari teman-teman. Mari rayakan bersama!", image: "/placeholder/portrait.svg" }),
        S("event", { heading: "Acara", zone: "WIB", items: [event1("Prosesi Wisuda", d, "12.00", "Auditorium Universitas", "Jl. Pendidikan No. 1", city), { ...event1("Syukuran Kelulusan", d, "Selesai", "Rumah Makan Keluarga", "Jl. Mawar No. 3", city), start: d.iso(17) }] }),
        countdown(d, "Hari wisuda", "Selamat! Hari wisuda telah tiba"),
        gallery("Kenangan Kampus", 3, 6),
        rsvp({ heading: "Hadir di syukuran?", text: "Kabari kami ya.", showWishes: "ya" }),
      ],
    };
  },
  syukuran(t, i) {
    const jenis = ["Syukuran Rumah Baru", "Pengajian & Doa Bersama", "Walimatussafar", "Syukuran Tujuh Bulanan", "Halal bi Halal Keluarga", "Syukuran Usaha Baru"][i % 6];
    const host = `Keluarga ${pick(PARENT_M)}`;
    const d = nextDate(19), city = pick(CITIES);
    const body = {
      "Syukuran Rumah Baru": "Alhamdulillah, kami telah menempati rumah baru. Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam doa bersama dan ramah tamah.",
      "Pengajian & Doa Bersama": "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pengajian dan doa bersama, semoga membawa keberkahan.",
      Walimatussafar: "Menjelang keberangkatan ke Tanah Suci, kami mohon doa restu dan mengundang Bapak/Ibu/Saudara/i dalam acara walimatussafar.",
      "Syukuran Tujuh Bulanan": "Dengan penuh syukur atas kehamilan yang memasuki usia tujuh bulan, kami mengundang Bapak/Ibu/Saudara/i untuk mendoakan ibu dan calon buah hati.",
      "Halal bi Halal Keluarga": "Mari bersilaturahmi dan saling memaafkan dalam acara halal bi halal keluarga besar.",
      "Syukuran Usaha Baru": "Dengan rasa syukur atas dibukanya usaha baru kami, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan kelancarannya.",
    }[jenis];
    return {
      title: jenis,
      sections: [
        cover({ eyebrow: "Undangan", title: jenis, subtitle: d.text, image: t.art, tone: t.tone }),
        S("about", { heading: t.style === "islami" ? "Assalamu’alaikum Wr. Wb." : "Dengan hormat", body: `${body}\n\nKami yang berbahagia,\n${host}`, image: "" }),
        S("event", { heading: "Waktu & Tempat", zone: "WIB", items: [event1(jenis, d, "21.00", "Kediaman Keluarga", "Jl. Anggrek No. 12", city)] }),
        countdown(d, "Menuju hari acara"),
        rsvp({ text: "Mohon konfirmasi kehadiran.", showWishes: "ya" }),
        closing("Terima Kasih", `Atas kehadiran dan doanya.\n${host}`, t.art),
      ],
    };
  },
  acara(t, i) {
    const jenis = ["Seminar Kewirausahaan", "Gathering Komunitas", "Peluncuran Produk", "Reuni Angkatan 2010", "Workshop Desain", "Malam Apresiasi Karyawan"][i % 6];
    const d = nextDate(13), city = pick(CITIES);
    return {
      title: jenis,
      sections: [
        cover({ eyebrow: "Anda diundang ke", title: jenis, subtitle: `${d.text} · ${city}`, greeting: "Undangan khusus untuk", image: t.art, tone: t.tone, buttonText: "Lihat Detail" }),
        S("about", { heading: "Tentang acara", body: `${jenis} menghadirkan sesi berbagi, diskusi, dan networking bersama para peserta dari berbagai latar belakang.`, image: IMG(4) }),
        S("event", { heading: "Agenda", zone: "WIB", items: [event1("Registrasi", d, "13.30", "Lobby", "Jl. Gatot Subroto No. 99", city), { ...event1("Sesi Utama", d, "16.30", "Ballroom", "Jl. Gatot Subroto No. 99", city), start: d.iso(14) }] }),
        ...(i % 2 === 0 ? [S("projects", { heading: "Pembicara", items: [1, 2, 3].map((k) => ({ title: `Nama Pembicara ${k}`, description: ["Praktisi industri", "Pendiri startup", "Akademisi"][k - 1], image: k === 1 ? "/placeholder/portrait.svg" : IMG(k + 3), link: "" })) })] : []),
        countdown(d, "Acara dimulai dalam", "Acara sedang berlangsung"),
        ...(i % 3 === 1 ? [S("dresscode", { heading: "Dress Code", text: "Smart casual.", colors: [{ color: t.theme.colorPrimary, label: "Gelap" }, { color: t.theme.colorAccent, label: "Aksen" }], image: "" })] : []),
        rsvp({ heading: "Daftar hadir", text: "Konfirmasi kehadiran Anda agar kami dapat menyiapkan tempat.", maxGuests: 1, showWishes: "tidak" }),
      ],
    };
  },
  "grand-opening"(t, i) {
    const usaha = ["Kedai Kopi Senja", "Butik Melati", "Bengkel Maju Jaya"][i % 3];
    const d = nextDate(10), city = pick(CITIES);
    return {
      title: usaha,
      sections: [
        cover({ eyebrow: "Grand Opening", title: usaha, subtitle: `${d.text} · ${city}`, greeting: "Undangan untuk", image: t.art, tone: t.tone, buttonText: "Lihat Promo" }),
        poster("Kami Resmi Buka!", usaha, "Nikmati promo spesial di hari pembukaan", t.dark),
        S("skills", { heading: "Promo pembukaan", items: [{ name: "Diskon 50%", detail: "Untuk 100 pengunjung pertama" }, { name: "Gratis suvenir", detail: "Setiap pembelian" }, { name: "Doorprize", detail: "Diundi pukul 16.00" }, { name: "Live music", detail: "Sepanjang sore" }] }),
        S("event", { heading: "Waktu & Tempat", zone: "WIB", items: [event1("Grand Opening", d, "17.00", usaha, "Jl. Pemuda No. 21", city)] }),
        countdown(d, "Buka dalam", "Kami sudah buka! Sampai jumpa"),
        gallery("Sekilas tempat kami", 3, 3),
        rsvp({ heading: "Konfirmasi kehadiran", text: "Daftarkan diri untuk ikut undian doorprize.", maxGuests: 2, showWishes: "tidak" }),
      ],
    };
  },
};

// ---------- adat baru ----------
const ADAT = [
  {
    key: "betawi", name: "Pernikahan Adat Betawi", palette: ["Ondel-ondel", "#2B1110", "#C0262D", "#FFF8EE", "#F6E2C6"], deco2: "#1F7A3A",
    eyebrow: "Pernikahan", couple: ["Siti", "Bang Udin"], quote: ["Buka palang pintu, pengantin datang membawa restu.", "Pantun Betawi"],
    ceremony: [["Ngedelengin", "Penjajakan awal antara kedua keluarga."], ["Ngelamar", "Keluarga pria datang melamar secara resmi."], ["Bawa Tande Putus", "Menyerahkan tanda pengikat sebagai bukti kesungguhan."], ["Malam Pacar", "Calon pengantin wanita memakai pacar (inai) di malam sebelum akad."], ["Akad Nikah", "Ikrar pernikahan kedua mempelai."], ["Buka Palang Pintu", "Adu pantun dan silat saat rombongan pengantin pria tiba."]],
    dress: "Tamu dianjurkan berpakaian formal; boleh mengenakan kebaya kerancang atau baju sadariah.", colors: [["#C0262D", "Merah"], ["#1F7A3A", "Hijau"], ["#E0B23A", "Emas"]], closing: "Terima Kasih",
  },
  {
    key: "melayu", name: "Walimatul Urus Adat Melayu", palette: ["Kuning Diraja", "#2A2410", "#C8A415", "#FFFCEF", "#F4EAC2"], deco2: "#2E6B3A",
    eyebrow: "Walimatul Urus", couple: ["Nurul", "Hakim"], quote: ["Biduk berlalu kiambang bertaut.", "Peribahasa Melayu"],
    ceremony: [["Merisik", "Penjajakan oleh pihak keluarga lelaki."], ["Meminang", "Peminangan resmi dan bertukar tanda."], ["Berinai", "Memakai inai pada malam sebelum akad sebagai lambang kesiapan."], ["Akad Nikah", "Ikrar pernikahan kedua mempelai."], ["Bersanding", "Kedua mempelai duduk bersanding di pelaminan."], ["Makan Beradab", "Jamuan makan bersama kedua keluarga dengan tata krama Melayu."]],
    dress: "Tamu dianjurkan mengenakan baju kurung, baju Melayu, atau pakaian formal.", colors: [["#C8A415", "Kuning"], ["#2E6B3A", "Hijau"], ["#FFFCEF", "Krem"]], closing: "Terima Kasih",
  },
  {
    key: "bugis", name: "Pernikahan Adat Bugis", palette: ["Sutra Mandar", "#2A0F14", "#9E1B32", "#FFF7F2", "#F4DDD3"], deco2: "#D4A63A",
    eyebrow: "Pernikahan", couple: ["Andi Nur", "Andi Rahman"], quote: ["Resopa temmangingngi namalomo naletei pammase Dewata.", "Pepatah Bugis — hanya kerja keras yang dirahmati"],
    ceremony: [["Mammanu'-manu'", "Penjajakan awal oleh keluarga pria."], ["Madduta", "Lamaran resmi dan pembahasan hal-hal pernikahan."], ["Mappacci", "Malam pensucian dengan daun pacar oleh keluarga dan kerabat."], ["Akad Nikah", "Ikrar pernikahan kedua mempelai."], ["Tudang Botting", "Kedua mempelai duduk bersanding menerima ucapan tamu."], ["Mapparola", "Kunjungan mempelai wanita ke keluarga mempelai pria."]],
    dress: "Tamu dianjurkan mengenakan baju bodo, jas tutup, atau pakaian formal.", colors: [["#9E1B32", "Merah marun"], ["#D4A63A", "Emas"], ["#1F4E79", "Biru"]], closing: "Terima Kasih",
  },
  {
    key: "sasak", name: "Pernikahan Adat Sasak", palette: ["Tenun Lombok", "#1E1A14", "#B5492A", "#FBF6EC", "#EADFC6"], deco2: "#2C2C2C",
    eyebrow: "Pernikahan", couple: ["Baiq Rina", "Lalu Ahmad"], quote: ["Merariq bukan sekadar adat, melainkan doa dan restu dua keluarga.", ""],
    ceremony: [["Merariq", "Tradisi membawa calon pengantin wanita, dilakukan sesuai kesepakatan keluarga."], ["Selabar", "Pemberitahuan resmi kepada keluarga pengantin wanita."], ["Akad Nikah", "Ikrar pernikahan kedua mempelai."], ["Sorong Serah Aji Krame", "Prosesi adat penyerahan aji krame sebagai simbol penghormatan."], ["Nyongkolan", "Arak-arakan pengantin menuju rumah keluarga wanita diiringi gendang beleq."]],
    dress: "Tamu dianjurkan mengenakan pakaian adat Sasak atau pakaian formal.", colors: [["#B5492A", "Terakota"], ["#2C2C2C", "Hitam"], ["#D9A441", "Emas"]], closing: "Tampiasih",
  },
];

// ---------- resep portofolio ----------
const PORT = {
  personal: [["Desainer Grafis", "Saya membantu brand tampil jelas dan berkesan.", ["Identitas brand", "Desain kemasan", "Konten media sosial", "Ilustrasi"]], ["Ilustrator", "Gambar penuh warna untuk buku, kemasan, dan mural.", ["Buku anak", "Karakter", "Mural", "Stiker"]], ["Content Creator", "Cerita singkat yang dekat dengan audiens.", ["Video pendek", "Fotografi produk", "Copywriting", "Strategi konten"]], ["Desainer UI/UX", "Merancang aplikasi yang mudah dan menyenangkan.", ["Riset pengguna", "Wireframe", "Desain UI", "Prototipe"]], ["Videografer", "Merekam momen menjadi cerita sinematik.", ["Video pernikahan", "Iklan produk", "Dokumenter", "Editing"]], ["Motion Designer", "Animasi yang membuat pesan lebih hidup.", ["Animasi logo", "Explainer video", "Motion graphic", "Lower third"]]],
  fotografer: [["Fotografer Pernikahan", "Mengabadikan hari bahagia dengan hangat.", ["Prewedding", "Akad & resepsi", "Album cetak", "Video highlight"]], ["Fotografer Produk", "Foto produk yang membuat orang ingin membeli.", ["Katalog", "Flat lay", "Foto model", "Retouch"]], ["Fotografer Potret", "Potret yang jujur dan penuh karakter.", ["Potret keluarga", "Foto profil", "Wisuda", "Maternity"]], ["Fotografer Perjalanan", "Cerita dari setiap tempat yang dikunjungi.", ["Hotel & resort", "Pariwisata", "Cetak foto", "Workshop"]]],
  teknologi: [["Software Engineer", "Membangun aplikasi web yang cepat dan andal.", ["Aplikasi web", "API & backend", "Integrasi sistem", "Konsultasi"]], ["Data Analyst", "Mengubah data menjadi keputusan.", ["Dashboard", "Analisis penjualan", "Pelatihan Excel", "Otomasi laporan"]], ["Mobile Developer", "Aplikasi Android & iOS untuk usaha Anda.", ["Aplikasi Android", "Aplikasi iOS", "UI mobile", "Publikasi store"]], ["DevOps Engineer", "Server stabil, deploy tanpa drama.", ["Cloud setup", "CI/CD", "Monitoring", "Keamanan"]], ["Konsultan IT", "Solusi teknologi untuk UMKM dan instansi.", ["Jaringan kantor", "Sistem kasir", "Website", "Pelatihan"]]],
  penulis: [["Penulis Fiksi", "Menulis cerita yang layak dibaca dua kali.", ["Novel", "Cerpen", "Naskah", "Kelas menulis"]], ["Copywriter", "Kata-kata yang menjual.", ["Iklan", "Website", "Email marketing", "Naming brand"]], ["Pembicara Publik", "Berbagi inspirasi di panggung dan ruang kelas.", ["Seminar", "Pelatihan", "MC acara", "Podcast"]]],
  arsitek: [["Studio Arsitek", "Ruang yang nyaman untuk ditinggali.", ["Desain rumah", "Renovasi", "Gambar kerja", "Pengawasan"]], ["Desain Interior", "Interior yang fungsional dan berkarakter.", ["Interior rumah", "Kafe & toko", "Furnitur custom", "Styling"]], ["Kontraktor Rumah", "Membangun rumah tepat waktu dan sesuai anggaran.", ["Bangun baru", "Renovasi", "RAB", "Perizinan"]]],
  bisnis: [["Konveksi Jaya Abadi", "Produksi kaos, seragam, dan jaket berkualitas.", ["Kaos sablon", "Seragam kantor", "Jaket komunitas", "Bordir"]], ["Bersih Sejahtera", "Jasa kebersihan rumah dan kantor.", ["Cleaning harian", "Cuci sofa", "Pest control", "Deep cleaning"]], ["Percetakan Cahaya", "Cetak cepat, rapi, dan tepat waktu.", ["Undangan cetak", "Banner", "Brosur", "Stiker"]], ["Agensi Digital Sinar", "Pemasaran digital untuk UMKM.", ["Media sosial", "Iklan online", "Website", "Branding"]], ["Toko Bangunan Makmur", "Lengkap untuk kebutuhan bangun dan renovasi.", ["Semen & pasir", "Cat", "Keramik", "Antar gratis"]], ["Rental Mobil Lancar", "Sewa mobil nyaman untuk mudik dan wisata.", ["Lepas kunci", "Dengan sopir", "Antar bandara", "Wisata"]]],
  kuliner: [["Dapur Bunda", "Masakan rumahan yang bikin rindu.", ["Katering harian", "Nasi kotak", "Tumpeng", "Kue basah"]], ["Kopi Kampung", "Kopi lokal disangrai sendiri.", ["Kopi susu", "Manual brew", "Biji kopi", "Camilan"]], ["Toko Roti Manis", "Roti dan kue segar setiap pagi.", ["Roti tawar", "Kue ulang tahun", "Pastry", "Hampers"]], ["Seblak Mantap", "Pedasnya bikin nagih.", ["Seblak", "Bakso aci", "Minuman segar", "Pesan antar"]]],
  kesehatan: [["Klinik Gigi Senyum", "Senyum sehat untuk seluruh keluarga.", ["Pemeriksaan", "Scaling", "Behel", "Tambal gigi"]], ["Salon & Spa Ayu", "Perawatan cantik dan rileks.", ["Potong rambut", "Creambath", "Facial", "Pijat"]], ["Studio Yoga Tenang", "Tubuh bugar, pikiran tenang.", ["Kelas pemula", "Yoga prenatal", "Private class", "Meditasi"]]],
  pendidikan: [["Les Privat Cerdas", "Belajar menyenangkan di rumah.", ["TK & SD", "SMP", "Persiapan ujian", "Mengaji"]], ["Kursus Bahasa Inggris", "Berani bicara dalam 3 bulan.", ["Conversation", "TOEFL", "Kelas anak", "Online"]], ["PAUD Pelangi", "Tempat bermain dan belajar si kecil.", ["Kelompok bermain", "TK A & B", "Daycare", "Ekstrakurikuler"]]],
  seni: [["Band Indie Senja", "Lagu-lagu tentang kota dan rindu.", ["Konser", "Album", "Merchandise", "Booking"]], ["Pelukis Kontemporer", "Warna dan cerita di atas kanvas.", ["Lukisan komisi", "Pameran", "Mural", "Kelas melukis"]], ["Sanggar Tari Nusantara", "Melestarikan tari tradisi.", ["Kelas tari anak", "Pentas", "Kostum", "Pelatihan guru"]]],
};

function portfolioSections(t, cat, i, item) {
  const [title, tagline, services] = item;
  const align = ["gelap", "editorial", "retro"].includes(t.style) ? "cover" : ["pastel", "ceria"].includes(t.style) ? "center" : "left";
  const city = pick(CITIES);
  const sections = [
    S("hero", { eyebrow: CATEGORY_LABEL[cat], title, subtitle: tagline, description: `Berbasis di ${city}, melayani klien di seluruh Indonesia.`, image: t.art, align, buttonText: "Hubungi kami", buttonLink: "#kontak" }),
  ];
  if (["retro", "kreatif", "ceria"].includes(t.style)) sections.push(poster(title, CATEGORY_LABEL[cat], tagline, t.dark));
  sections.push(S("about", { heading: "Tentang", body: `${title} berawal dari kecintaan pada pekerjaan yang dikerjakan dengan sepenuh hati. Kami percaya hasil terbaik lahir dari komunikasi yang baik dan proses yang rapi.`, image: "/placeholder/portrait.svg" }));
  sections.push(S("skills", { heading: "Layanan", items: services.map((s, k) => ({ name: s, detail: ["Konsultasi gratis", "Hasil cepat & rapi", "Harga bersahabat", "Bergaransi"][k % 4] })) }));
  if (cat === "fotografer" || cat === "seni" || i % 3 === 0) sections.push(gallery("Galeri", cat === "fotografer" ? 3 : 4, cat === "fotografer" ? 6 : 4));
  else sections.push(S("projects", { heading: "Karya pilihan", items: [1, 2, 3].map((k) => ({ title: `${services[k - 1]}`, description: "Contoh proyek — ganti dengan karya Anda.", image: IMG(k + (i % 3)), link: "" })) }));
  if (["teknologi", "penulis"].includes(cat)) sections.push(S("experience", { heading: "Pengalaman", items: [{ role: "Posisi saat ini", place: "Perusahaan / klien", period: "2023 – sekarang", description: "Ceritakan pencapaian utama Anda." }, { role: "Posisi sebelumnya", place: "Perusahaan", period: "2019 – 2023", description: "" }] }));
  sections.push(S("testimonial", { quote: "Pelayanannya ramah, hasilnya memuaskan. Pasti kembali lagi!", author: "Klien setia", role: city }));
  sections.push(S("contact", { heading: "Hubungi kami", text: "Konsultasi gratis lewat email atau WhatsApp.", email: "halo@email.com", phone: "0812-0000-0000", links: [{ label: "Instagram", url: "https://instagram.com/" }] }));
  return { title, sections };
}

// ---------- rencana 100 template ----------
const PLAN = [
  // [kind, kategori, jumlah, gaya-gaya]
  ["invitation", "pernikahan", 16, ["elegan", "floral", "rustic", "minimalis", "klasik", "gelap", "pastel", "modern", "islami", "retro"]],
  ["invitation", "adat", 4, ["nusantara"]],
  ["invitation", "lamaran", 6, ["floral", "pastel", "elegan", "minimalis", "rustic", "modern"]],
  ["invitation", "ulang-tahun", 8, ["ceria", "pastel", "retro", "modern", "gelap", "elegan", "minimalis", "floral"]],
  ["invitation", "khitanan", 6, ["islami", "ceria", "klasik", "pastel", "minimalis", "rustic"]],
  ["invitation", "wisuda", 5, ["klasik", "modern", "elegan", "minimalis", "gelap"]],
  ["invitation", "syukuran", 6, ["islami", "rustic", "minimalis", "klasik", "floral", "modern"]],
  ["invitation", "acara", 6, ["modern", "gelap", "minimalis", "retro", "editorial", "ceria"]],
  ["invitation", "grand-opening", 3, ["modern", "retro", "ceria"]],
  ["portfolio", "personal", 6, ["minimalis", "pastel", "ceria", "modern", "editorial", "kreatif"]],
  ["portfolio", "fotografer", 4, ["editorial", "gelap", "minimalis", "klasik"]],
  ["portfolio", "teknologi", 5, ["gelap", "modern", "minimalis", "pastel", "editorial"]],
  ["portfolio", "penulis", 3, ["klasik", "editorial", "elegan"]],
  ["portfolio", "arsitek", 3, ["minimalis", "modern", "rustic"]],
  ["portfolio", "bisnis", 6, ["modern", "minimalis", "klasik", "elegan", "retro", "gelap"]],
  ["portfolio", "kuliner", 4, ["rustic", "retro", "ceria", "klasik"]],
  ["portfolio", "kesehatan", 3, ["minimalis", "pastel", "modern"]],
  ["portfolio", "pendidikan", 3, ["ceria", "modern", "pastel"]],
  ["portfolio", "seni", 3, ["gelap", "editorial", "kreatif"]],
];
const CATEGORY_LABEL = { pernikahan: "Pernikahan", adat: "Pernikahan Adat", lamaran: "Lamaran", "ulang-tahun": "Ulang Tahun", khitanan: "Khitanan & Aqiqah", wisuda: "Wisuda", syukuran: "Syukuran", acara: "Acara", "grand-opening": "Grand Opening", personal: "Personal & Kreatif", fotografer: "Fotografer", teknologi: "Teknologi", penulis: "Penulis", arsitek: "Arsitek & Interior", bisnis: "Bisnis & UMKM", kuliner: "Kuliner", kesehatan: "Kesehatan & Kecantikan", pendidikan: "Pendidikan", seni: "Seni & Musik" };

const out = [];
const paletteUse = {};
for (const [kind, cat, count, styles] of PLAN) {
  for (let i = 0; i < count; i++) {
    const styleKey = styles[i % styles.length];
    const st = STYLE[styleKey];
    let pal, deco2, adat;
    if (cat === "adat") {
      adat = ADAT[i];
      pal = adat.palette;
      deco2 = adat.deco2;
    } else {
      const k = `${cat}:${styleKey}`;
      const n = paletteUse[k] ?? Math.floor(i / styles.length);
      paletteUse[k] = n + 1;
      pal = st.palettes[(n + i) % st.palettes.length];
    }
    const [palName, text, accent, bg, surface] = pal;
    const fonts = st.fonts[(i + out.length) % st.fonts.length];
    const dark = isDark(bg);
    const theme = { fontHeading: fonts[0], fontBody: fonts[1], colorPrimary: text, colorAccent: accent, colorBackground: bg, colorSurface: surface, radius: st.radius, headingCase: "normal" };
    if (st.ornaments) theme.ornament = st.ornaments[i % st.ornaments.length];
    const motif = st.motifs[i % st.motifs.length];
    const id = `kol-${cat}-${String(i + 1).padStart(2, "0")}`;
    const art = writeArt(`${id}.svg`, motif, { base: dark ? bg : surface, deco: accent, deco2: deco2 ?? text }, st.grain);
    const t = { id, style: styleKey, art, tone: dark ? "gelap" : "terang", dark, theme };

    let built;
    if (cat === "adat") {
      const [a, b] = adat.couple;
      const d = nextDate(8), city = { betawi: "Jakarta", melayu: "Pekanbaru", bugis: "Makassar", sasak: "Mataram" }[adat.key];
      built = {
        title: `${a} & ${b}`,
        sections: [
          cover({ eyebrow: adat.eyebrow, title: `${a} & ${b}`, subtitle: d.text, image: art, tone: t.tone }),
          music(),
          S("testimonial", { quote: adat.quote[0], author: adat.quote[1] || adat.name, role: "" }),
          S("couple", { heading: "Mempelai", intro: "Dengan memohon rahmat Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami:", name1: a, script1: "", full1: full(a), parents1: `Putri dari ${pick(PARENT_M)}\n& ${pick(PARENT_F)}`, photo1: "/placeholder/portrait.svg", ig1: "", name2: b, script2: "", full2: full(b), parents2: `Putra dari ${pick(PARENT_M)}\n& ${pick(PARENT_F)}`, photo2: "/placeholder/hero.svg", ig2: "" }),
          S("ceremony", { heading: `Rangkaian ${adat.name.replace(/^(Pernikahan|Walimatul Urus) /, "")}`, intro: "Rangkaian adat sebagai wujud penghormatan kepada orang tua dan leluhur. Sesuaikan dengan tradisi keluarga.", zone: adat.key === "sasak" || adat.key === "bugis" ? "WITA" : "WIB", items: adat.ceremony.map(([name, description]) => ({ name, description, start: "", place: "" })) }),
          S("event", { heading: "Waktu & Tempat", zone: adat.key === "sasak" || adat.key === "bugis" ? "WITA" : "WIB", items: [event1("Akad Nikah", d, "10.00", "Masjid Raya", "Jl. Merdeka No. 1", city), { ...event1("Resepsi", d, "Selesai", pick(VENUES), "Jl. Sudirman No. 10", city), start: d.iso(11) }] }),
          countdown(d),
          S("dresscode", { heading: "Dress Code", text: adat.dress, colors: adat.colors.map(([color, label]) => ({ color, label })), image: "" }),
          gallery(), rsvp(), gift("Tanda Kasih"),
          closing(adat.closing, `Atas kehadiran dan doa restunya, kami ucapkan terima kasih.\n${a} & ${b}`, art),
        ],
      };
    } else if (kind === "invitation") {
      built = INV[cat](t, i);
    } else {
      built = portfolioSections(t, cat, i, PORT[cat][i % PORT[cat].length]);
    }

    const name = cat === "adat" ? adat.name : `${CATEGORY_LABEL[cat]} ${st.label} · ${palName}`;
    out.push({
      id,
      kind,
      name,
      category: cat,
      style: styleKey,
      description: cat === "adat" ? `Nuansa ${palName.toLowerCase()} bermotif tenun, lengkap dengan rangkaian prosesi adat.` : `Gaya ${st.label.toLowerCase()} ${st.desc}, palet ${palName}.`,
      tags: [st.label.toLowerCase(), CATEGORY_LABEL[cat].toLowerCase(), palName.toLowerCase(), ...(styleKey === "retro" ? ["retro klasik"] : [])],
      theme,
      sections: built.sections,
    });
  }
}

fs.writeFileSync(path.join(ROOT, "templates", "koleksi-100.json"), JSON.stringify(out) + "\n");
const tally = {};
for (const t of out) tally[`${t.kind}/${t.category}`] = (tally[`${t.kind}/${t.category}`] ?? 0) + 1;
console.log(`${out.length} template dibuat`);
console.log(tally);
