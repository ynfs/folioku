import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createTemplateAction, toggleTemplatePublishAction } from "@/app/actions";
import { AppHeader } from "@/components/ui/AppHeader";
import { DeleteTemplateButton } from "@/components/ui/DeleteTemplateButton";
import { backend, requireUser } from "@/lib/backend";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { CATEGORIES, PRODUCTS, STYLES, TEMPLATES, categoryLabel, styleLabel } from "@/lib/templates";
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
              <input type="hidden" name="kind" value="portfolio" />
              <button className="btn-brand">+ Kanvas kosong (portofolio)</button>
            </form>
            <form action={createTemplateAction}>
              <input type="hidden" name="source" value="blank" />
              <input type="hidden" name="kind" value="invitation" />
              <button className="btn-brand">+ Kanvas kosong (undangan)</button>
            </form>
            <form action={createTemplateAction}>
              <input type="hidden" name="source" value="blank" />
              <input type="hidden" name="kind" value="proposal" />
              <button className="btn-brand">+ Kanvas kosong (proposal)</button>
            </form>
            <form action={createTemplateAction} className="flex items-end gap-2">
              <div>
                <label className="label" htmlFor="source">
                  atau salin dari
                </label>
                <select id="source" name="source" className="input min-w-56">
                  {PRODUCTS.map((p) => (
                    <optgroup key={p.value} label={p.label}>
                      {[...custom, ...TEMPLATES]
                        .filter((t) => (t.kind ?? "portfolio") === p.value)
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                            {t.builtin ? "" : " (buatan admin)"}
                          </option>
                        ))}
                    </optgroup>
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
        <p className="mt-1 text-sm text-app-muted">
          {TEMPLATES.length} template di folder templates/ (100 di antaranya dibuat oleh <code>scripts/generate-koleksi.mjs</code>). Salin untuk mengubahnya.
        </p>
        <ClassificationSummary />
        <div className="mt-4 overflow-x-auto rounded-2xl border border-app-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-app-line text-xs text-app-muted">
              <tr>
                <th className="px-4 py-2 font-semibold">Template</th>
                <th className="px-4 py-2 font-semibold">Jenis</th>
                <th className="px-4 py-2 font-semibold">Kategori</th>
                <th className="px-4 py-2 font-semibold">Gaya</th>
                <th className="px-4 py-2 font-semibold">Dipakai</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {TEMPLATES.map((t) => (
                <tr key={t.id} className="border-b border-app-line last:border-0">
                  <td className="px-4 py-2 font-semibold">{t.name}</td>
                  <td className="px-4 py-2 text-app-muted">{PRODUCTS.find((p) => p.value === (t.kind ?? "portfolio"))?.short}</td>
                  <td className="px-4 py-2 text-app-muted">{categoryLabel(t.category)}</td>
                  <td className="px-4 py-2 text-app-muted">{styleLabel(t.style)}</td>
                  <td className="px-4 py-2 text-app-muted">{stats.usage[t.id] ?? 0}</td>
                  <td className="px-4 py-2 text-right">
                    <form action={createTemplateAction}>
                      <input type="hidden" name="source" value={t.id} />
                      <button className="btn-ghost px-2 py-1 text-xs">Salin & edit</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <p className="mt-1 text-xs text-app-muted">
          {PRODUCTS.find((p) => p.value === (t.kind ?? "portfolio"))?.short} · {CATEGORIES.find((c) => c.value === t.category)?.label ?? t.category} · dipakai {usage}
        </p>
        {children}
      </div>
    </article>
  );
}

/** Ringkasan klasifikasi: jumlah template per jenis, kategori, dan gaya. */
function ClassificationSummary() {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-3">
      {PRODUCTS.map((p) => {
        const items = TEMPLATES.filter((t) => (t.kind ?? "portfolio") === p.value);
        return (
          <div key={p.value} className="rounded-2xl border border-app-line bg-white p-4">
            <p className="font-bold">
              {p.label} <span className="text-app-muted">({items.length})</span>
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {CATEGORIES.filter((c) => c.kind === p.value).map((c) => (
                <li key={c.value} className="flex justify-between">
                  <span className="text-app-muted">{c.label}</span>
                  <span className="font-semibold">{items.filter((t) => t.category === c.value).length}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <div className="rounded-2xl border border-app-line bg-white p-4">
        <p className="font-bold">Gaya</p>
        <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          {STYLES.map((s) => (
            <li key={s.value} className="flex justify-between">
              <span className="text-app-muted">{s.label}</span>
              <span className="font-semibold">{TEMPLATES.filter((t) => t.style === s.value).length}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
