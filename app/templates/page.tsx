import type { Metadata } from "next";
import Link from "next/link";
import { createProjectAction } from "@/app/actions";
import { AppHeader } from "@/components/ui/AppHeader";
import { ProductTabs } from "@/components/ui/ProductTabs";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { isPremiumTemplate } from "@/lib/billing";
import { CATEGORIES, STYLES, categoryLabel, kindOf, kindSlug, parseKind, styleLabel } from "@/lib/templates";
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
  const akses = one(sp.akses) === "gratis" || one(sp.akses) === "premium" ? one(sp.akses) : "";

  const byCat = kategori ? all.filter((t) => t.category === kategori) : all;
  const byStyle = gaya ? byCat.filter((t) => t.style === gaya) : byCat;
  const byAccess = akses ? byStyle.filter((t) => isPremiumTemplate(t) === (akses === "premium")) : byStyle;
  const list = q ? byAccess.filter((t) => [t.name, t.description, categoryLabel(t.category), ...t.tags].join(" ").toLowerCase().includes(q)) : byAccess;

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(one(sp.hal)) || 1));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const href = (o: { kategori?: string; gaya?: string; hal?: number; q?: string; akses?: string }) => {
    const p = new URLSearchParams({ jenis });
    const k = o.kategori ?? kategori;
    const g = o.gaya ?? gaya;
    const s = o.q ?? q;
    const a = o.akses ?? akses;
    if (k) p.set("kategori", k);
    if (g) p.set("gaya", g);
    if (s) p.set("q", s);
    if (a) p.set("akses", a);
    if (o.hal && o.hal > 1) p.set("hal", String(o.hal));
    return `/templates?${p.toString()}`;
  };
  const styleCounts = STYLES.map((s) => ({ ...s, n: byCat.filter((t) => t.style === s.value).length })).filter((s) => s.n > 0);

  return (
    <>
      <AppHeader />
      <main className="w-full flex-1 pb-16">
        {/* Kepala halaman */}
        <section className="relative overflow-hidden border-b border-app-line/70">
          <div className="bg-dots absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]" />
          <div className={`absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full blur-3xl ${GLOW[kind]}`} />
          <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:pt-10">
            <ProductTabs active={kind} hrefFor={(k) => `/templates?jenis=${kindSlug(k)}`} />
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px] lg:items-end">
              <div>
                <span className="eyebrow">Galeri template</span>
                <h1 className="font-display mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">{TITLE[kind]}</h1>
                <p className="mt-3 max-w-xl text-app-muted">Pilih desain yang paling mendekati selera kamu — teks, foto, warna, dan susunan bagiannya bisa diubah sesukamu.</p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <Stat value={all.length} label="template" />
                  <Stat value={cats.length} label="kategori" className="hidden sm:inline" />
                  <Stat value={STYLES.filter((s) => all.some((t) => t.style === s.value)).length} label="gaya" className="hidden sm:inline" />
                  <Stat value={all.filter(isPremiumTemplate).length} label="Premium" star />
                </div>
              </div>
              <form action="/templates" className="flex w-full items-center gap-2 rounded-2xl border border-app-line bg-white p-1.5 shadow-soft focus-within:border-app-fg">
                <input type="hidden" name="jenis" value={jenis} />
                {kategori && <input type="hidden" name="kategori" value={kategori} />}
                {gaya && <input type="hidden" name="gaya" value={gaya} />}
                {akses && <input type="hidden" name="akses" value={akses} />}
                <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" className="ml-2 shrink-0 text-app-muted" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input name="q" defaultValue={q} placeholder={`Cari, mis. “${SEARCH_HINT[kind]}”`} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" aria-label="Cari template" />
                <button className="btn-primary shrink-0">Cari</button>
              </form>
            </div>
          </div>
        </section>

        {/* Bilah filter: menempel di bawah header saat menggulir */}
        <div className="sticky top-16 z-30 border-b border-app-line/70 bg-app-bg/90 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="scroll-x fade-x -mx-4 flex gap-2 px-4" aria-label="Kategori">
              <FilterChip href={href({ kategori: "", hal: 1 })} active={!kategori} label="Semua" count={all.length} />
              {cats.map((c) => (
                <FilterChip key={c.value} href={href({ kategori: c.value, hal: 1 })} active={kategori === c.value} label={c.label} count={all.filter((t) => t.category === c.value).length} />
              ))}
            </div>
            <div className="mt-2.5">
              <div className="scroll-x fade-x -mx-4 flex items-center gap-1.5 px-4" aria-label="Gaya">
                <span className="shrink-0 pr-1 text-[11px] font-bold uppercase tracking-wider text-app-muted">Gaya</span>
                <FilterChip small href={href({ gaya: "", hal: 1 })} active={!gaya} label="Semua" />
                {styleCounts.map((s) => (
                  <FilterChip small key={s.value} href={href({ gaya: s.value, hal: 1 })} active={gaya === s.value} label={s.label} count={s.n} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-3 px-4 text-sm text-app-muted">
          <span>
            Menampilkan <b className="text-app-fg">{shown.length ? (page - 1) * PER_PAGE + 1 : 0}–{(page - 1) * PER_PAGE + shown.length}</b> dari {list.length} template
            {q && <> untuk “{q}”</>}
          </span>
          {(kategori || gaya || q || akses) && (
            <Link href={`/templates?jenis=${jenis}`} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-app-fg ring-1 ring-app-line hover:ring-app-fg">
              ✕ Hapus semua filter
            </Link>
          )}
          <div className="ml-auto flex shrink-0 rounded-full border border-app-line bg-white p-0.5 text-xs font-semibold" aria-label="Akses">
            {ACCESS.map(([v, l]) => (
              <Link key={v} href={href({ akses: v, hal: 1 })} className={`rounded-full px-3 py-1.5 ${akses === v ? "bg-app-fg text-white" : "text-app-muted hover:text-app-fg"}`}>
                {l}
              </Link>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md px-4 text-center">
            <p className="text-4xl">🔍</p>
            <p className="font-display mt-3 text-lg font-bold">Belum ada template yang cocok</p>
            <p className="mt-1 text-sm text-app-muted">Coba kata kunci lain atau longgarkan filternya.</p>
            <Link href={`/templates?jenis=${jenis}`} className="btn-primary mt-5">
              Lihat semua template
            </Link>
          </div>
        ) : (
          <div className="mx-auto mt-4 grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-app-muted">{t.description}</p>
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
          <nav className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-center gap-1.5 px-4" aria-label="Halaman">
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
      className={`shrink-0 whitespace-nowrap rounded-full border font-semibold transition ${small ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm"} ${
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

const TITLE = { invitation: "Template undangan digital", proposal: "Template proposal", portfolio: "Template portofolio & company profile" } as const;
const SEARCH_HINT = { invitation: "jawa", proposal: "sponsorship", portfolio: "fotografer" } as const;
const GLOW = { invitation: "bg-[#FF8A9B]/25", proposal: "bg-[#4FB6FF]/25", portfolio: "bg-[#A78BFA]/25" } as const;
const ACCESS = [
  ["", "Semua"],
  ["gratis", "Gratis"],
  ["premium", "★ Premium"],
] as const;

function Stat({ value, label, star, className = "" }: { value: number; label: string; star?: boolean; className?: string }) {
  return (
    <span className={`rounded-full px-3 py-1 ring-1 ${className} ${star ? "bg-amber-50 text-amber-900 ring-amber-200" : "bg-white text-app-muted ring-app-line"}`}>
      {star && "★ "}
      <b className={star ? "" : "text-app-fg"}>{value}</b> {label}
    </span>
  );
}
