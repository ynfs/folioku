import type { Metadata } from "next";
import Link from "next/link";
import { createProjectAction } from "@/app/actions";
import { AppHeader } from "@/components/ui/AppHeader";
import { ProductTabs } from "@/components/ui/ProductTabs";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { isPremiumTemplate } from "@/lib/billing";
import { CATEGORIES, STYLES, categoryLabel, kindOf, kindSlug, parseKind, productWord, styleLabel } from "@/lib/templates";
import { galleryTemplates } from "@/lib/templates-server";

export const metadata: Metadata = { title: "Galeri template" };

const PER_PAGE = 24;

export default async function TemplatesPage(props: PageProps<"/templates">) {
  const sp = await props.searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const kind = parseKind(sp.jenis);
  const jenis = kindSlug(kind);

  const all = (await galleryTemplates()).filter((t) => kindOf(t) === kind);
  const cats = CATEGORIES.filter((c) => c.kind === kind);
  // "kategori" (baru) atau "gaya" lama yang berisi kategori; "koleksi=retro" lama → gaya retro
  const kategori = [one(sp.kategori), one(sp.gaya)].find((v) => cats.some((c) => c.value === v)) ?? "";
  const gaya = [one(sp.gaya), one(sp.koleksi)].find((v) => STYLES.some((s) => s.value === v)) ?? "";
  const q = one(sp.q).trim().toLowerCase().slice(0, 60);

  const byCat = kategori ? all.filter((t) => t.category === kategori) : all;
  const byStyle = gaya ? byCat.filter((t) => t.style === gaya) : byCat;
  const list = q ? byStyle.filter((t) => [t.name, t.description, ...t.tags].join(" ").toLowerCase().includes(q)) : byStyle;

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(one(sp.hal)) || 1));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const href = (o: { kategori?: string; gaya?: string; hal?: number; q?: string }) => {
    const p = new URLSearchParams({ jenis });
    const k = o.kategori ?? kategori;
    const g = o.gaya ?? gaya;
    const s = o.q ?? q;
    if (k) p.set("kategori", k);
    if (g) p.set("gaya", g);
    if (s) p.set("q", s);
    if (o.hal && o.hal > 1) p.set("hal", String(o.hal));
    return `/templates?${p.toString()}`;
  };
  const styleCounts = STYLES.map((s) => ({ ...s, n: byCat.filter((t) => t.style === s.value).length })).filter((s) => s.n > 0);

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <ProductTabs active={kind} hrefFor={(k) => `/templates?jenis=${kindSlug(k)}`} />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-extrabold">{kind === "invitation" ? "Template undangan digital" : `Template ${productWord(kind)}`}</h1>
            <p className="mt-1 text-app-muted">{all.length} template · pilih berdasarkan kategori dan gaya, nanti semuanya bisa kamu ubah.</p>
          </div>
          <form action="/templates" className="flex gap-2">
            <input type="hidden" name="jenis" value={jenis} />
            {kategori && <input type="hidden" name="kategori" value={kategori} />}
            {gaya && <input type="hidden" name="gaya" value={gaya} />}
            <input name="q" defaultValue={q} placeholder="Cari template…" className="input w-56" aria-label="Cari template" />
            <button className="btn-primary">Cari</button>
          </form>
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-wider text-app-muted">Kategori</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterChip href={href({ kategori: "", hal: 1 })} active={!kategori} label="Semua" count={all.length} />
          {cats.map((c) => (
            <FilterChip key={c.value} href={href({ kategori: c.value, hal: 1 })} active={kategori === c.value} label={c.label} count={all.filter((t) => t.category === c.value).length} />
          ))}
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-app-muted">Gaya</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <FilterChip small href={href({ gaya: "", hal: 1 })} active={!gaya} label="Semua gaya" />
          {styleCounts.map((s) => (
            <FilterChip small key={s.value} href={href({ gaya: s.value, hal: 1 })} active={gaya === s.value} label={s.label} count={s.n} />
          ))}
        </div>

        <p className="mt-6 text-sm text-app-muted">
          Menampilkan {shown.length ? (page - 1) * PER_PAGE + 1 : 0}–{(page - 1) * PER_PAGE + shown.length} dari {list.length} template
          {q && (
            <>
              {" "}
              untuk “{q}” ·{" "}
              <Link href={href({ q: "", hal: 1 })} className="font-semibold underline">
                hapus pencarian
              </Link>
            </>
          )}
        </p>

        {shown.length === 0 ? (
          <p className="mt-16 text-center text-app-muted">Belum ada template yang cocok.</p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((t) => (
              <article key={t.id} className="card card-hover group flex flex-col overflow-hidden">
                <div className="relative">
                  <PortfolioThumb data={t} height={240} />
                  {isPremiumTemplate(t) && <PremiumBadge />}
                  {/* Lapisan hover: pratinjau */}
                  <Link
                    href={`/templates/${t.id}`}
                    className="absolute inset-0 grid place-items-center bg-app-fg/0 opacity-0 transition duration-300 group-hover:bg-app-fg/35 group-hover:opacity-100 focus-visible:bg-app-fg/35 focus-visible:opacity-100"
                    aria-label={`Pratinjau ${t.name}`}
                  >
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-lift">👁 Pratinjau</span>
                  </Link>
                </div>
                <div className="flex flex-1 flex-col border-t border-app-line p-4">
                  <h2 className="font-display font-bold">
                    {t.name}
                    {!t.builtin && <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase text-brand">Baru</span>}
                  </h2>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    <span className="chip bg-app-soft">{categoryLabel(t.category)}</span>
                    {t.style && <span className="chip">{styleLabel(t.style)}</span>}
                  </div>
                  <p className="mt-2 flex-1 text-sm text-app-muted">{t.description}</p>
                  <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
                    <Link href={`/templates/${t.id}`} className="btn-ghost">
                      Pratinjau
                    </Link>
                    <form action={createProjectAction}>
                      <input type="hidden" name="templateId" value={t.id} />
                      <button className="btn-primary w-full">Gunakan</button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label="Halaman">
            {page > 1 && (
              <Link href={href({ hal: page - 1 })} className="btn-ghost">
                ← Sebelumnya
              </Link>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={href({ hal: n })}
                aria-current={n === page ? "page" : undefined}
                className={`grid h-9 w-9 place-items-center rounded-lg border text-sm font-semibold ${n === page ? "border-app-fg bg-app-fg text-white" : "border-app-line bg-white"}`}
              >
                {n}
              </Link>
            ))}
            {page < pages && (
              <Link href={href({ hal: page + 1 })} className="btn-ghost">
                Berikutnya →
              </Link>
            )}
          </nav>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function FilterChip({ href, active, label, count, small }: { href: string; active: boolean; label: string; count?: number; small?: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border font-semibold ${small ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm"} ${
        active ? "border-app-fg bg-app-fg text-white" : "border-app-line bg-white hover:border-app-fg"
      }`}
    >
      {label}
      {count !== undefined && <span className={`ml-1.5 ${active ? "text-white/70" : "text-app-muted"}`}>{count}</span>}
    </Link>
  );
}

function PremiumBadge() {
  return (
    <span data-premium className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-[linear-gradient(135deg,#FBBF24,#E36414)] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
      ★ Premium
    </span>
  );
}
