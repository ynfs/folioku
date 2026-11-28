import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "@/components/ui/AppHeader";
import { AppIcon } from "@/components/ui/AppIcons";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { FREE_INVITATION_DAYS, PLANS, formatRupiah } from "@/lib/billing";
import { CONTACT, waLink } from "@/lib/contact";

export const metadata: Metadata = { title: "Harga", description: "Paket Safantara: undangan digital sekali bayar dan langganan Pro untuk proposal & portofolio." };

const INVITATION = [
  {
    key: "free",
    name: "Gratis",
    price: "Rp 0",
    period: `aktif ${FREE_INVITATION_DAYS} hari`,
    features: ["Template non-premium", "RSVP, ucapan, musik & amplop digital", "Nama tamu di link (?to=)", "Ada watermark Safantara"],
    cta: { href: "/templates?jenis=undangan", label: "Mulai gratis" },
  },
  {
    key: "basic",
    name: "Basic",
    price: formatRupiah(PLANS.basic.price),
    period: PLANS.basic.period,
    features: ["Semua fitur Gratis", "Tanpa watermark Safantara", "Masa aktif 6 bulan", "Daftar tamu & RSVP di dashboard"],
    cta: { href: "/bayar?paket=basic", label: "Pilih Basic" },
  },
  {
    key: "premium",
    name: "Premium",
    price: formatRupiah(PLANS.premium.price),
    period: PLANS.premium.period,
    highlight: true,
    features: ["Semua fitur Basic", "Template Premium: adat Jawa, gunungan, aksara Jawa, retro, klasik", "Masa aktif 1 tahun", "Prioritas bantuan via WhatsApp"],
    cta: { href: "/bayar?paket=premium", label: "Pilih Premium" },
  },
  {
    key: "eksklusif",
    name: "Eksklusif",
    price: "Rp 300 rb+",
    period: "desain custom",
    features: ["Semua fitur Premium", "Didesain khusus oleh tim kami", "Foto profil & ilustrasi custom", "Revisi sampai cocok"],
    cta: { href: waLink("Halo, saya tertarik paket Undangan Eksklusif Safantara."), label: "Chat WhatsApp", external: true },
  },
];

const PRO_FEATURES = ["Portofolio & proposal terbit tanpa batas", "Semua template Premium", "Tanpa watermark Safantara", "Prioritas bantuan via WhatsApp"];

const FAQ = [
  ["Bagaimana cara bayarnya?", "Lewat DANA. Setelah memilih paket, kamu mendapat nominal transfer (dengan kode unik), lalu unggah bukti transfer. Paket aktif setelah dicek admin, biasanya kurang dari 1×24 jam."],
  ["Apakah undangan bisa dicoba dulu?", `Bisa. Semua template — termasuk Premium — bebas diedit. Paket Gratis aktif ${FREE_INVITATION_DAYS} hari sejak terbit; template Premium perlu paket Premium untuk diterbitkan.`],
  ["Paket undangan itu per apa?", "Per satu undangan (sekali bayar). Undangan lain bisa memakai paket berbeda."],
  ["Sudah Basic, mau pindah ke Premium?", `Cukup bayar selisihnya lewat paket Upgrade (${formatRupiah(PLANS["upgrade-premium"].price)}).`],
];

export default function HargaPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <section className="relative">
          <div className="bg-dots absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          <div className="mx-auto max-w-6xl px-4 pb-8 pt-16 text-center">
            <span className="eyebrow">Harga</span>
            <h1 className="font-display mx-auto mt-5 max-w-3xl text-5xl font-extrabold leading-tight">Bayar sekali untuk undangan, langganan untuk bisnis</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-app-muted">Mulai gratis, upgrade kapan saja. Pembayaran mudah lewat DANA.</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="flex items-center gap-3">
            <AppIcon name="undangan" size={40} />
            <div>
              <h2 className="font-display text-2xl font-extrabold">Undangan Digital</h2>
              <p className="text-sm text-app-muted">Sekali bayar per undangan</p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {INVITATION.map((p) => (
              <div key={p.key} className={`card relative flex flex-col p-6 ${p.highlight ? "ring-2 ring-brand" : ""}`}>
                {p.highlight && <span className="bg-grad absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-bold text-white">Paling laris</span>}
                <h3 className="font-display text-lg font-bold">{p.name}</h3>
                <p className="font-display mt-3 text-3xl font-extrabold">{p.price}</p>
                <p className="text-sm text-app-muted">{p.period}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-brand">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {p.cta.external ? (
                  <a href={p.cta.href} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-6">
                    {p.cta.label}
                  </a>
                ) : (
                  <Link href={p.cta.href} className={`mt-6 ${p.highlight ? "btn-brand" : "btn-primary"}`}>
                    {p.cta.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="pro" className="border-y border-app-line bg-white/70">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <AppIcon name="proposal" size={40} />
                <AppIcon name="portofolio" size={40} />
              </div>
              <h2 className="font-display mt-4 text-3xl font-extrabold">Safantara Pro</h2>
              <p className="mt-2 text-app-muted">Untuk freelancer, pebisnis, dan EO yang sering membuat proposal & portofolio. Paket Gratis: 1 portofolio/proposal terbit dengan watermark.</p>
              <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-brand">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["pro-bulanan", "pro-tahunan"] as const).map((k) => (
                <div key={k} className={`card flex flex-col p-6 ${k === "pro-tahunan" ? "ring-2 ring-brand" : ""}`}>
                  <p className="font-bold">{k === "pro-bulanan" ? "Bulanan" : "Tahunan"}</p>
                  <p className="font-display mt-2 text-3xl font-extrabold">{formatRupiah(PLANS[k].price)}</p>
                  <p className="text-sm text-app-muted">{PLANS[k].period}</p>
                  {k === "pro-tahunan" && <p className="mt-1 text-xs font-bold text-green-700">Hemat ±25%</p>}
                  <Link href={`/bayar?paket=${k}`} className={`mt-5 ${k === "pro-tahunan" ? "btn-brand" : "btn-primary"}`}>
                    Langganan
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="font-display text-center text-2xl font-extrabold">Pertanyaan umum</h2>
          <div className="mt-6 space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="text-app-muted transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm text-app-muted">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-app-muted">
            Butuh paket reseller untuk WO/EO? Hubungi WhatsApp {CONTACT.whatsappDisplay} atau {CONTACT.email}.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
