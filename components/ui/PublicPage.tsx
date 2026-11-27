import Link from "next/link";
import { PrintButton } from "@/components/sections/proposal-client";
import { SiteProvider } from "@/components/sections/site-context";
import { HOME, mapAllSections, pageSections, resolvePageLinks } from "@/lib/pages";
import { Portfolio } from "@/lib/renderer/Portfolio";
import type { PortfolioData, PropValue, Publication } from "@/lib/types";

/** Mengganti {{tamu}} di semua teks dengan nama tamu dari link undangan. */
function fillGuest(d: PortfolioData, guest: string): PortfolioData {
  const name = guest || "Tamu Undangan";
  const sub = (v: PropValue): PropValue => {
    if (typeof v === "string") return v.replaceAll("{{tamu}}", name);
    if (Array.isArray(v)) {
      return v.map((item) =>
        Object.fromEntries(Object.entries(item).map(([k, x]) => [k, typeof x === "string" ? x.replaceAll("{{tamu}}", name) : x])),
      ) as PropValue;
    }
    return v;
  };
  return mapAllSections(d, (s) => ({ ...s, props: Object.fromEntries(Object.entries(s.props).map(([k, v]) => [k, sub(v)])) }));
}

/** Nama tamu dari ?to=… (dibersihkan dan dibatasi panjangnya). */
export function guestFrom(value: string | string[] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value;
  return (v ?? "").replace(/[\u0000-\u001F\u007F<>]/g, "").trim().slice(0, 60);
}

/** Merender satu halaman publik; link "page:"/"section:" diubah menjadi URL nyata. */
export function PublicPage({ pub, pageId = HOME, guest = "" }: { pub: Publication; pageId?: string; guest?: string }) {
  const resolved = fillGuest(resolvePageLinks(pub.data, `/p/${pub.slug}`, pageId), guest);
  const data = { theme: resolved.theme, sections: pageSections(resolved, pageId) };
  return (
    <SiteProvider value={{ slug: pub.slug, guest, editing: false }}>
      <main className="flex-1" style={{ background: data.theme.colorBackground }}>
        <Portfolio data={data} />
        {pub.kind === "proposal" && <PrintButton />}
        <footer className="no-print py-6 text-center text-xs opacity-60" style={{ color: data.theme.colorPrimary }}>
          Dibuat dengan{" "}
          <Link href="/" className="font-semibold underline">
            Safantara
          </Link>
        </footer>
      </main>
    </SiteProvider>
  );
}
