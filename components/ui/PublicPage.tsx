import Link from "next/link";
import { HOME, pageSections, resolvePageLinks } from "@/lib/pages";
import { Portfolio } from "@/lib/renderer/Portfolio";
import type { Publication } from "@/lib/types";

/** Merender satu halaman portofolio publik; link "page:<id>" diubah menjadi URL nyata. */
export function PublicPage({ pub, pageId = HOME }: { pub: Publication; pageId?: string }) {
  const resolved = resolvePageLinks(pub.data, `/p/${pub.slug}`);
  const data = { theme: resolved.theme, sections: pageSections(resolved, pageId) };
  return (
    <main className="flex-1" style={{ background: data.theme.colorBackground }}>
      <Portfolio data={data} />
      <footer className="py-6 text-center text-xs opacity-60" style={{ color: data.theme.colorPrimary }}>
        Dibuat dengan{" "}
        <Link href="/" className="font-semibold underline">
          Folioku
        </Link>
      </footer>
    </main>
  );
}
