import type { Metadata } from "next";
import Link from "next/link";
import { createTemplateAction } from "@/app/actions";
import { AppHeader } from "@/components/ui/AppHeader";
import { DeleteProjectButton } from "@/components/ui/DeleteProjectButton";
import { ProductTabs } from "@/components/ui/ProductTabs";
import { backend, requireUser } from "@/lib/backend";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { kindOf, parseKind } from "@/lib/templates";

export const metadata: Metadata = { title: "Dashboard" };

const dateFmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const user = await requireUser("/dashboard");
  const { jenis } = await props.searchParams;
  const kind = parseKind(jenis);
  const isInv = kind === "invitation";
  const all = await backend.listProjects(user.id);
  const projects = all.filter((p) => kindOf(p) === kind);
  const word = isInv ? "undangan" : "portofolio";
  const newHref = `/templates?jenis=${isInv ? "undangan" : "portofolio"}`;

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <ProductTabs active={kind} hrefFor={(k) => (k === "invitation" ? "/dashboard?jenis=undangan" : "/dashboard")} />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Halo, {user.name || "kamu"}</h1>
            <p className="mt-1 text-app-muted">
              {projects.length ? `Kamu punya ${projects.length} ${word}.` : `Belum ada ${word}. Mulai dari sebuah template.`}
            </p>
          </div>
          <Link href={newHref} className="btn-brand">
            + {isInv ? "Undangan baru" : "Portofolio baru"}
          </Link>
        </div>

        {backend.mode === "local" && (
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Mode lokal aktif: data disimpan di folder <code>data/</code> komputer ini. Isi variabel Supabase di{" "}
            <code>.env.local</code> untuk penggunaan online.
          </p>
        )}

        {projects.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-app-line bg-white p-12 text-center">
            <p className="text-lg font-bold">Belum ada {word}</p>
            <p className="mt-1 text-app-muted">Pilih template untuk membuat {word} pertamamu.</p>
            <Link href={newHref} className="btn-primary mt-6">
              Lihat galeri template
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-app-line bg-white">
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
                  {isInv && (
                    <Link href={`/dashboard/undangan/${p.id}`} className="btn-ghost mt-2 w-full">
                      Tamu & RSVP
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
    </>
  );
}
