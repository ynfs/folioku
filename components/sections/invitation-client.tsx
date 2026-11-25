/* eslint-disable @next/next/no-img-element -- gambar bisa berasal dari URL apa pun milik klien */
"use client";

import { useEffect, useRef, useState } from "react";
import { toEpoch } from "@/lib/datetime";
import type { PropValue, Wish } from "@/lib/types";
import { safeHref } from "./canvas";
import { InvHeading, InvWrap } from "./invitation";
import { useSite } from "./site-context";

// Bagian undangan yang interaktif: sampul, hitung mundur, RSVP, amplop, musik.

type P = Record<string, PropValue>;
const s = (v: PropValue | undefined): string => (typeof v === "string" ? v : v == null ? "" : String(v));
const list = (v: PropValue | undefined): Record<string, string>[] => (Array.isArray(v) ? (v as Record<string, string>[]) : []);

/** Event yang memberi tahu musik latar untuk mulai diputar. */
const OPEN_EVENT = "safantara:open";

// ---------- Sampul ----------
export function Cover({ p }: { p: P }) {
  const { guest } = useSite();
  const ref = useRef<HTMLElement>(null);

  function open(e: React.MouseEvent) {
    window.dispatchEvent(new Event(OPEN_EVENT));
    if (s(p.buttonLink)) return; // ikuti link biasa
    e.preventDefault();
    // Tanpa link: gulir ke bagian berikutnya.
    const wrapper = ref.current?.parentElement;
    let next = wrapper?.nextElementSibling as HTMLElement | null;
    while (next && next.offsetHeight === 0) next = next.nextElementSibling as HTMLElement | null;
    next?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section ref={ref} className="relative isolate flex min-h-[640px] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center text-white @3xl:min-h-[760px]">
      {s(p.image) && <img src={s(p.image)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-black/50" />
      {s(p.eyebrow) && <p className="text-sm font-semibold uppercase tracking-[0.3em] opacity-90">{s(p.eyebrow)}</p>}
      <h1 className="pf-h mt-4 text-5xl font-bold leading-tight @3xl:text-7xl">{s(p.title)}</h1>
      {s(p.subtitle) && <p className="mt-4 text-lg opacity-90">{s(p.subtitle)}</p>}
      <div className="mt-12">
        {s(p.greeting) && <p className="text-sm opacity-80">{s(p.greeting)}</p>}
        <p className="mt-2 inline-block rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-xl font-semibold backdrop-blur-sm">
          {guest || "Tamu Undangan"}
        </p>
      </div>
      {s(p.buttonText) && (
        <a href={s(p.buttonLink) ? safeHref(s(p.buttonLink)) : "#"} onClick={open} className="pf-btn mt-10 inline-block px-8 py-3 font-semibold">
          ✉ {s(p.buttonText)}
        </a>
      )}
    </section>
  );
}

// ---------- Hitung mundur ----------
export function Countdown({ p }: { p: P }) {
  const target = toEpoch(s(p.target), s(p.zone) || "WIB");
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const left = target !== null && now !== null ? Math.max(0, target - now) : null;
  const units: [string, number | null][] = [
    ["Hari", left === null ? null : Math.floor(left / 86400_000)],
    ["Jam", left === null ? null : Math.floor(left / 3600_000) % 24],
    ["Menit", left === null ? null : Math.floor(left / 60_000) % 60],
    ["Detik", left === null ? null : Math.floor(left / 1000) % 60],
  ];

  return (
    <InvWrap id="hitung-mundur">
      <InvHeading>{s(p.heading)}</InvHeading>
      {left === 0 ? (
        <p className="pf-h text-2xl font-bold">{s(p.doneText)}</p>
      ) : (
        <div className="mx-auto grid max-w-xl grid-cols-4 gap-3">
          {units.map(([label, v]) => (
            <div key={label} className="pf-card py-5" style={{ background: "var(--c-surface)" }}>
              <p className="pf-h text-4xl font-bold tabular-nums @3xl:text-5xl">{v === null ? "--" : String(v).padStart(2, "0")}</p>
              <p className="pf-muted mt-1 text-xs font-semibold uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      )}
    </InvWrap>
  );
}

// ---------- RSVP & ucapan ----------
const ATTEND_LABEL: Record<Wish["attendance"], string> = { hadir: "Hadir", tidak: "Tidak hadir", ragu: "Masih ragu" };

const SAMPLE_WISHES: Wish[] = [
  { id: "c1", name: "Contoh Tamu", attendance: "hadir", message: "Selamat menempuh hidup baru! Semoga samawa.", createdAt: "" },
  { id: "c2", name: "Teman Kantor", attendance: "ragu", message: "Bahagia selalu untuk kalian berdua.", createdAt: "" },
];

export function RsvpSection({ p }: { p: P }) {
  const { slug, guest, editing } = useSite();
  const max = Math.min(4, Math.max(1, Number(p.maxGuests) || 2));
  const showWishes = s(p.showWishes) !== "tidak";
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const live = !!slug && !editing;

  useEffect(() => {
    if (!live || !showWishes) return;
    let cancelled = false;
    fetch(`/api/rsvp?slug=${encodeURIComponent(slug!)}`)
      .then((r) => (r.ok ? r.json() : { wishes: [] }))
      .then((j: { wishes: Wish[] }) => !cancelled && setWishes(j.wishes))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [live, showWishes, slug]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!live) return;
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        name: f.get("name"),
        attendance: f.get("attendance"),
        guests: Number(f.get("guests")),
        message: f.get("message"),
        website: f.get("website"),
      }),
    }).catch(() => null);
    const json = res ? ((await res.json().catch(() => ({}))) as { wish?: Wish; error?: string }) : {};
    if (!res || !res.ok) {
      setStatus("error");
      setError(json.error ?? "Gagal mengirim. Coba lagi.");
      return;
    }
    setStatus("done");
    if (json.wish && showWishes) setWishes((w) => [json.wish!, ...w]);
  }

  const shown = live ? wishes : SAMPLE_WISHES;

  return (
    <InvWrap id="rsvp" className="pf-surface">
      <InvHeading>{s(p.heading)}</InvHeading>
      {s(p.text) && <p className="pf-muted mx-auto mb-8 max-w-xl">{s(p.text)}</p>}

      {status === "done" ? (
        <p className="pf-card mx-auto max-w-xl p-6 text-lg font-semibold" style={{ background: "var(--c-bg)" }}>
          Terima kasih! Konfirmasi dan ucapan Anda sudah kami terima. 🙏
        </p>
      ) : (
        <form onSubmit={submit} className="pf-card mx-auto max-w-xl space-y-4 p-6 text-left" style={{ background: "var(--c-bg)" }}>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <label className="block">
            <span className="text-sm font-semibold">Nama</span>
            <input name="name" required maxLength={60} defaultValue={guest} className="inv-input" />
          </label>
          <fieldset>
            <legend className="text-sm font-semibold">Kehadiran</legend>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(Object.keys(ATTEND_LABEL) as Wish["attendance"][]).map((a) => (
                <label key={a} className="inv-choice">
                  <input type="radio" name="attendance" value={a} defaultChecked={a === "hadir"} className="sr-only" />
                  {ATTEND_LABEL[a]}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block">
            <span className="text-sm font-semibold">Jumlah orang</span>
            <select name="guests" className="inv-input" defaultValue="1">
              {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} orang
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Ucapan & doa</span>
            <textarea name="message" maxLength={500} rows={3} className="inv-input" placeholder="Tulis ucapan untuk kami…" />
          </label>
          {status === "error" && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <button className="pf-btn w-full py-3 font-semibold disabled:opacity-60" disabled={status === "sending" || !live}>
            {status === "sending" ? "Mengirim…" : "Kirim"}
          </button>
          {!live && <p className="pf-muted text-center text-xs">Formulir aktif setelah undangan di-publish.</p>}
        </form>
      )}

      {showWishes && (
        <div className="mx-auto mt-10 max-w-xl text-left">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider">
            Ucapan ({shown.length}){!live && <span className="pf-muted font-normal normal-case"> — contoh</span>}
          </p>
          <ul className="max-h-96 space-y-3 overflow-y-auto">
            {shown.map((w) => (
              <li key={w.id} className="pf-card p-4" style={{ background: "var(--c-bg)" }}>
                <p className="font-semibold">
                  {w.name} <span className="pf-accent text-xs font-semibold">· {ATTEND_LABEL[w.attendance]}</span>
                </p>
                {w.message && <p className="pf-muted mt-1 whitespace-pre-line text-sm">{w.message}</p>}
              </li>
            ))}
            {shown.length === 0 && <li className="pf-muted text-sm">Belum ada ucapan. Jadilah yang pertama!</li>}
          </ul>
        </div>
      )}
    </InvWrap>
  );
}

// ---------- Amplop digital ----------
export function Gift({ p }: { p: P }) {
  const [copied, setCopied] = useState<number | null>(null);
  return (
    <InvWrap id="amplop">
      <InvHeading>{s(p.heading)}</InvHeading>
      {s(p.text) && <p className="pf-muted mx-auto mb-8 max-w-xl">{s(p.text)}</p>}
      <div className="mx-auto grid max-w-2xl gap-4 @3xl:grid-cols-2">
        {list(p.items).map((it, i) => (
          <div key={i} className="pf-card flex flex-col items-center p-6" style={{ background: "var(--c-surface)" }}>
            <p className="text-sm font-bold uppercase tracking-wider">{it.bank}</p>
            {it.qr && <img src={it.qr} alt={`QR ${it.bank}`} className="mt-3 h-36 w-36 rounded-lg bg-white object-contain p-2" />}
            <p className="pf-h mt-3 text-2xl font-bold tracking-wider tabular-nums">{it.number}</p>
            <p className="pf-muted text-sm">a.n. {it.holder}</p>
            <button
              type="button"
              className="pf-btn-outline mt-4 px-4 py-1.5 text-sm font-semibold"
              onClick={() => {
                navigator.clipboard?.writeText(it.number ?? "").then(() => setCopied(i), () => undefined);
                setTimeout(() => setCopied((c) => (c === i ? null : c)), 2000);
              }}
            >
              {copied === i ? "Tersalin ✓" : "Salin nomor"}
            </button>
          </div>
        ))}
      </div>
      {s(p.address) && (
        <div className="pf-card mx-auto mt-6 max-w-2xl p-6" style={{ background: "var(--c-surface)" }}>
          <p className="text-sm font-bold uppercase tracking-wider">Kirim kado</p>
          <p className="pf-muted mt-2 whitespace-pre-line">{s(p.address)}</p>
        </div>
      )}
    </InvWrap>
  );
}

// ---------- Musik latar ----------
export function Music({ p }: { p: P }) {
  const { editing } = useSite();
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const src = s(p.src);

  useEffect(() => {
    if (editing || !src) return;
    const start = () => {
      audio.current?.play().then(() => setPlaying(true), () => undefined);
    };
    window.addEventListener(OPEN_EVENT, start);
    return () => window.removeEventListener(OPEN_EVENT, start);
  }, [editing, src]);

  if (editing) {
    return (
      <div className="pf-surface flex items-center justify-center gap-2 px-6 py-4 text-sm">
        <span className="text-lg">♪</span>
        {src ? `Musik latar: ${s(p.title) || "lagu"} (diputar saat tamu membuka undangan)` : "Musik latar: pilih file mp3 di panel kanan"}
      </div>
    );
  }
  if (!src) return null;

  return (
    <>
      <audio ref={audio} src={src} loop preload="none" />
      <button
        type="button"
        aria-label={playing ? "Jeda musik" : "Putar musik"}
        title={s(p.title) || undefined}
        onClick={() => {
          const a = audio.current;
          if (!a) return;
          if (a.paused) a.play().then(() => setPlaying(true), () => undefined);
          else {
            a.pause();
            setPlaying(false);
          }
        }}
        className="pf-btn fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full! text-xl shadow-lg"
      >
        <span className={playing ? "animate-spin [animation-duration:3s]" : ""}>{playing ? "♫" : "♪"}</span>
      </button>
    </>
  );
}
