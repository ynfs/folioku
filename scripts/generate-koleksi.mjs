// Generator template Safantara: 100 koleksi (60 undangan + 40 portofolio) dan 100 proposal, beserta gambar sampulnya.
// Jalankan dari folder proyek:  node scripts/generate-koleksi.mjs
// Hasil: templates/koleksi-100.json, templates/proposal-100.json, dan public/koleksi/*.svg (deterministik).
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

// =====================================================================
// FASE 2 — 100 template PROPOSAL (10 kategori × 10 topik)
// Benih acak terpisah agar fase 1 di atas tidak berubah.
// =====================================================================
seed = 77001;

const PROP_EYEBROW = {
  penawaran: "Proposal Penawaran",
  sponsorship: "Proposal Sponsorship",
  kegiatan: "Proposal Kegiatan",
  kerjasama: "Proposal Kerja Sama",
  investasi: "Proposal Investasi",
  "pitch-deck": "Pitch Deck",
  proyek: "Proposal Proyek",
  hibah: "Proposal Permohonan Dana",
  penelitian: "Proposal Penelitian",
  organisasi: "Proposal Kegiatan",
};
const PROP_LABEL = {
  penawaran: "Penawaran", sponsorship: "Sponsorship", kegiatan: "Kegiatan", kerjasama: "Kerja Sama", investasi: "Investasi",
  "pitch-deck": "Pitch Deck", proyek: "Proyek", hibah: "Hibah & CSR", penelitian: "Penelitian", organisasi: "Organisasi",
};
const ROMAWI = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

