import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createProjectAction } from "@/app/actions";
import { PreviewFrame } from "@/components/ui/PreviewFrame";
import { isPremiumTemplate } from "@/lib/billing";
import { categoryLabel, kindOf, kindSlug, productWord, styleLabel } from "@/lib/templates";
import { findTemplate } from "@/lib/templates-server";

// Pratinjau satu template secara penuh sebelum dipakai.

export async function generateMetadata(props: PageProps<"/templates/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const t = await findTemplate(id);
  return { title: t ? `Pratinjau ${t.name}` : "Template tidak ditemukan" };
}

export default async function TemplatePreviewPage(props: PageProps<"/templates/[id]">) {
  const { id } = await props.params;
  const t = await findTemplate(id);
  if (!t) notFound();
  const kind = kindOf(t);

  return (
    <div className="flex min-h-screen flex-col bg-[#ECE6DC]">
      <header className="sticky top-0 z-40 border-b border-app-line bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link href={`/templates?jenis=${kindSlug(kind)}&kategori=${t.category}`} className="btn-ghost px-3" aria-label="Kembali ke galeri">
            ←
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="font-display truncate text-lg font-bold">{t.name}</h1>
            <div className="mt-0.5 flex flex-wrap gap-1">
              <span className="chip capitalize">{productWord(kind)}</span>
              <span className="chip">{categoryLabel(t.category)}</span>
              {t.style && <span className="chip">{styleLabel(t.style)}</span>}
              {isPremiumTemplate(t) && (
                <a href="/harga" className="chip border-amber-300 bg-amber-50 text-amber-800">
                  ★ Premium
                </a>
              )}
            </div>
          </div>
          <form action={createProjectAction}>
            <input type="hidden" name="templateId" value={t.id} />
            <button className="btn-brand">Gunakan template ini →</button>
          </form>
        </div>
      </header>
      <PreviewFrame data={t} description={t.description} />
    </div>
  );
}
