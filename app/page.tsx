import Link from "next/link";
import { AppHeader } from "@/components/ui/AppHeader";
import { ProductTabs } from "@/components/ui/ProductTabs";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { TEMPLATES, kindOf, parseKind } from "@/lib/templates";
import type { ProductKind } from "@/lib/types";

const CONTENT: Record<
  ProductKind,
  { eyebrow: string; title: string; text: string; cta: string; steps: { title: string; text: string }[]; features?: string[] }
> = {
  portfolio: {
    eyebrow: "Portofolio & company profile",
    title: "Portofolio profesional tanpa menulis kode",
    text: "Pilih template, edit isinya langsung di browser, lalu bagikan link portofolio atau profil perusahaan dalam hitungan menit.",
    cta: "Pilih template portofolio",
    steps: [
      { title: "Pilih template", text: "Mulai dari gaya modern, minimalis, klasik, retro, atau editorial." },
      { title: "Edit sesukamu", text: "Ubah teks, gambar, warna, dan font. Desain bebas ala Figma." },
      { title: "Publikasikan", text: "Dapatkan link portofolio publik untuk dibagikan ke klien." },
    ],
  },
  invitation: {
    eyebrow: "Undangan digital",
    title: "Undangan digital yang indah untuk momen bahagiamu",
    text: "Pernikahan, ulang tahun, khitanan, sampai acara kantor. Kirim link undangan dengan nama tiap tamu, terima RSVP dan ucapan langsung di dashboard.",
    cta: "Pilih template undangan",
    steps: [
      { title: "Pilih tema", text: "Elegan, rustic, ceria, islami, atau modern untuk event." },
      { title: "Isi detail acara", text: "Mempelai, waktu & tempat, peta, galeri, musik, amplop digital." },
      { title: "Sebar ke tamu", text: "Buat link per tamu, kirim lewat WhatsApp, pantau RSVP & ucapan." },
    ],
    features: [
      "Nama tamu otomatis di sampul",
      "Hitung mundur acara",
      "Peta & simpan ke kalender",
      "RSVP & buku ucapan",
      "Amplop digital (salin rekening)",
      "Musik latar",
      "Galeri & kisah cinta",
      "Desain bebas ala Figma",
    ],
  },
};

export default async function Home(props: PageProps<"/">) {
  const { produk } = await props.searchParams;
  const kind = parseKind(produk);
  const c = CONTENT[kind];
  const jenis = kind === "invitation" ? "undangan" : "portofolio";
  const samples = TEMPLATES.filter((t) => kindOf(t) === kind).slice(0, 3);

  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-8 text-center">
          <ProductTabs active={kind} hrefFor={(k) => (k === "invitation" ? "/?produk=undangan" : "/")} />
        </div>

        <section className="mx-auto max-w-6xl px-4 py-16 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand">{c.eyebrow}</p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">{c.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-app-muted">{c.text}</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href={`/templates?jenis=${jenis}`} className="btn-brand px-6 py-3 text-base">
              {c.cta}
            </Link>
            <Link href="/daftar" className="btn-ghost px-6 py-3 text-base">
              Buat akun
            </Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-12 sm:grid-cols-3">
          {c.steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-app-line bg-white p-6">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-app-fg text-sm font-bold text-white">{i + 1}</span>
              <h2 className="mt-4 text-lg font-bold">{s.title}</h2>
              <p className="mt-1 text-sm text-app-muted">{s.text}</p>
            </div>
          ))}
        </section>

        {c.features && (
          <section className="mx-auto max-w-6xl px-4 pb-12">
            <ul className="flex flex-wrap justify-center gap-2">
              {c.features.map((f) => (
                <li key={f} className="rounded-full border border-app-line bg-white px-4 py-2 text-sm font-semibold">
                  ✓ {f}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-extrabold">Template populer</h2>
            <Link href={`/templates?jenis=${jenis}`} className="text-sm font-semibold text-brand">
              Lihat semua →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {samples.map((t) => (
              <article key={t.id} className="relative overflow-hidden rounded-2xl border border-app-line bg-white transition hover:shadow-lg">
                <PortfolioThumb data={t} />
                <Link href={`/templates?jenis=${jenis}`} className="absolute inset-0" aria-label={`Lihat template ${t.name}`} />
                <div className="border-t border-app-line p-4">
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-app-muted">{t.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-app-line py-8 text-center text-sm text-app-muted">© Safantara</footer>
    </>
  );
}