// [judul, gaya, pengaju]
const TOPICS = {
  penawaran: [
    ["Jasa Desain & Branding", "kreatif", "Studio Kreasi Visual"], ["Pembuatan Website Company Profile", "modern", "Sinar Digital"], ["Jasa Fotografi Produk", "editorial", "Lensa Studio"],
    ["Katering Makan Siang Kantor", "rustic", "Dapur Sehat Bunda"], ["Jasa Kebersihan Gedung", "minimalis", "Bersih Sejahtera"], ["Pengelolaan Media Sosial", "pastel", "Kontenin Agency"],
    ["Jasa Konsultan Pajak", "klasik", "KKP Amanah"], ["Sewa Sound System & Panggung", "gelap", "Gema Audio"], ["Pelatihan Pelayanan Prima", "elegan", "Lembaga Pelatihan Prima"], ["Instalasi CCTV & Keamanan", "modern", "Mata Elang Security"],
  ],
  sponsorship: [
    ["Festival Musik Kampus", "retro", "BEM Universitas Nusantara"], ["Turnamen E-sport Pelajar", "gelap", "Komunitas Gamer Kota"], ["Lomba Lari 10K Kota", "modern", "Panitia Run For Health"],
    ["Pentas Seni Akhir Tahun", "ceria", "OSIS SMA Negeri 1"], ["Bazar UMKM Ramadan", "islami", "Asosiasi UMKM Kota"], ["Seminar Nasional Kewirausahaan", "elegan", "Himpunan Mahasiswa Manajemen"],
    ["Pameran Fotografi Kota", "editorial", "Klub Fotografi Lensa"], ["Festival Kuliner Nusantara", "rustic", "Panitia Festival Kuliner"], ["Konser Amal Peduli Bencana", "kreatif", "Relawan Peduli"], ["Kompetisi Robotik Pelajar", "pastel", "Ikatan Guru Teknologi"],
  ],
  kegiatan: [
    ["Bakti Sosial Ramadan", "islami", "Remaja Masjid Al-Ikhlas"], ["Pelatihan UMKM Desa", "minimalis", "Pemerintah Desa Sukamaju"], ["Lomba HUT Kemerdekaan RI", "ceria", "Karang Taruna RW 05"],
    ["Donor Darah Massal", "modern", "Komunitas Peduli Sesama"], ["Kemah Bakti Pramuka", "rustic", "Gugus Depan 01"], ["Penghijauan Kampung", "floral", "Paguyuban Warga Hijau"],
    ["Workshop Literasi Digital", "pastel", "Taman Baca Cerdas"], ["Pengajian Akbar & Santunan", "islami", "Majelis Taklim Nurul Iman"], ["Turnamen Futsal Antar RT", "retro", "Pemuda RW 03"], ["Studi Banding Desa Wisata", "klasik", "BUMDes Maju Bersama"],
  ],
  kerjasama: [
    ["Kemitraan Distribusi Produk", "modern", "PT Sumber Rasa"], ["Kerja Sama Program Magang Siswa", "minimalis", "SMK Negeri 2"], ["Media Partner Acara", "kreatif", "Radio Suara Kota"],
    ["Program Reseller & Agen", "ceria", "Keripik Mbok Sri"], ["Kolaborasi Produk Antar Brand", "pastel", "Kopi Kampung × Roti Manis"], ["Kerja Sama Layanan Kesehatan Karyawan", "klasik", "Klinik Pratama Sehat"],
    ["Kemitraan Waralaba", "elegan", "Teh Tarik Juara"], ["Program CSR Bersama", "rustic", "Forum CSR Kota"], ["Pemasok Bahan Baku", "editorial", "Koperasi Tani Makmur"], ["Kemitraan Pemasaran Digital", "gelap", "Agensi Digital Sinar"],
  ],
  investasi: [
    ["Ekspansi Kedai Kopi", "rustic", "Kopi Kampung"], ["Pembukaan Cabang Laundry", "minimalis", "Laundry Wangi"], ["Peternakan Ayam Petelur", "klasik", "Peternakan Berkah"],
    ["Pabrik Keripik Singkong", "retro", "Keripik Mbok Sri"], ["Toko Online Fashion Muslim", "elegan", "Busana Anggun"], ["Budidaya Ikan Lele Bioflok", "modern", "Lele Mandiri"],
    ["Pembangunan Rumah Kos", "editorial", "Griya Kos Nyaman"], ["Usaha Katering Sehat", "pastel", "Dapur Sehat Bunda"], ["Bengkel Motor Modern", "gelap", "Bengkel Maju Jaya"], ["Agrowisata Kebun Jeruk", "floral", "Kebun Jeruk Lestari"],
  ],
  "pitch-deck": [
    ["KasirKu — Aplikasi Kasir UMKM", "modern", "KasirKu"], ["PanenID — Marketplace Hasil Tani", "rustic", "PanenID"], ["BelajarYuk — Platform Les Online", "pastel", "BelajarYuk"],
    ["GalonGo — Antar Galon Cepat", "ceria", "GalonGo"], ["KodeKecil — Kelas Coding Anak", "kreatif", "KodeKecil"], ["KosKu — Aplikasi Manajemen Kos", "minimalis", "KosKu"],
    ["NikahMudah — Platform Wedding Organizer", "elegan", "NikahMudah"], ["CuciKilat — Laundry On-demand", "gelap", "CuciKilat"], ["BundaSehat — Aplikasi Ibu Hamil", "floral", "BundaSehat"], ["DaurUlang — Platform Bank Sampah", "editorial", "DaurUlang"],
  ],
  proyek: [
    ["Renovasi Gedung Sekolah", "klasik", "CV Bangun Karya"], ["Pembangunan Jalan Desa", "minimalis", "CV Jalan Mulus"], ["Pengadaan Komputer Lab", "modern", "PT Teknologi Nusantara"],
    ["Sistem Informasi Desa", "editorial", "Sinar Digital"], ["Pembangunan Taman Kota", "floral", "CV Hijau Lestari"], ["Instalasi Panel Surya Kantor", "gelap", "PT Surya Energi"],
    ["Pengadaan Seragam Pegawai", "elegan", "Konveksi Jaya Abadi"], ["Website Resmi Pemerintah Daerah", "minimalis", "Sinar Digital"], ["Renovasi Masjid", "islami", "CV Bangun Karya"], ["Pengadaan Alat Kesehatan Puskesmas", "pastel", "PT Medika Utama"],
  ],
  hibah: [
    ["Beasiswa Anak Nelayan", "floral", "Yayasan Pesisir Cerdas"], ["Air Bersih untuk Desa", "minimalis", "Komunitas Air Untuk Semua"], ["Perpustakaan Keliling", "ceria", "Taman Baca Cerdas"],
    ["Rumah Baca Anak", "pastel", "Rumah Baca Pelangi"], ["Pelatihan Menjahit Ibu Rumah Tangga", "rustic", "PKK Kelurahan Mekar"], ["Bank Sampah Kampung", "modern", "Paguyuban Warga Hijau"],
    ["Renovasi Panti Asuhan", "islami", "Panti Asuhan Kasih Ibu"], ["Klinik Kesehatan Gratis", "klasik", "Relawan Medis Peduli"], ["Sekolah Alam Desa", "rustic", "Yayasan Sekolah Alam"], ["Pemberdayaan Petani Muda", "editorial", "Gerakan Petani Muda"],
  ],
  penelitian: [
    ["Pengaruh Media Sosial terhadap Minat Beli Remaja", "klasik", "Mahasiswa Manajemen"], ["Analisis Kualitas Air Sungai Kota", "minimalis", "Mahasiswa Teknik Lingkungan"], ["Efektivitas Pembelajaran Daring di SD", "pastel", "Mahasiswa Pendidikan"],
    ["Sistem Pakar Diagnosa Penyakit Tanaman", "modern", "Mahasiswa Informatika"], ["Pengembangan Pupuk Organik Cair", "rustic", "Mahasiswa Agroteknologi"], ["Studi Kelayakan Usaha Kedai Kopi", "editorial", "Mahasiswa Ekonomi"],
    ["Perilaku Konsumen Produk Halal", "islami", "Mahasiswa Ekonomi Syariah"], ["Literasi Keuangan Mahasiswa", "elegan", "Mahasiswa Akuntansi"], ["Rancang Bangun Aplikasi Absensi", "gelap", "Mahasiswa Sistem Informasi"], ["Pemetaan Potensi Wisata Desa", "floral", "Mahasiswa Geografi"],
  ],
  organisasi: [
    ["Pentas Seni OSIS", "ceria", "OSIS SMP Negeri 3"], ["Peringatan HUT RI Karang Taruna", "retro", "Karang Taruna Bina Remaja"], ["Seminar Kepemudaan BEM", "modern", "BEM Fakultas Ekonomi"],
    ["Jambore Pramuka Daerah", "rustic", "Kwartir Cabang"], ["Kegiatan Ramadan Remaja Masjid", "islami", "Remaja Masjid Al-Ikhlas"], ["Reuni Akbar Ikatan Alumni", "elegan", "Ikatan Alumni SMA 1"],
    ["Aksi Bersih Gunung", "minimalis", "Komunitas Pecinta Alam"], ["Lomba Masak PKK", "floral", "PKK Kelurahan Mekar"], ["Pelatihan Ronda & Keamanan Warga", "klasik", "Paguyuban Warga RW 07"], ["Sekolah Sepak Bola Anak", "pastel", "SSB Garuda Muda"],
  ],
};

