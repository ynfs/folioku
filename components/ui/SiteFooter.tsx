import Link from "next/link";
import { CONTACT, mailLink, waLink } from "@/lib/contact";
import { Logo } from "./AppHeader";

const COLS = [
  {
    title: "Undangan",
    links: [
      ["Pernikahan", "/templates?jenis=undangan&kategori=pernikahan"],
      ["Pernikahan Adat", "/templates?jenis=undangan&kategori=adat"],
      ["Ulang Tahun", "/templates?jenis=undangan&kategori=ulang-tahun"],
      ["Khitanan & Aqiqah", "/templates?jenis=undangan&kategori=khitanan"],
      ["Acara & Event", "/templates?jenis=undangan&kategori=acara"],
    ],
  },
  {
    title: "Proposal",
    links: [
      ["Penawaran Jasa", "/templates?jenis=proposal&kategori=penawaran"],
      ["Sponsorship", "/templates?jenis=proposal&kategori=sponsorship"],
      ["Pitch Deck", "/templates?jenis=proposal&kategori=pitch-deck"],
      ["Proyek & Tender", "/templates?jenis=proposal&kategori=proyek"],
      ["Dana Hibah & CSR", "/templates?jenis=proposal&kategori=hibah"],
    ],
  },
  {
    title: "Portofolio",
    links: [
      ["Personal & Kreatif", "/templates?jenis=portofolio&kategori=personal"],
      ["Fotografer", "/templates?jenis=portofolio&kategori=fotografer"],
      ["Bisnis & UMKM", "/templates?jenis=portofolio&kategori=bisnis"],
      ["Kuliner & Kafe", "/templates?jenis=portofolio&kategori=kuliner"],
      ["Teknologi", "/templates?jenis=portofolio&kategori=teknologi"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-app-line bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-app-muted">
            Portofolio, undangan digital, dan proposal yang indah — tanpa menulis kode. Dibuat dengan bangga di Indonesia.
          </p>
          <div className="mt-5 space-y-1.5 text-sm">
            <p className="font-semibold">Layanan custom profil & desain:</p>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-app-muted hover:text-app-fg">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[#25D366] text-xs text-white">✆</span>
              WhatsApp {CONTACT.whatsappDisplay}
            </a>
            <a href={mailLink()} className="flex items-center gap-2 text-app-muted hover:text-app-fg">
              <span className="bg-grad grid h-6 w-6 place-items-center rounded-md text-xs text-white">✉</span>
              {CONTACT.email}
            </a>
          </div>
          <div className="mt-5 flex gap-2">
            <Link href="/daftar" className="btn-brand">
              Mulai gratis
            </Link>
            <Link href="/templates" className="btn-ghost">
              Lihat template
            </Link>
          </div>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="font-display text-sm font-bold">{c.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-app-muted transition hover:text-app-fg">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-app-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-app-muted">
          <p>© {new Date().getFullYear()} Safantara. Semua hak dilindungi.</p>
          <p>Portofolio · Undangan Digital · Proposal</p>
        </div>
      </div>
    </footer>
  );
}
