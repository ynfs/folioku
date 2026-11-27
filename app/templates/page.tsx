import type { Metadata } from "next";
import Link from "next/link";
import { createProjectAction } from "@/app/actions";
import { AppHeader } from "@/components/ui/AppHeader";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { ProductTabs } from "@/components/ui/ProductTabs";
import { CATEGORIES, kindOf, parseKind } from "@/lib/templates";
import { galleryTemplates } from "@/lib/templates-server";

export const metadata: Metadata = { title: "Galeri template" };

export default async function TemplatesPage(props: PageProps<"/templates">) {
  const { gaya, jenis, koleksi } = await props.searchParams;
  const retro = koleksi === "retro";
  const kind = parseKind(jenis);
  const base = `/templates?jenis=${kind === "invitation" ? "undangan" : "portofolio"}`;
  const cats = CATEGORIES.filter((c) => c.kind === kind);
  const active = typeof gaya === "string" && cats.some((c) => c.value === gaya) ? gaya : "";
  const all = (await galleryTemplates()).filter((t) => kindOf(t) === kind);
  const byCat = active ? all.filter((t) => t.category === active) : all;
  // Koleksi gaya lintas kategori, mis. "Retro Klasik"
  const list = retro ? byCat.filter((t) => t.tags.includes("retro klasik")) : byCat;

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <ProductTabs active={kind} hrefFor={(k) => `/templates?jenis=${k === "invitation" ? "undangan" : "portofolio"}`} />
        <h1 className="mt-6 text-3xl font-extrabold">{kind === "invitation" ? "Template undangan digital" : "Template portofolio"}</h1>
        <p className="mt-1 text-app-muted">Pilih gaya yang paling cocok, nanti semuanya bisa kamu ubah.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <FilterChip href={base} active={!active && !retro} label="Semua" />
          <FilterChip href={`${base}&koleksi=retro`} active={retro && !active} label="✦ Retro Klasik" />
          {cats.map((c) => (
            <FilterChip key={c.value} href={`${base}&gaya=${c.value}`} active={active === c.value} label={c.label} />
          ))}
        </div>

        {list.length === 0 ? (
          <p className="mt-16 text-center text-app-muted">Belum ada template untuk gaya ini.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <article key={t.id} className="flex flex-col overflow-hidden rounded-2xl border border-app-line bg-white">
                <PortfolioThumb data={t} height={240} />
                <div className="flex flex-1 flex-col border-t border-app-line p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-bold">
                      {t.name}
                      {!t.builtin && <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase text-brand">Baru</span>}
                    </h2>
                    <span className="shrink-0 rounded-full bg-app-bg px-2 py-0.5 text-xs font-semibold text-app-muted">
                      {CATEGORIES.find((c) => c.value === t.category)?.label ?? t.category}
                    </span>
                  </div>
                  <p className="mt-1 flex-1 text-sm text-app-muted">{t.description}</p>
                  <form action={createProjectAction} className="mt-4">
                    <input type="hidden" name="templateId" value={t.id} />
                    <button className="btn-primary w-full">Gunakan template ini</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
        active ? "border-app-fg bg-app-fg text-white" : "border-app-line bg-white hover:border-app-fg"
      }`}
    >
      {label}
    </Link>
  );
}
