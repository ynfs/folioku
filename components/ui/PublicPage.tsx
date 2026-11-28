import Link from "next/link";
import { PrintButton } from "@/components/sections/proposal-client";
import { SiteProvider } from "@/components/sections/site-context";
import { pageAccess } from "@/lib/billing";
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
  const access = pageAccess(pub);
  if (access.expired) return <ExpiredPage />;
  const resolved = fillGuest(resolvePageLinks(pub.data, `/p/${pub.slug}`, pageId), guest);
  const data = { theme: resolved.theme, sections: pageSections(resolved, pageId) };
  return (
    <SiteProvider value={{ slug: pub.slug, guest, editing: false }}>
      <main className="flex-1" style={{ background: data.theme.colorBackground }}>
        <Portfolio data={data} />
        {pub.kind === "proposal" && <PrintButton />}
        {access.watermark && (
          <>
            <footer className="py-6 text-center text-xs opacity-60" style={{ color: data.theme.colorPrimary }}>
              Dibuat dengan{" "}
              <Link href="/" className="font-semibold underline">
                Safantara
              </Link>
            </footer>
            {/* Watermark paket Gratis */}
            <Link
              href="/harga"
              data-watermark
              className="no-print fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-black/10 bg-white/95 py-1.5 pl-1.5 pr-3.5 text-xs font-semibold text-[#16130f] shadow-lg backdrop-blur"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[linear-gradient(135deg,#FF8A3D,#F0532D_50%,#D9365E)] text-[11px] font-black text-white">S</span>
              Dibuat gratis dengan Safantara
            </Link>
          </>
        )}
      </main>
    </SiteProvider>
  );
}

function ExpiredPage() {
  return (
    <main className="grid flex-1 place-items-center bg-[#fbf8f3] px-6 py-24 text-center text-[#16130f]">
      <div className="max-w-md">
        <p className="text-5xl">🕊️</p>
        <h1 className="mt-4 text-2xl font-extrabold">Masa aktif halaman ini sudah berakhir</h1>
        <p className="mt-2 text-sm opacity-70">Pemilik dapat mengaktifkannya kembali dengan memilih paket di Safantara.</p>
        <Link href="/harga" className="mt-6 inline-block rounded-full bg-[#16130f] px-5 py-2.5 text-sm font-bold text-white">
          Lihat paket Safantara
        </Link>
      </div>
    </main>
  );
}
