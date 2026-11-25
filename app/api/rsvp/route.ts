import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import type { Attendance } from "@/lib/types";

// RSVP & ucapan tamu undangan.
//  POST /api/rsvp           { slug, name, attendance, guests, message, website }
//  GET  /api/rsvp?slug=...  → { wishes }

const ATTENDANCE: Attendance[] = ["hadir", "tidak", "ragu"];

// Batas sederhana per IP agar formulir tidak dibanjiri (per proses server).
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max: number) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });

  // Kolom jebakan: manusia tidak mengisinya, bot biasanya mengisi.
  if (clean(body.website, 100)) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "lokal";
  if (limited(ip)) return NextResponse.json({ error: "Terlalu banyak kiriman. Coba lagi nanti." }, { status: 429 });

  const slug = clean(body.slug, 60);
  const name = clean(body.name, 60);
  const attendance = ATTENDANCE.includes(body.attendance as Attendance) ? (body.attendance as Attendance) : null;
  const guests = Math.min(10, Math.max(1, Math.round(Number(body.guests) || 1)));
  const message = clean(body.message, 500);

  if (!slug || !name) return NextResponse.json({ error: "Nama wajib diisi." }, { status: 400 });
  if (!attendance) return NextResponse.json({ error: "Pilih status kehadiran." }, { status: 400 });

  const rsvp = await backend.addRsvp(slug, { name, attendance, guests, message });
  if (!rsvp) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });

  const { id, createdAt } = rsvp;
  return NextResponse.json({ wish: { id, name, attendance, message, createdAt } });
}

export async function GET(request: Request) {
  const slug = clean(new URL(request.url).searchParams.get("slug"), 60);
  if (!slug) return NextResponse.json({ wishes: [] });
  const wishes = await backend.listWishes(slug);
  return NextResponse.json({ wishes }, { headers: { "Cache-Control": "no-store" } });
}
