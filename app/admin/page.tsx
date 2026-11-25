import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createTemplateAction, toggleTemplatePublishAction } from "@/app/actions";
import { AppHeader } from "@/components/ui/AppHeader";
import { DeleteTemplateButton } from "@/components/ui/DeleteTemplateButton";
import { backend, requireUser } from "@/lib/backend";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { TEMPLATES } from "@/lib/templates";
import type { Template } from "@/lib/types";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const user = await requireUser("/admin");
  if (user.role !== "admin") redirect("/dashboard");

  const [custom, stats] = await Promise.all([backend.listTemplates({ includeDrafts: true }), backend.adminStats()]);

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-extrabold">Panel admin</h1>
        <p className="mt-1 text-app-muted">Buat dan kelola template untuk galeri.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Stat label="Pengguna" value={stats.users} />
          <Stat label="Proyek" value={stats.projects} />
          <Stat label="Portofolio terbit" value={stats.published} />
          <Stat label="Template" value={custom.length + TEMPLATES.length} />
        </div>

        {/* Template baru */}
        <section className="mt-10 rounded-2xl border border-app-line bg-white p-6">
          <h2 className="text-xl font-extrabold">Buat template baru</h2>
          <p className="mt-1 text-sm text-app-muted">
            Mulai dari kanvas kosong untuk desain bebas ala Figma, atau salin template yang sudah ada lalu ubah.
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <form action={createTemplateAction}>
              <input type="hidden" name="source" value="blank" />
              <button className="btn-brand">+ Kanvas kosong</button>
            </form>
            <form action={createTemplateAction} className="flex items-end gap-2">
              <div>
                <label className="label" htmlFor="source">
                  atau salin dari
                </label>
                <select id="source" name="source" className="input min-w-56">
                  {[...custom, ...TEMPLATES].map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                      {t.builtin ? " (bawaan)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn-primary">Salin & edit</button>
            </form>
          </div>
        </section>

        <h2 className="mt-10 text-xl font-extrabold">Template buatan admin</h2>
        {custom.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-app-line bg-white p-8 text-center text-app-muted">
            Belum ada. Buat template pertama di atas.
          </p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {custom.map((t) => (
              <TemplateCard key={t.id} t={t} usage={stats.usage[t.id] ?? 0}>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/admin/templates/${t.id}`} className="btn-primary flex-1">
                    Edit desain
                  </Link>
                  <form action={toggleTemplatePublishAction}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="btn-ghost">{t.published ? "Tarik" : "Terbitkan"}</button>
                  </form>
                  <DeleteTemplateButton id={t.id} />
                </div>
              </TemplateCard>
            ))}
          </div>
        )}

        <h2 className="mt-10 text-xl font-extrabold">Template bawaan</h2>
        <p className="mt-1 text-sm text-app-muted">Disimpan sebagai file JSON di folder templates/. Salin untuk mengubahnya.</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} t={t} usage={stats.usage[t.id] ?? 0}>
              <form action={createTemplateAction} className="mt-4">
                <input type="hidden" name="source" value={t.id} />
                <button className="btn-ghost w-full">Salin & edit</button>
              </form>
            </TemplateCard>
          ))}
        </div>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-app-line bg-white p-5">
      <p className="text-sm text-app-muted">{label}</p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function TemplateCard({ t, usage, children }: { t: Template; usage: number; children: React.ReactNode }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-app-line bg-white">
      <PortfolioThumb data={t} height={200} />
      <div className="flex flex-1 flex-col border-t border-app-line p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold">{t.name}</h3>
          {!t.builtin && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                t.published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-900"
              }`}
            >
              {t.published ? "Terbit" : "Draf"}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs capitalize text-app-muted">
          {t.category} · dipakai {usage} proyek
        </p>
        {children}
      </div>
    </article>
  );
}
