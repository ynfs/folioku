// Pengubah tulisan Latin → Aksara Jawa (Hanacaraka, blok Unicode U+A980–U+A9DF).
// Aturan sederhana yang umum dipakai:
//  - suku kata konsonan + vokal: a (tanpa tanda), i = wulu, u = suku,
//    e = pepet (ê), é/è = taling, o = taling-tarung
//  - konsonan mati di akhir: r = layar, ng = cecak, h = wignyan, lainnya = pangkon
//  - gugus di tengah kata: Cr = cakra, Cy = pengkal, lainnya = pasangan (C + pangkon + C)
//  - vokal di awal suku kata memakai ha (ꦲ)
// Hasil tetap perlu dicek untuk nama/ejaan khusus (mis. murda, aksara rekan).

const CONS: Record<string, string> = {
  ng: "ꦔ",
  ny: "ꦚ",
  dh: "ꦝ",
  th: "ꦛ",
  kh: "ꦏ꦳",
  sy: "ꦯ",
  h: "ꦲ",
  n: "ꦤ",
  c: "ꦕ",
  r: "ꦫ",
  k: "ꦏ",
  d: "ꦢ",
  t: "ꦠ",
  s: "ꦱ",
  w: "ꦮ",
  l: "ꦭ",
  p: "ꦥ",
  j: "ꦗ",
  y: "ꦪ",
  m: "ꦩ",
  g: "ꦒ",
  b: "ꦧ",
  f: "ꦥ꦳",
  v: "ꦮ꦳",
  z: "ꦗ꦳",
  q: "ꦏ",
  x: "ꦏ꧀ꦱ",
};

const VOWEL_SIGN: Record<string, string> = { a: "", i: "ꦶ", u: "ꦸ", e: "ꦼ", é: "ꦺ", è: "ꦺ", ê: "ꦼ", o: "ꦺꦴ" };
const PANGKON = "꧀";
const CAKRA = "ꦿ";
const PENGKAL = "ꦾ";
const FINAL: Record<string, string> = { r: "ꦂ", ng: "ꦁ", h: "ꦃ" };
const DIGITS = "꧐꧑꧒꧓꧔꧕꧖꧗꧘꧙";

const CONS_KEYS = Object.keys(CONS).sort((a, b) => b.length - a.length);
const isVowel = (ch: string | undefined) => !!ch && ch in VOWEL_SIGN;

function readCons(s: string, i: number): string | null {
  for (const k of CONS_KEYS) if (s.startsWith(k, i)) return k;
  return null;
}

function word(w: string): string {
  let out = "";
  let i = 0;
  while (i < w.length) {
    const c = readCons(w, i);
    if (c) {
      const next = i + c.length;
      // Cakra (Cr + vokal) dan pengkal (Cy + vokal)
      if ((w[next] === "r" || w[next] === "y") && isVowel(w[next + 1]) && c !== "r" && c !== "y") {
        out += CONS[c] + (w[next] === "r" ? CAKRA : PENGKAL) + VOWEL_SIGN[w[next + 1]];
        i = next + 2;
        continue;
      }
      if (isVowel(w[next])) {
        out += CONS[c] + VOWEL_SIGN[w[next]];
        i = next + 1;
        continue;
      }
      // Konsonan mati: r/ng/h memakai sandhangan panyigeg (layar/cecak/wignyan);
      // lainnya memakai pangkon — bila diikuti konsonan, font merendernya sebagai pasangan.
      out += FINAL[c] ?? CONS[c] + PANGKON;
      i = next;
      continue;
    }
    const ch = w[i];
    if (isVowel(ch)) {
      // Vokal tanpa konsonan di depannya ditulis dengan ha
      out += "ꦲ" + VOWEL_SIGN[ch];
      i += 1;
      continue;
    }
    if (/[0-9]/.test(ch)) {
      out += DIGITS[Number(ch)];
      i += 1;
      continue;
    }
    out += ch === "," ? "꧈" : ch === "." ? "꧉" : ch;
    i += 1;
  }
  return out;
}

/** Mengubah teks Latin menjadi Aksara Jawa. Spasi antarkata dipertahankan agar mudah dibaca. */
export function latinToJawa(text: string): string {
  return text
    .toLowerCase()
    .split(/(\s+)/)
    .map((part) => (/^\s+$/.test(part) ? part : word(part)))
    .join("");
}

/** true jika teks memuat Aksara Jawa. */
export const hasAksara = (text: string) => /[ꦀ-꧟]/.test(text);

/** Font Google untuk Aksara Jawa. */
export const AKSARA_FONT = "Noto Sans Javanese";
