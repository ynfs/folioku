/* eslint-disable @next/next/no-img-element -- foto tim bisa berasal dari URL apa pun */
import type { PropValue } from "@/lib/types";

// Bagian proposal: tampil seperti dokumen (rata kiri, judul berbatang aksen).

type P = Record<string, PropValue>;
const s = (v: PropValue | undefined): string => (typeof v === "string" ? v : v == null ? "" : String(v));
const list = (v: PropValue | undefined): Record<string, string>[] => (Array.isArray(v) ? (v as Record<string, string>[]) : []);

/** Angka dari teks bebas, mis. "Rp 2.500.000" → 2500000. */
export const toNumber = (v: string | undefined) => Number((v ?? "").replace(/[^\d]/g, "")) || 0;

/** "Rp 2.500.000" — diformat manual agar hasil server & browser identik. */
export function rupiah(n: number): string {
  const neg = n < 0;
  const digits = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${neg ? "-" : ""}Rp ${digits}`;
}

/** Harga paket: angka → Rupiah, nol → "Gratis", teks lain apa adanya (mis. "Hubungi kami"). */
function priceLabel(raw: string | undefined, n: number): string {
  const t = (raw ?? "").trim();
  if (!t) return "";
  if (n > 0) return rupiah(n);
  return /^[s.,0Rrp]*$/.test(t) ? "Gratis" : t;
}

export function ProWrap({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`px-6 py-14 @3xl:px-12 @3xl:py-20 ${className}`}>
      <div className="mx-auto max-w-4xl">{children}</div>
    </section>
  );
}

export function ProHeading({ children, intro }: { children: React.ReactNode; intro?: string }) {
  if (!children) return null;
  return (
    <div className="mb-8">
      <h2 className="pf-h flex items-center gap-3 text-2xl font-bold @3xl:text-3xl">
        <span className="h-8 w-1.5 shrink-0 rounded-full" style={{ background: "var(--c-accent)" }} aria-hidden />
        {children}
      </h2>
      {intro && <p className="pf-muted mt-3 max-w-2xl leading-relaxed">{intro}</p>}
    </div>
  );
}

export function Points({ p }: { p: P }) {
  const items = list(p.items);
  const asList = s(p.layout) === "list";
  return (
    <ProWrap>
      <ProHeading intro={s(p.intro)}>{s(p.heading)}</ProHeading>
      {asList ? (
        <ol className="space-y-4">
          {items.map((it, i) => (
            <li key={i} className="flex gap-4">
              <span className="pf-h grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold" style={{ background: "var(--c-accent)", color: "var(--c-bg)" }}>
                {i + 1}
              </span>
              <div className="pt-1">
                <p className="font-semibold">{it.title}</p>
                {it.detail && <p className="pf-muted mt-1 text-sm leading-relaxed">{it.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="grid gap-4 @3xl:grid-cols-2">
          {items.map((it, i) => (
            <div key={i} className="pf-card border-l-4 p-5" style={{ background: "var(--c-surface)", borderLeftColor: "var(--c-accent)" }}>
              <p className="pf-accent text-xs font-bold uppercase tracking-wider">{String(i + 1).padStart(2, "0")}</p>
              <p className="pf-h mt-1 text-lg font-bold">{it.title}</p>
              {it.detail && <p className="pf-muted mt-1 text-sm leading-relaxed">{it.detail}</p>}
            </div>
          ))}
        </div>
      )}
    </ProWrap>
  );
}

export function Timeline({ p }: { p: P }) {
  const items = list(p.items);
  return (
    <ProWrap className="pf-surface">
      <ProHeading>{s(p.heading)}</ProHeading>
      <ol className="grid gap-4 @3xl:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {items.map((it, i) => (
          <li key={i} className="pf-card relative p-5" style={{ background: "var(--c-bg)" }}>
            <div className="mb-3 flex items-center gap-2">
              <span className="pf-h grid h-7 w-7 place-items-center rounded-full text-xs font-bold" style={{ background: "var(--c-accent)", color: "var(--c-bg)" }}>
                {i + 1}
              </span>
              <span className="pf-accent text-xs font-bold uppercase tracking-wider">{it.period}</span>
            </div>
            <p className="pf-h text-lg font-bold">{it.phase}</p>
            {it.detail && <p className="pf-muted mt-1 text-sm leading-relaxed">{it.detail}</p>}
          </li>
        ))}
      </ol>
    </ProWrap>
  );
}

export function Budget({ p }: { p: P }) {
  const rows = list(p.items).map((it) => {
    const qty = toNumber(it.qty) || 1;
    const price = toNumber(it.price);
    return { item: it.item ?? "", unit: it.unit ?? "", qty, price, total: qty * price };
  });
  const subtotal = rows.reduce((n, r) => n + r.total, 0);
  const taxPct = Math.min(100, Math.max(0, Number(p.tax) || 0));
  const tax = Math.round((subtotal * taxPct) / 100);
  const cell = "px-3 py-2.5";
  return (
    <ProWrap id="anggaran">
      <ProHeading intro={s(p.intro)}>{s(p.heading)}</ProHeading>
      <div className="pf-card overflow-x-auto border" style={{ borderColor: "color-mix(in srgb, var(--c-text) 15%, transparent)" }}>
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead style={{ background: "var(--c-accent)", color: "var(--c-bg)" }}>
            <tr>
              <th className={`${cell} w-10 font-semibold`}>No</th>
              <th className={`${cell} font-semibold`}>Uraian</th>
              <th className={`${cell} text-right font-semibold`}>Jumlah</th>
              <th className={`${cell} text-right font-semibold`}>Harga satuan</th>
              <th className={`${cell} text-right font-semibold`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid color-mix(in srgb, var(--c-text) 10%, transparent)", background: i % 2 ? "var(--c-surface)" : undefined }}>
                <td className={cell}>{i + 1}</td>
                <td className={`${cell} font-medium`}>{r.item}</td>
                <td className={`${cell} whitespace-nowrap text-right`}>
                  {r.qty} {r.unit}
                </td>
                <td className={`${cell} whitespace-nowrap text-right tabular-nums`}>{rupiah(r.price)}</td>
                <td className={`${cell} whitespace-nowrap text-right font-semibold tabular-nums`}>{rupiah(r.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot style={{ borderTop: "2px solid color-mix(in srgb, var(--c-text) 25%, transparent)" }}>
            <tr>
              <td className={cell} colSpan={4}>
                Subtotal
              </td>
              <td className={`${cell} text-right font-semibold tabular-nums`}>{rupiah(subtotal)}</td>
            </tr>
            {taxPct > 0 && (
              <tr>
                <td className={cell} colSpan={4}>
                  PPN {taxPct}%
                </td>
                <td className={`${cell} text-right tabular-nums`}>{rupiah(tax)}</td>
              </tr>
            )}
            <tr style={{ background: "var(--c-surface)" }}>
              <td className={`${cell} pf-h text-base font-bold`} colSpan={4}>
                Total
              </td>
              <td className={`${cell} pf-h whitespace-nowrap text-right text-base font-bold tabular-nums`}>{rupiah(subtotal + tax)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {s(p.note) && <p className="pf-muted mt-3 text-sm italic">{s(p.note)}</p>}
    </ProWrap>
  );
}

export function Pricing({ p }: { p: P }) {
  const items = list(p.items);
  return (
    <ProWrap id="paket" className="pf-surface">
      <ProHeading intro={s(p.intro)}>{s(p.heading)}</ProHeading>
      <div className="grid gap-5 @3xl:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {items.map((it, i) => {
          const hot = /^(ya|y|yes|1|true)$/i.test((it.highlight ?? "").trim());
          const price = toNumber(it.price);
          return (
            <div
              key={i}
              className="pf-card relative flex flex-col border-2 p-6"
              style={{ background: "var(--c-bg)", borderColor: hot ? "var(--c-accent)" : "color-mix(in srgb, var(--c-text) 12%, transparent)" }}
            >
              {hot && (
                <span className="absolute -top-3 left-6 rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: "var(--c-accent)", color: "var(--c-bg)" }}>
                  Unggulan
                </span>
              )}
              <p className="pf-h text-xl font-bold">{it.name}</p>
              <p className="mt-3">
                <span className="pf-h text-3xl font-bold tabular-nums">{priceLabel(it.price, price)}</span>
                {it.period && <span className="pf-muted text-sm"> {it.period}</span>}
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {(it.features ?? "")
                  .split("\n")
                  .map((f) => f.trim())
                  .filter(Boolean)
                  .map((f, k) => (
                    <li key={k} className="flex gap-2">
                      <span className="pf-accent font-bold">✓</span>
                      {f}
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
      </div>
    </ProWrap>
  );
}

export function Team({ p }: { p: P }) {
  return (
    <ProWrap id="tim">
      <ProHeading>{s(p.heading)}</ProHeading>
      <div className="grid grid-cols-2 gap-6 @3xl:grid-cols-4">
        {list(p.items).map((it, i) => (
          <div key={i} className="text-center">
            {it.photo && <img src={it.photo} alt={it.name} className="pf-img mx-auto aspect-square w-full max-w-40 object-cover" />}
            <p className="mt-3 font-semibold">{it.name}</p>
            <p className="pf-muted text-sm">{it.role}</p>
          </div>
        ))}
      </div>
    </ProWrap>
  );
}
