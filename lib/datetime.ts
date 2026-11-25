// Tanggal undangan disimpan sebagai "YYYY-MM-DDTHH:mm" (waktu lokal acara) + zona
// WIB/WITA/WIT. Diformat manual agar hasil server dan browser selalu sama.

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const OFFSET: Record<string, number> = { WIB: 7, WITA: 8, WIT: 9 };

interface Parts {
  y: number;
  m: number;
  d: number;
  h: number;
  min: number;
}

export function parseLocal(v: string | undefined): Parts | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(v ?? "");
  if (!m) return null;
  return { y: +m[1], m: +m[2], d: +m[3], h: +(m[4] ?? 0), min: +(m[5] ?? 0) };
}

/** "Sabtu, 20 Desember 2026" */
export function formatTanggal(v: string | undefined): string {
  const p = parseLocal(v);
  if (!p) return "";
  const wd = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay();
  return `${HARI[wd]}, ${p.d} ${BULAN[p.m - 1]} ${p.y}`;
}

/** "08.00" */
export function formatJam(v: string | undefined): string {
  const p = parseLocal(v);
  if (!p) return "";
  return `${String(p.h).padStart(2, "0")}.${String(p.min).padStart(2, "0")}`;
}

/** Waktu absolut (ms) dari waktu lokal acara + zona. */
export function toEpoch(v: string | undefined, zone = "WIB"): number | null {
  const p = parseLocal(v);
  if (!p) return null;
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.min) - (OFFSET[zone] ?? 7) * 3600_000;
}

/** Link "Simpan ke Google Calendar". */
export function calendarLink(title: string, start: string | undefined, zone: string, place: string): string | null {
  const t = toEpoch(start, zone);
  if (t === null) return null;
  const fmt = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const q = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${fmt(t)}/${fmt(t + 2 * 3600_000)}`, location: place });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}
