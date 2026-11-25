"use client";

import { useState, useSyncExternalStore } from "react";
import type { Rsvp } from "@/lib/types";

// Alat pemilik undangan: pembuat link per tamu dan tabel RSVP.

const ATTEND: Record<Rsvp["attendance"], string> = { hadir: "Hadir", tidak: "Tidak hadir", ragu: "Masih ragu" };

export function GuestLinks({ slug, title }: { slug: string; title: string }) {
  const [names, setNames] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const origin = useSyncExternalStore(
    () => () => undefined,
    () => window.location.origin,
    () => "",
  );
  const base = `${origin}/p/${slug}`;

  const guests = [...new Set(names.split("\n").map((n) => n.trim()).filter(Boolean))].slice(0, 300);
  const linkFor = (name: string) => `${base}?to=${encodeURIComponent(name)}`;
  const message = (name: string) =>
    `Kepada Yth. ${name},\n\nTanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di acara kami:\n${title}\n\nInfo lengkap undangan:\n${linkFor(name)}\n\nMerupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir. Terima kasih.`;

  function copy(text: string, key: string) {
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(key);
        setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
      },
      () => undefined,
    );
  }

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-2">
      <div>
        <label className="label" htmlFor="guest-names">
          Nama tamu (satu nama per baris)
        </label>
        <textarea
          id="guest-names"
          className="input min-h-48"
          placeholder={"Bapak Budi & Keluarga\nIbu Sari\nTeman-teman Kantor"}
          value={names}
          onChange={(e) => setNames(e.target.value)}
        />
        <p className="mt-2 text-xs text-app-muted">
          Link umum (tanpa nama):{" "}
          <a href={base} target="_blank" className="font-semibold text-brand underline">
            {base}
          </a>
        </p>
      </div>
      <div>
        <p className="label">Link per tamu ({guests.length})</p>
        {guests.length === 0 ? (
          <p className="rounded-lg border border-dashed border-app-line p-6 text-center text-sm text-app-muted">
            Ketik nama tamu di kiri, link undangan bernama otomatis muncul di sini.
          </p>
        ) : (
          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {guests.map((g) => (
              <li key={g} className="rounded-lg border border-app-line p-2.5">
                <p className="truncate text-sm font-semibold">{g}</p>
                <p className="truncate text-xs text-app-muted">{linkFor(g)}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => copy(linkFor(g), `l:${g}`)}>
                    {copied === `l:${g}` ? "Tersalin ✓" : "Salin link"}
                  </button>
                  <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => copy(message(g), `m:${g}`)}>
                    {copied === `m:${g}` ? "Tersalin ✓" : "Salin pesan"}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(message(g))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn px-2 py-1 text-xs text-white"
                    style={{ background: "#25D366" }}
                  >
                    Kirim WhatsApp
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const dateFmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });

export function RsvpTable({ rsvps, filename }: { rsvps: Rsvp[]; filename: string }) {
  const [filter, setFilter] = useState<"semua" | Rsvp["attendance"]>("semua");
  const shown = filter === "semua" ? rsvps : rsvps.filter((r) => r.attendance === filter);

  function downloadCsv() {
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [["Waktu", "Nama", "Kehadiran", "Jumlah orang", "Ucapan"], ...rsvps.map((r) => [dateFmt.format(new Date(r.createdAt)), r.name, ATTEND[r.attendance], r.guests, r.message])];
    const blob = new Blob(["﻿" + rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (rsvps.length === 0) {
    return <p className="mt-3 text-sm text-app-muted">Belum ada tamu yang mengisi RSVP.</p>;
  }

  return (
    <div className="mt-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          {(["semua", "hadir", "ragu", "tidak"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${filter === f ? "border-app-fg bg-app-fg text-white" : "border-app-line"}`}
            >
              {f === "semua" ? "Semua" : ATTEND[f]}
            </button>
          ))}
        </div>
        <button type="button" className="btn-ghost px-3 py-1.5 text-xs" onClick={downloadCsv}>
          Unduh CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-app-line text-xs text-app-muted">
            <tr>
              <th className="py-2 pr-4 font-semibold">Nama</th>
              <th className="py-2 pr-4 font-semibold">Kehadiran</th>
              <th className="py-2 pr-4 font-semibold">Orang</th>
              <th className="py-2 pr-4 font-semibold">Ucapan</th>
              <th className="py-2 font-semibold">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-b border-app-line align-top last:border-0">
                <td className="py-2 pr-4 font-semibold">{r.name}</td>
                <td className="py-2 pr-4">{ATTEND[r.attendance]}</td>
                <td className="py-2 pr-4">{r.guests}</td>
                <td className="max-w-md py-2 pr-4 whitespace-pre-line text-app-muted">{r.message || "—"}</td>
                <td className="py-2 whitespace-nowrap text-xs text-app-muted">{dateFmt.format(new Date(r.createdAt))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
