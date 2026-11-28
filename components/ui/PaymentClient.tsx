"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitProofAction } from "@/app/actions";

export function CopyButton({ value, label = "Salin" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn-ghost px-3 py-1.5 text-xs"
      onClick={() => {
        navigator.clipboard?.writeText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "Tersalin ✓" : label}
    </button>
  );
}

/** Unggah bukti transfer DANA: file → /api/upload → kirim URL ke server. */
export function ProofForm({ orderId, initialSender = "" }: { orderId: string; initialSender?: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [sender, setSender] = useState(initialSender);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!file) return setError("Pilih foto/screenshot bukti transfer.");
    if (!sender.trim()) return setError("Isi nama atau nomor DANA pengirim.");
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error || "Gagal mengunggah bukti.");
      const r = await submitProofAction(orderId, json.url, sender);
      if (!r.ok) throw new Error(r.error || "Gagal mengirim bukti.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim bukti.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label" htmlFor="bukti">
          Screenshot bukti transfer
        </label>
        <input id="bukti" type="file" accept="image/png,image/jpeg,image/webp" className="input" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <div>
        <label className="label" htmlFor="pengirim">
          Nama / nomor DANA pengirim
        </label>
        <input id="pengirim" className="input" maxLength={80} value={sender} onChange={(e) => setSender(e.target.value)} placeholder="mis. Rina — 0812xxxx" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-brand w-full" disabled={busy}>
        {busy ? "Mengirim…" : "Kirim bukti pembayaran"}
      </button>
    </form>
  );
}
