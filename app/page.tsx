import Link from "next/link";
import { AppHeader } from "@/components/ui/AppHeader";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { TEMPLATES } from "@/lib/templates";

const STEPS = [
  { n: "1", title: "Pilih template", text: "Mulai dari gaya modern, minimalis, klasik, retro, atau editorial." },
  { n: "2", title: "Edit sesukamu", text: "Ubah teks, gambar, warna, dan font. Tambah atau hapus bagian." },
  { n: "3", title: "Publikasikan", text: "Dapatkan link portofolio publik untuk dibagikan ke klien." },
];

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-20 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand">Pembuat portofolio</p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Portofolio profesional tanpa menulis kode
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-app-muted">
            Pilih template, edit isinya langsung di browser, lalu bagikan link portofolio kamu dalam hitungan menit.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/templates" className="btn-brand px-6 py-3 text-base">
              Pilih template
            </Link>
            <Link href="/daftar" className="btn-ghost px-6 py-3 text-base">
              Buat akun
            </Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-app-line bg-white p-6">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-app-fg text-sm font-bold text-white">{s.n}</span>
              <h2 className="mt-4 text-lg font-bold">{s.title}</h2>
              <p className="mt-1 text-sm text-app-muted">{s.text}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-extrabold">Template populer</h2>
            <Link href="/templates" className="text-sm font-semibold text-brand">
              Lihat semua →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.slice(0, 3).map((t) => (
              <article key={t.id} className="relative overflow-hidden rounded-2xl border border-app-line bg-white transition hover:shadow-lg">
                <PortfolioThumb data={t} />
                <Link href="/templates" className="absolute inset-0" aria-label={`Lihat template ${t.name}`} />
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