const rp = (n) => String(Math.round(n / 50000) * 50000);
const pt = (title, detail) => ({ title, detail });
const contactP = (issuer) => S("contact", { heading: "Kontak", text: `Untuk pertanyaan dan diskusi lebih lanjut, silakan hubungi ${issuer}.`, email: "halo@email.com", phone: "0812-0000-0000", links: [] });
const approvalP = (issuer, city, dateText, signerRole = "Ketua / Direktur", text) =>
  S("approval", {
    heading: "Persetujuan",
    text: text ?? "Jika proposal ini sesuai, silakan berikan persetujuan atau catatan Anda. Kami akan segera menindaklanjuti.",
    signer: `Perwakilan ${issuer}`,
    signerRole,
    place: `${city}, ${dateText.split(", ")[1]}`,
  });

function proposalRecipe(cat, i, [title, , issuer], t, d, city) {
  const k = 1 + (i % 5) * 0.35; // variasi skala anggaran
  const team3 = (roles) => S("team", { heading: "Tim", items: roles.map((role, n) => ({ name: `Nama ${role}`, role, photo: n % 2 ? "/placeholder/hero.svg" : "/placeholder/portrait.svg" })) });
  switch (cat) {
    case "penawaran":
      return [
        S("about", { heading: "Ringkasan", body: `${issuer} dengan senang hati mengajukan penawaran ${title.toLowerCase()}. Proposal ini menjelaskan ruang lingkup pekerjaan, pilihan paket, jadwal, serta syarat dan ketentuan.`, image: "" }),
        S("points", { heading: "Ruang Lingkup", intro: "", layout: "grid", items: [pt("Analisis kebutuhan", "Diskusi awal untuk memahami tujuan dan target."), pt("Pelaksanaan", `Pengerjaan ${title.toLowerCase()} sesuai standar kualitas kami.`), pt("Revisi", "Penyesuaian hasil sesuai masukan klien."), pt("Serah terima", "Laporan dan dokumentasi hasil pekerjaan.")] }),
        S("pricing", { heading: "Pilihan Paket", intro: "Pilih paket yang paling sesuai dengan kebutuhan Anda.", items: [
          { name: "Hemat", price: rp(2500000 * k), period: "", features: "Layanan inti\nKonsultasi 1x\nRevisi 1x", highlight: "" },
          { name: "Bisnis", price: rp(5500000 * k), period: "", features: "Semua di paket Hemat\nKonsultasi 3x\nRevisi 3x\nLaporan bulanan", highlight: "ya" },
          { name: "Premium", price: rp(9500000 * k), period: "", features: "Semua di paket Bisnis\nPrioritas pengerjaan\nRevisi tanpa batas\nPendampingan 3 bulan", highlight: "" } ] }),
        S("timeline", { heading: "Jadwal Pelaksanaan", items: [{ phase: "Kick-off", period: "Minggu 1", detail: "Rapat awal dan pengumpulan bahan." }, { phase: "Pengerjaan", period: "Minggu 2–3", detail: "Pelaksanaan pekerjaan utama." }, { phase: "Revisi & serah terima", period: "Minggu 4", detail: "Penyempurnaan dan penyerahan hasil." }] }),
        ...(i % 2 ? [team3(["Manajer proyek", "Tenaga ahli", "Admin"])] : []),
        S("points", { heading: "Syarat & Ketentuan", intro: "", layout: "list", items: [pt("Uang muka 50%", "Dibayarkan saat penandatanganan kesepakatan."), pt("Pelunasan", "Dilakukan saat serah terima hasil pekerjaan."), pt("Masa berlaku", "Penawaran berlaku 30 hari sejak tanggal proposal.")] }),
        approvalP(issuer, city, d.text, "Direktur"),
        contactP(issuer),
      ];
    case "sponsorship":
      return [
        S("about", { heading: "Tentang Acara", body: `${title} adalah acara tahunan yang diselenggarakan oleh ${issuer} di ${city}, dengan target lebih dari ${(i + 2) * 500} pengunjung. Kami mengundang mitra sponsor untuk tumbuh bersama audiens kami.`, image: IMG(4) }),
        S("points", { heading: "Mengapa Menjadi Sponsor?", intro: "", layout: "grid", items: [pt("Paparan merek", "Logo tampil di panggung, banner, dan media sosial."), pt("Audiens tepat sasaran", "Peserta muda dan aktif di media sosial."), pt("Aktivasi langsung", "Booth untuk sampling dan penjualan produk."), pt("Liputan media", "Publikasi bersama media partner.")] }),
        S("pricing", { heading: "Paket Sponsor", intro: "", items: [
          { name: "Platinum", price: rp(25000000 * k), period: "", features: "Logo utama di semua materi\nBooth 3×3 m\nSesi presentasi 10 menit\nPenyebutan oleh MC", highlight: "ya" },
          { name: "Gold", price: rp(12000000 * k), period: "", features: "Logo besar di banner\nBooth 2×2 m\nPenyebutan oleh MC", highlight: "" },
          { name: "Silver", price: rp(5000000 * k), period: "", features: "Logo di banner & media sosial\nPembagian brosur", highlight: "" } ] }),
        S("timeline", { heading: "Rangkaian Acara", items: [{ phase: "Publikasi", period: "H-30", detail: "Kampanye media sosial dan poster." }, { phase: "Hari pelaksanaan", period: d.text, detail: `Acara utama di ${pick(VENUES)}, ${city}.` }, { phase: "Laporan sponsor", period: "H+7", detail: "Dokumentasi dan laporan paparan merek." }] }),
        S("budget", { heading: "Rencana Anggaran", intro: "", items: [{ item: "Sewa tempat", qty: "1", unit: "hari", price: rp(8000000 * k) }, { item: "Panggung & sound system", qty: "1", unit: "paket", price: rp(12000000 * k) }, { item: "Publikasi & desain", qty: "1", unit: "paket", price: rp(3000000 * k) }, { item: "Konsumsi panitia", qty: "50", unit: "orang", price: "35000" }], tax: 0, note: "" }),
        approvalP(issuer, city, d.text, "Ketua Panitia", "Kami menantikan dukungan Anda. Silakan pilih paket atau sampaikan catatan di bawah ini."),
        contactP(issuer),
      ];
    case "kegiatan":
    case "organisasi":
      return [
        S("about", { heading: "Latar Belakang", body: `Kegiatan ${title.toLowerCase()} digagas oleh ${issuer} sebagai wujud kepedulian dan kebersamaan. Kegiatan ini diharapkan memberi manfaat nyata bagi masyarakat sekitar.`, image: "" }),
        S("points", { heading: "Tujuan Kegiatan", intro: "", layout: "grid", items: [pt("Mempererat silaturahmi", "Menguatkan kebersamaan antarwarga dan anggota."), pt("Memberi manfaat", "Membantu kebutuhan masyarakat sasaran."), pt("Mengembangkan potensi", "Melatih kepemimpinan dan kerja sama tim.")] }),
        S("timeline", { heading: "Susunan Acara", items: [{ phase: "Pembukaan", period: "08.00–09.00", detail: "Sambutan ketua panitia dan tamu undangan." }, { phase: "Acara inti", period: "09.00–12.00", detail: `Pelaksanaan ${title.toLowerCase()}.` }, { phase: "Penutupan", period: "12.00–13.00", detail: "Doa bersama, dokumentasi, dan ramah tamah." }] }),
        team3(["Ketua Panitia", "Sekretaris", "Bendahara", "Koordinator Acara"]),
        S("budget", { heading: "Rencana Anggaran Biaya", intro: "", items: [{ item: "Konsumsi peserta", qty: String(60 + i * 10), unit: "orang", price: "25000" }, { item: "Perlengkapan & dekorasi", qty: "1", unit: "paket", price: rp(1500000 * k) }, { item: "Dokumentasi", qty: "1", unit: "paket", price: rp(750000 * k) }, { item: "Hadiah / bingkisan", qty: "20", unit: "buah", price: "50000" }], tax: 0, note: "Laporan pertanggungjawaban akan disampaikan setelah kegiatan." }),
        ...(cat === "organisasi" ? [S("pricing", { heading: "Bentuk Dukungan", intro: "Kami menerima dukungan dalam bentuk berikut:", items: [{ name: "Donatur Utama", price: rp(5000000), period: "", features: "Nama/logo di spanduk utama\nUcapan terima kasih di acara", highlight: "ya" }, { name: "Donatur", price: rp(1000000), period: "", features: "Nama di spanduk\nSertifikat penghargaan", highlight: "" }, { name: "Dukungan Barang", price: "", period: "sesuai kesepakatan", features: "Konsumsi, hadiah, atau perlengkapan", highlight: "" }] })] : []),
        approvalP(issuer, city, d.text, "Ketua Panitia", "Demikian proposal ini kami sampaikan. Atas perhatian dan dukungannya kami ucapkan terima kasih."),
        contactP(issuer),
      ];
    case "kerjasama":
      return [
        S("about", { heading: "Ringkasan", body: `${issuer} mengajukan ${title.toLowerCase()} yang saling menguntungkan. Proposal ini menjelaskan bentuk kerja sama, manfaat bagi kedua pihak, dan ketentuan pelaksanaannya.`, image: "" }),
        S("points", { heading: "Bentuk Kerja Sama", intro: "", layout: "list", items: [pt("Penyediaan", "Pihak pertama menyediakan produk/layanan sesuai kesepakatan."), pt("Promosi bersama", "Kedua pihak saling mempromosikan di kanal masing-masing."), pt("Evaluasi berkala", "Rapat evaluasi setiap tiga bulan.")] }),
        S("points", { heading: "Manfaat bagi Kedua Pihak", intro: "", layout: "grid", items: [pt("Pihak Pertama", "Perluasan pasar dan peningkatan penjualan."), pt("Pihak Kedua", "Akses produk/layanan dengan harga khusus."), pt("Bersama", "Penguatan citra dan jaringan usaha.")] }),
        S("pricing", { heading: "Skema Kemitraan", intro: "", items: [{ name: "Mitra Reguler", price: rp(3000000 * k), period: "/tahun", features: "Harga mitra\nMateri promosi", highlight: "" }, { name: "Mitra Utama", price: rp(10000000 * k), period: "/tahun", features: "Harga mitra terbaik\nPrioritas stok\nPelatihan tim", highlight: "ya" }] }),
        S("timeline", { heading: "Tahapan", items: [{ phase: "Penjajakan", period: "Bulan 1", detail: "Diskusi dan penyusunan nota kesepahaman." }, { phase: "Uji coba", period: "Bulan 2–3", detail: "Pelaksanaan awal dengan skala terbatas." }, { phase: "Kerja sama penuh", period: "Bulan 4 dst.", detail: "Pelaksanaan penuh dan evaluasi berkala." }] }),
        S("points", { heading: "Ketentuan", intro: "", layout: "list", items: [pt("Jangka waktu", "Kerja sama berlaku 1 tahun dan dapat diperpanjang."), pt("Pembayaran", "Sesuai termin yang disepakati bersama."), pt("Pengakhiran", "Pemberitahuan tertulis 30 hari sebelumnya.")] }),
        approvalP(issuer, city, d.text, "Direktur"),
        contactP(issuer),
      ];
    case "investasi":
    case "pitch-deck": {
      const pitch = cat === "pitch-deck";
      const nama = title.split(" — ")[0];
      return [
        ...(pitch ? [poster(nama, title.split(" — ")[1] ?? "", "Solusi sederhana untuk masalah sehari-hari jutaan orang", t.dark)] : []),
        S("about", { heading: "Ringkasan Eksekutif", body: `${pitch ? nama : issuer} ${pitch ? "membangun" : "mengembangkan"} ${pitch ? (title.split(" — ")[1] ?? "").toLowerCase() : title.toLowerCase()} dengan pertumbuhan yang konsisten. Kami membuka peluang ${pitch ? "investasi tahap awal" : "investasi"} untuk mempercepat pertumbuhan.`, image: IMG(5) }),
        S("points", { heading: pitch ? "Masalah" : "Peluang Pasar", intro: "", layout: "grid", items: pitch ? [pt("Proses masih manual", "Pelaku usaha mencatat dengan kertas dan rawan salah."), pt("Akses terbatas", "Solusi yang ada mahal dan rumit."), pt("Data tidak terpakai", "Keputusan diambil tanpa data.")] : [pt("Permintaan tinggi", `Kebutuhan pasar di ${city} terus meningkat.`), pt("Pesaing sedikit", "Belum banyak pemain dengan kualitas serupa."), pt("Pelanggan setia", "Tingkat pembelian ulang yang tinggi.")] }),
        S("points", { heading: pitch ? "Solusi Kami" : "Keunggulan", intro: "", layout: "grid", items: [pt("Mudah digunakan", "Bisa dipakai siapa saja tanpa pelatihan rumit."), pt("Terjangkau", "Harga sesuai kemampuan usaha kecil."), pt("Teruji", `Sudah dipakai oleh ${(i + 1) * 120}+ pelanggan.`)] }),
        ...(pitch ? [S("pricing", { heading: "Model Bisnis", intro: "", items: [{ name: "Gratis", price: "0", period: "", features: "Fitur dasar\nUntuk mencoba", highlight: "" }, { name: "Pro", price: "49000", period: "/bulan", features: "Semua fitur\nLaporan lengkap\nDukungan prioritas", highlight: "ya" }, { name: "Bisnis", price: "149000", period: "/bulan", features: "Multi cabang\nIntegrasi\nAkun tim", highlight: "" }] })] : []),
        S("timeline", { heading: pitch ? "Peta Jalan" : "Rencana Pengembangan", items: [{ phase: "Tahap 1", period: "Kuartal 1", detail: pitch ? "Peluncuran fitur utama dan 1.000 pengguna." : "Persiapan tempat dan perizinan." }, { phase: "Tahap 2", period: "Kuartal 2–3", detail: pitch ? "Ekspansi ke 5 kota dan kemitraan." : "Operasional dan pemasaran." }, { phase: "Tahap 3", period: "Kuartal 4", detail: pitch ? "Fitur premium dan profitabilitas." : "Balik modal dan ekspansi berikutnya." }] }),
        S("budget", { heading: pitch ? "Penggunaan Dana" : "Kebutuhan Modal", intro: "", items: pitch ? [{ item: "Pengembangan produk", qty: "1", unit: "tahun", price: rp(300000000 * k) }, { item: "Pemasaran & akuisisi pengguna", qty: "1", unit: "tahun", price: rp(200000000 * k) }, { item: "Operasional", qty: "1", unit: "tahun", price: rp(100000000 * k) }] : [{ item: "Tempat & renovasi", qty: "1", unit: "paket", price: rp(60000000 * k) }, { item: "Peralatan produksi", qty: "1", unit: "paket", price: rp(45000000 * k) }, { item: "Modal kerja 3 bulan", qty: "3", unit: "bulan", price: rp(10000000 * k) }], tax: 0, note: pitch ? "Pendanaan tahap awal; rincian valuasi dibahas pada pertemuan lanjutan." : "Skema bagi hasil dibahas bersama calon investor." }),
        team3(pitch ? ["CEO", "CTO", "Kepala Pemasaran"] : ["Pemilik", "Manajer Operasional", "Keuangan"]),
        approvalP(pitch ? nama : issuer, city, d.text, pitch ? "CEO & Pendiri" : "Pemilik", "Tertarik berinvestasi atau ingin berdiskusi? Sampaikan minat Anda di bawah ini."),
        contactP(pitch ? nama : issuer),
      ];
    }
    case "proyek":
      return [
        S("about", { heading: "Gambaran Proyek", body: `${issuer} mengajukan proposal ${title.toLowerCase()} lengkap dengan ruang lingkup, jadwal, rencana anggaran biaya (RAB), dan tenaga ahli yang terlibat.`, image: IMG(6) }),
        S("points", { heading: "Ruang Lingkup Pekerjaan", intro: "", layout: "list", items: [pt("Survei & perencanaan", "Pengukuran lokasi dan penyusunan gambar kerja."), pt("Pelaksanaan", "Pekerjaan utama sesuai spesifikasi teknis."), pt("Pengawasan mutu", "Pemeriksaan berkala oleh tenaga ahli."), pt("Serah terima", "Berita acara dan masa pemeliharaan.")] }),
        S("timeline", { heading: "Jadwal Pelaksanaan", items: [{ phase: "Persiapan", period: "Minggu 1–2", detail: "Mobilisasi tim dan material." }, { phase: "Pelaksanaan", period: "Minggu 3–10", detail: "Pekerjaan utama." }, { phase: "Finishing", period: "Minggu 11–12", detail: "Penyelesaian dan pembersihan." }, { phase: "Serah terima", period: "Minggu 13", detail: "Serah terima pertama." }] }),
        S("budget", { heading: "Rencana Anggaran Biaya (RAB)", intro: "", items: [{ item: "Pekerjaan persiapan", qty: "1", unit: "ls", price: rp(15000000 * k) }, { item: "Pekerjaan utama", qty: "1", unit: "ls", price: rp(120000000 * k) }, { item: "Material pendukung", qty: "1", unit: "ls", price: rp(35000000 * k) }, { item: "Tenaga kerja", qty: "90", unit: "HOK", price: "150000" }], tax: 11, note: "Harga sudah termasuk biaya pengiriman dan pemasangan." }),
        team3(["Manajer Proyek", "Ahli Teknik", "Pengawas Lapangan"]),
        S("points", { heading: "Ketentuan", intro: "", layout: "list", items: [pt("Termin pembayaran", "30% uang muka, 40% progres 50%, 30% serah terima."), pt("Masa pemeliharaan", "90 hari setelah serah terima pertama."), pt("Garansi", "Perbaikan tanpa biaya untuk cacat pekerjaan.")] }),
        approvalP(issuer, city, d.text, "Direktur"),
        contactP(issuer),
      ];
    case "hibah":
      return [
        S("about", { heading: "Latar Belakang", body: `${issuer} menginisiasi program ${title.toLowerCase()} untuk menjawab kebutuhan masyarakat di ${city}. Kami memohon dukungan dana dari mitra CSR dan donatur untuk mewujudkan program ini.`, image: IMG(3) }),
        S("points", { heading: "Tujuan Program", intro: "", layout: "grid", items: [pt("Akses yang setara", "Membuka akses layanan bagi masyarakat yang membutuhkan."), pt("Berkelanjutan", "Program dikelola bersama warga agar terus berjalan."), pt("Terukur", "Dampak dilaporkan secara berkala dan transparan.")] }),
        S("points", { heading: "Penerima Manfaat", intro: "", layout: "list", items: [pt(`${(i + 2) * 50} penerima manfaat langsung`, "Warga dan keluarga di wilayah sasaran."), pt("Relawan lokal", "Pemuda setempat sebagai pengelola program."), pt("Mitra pendukung", "Nama dan logo mitra tercantum di laporan program.")] }),
        S("timeline", { heading: "Rencana Pelaksanaan", items: [{ phase: "Persiapan", period: "Bulan 1", detail: "Pendataan penerima dan pengadaan." }, { phase: "Pelaksanaan", period: "Bulan 2–5", detail: "Program berjalan bersama relawan." }, { phase: "Evaluasi & laporan", period: "Bulan 6", detail: "Laporan dampak dan keuangan untuk donatur." }] }),
        S("budget", { heading: "Kebutuhan Dana", intro: "", items: [{ item: "Pengadaan sarana", qty: "1", unit: "paket", price: rp(25000000 * k) }, { item: "Operasional program", qty: "6", unit: "bulan", price: rp(2500000 * k) }, { item: "Pelatihan relawan", qty: "2", unit: "kali", price: rp(3000000) }, { item: "Monitoring & laporan", qty: "1", unit: "paket", price: rp(2000000) }], tax: 0, note: "Laporan penggunaan dana disampaikan secara terbuka kepada donatur." }),
        team3(["Ketua Yayasan", "Koordinator Program", "Bendahara"]),
        approvalP(issuer, city, d.text, "Ketua", "Bersediakah Anda mendukung program ini? Sampaikan keputusan atau pertanyaan Anda di bawah ini."),
        contactP(issuer),
      ];
    case "penelitian":
      return [
        S("about", { heading: "Latar Belakang", body: `Penelitian berjudul "${title}" disusun oleh ${issuer.toLowerCase()} sebagai syarat penyelesaian studi. Topik ini dipilih karena relevan dengan kondisi di ${city} dan belum banyak diteliti.`, image: "" }),
        S("points", { heading: "Rumusan Masalah", intro: "", layout: "list", items: [pt("Bagaimana kondisi saat ini?", "Gambaran umum objek penelitian."), pt("Faktor apa yang berpengaruh?", "Identifikasi variabel utama."), pt("Apa rekomendasi yang dapat diberikan?", "Saran berbasis hasil penelitian.")] }),
        S("points", { heading: "Tujuan & Manfaat", intro: "", layout: "grid", items: [pt("Tujuan", "Menjawab rumusan masalah secara ilmiah."), pt("Manfaat teoretis", "Menambah referensi bagi penelitian sejenis."), pt("Manfaat praktis", "Masukan bagi pelaku dan pengambil kebijakan.")] }),
        S("points", { heading: "Metodologi", intro: "", layout: "list", items: [pt("Pendekatan", i % 2 ? "Kuantitatif dengan kuesioner." : "Kualitatif dengan wawancara mendalam."), pt("Sampel", `${(i + 3) * 20} responden dengan teknik purposive sampling.`), pt("Analisis data", i % 2 ? "Regresi linier berganda." : "Analisis tematik.")] }),
        S("timeline", { heading: "Jadwal Penelitian", items: [{ phase: "Studi pustaka", period: "Bulan 1", detail: "Kajian teori dan penelitian terdahulu." }, { phase: "Pengumpulan data", period: "Bulan 2–3", detail: "Penyebaran instrumen dan wawancara." }, { phase: "Analisis & penulisan", period: "Bulan 4–5", detail: "Pengolahan data dan penyusunan laporan." }, { phase: "Sidang", period: "Bulan 6", detail: "Seminar hasil dan ujian." }] }),
        S("budget", { heading: "Anggaran Penelitian", intro: "", items: [{ item: "Pencetakan kuesioner", qty: String((i + 3) * 20), unit: "eksemplar", price: "5000" }, { item: "Transportasi lapangan", qty: "10", unit: "hari", price: "75000" }, { item: "Uji laboratorium / perangkat lunak", qty: "1", unit: "paket", price: rp(1500000) }, { item: "Penjilidan laporan", qty: "5", unit: "eksemplar", price: "60000" }], tax: 0, note: "" }),
        S("team", { heading: "Peneliti & Pembimbing", items: [{ name: "Nama Mahasiswa", role: "Peneliti", photo: "/placeholder/portrait.svg" }, { name: "Nama Dosen, M.Sc.", role: "Pembimbing I", photo: "/placeholder/hero.svg" }, { name: "Nama Dosen, M.M.", role: "Pembimbing II", photo: "/placeholder/portrait.svg" }] }),
        approvalP("Mahasiswa", city, d.text, "Peneliti", "Lembar pengesahan: dosen pembimbing dapat memberikan persetujuan atau catatan revisi di bawah ini."),
        contactP("peneliti"),
      ];
  }
  throw new Error(`kategori tidak dikenal: ${cat}`);
}

