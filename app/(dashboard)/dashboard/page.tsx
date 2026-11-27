import type { Metadata } from "next";
import Link from "next/link";
import { createTemplateAction } from "@/app/actions";
import { AppHeader } from "@/components/ui/AppHeader";
import { DeleteProjectButton } from "@/components/ui/DeleteProjectButton";
import { ProductTabs } from "@/components/ui/ProductTabs";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { backend, requireUser } from "@/lib/backend";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { kindOf, kindSlug, parseKind, productWord } from "@/lib/templates";

export const metadata: Metadata = { title: "Dashboard" };

const dateFmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const user = await requireUser("/dashboard");
  const { jenis } = await props.searchParams;
  const kind = parseKind(jenis);
  const isInv = kind === "invitation";
  const hasResponses = kind !== "portfolio";
  const all = await backend.listProjects(user.id);
  const projects = all.filter((p) => kindOf(p) === kind);
  const word = productWord(kind);
  const newHref = `/templates?jenis=${kindSlug(kind)}`;

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-app-muted">Dashboard</p>
            <h1 className="font-display text-4xl font-extrabold">Halo, {user.name || "kamu"} 👋</h1>
            <p className="mt-1 text-app-muted">Mau bikin apa hari ini?</p>
          </div>
        </div>

        {/* Buat cepat per produk */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { k: "invitation" as const, icon: "✉", title: "Undangan baru", text: "Pernikahan, ulang tahun, adat, acara", n: all.filter((p) => kindOf(p) === "invitation").length },
            { k: "proposal" as const, icon: "▤", title: "Proposal baru", text: "Penawaran, sponsorship, kegiatan", n: all.filter((p) => kindOf(p) === "proposal").length },
            { k: "portfolio" as const, icon: "▦", title: "Portofolio baru", text: "Profil pribadi & company profile", n: all.filter((p) => kindOf(p) === "portfolio").length },
          ].map((q) => (
            <Link key={q.k} href={`/templates?jenis=${kindSlug(q.k)}`} className="card card-hover group flex items-center gap-4 p-5">
              <span className="bg-grad grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl text-white shadow-[0_10px_20px_-10px_rgb(240_83_45/0.8)]">{q.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="font-display block font-bold">+ {q.title}</span>
                <span className="block truncate text-sm text-app-muted">{q.text}</span>
              </span>
              <span className="chip">{q.n}</span>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <ProductTabs active={kind} hrefFor={(k) => (k === "portfolio" ? "/dashboard" : `/dashboard?jenis=${kindSlug(k)}`)} />
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold capitalize">{word} saya</h2>
            <p className="mt-1 text-app-muted">
              {projects.length ? `Kamu punya ${projects.length} ${word}.` : `Belum ada ${word}. Mulai dari sebuah template.`}
            </p>
          </div>
          <Link href={newHref} className="btn-brand">
            + {word.charAt(0).toUpperCase() + word.slice(1)} baru
          </Link>
        </div>

        {backend.mode === "local" && (
          <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Mode lokal aktif: data disimpan di folder <code>data/</code> komputer ini. Isi variabel Supabase di{" "}
            <code>.env.local</code> untuk penggunaan online.
          </p>
        )}

        {projects.length === 0 ? (
          <div className="mt-8 rounded-3xl border-2 border-dashed border-app-line bg-white/60 p-12 text-center">
            <span className="bg-grad mx-auto grid h-14 w-14 place-items-center rounded-2xl text-2xl text-white">✦</span>
            <p className="font-display mt-4 text-xl font-bold">Belum ada {word}</p>
            <p className="mt-1 text-app-muted">Pilih template untuk membuat {word} pertamamu.</p>
            <Link href={newHref} className="btn-brand mt-6">
              Lihat galeri template
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article key={p.id} className="card card-hover flex flex-col overflow-hidden">
                <div className="relative">
                  <PortfolioThumb data={p.data} height={200} />
                  <Link href={`/editor/${p.id}`} className="absolute inset-0" aria-label={`Edit ${p.name}`} />
                </div>
                <div className="flex flex-1 flex-col border-t border-app-line p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold">{p.name}</h2>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.published ? "bg-green-100 text-green-800" : "bg-app-bg text-app-muted"
                      }`}
                    >
                      {p.published ? "Terbit" : "Draf"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-app-muted">Diubah {dateFmt.format(new Date(p.updatedAt))}</p>
                  {p.published && p.slug && (
                    <a href={`/p/${p.slug}`} target="_blank" className="mt-1 truncate text-xs font-semibold text-brand">
                      /p/{p.slug}
                    </a>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Link href={`/editor/${p.id}`} className="btn-primary flex-1">
                      Edit
                    </Link>
                    <DeleteProjectButton id={p.id} />
                  </div>
                  {hasResponses && (
                    <Link href={`/dashboard/undangan/${p.id}`} className="btn-ghost mt-2 w-full">
                      {isInv ? "Tamu & RSVP" : "Klien & Persetujuan"}
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <form action={createTemplateAction} className="mt-2">
                      <input type="hidden" name="projectId" value={p.id} />
                      <button className="w-full text-xs font-semibold text-app-muted underline hover:text-app-fg">Jadikan template</button>
                    </form>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
