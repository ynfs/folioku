/* eslint-disable @next/next/no-img-element -- logo lokal di /public/karya */
import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "@/components/ui/AppHeader";
import { AppIcon } from "@/components/ui/AppIcons";
import { KaryaLogo } from "@/components/ui/KaryaLogo";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { KARYA, SAFANTARA_APPS } from "@/lib/apps";
import { CONTACT, waLink } from "@/lib/contact";

export const metadata: Metadata = { title: "Aplikasi & karya" };

export default function AplikasiPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <section className="relative">
          <div className="bg-dots absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 text-center">
            <span className="eyebrow">Aplikasi & karya</span>
            <h1 className="font-display mx-auto mt-5 max-w-3xl text-5xl font-extrabold leading-tight">Semua yang sudah kami bangun, di satu tempat</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-app-muted">Aplikasi Safantara yang bisa langsung kamu pakai, dan website yang sudah kami buat untuk klien.</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="font-display text-2xl font-extrabold">Aplikasi Safantara</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SAFANTARA_APPS.map((a) => (
              <Link key={a.key} href={a.href} className="card card-hover group flex flex-col p-6">
                <AppIcon name={a.icon} size={56} />
                <h3 className="font-display mt-5 text-lg font-bold">{a.title}</h3>
                <p className="mt-1 flex-1 text-sm text-app-muted">{a.desc}</p>
                <span className="mt-4 text-sm font-bold text-brand transition group-hover:translate-x-1">Buka →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-app-line bg-white/70">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-extrabold">Karya kami</h2>
                <p className="mt-1 text-app-muted">Website yang sudah kami rancang dan bangun.</p>
              </div>
              <a href={waLink("Halo, saya ingin dibuatkan website seperti karya Safantara.")} target="_blank" rel="noopener noreferrer" className="btn-brand">
                Pesan website serupa
              </a>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {KARYA.map((k) => (
                <article key={k.key} className="card card-hover relative flex flex-col overflow-hidden">
                  <div className="grid h-44 place-items-center p-6" style={{ background: k.tile }}>
                    {k.logo ? (
                      // Logo asli ditampilkan besar (logo melebar tidak dipaksa masuk ubin persegi)
                      <img src={k.logo} alt={`Logo ${k.name}`} className="max-h-full max-w-[80%] object-contain" loading="lazy" />
                    ) : (
                      <KaryaLogo karya={k} size={96} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="chip w-fit">{k.category}</span>
                    <h3 className="font-display mt-3 text-lg font-bold">{k.name}</h3>
                    <p className="mt-1 flex-1 text-sm text-app-muted">{k.desc}</p>
                    {k.url ? (
                      <a href={k.url} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm font-bold text-brand after:absolute after:inset-0">
                        Kunjungi situs ↗
                      </a>
                    ) : (
                      <span className="mt-4 text-sm font-semibold text-app-muted">Segera online</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-app-muted">
              Ingin website atau aplikasi untuk usahamu? Hubungi WhatsApp {CONTACT.whatsappDisplay} atau {CONTACT.email}.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