const outP = [];
for (const [cat, topics] of Object.entries(TOPICS)) {
  topics.forEach((topic, i) => {
    const [title, styleKey, issuer] = topic;
    const st = STYLE[styleKey];
    const pal = st.palettes[(i + cat.length) % st.palettes.length];
    const [palName, text, accent, bg, surface] = pal;
    const fonts = st.fonts[(i + outP.length) % st.fonts.length];
    const dark = isDark(bg);
    const theme = { fontHeading: fonts[0], fontBody: fonts[1], colorPrimary: text, colorAccent: accent, colorBackground: bg, colorSurface: surface, radius: st.radius, headingCase: "normal" };
    if (st.ornaments) theme.ornament = st.ornaments[i % st.ornaments.length];
    const motif = st.motifs[(i + 1) % st.motifs.length];
    const id = `prop-${cat}-${String(i + 1).padStart(2, "0")}`;
    const art = writeArt(`${id}.svg`, motif, { base: dark ? bg : surface, deco: accent, deco2: text }, st.grain);
    const t = { id, style: styleKey, art, tone: dark ? "gelap" : "terang", dark, theme };
    const d = nextDate(9);
    const city = pick(CITIES);
    const no = `No. ${String(10 + i * 7).padStart(3, "0")}/${PROP_LABEL[cat].replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase()}/${ROMAWI[(dateIdx - 1) % 12]}/2027`;
    const sections = [
      cover({ eyebrow: PROP_EYEBROW[cat], title, subtitle: `${issuer} · ${no}`, greeting: cat === "penelitian" ? "Diajukan kepada" : "Disiapkan untuk", guestFallback: cat === "penelitian" ? "Bapak/Ibu Dosen Pembimbing" : "Bapak/Ibu Pimpinan", image: art, tone: t.tone, buttonText: "Baca Proposal" }),
      ...proposalRecipe(cat, i, topic, t, d, city),
    ];
    outP.push({
      id,
      kind: "proposal",
      name: `${PROP_LABEL[cat]} · ${title}`,
      category: cat,
      style: styleKey,
      description: `Proposal ${PROP_LABEL[cat].toLowerCase()} bergaya ${st.label.toLowerCase()} (${palName}) — ${title.toLowerCase()}.`,
      tags: [st.label.toLowerCase(), PROP_LABEL[cat].toLowerCase(), "proposal", palName.toLowerCase()],
      theme,
      sections,
    });
  });
}
fs.writeFileSync(path.join(ROOT, "templates", "proposal-100.json"), JSON.stringify(outP) + "\n");
console.log(`${outP.length} template proposal dibuat`);
