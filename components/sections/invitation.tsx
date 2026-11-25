/* eslint-disable @next/next/no-img-element -- gambar bisa berasal dari URL apa pun milik klien */
import { calendarLink, formatJam, formatTanggal } from "@/lib/datetime";
import type { PropValue } from "@/lib/types";
import { safeHref } from "./canvas";

// Bagian undangan digital yang tidak butuh interaksi (bisa dirender di server).

type P = Record<string, PropValue>;
const s = (v: PropValue | undefined): string => (typeof v === "string" ? v : v == null ? "" : String(v));
const list = (v: PropValue | undefined): Record<string, string>[] => (Array.isArray(v) ? (v as Record<string, string>[]) : []);

export function InvWrap({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`px-6 py-16 text-center @3xl:px-12 @3xl:py-24 ${className}`}>
      <div className="mx-auto max-w-4xl">{children}</div>
    </section>
  );
}

export function InvHeading({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="mb-10">
      <h2 className="pf-h text-3xl font-bold @3xl:text-5xl">{children}</h2>
      <span className="pf-accent mt-4 block text-xl" aria-hidden>
        ❦
      </span>
    </div>
  );
}

function Person({ name, full, parents, photo, ig }: { name: string; full: string; parents: string; photo: string; ig: string }) {
  return (
    <div className="flex flex-col items-center">
      {photo && <img src={photo} alt={name} className="h-44 w-44 rounded-full border-4 object-cover @3xl:h-56 @3xl:w-56" style={{ borderColor: "var(--c-surface)" }} />}
      <p className="pf-h mt-6 text-4xl font-bold @3xl:text-5xl">{name}</p>
      {full && <p className="mt-2 text-lg font-semibold">{full}</p>}
      {parents && <p className="pf-muted mt-2 whitespace-pre-line">{parents}</p>}
      {ig && (
        <a href={safeHref(ig)} target="_blank" rel="noopener noreferrer" className="pf-accent mt-3 text-sm font-semibold">
          Instagram ↗
        </a>
      )}
    </div>
  );
}

export function Couple({ p }: { p: P }) {
  return (
    <InvWrap id="mempelai">
      <InvHeading>{s(p.heading)}</InvHeading>
      {s(p.intro) && <p className="pf-muted mx-auto mb-12 max-w-2xl leading-relaxed">{s(p.intro)}</p>}
      <div className="grid items-center gap-10 @3xl:grid-cols-[1fr_auto_1fr]">
        <Person name={s(p.name1)} full={s(p.full1)} parents={s(p.parents1)} photo={s(p.photo1)} ig={s(p.ig1)} />
        <span className="pf-h pf-accent text-6xl" aria-hidden>
          &amp;
        </span>
        <Person name={s(p.name2)} full={s(p.full2)} parents={s(p.parents2)} photo={s(p.photo2)} ig={s(p.ig2)} />
      </div>
    </InvWrap>
  );
}

export function EventSection({ p }: { p: P }) {
  const zone = s(p.zone) || "WIB";
  return (
    <InvWrap id="acara" className="pf-surface">
      <InvHeading>{s(p.heading)}</InvHeading>
      <div className="grid gap-6 @3xl:grid-cols-2">
        {list(p.items).map((it, i) => {
          const cal = calendarLink(it.name, it.start, zone, [it.place, it.address].filter(Boolean).join(", "));
          return (
            <article key={i} className="pf-card flex flex-col items-center border p-8" style={{ background: "var(--c-bg)", borderColor: "color-mix(in srgb, var(--c-accent) 35%, transparent)" }}>
              <h3 className="pf-h text-2xl font-bold @3xl:text-3xl">{it.name}</h3>
              {it.start && (
                <>
                  <p className="mt-4 text-lg font-semibold">{formatTanggal(it.start)}</p>
                  <p className="pf-muted">
                    Pukul {formatJam(it.start)}
                    {it.end ? ` – ${it.end}` : ""} {zone}
                  </p>
                </>
              )}
              {it.place && <p className="mt-4 font-semibold">{it.place}</p>}
              {it.address && <p className="pf-muted mt-1 whitespace-pre-line text-sm">{it.address}</p>}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {it.map && (
                  <a href={safeHref(it.map)} target="_blank" rel="noopener noreferrer" className="pf-btn px-5 py-2.5 text-sm font-semibold">
                    Lihat lokasi
                  </a>
                )}
                {cal && (
                  <a href={cal} target="_blank" rel="noopener noreferrer" className="pf-btn-outline px-5 py-2.5 text-sm font-semibold">
                    Simpan ke kalender
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </InvWrap>
  );
}

export function Story({ p }: { p: P }) {
  return (
    <InvWrap id="kisah">
      <InvHeading>{s(p.heading)}</InvHeading>
      <ol className="relative mx-auto max-w-2xl space-y-10 text-left before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-[color-mix(in_srgb,var(--c-accent)_40%,transparent)]">
        {list(p.items).map((it, i) => (
          <li key={i} className="relative pl-10">
            <span className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4" style={{ background: "var(--c-accent)", borderColor: "var(--c-bg)" }} />
            <p className="pf-accent text-sm font-bold uppercase tracking-wider">{it.date}</p>
            <h3 className="pf-h mt-1 text-2xl font-bold">{it.title}</h3>
            {it.description && <p className="pf-muted mt-2 leading-relaxed">{it.description}</p>}
            {it.image && <img src={it.image} alt="" className="pf-img mt-4 aspect-video w-full object-cover" />}
          </li>
        ))}
      </ol>
    </InvWrap>
  );
}
