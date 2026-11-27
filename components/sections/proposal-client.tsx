"use client";

import { useState } from "react";
import type { PropValue } from "@/lib/types";
import { ProHeading, ProWrap } from "./proposal";
import { useSite } from "./site-context";

// Bagian Persetujuan: klien memberi keputusan langsung di halaman proposal.
// Disimpan lewat /api/rsvp (kehadiran: hadir = setuju, ragu = perlu diskusi, tidak = tidak setuju)
// dan hanya terlihat oleh pemilik di dashboard.

type P = Record<string, PropValue>;
const s = (v: PropValue | undefined): string => (typeof v === "string" ? v : v == null ? "" : String(v));

const DECISIONS = [
  { value: "hadir", label: "Setuju" },
  { value: "ragu", label: "Perlu diskusi" },
  { value: "tidak", label: "Tidak setuju" },
] as const;

export function Approval({ p }: { p: P }) {
  const { slug, guest, editing } = useSite();
  const live = !!slug && !editing;
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [decision, setDecision] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!live) return;
    const f = new FormData(e.currentTarget);
    const choice = String(f.get("attendance") ?? "");
    setStatus("sending");
    setError("");
    const name = [f.get("name"), f.get("company")].map((x) => String(x ?? "").trim()).filter(Boolean).join(" — ");
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, name, attendance: choice, guests: 1, message: f.get("message"), website: f.get("website") }),
    }).catch(() => null);
    if (!res || !res.ok) {
      const j = res ? ((await res.json().catch(() => ({}))) as { error?: string }) : {};
      setStatus("error");
      setError(j.error ?? "Gagal mengirim. Coba lagi.");
      return;
    }
    setDecision(DECISIONS.find((d) => d.value === choice)?.label ?? "");
    setStatus("done");
  }

  return (
    <ProWrap id="persetujuan" className="pf-surface">
      <ProHeading intro={s(p.text)}>{s(p.heading)}</ProHeading>
      <div className="grid gap-8 @3xl:grid-cols-[1fr_1.2fr]">
        {/* Blok tanda tangan pengaju (ikut tercetak di PDF) */}
        <div className="pf-card p-6" style={{ background: "var(--c-bg)" }}>
          <p className="pf-muted text-sm">{s(p.place)}</p>
          <p className="mt-1 text-sm">Hormat kami,</p>
          <div className="mt-16 border-b" style={{ borderColor: "var(--c-text)" }} />
          <p className="mt-2 font-semibold">{s(p.signer)}</p>
          <p className="pf-muted text-sm">{s(p.signerRole)}</p>
        </div>

        {status === "done" ? (
          <div className="pf-card no-print grid place-items-center p-6 text-center" style={{ background: "var(--c-bg)" }}>
            <div>
              <p className="pf-h text-2xl font-bold">Terima kasih!</p>
              <p className="pf-muted mt-2">
                Keputusan Anda (<b>{decision}</b>) sudah kami terima. Kami akan segera menghubungi Anda.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="pf-card no-print space-y-3 p-6" style={{ background: "var(--c-bg)" }}>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="grid grid-cols-3 gap-2">
              {DECISIONS.map((d) => (
                <label key={d.value} className="inv-choice">
                  <input type="radio" name="attendance" value={d.value} defaultChecked={d.value === "hadir"} className="sr-only" />
                  {d.label}
                </label>
              ))}
            </div>
            <label className="block">
              <span className="text-sm font-semibold">Nama & jabatan</span>
              <input name="name" required maxLength={40} className="inv-input" placeholder="mis. Budi, Manajer Pemasaran" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Instansi / perusahaan</span>
              <input name="company" maxLength={18} defaultValue={guest} className="inv-input" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Catatan (opsional)</span>
              <textarea name="message" rows={3} maxLength={500} className="inv-input" placeholder="Pertanyaan atau permintaan penyesuaian…" />
            </label>
            {status === "error" && <p className="text-sm font-semibold text-red-600">{error}</p>}
            <button className="pf-btn w-full py-3 font-semibold disabled:opacity-60" disabled={status === "sending" || !live}>
              {status === "sending" ? "Mengirim…" : "Kirim keputusan"}
            </button>
            {!live && <p className="pf-muted text-center text-xs">Formulir aktif setelah proposal di-publish.</p>}
          </form>
        )}
      </div>
    </ProWrap>
  );
}

/** Tombol cetak / simpan PDF di halaman publik proposal. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print fixed bottom-5 left-5 z-50 rounded-full bg-black/80 px-5 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur hover:bg-black"
    >
      ⬇ Unduh PDF
    </button>
  );
}
