/* eslint-disable @next/next/no-img-element -- ilustrasi SVG lokal */
import Link from "next/link";
import { AppHeader, LogoMark } from "@/components/ui/AppHeader";
import { AppIcon, type AppIconName } from "@/components/ui/AppIcons";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { CONTACT, mailLink, waLink } from "@/lib/contact";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { CATEGORIES, TEMPLATES, getTemplate, kindOf } from "@/lib/templates";
import type { ProductKind, Template } from "@/lib/types";

// ---------------- Data tampilan ----------------
const count = (k: ProductKind) => TEMPLATES.filter((t) => kindOf(t) === k).length;
const pickTemplate = (id: string, fallback: ProductKind): Template => getTemplate(id) ?? TEMPLATES.find((t) => kindOf(t) === fallback)!;
const every = (k: ProductKind, step: number, n: number) => TEMPLATES.filter((t) => kindOf(t) === k).filter((_, i) => i % step === 0).slice(0, n);

const PRODUCTS: { kind: ProductKind; slug: string; title: string; text: string; points: string[]; icon: AppIconName; sample: string; tint: string }[] = [
  {
    kind: "invitation", slug: "undangan", title: "Undangan Digital", icon: "undangan", sample: "tpl-undangan-elegan", tint: "from-rose-100 to-amber-50",
    text: "Pernikahan, adat Nusantara, ulang tahun, khitanan, wisuda, hingga acara kantor.",
    points: ["Nama tamu otomatis di sampul", "RSVP & buku ucapan", "Amplop digital & musik"],
  },
  {
    kind: "proposal", slug: "proposal", title: "Proposal", icon: "proposal", sample: "prop-sponsorship-01", tint: "from-sky-100 to-emerald-50",
    text: "Penawaran jasa, sponsorship, kegiatan, kerja sama, pitch deck, dan hibah.",
    points: ["Anggaran + PPN otomatis", "Persetujuan klien online", "Unduh sebagai PDF"],
  },
  {
    kind: "portfolio", slug: "portofolio", title: "Portofolio & Company Profile", icon: "portofolio", sample: "tpl-retro-company", tint: "from-violet-100 to-orange-50",
    text: "Situs pribadi, studio kreatif, UMKM, kafe, klinik, hingga sekolah.",
    points: ["Multi-halaman", "Galeri & proyek", "Desain bebas ala Figma"],
  },
];

const FAQ: [string, string][] = [
  ["Apakah saya perlu bisa coding?", "Tidak sama sekali. Pilih template, klik bagian yang ingin diubah, lalu ketik. Semuanya tersimpan otomatis."],
  ["Bagaimana cara mengirim undangan ke tamu?", "Di dashboard, ketik daftar nama tamu. Setiap tamu mendapat link dengan namanya sendiri dan tombol kirim WhatsApp sekali klik."],
  ["Apakah proposal bisa diunduh sebagai PDF?", "Bisa. Halaman proposal punya tombol Unduh PDF dengan tata letak cetak yang rapi, lengkap dengan blok tanda tangan."],
  ["Bisakah saya mengubah isi setelah dipublikasikan?", "Bisa kapan saja. Perubahan yang tersimpan langsung tampil di link yang sudah dibagikan."],
  ["Apakah bisa memakai domain sendiri?", "Saat ini setiap halaman memakai alamat Safantara (/p/nama-kamu). Dukungan domain sendiri sedang dikembangkan."],
  ["Saya ingin desain yang benar-benar khusus. Bisa?", `Bisa. Untuk custom profil, undangan, atau proposal sesuai keinginan, hubungi kami lewat WhatsApp ${CONTACT.whatsappDisplay} atau email ${CONTACT.email}.`],
];

export default function Home() {
  const heroDesk = pickTemplate("tpl-adat-jawa", "invitation");
  const heroPhone = pickTemplate("prop-penawaran-02", "proposal");
  const heroPhone2 = pickTemplate("tpl-retro-pernikahan", "invitation");
  const row1 = [...every("invitation", 6, 8), ...every("proposal", 12, 4)];
  const row2 = [...every("portfolio", 4, 7), ...every("proposal", 9, 5)];
  const adat = CATEGORIES.find((c) => c.value === "adat");

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-x-clip">
        {/* ================= HERO ================= */}
        <section className="relative">
          <div className="bg-dots absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          <div className="absolute -top-32 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_138_61/0.28),transparent)] blur-2xl" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
            <div className="animate-rise">
              <span className="eyebrow">✦ {TEMPLATES.length} template siap pakai</span>
              <h1 className="font-display mt-5 text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
                Buat <span className="text-grad">undangan</span>, proposal &amp; portofolio yang memukau.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-app-muted">
                Pilih template, edit langsung seperti di Figma, lalu bagikan link. Terima RSVP tamu dan persetujuan klien — tanpa menulis satu baris kode pun.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/daftar" className="btn-brand btn-lg">
                  Mulai gratis →
                </Link>
                <Link href="/templates?jenis=undangan" className="btn-ghost btn-lg">
                  Jelajahi template
                </Link>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
                {[
                  [String(TEMPLATES.length), "template"],
                  ["3", "produk"],
                  ["0", "baris kode"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <dt className="font-display text-3xl font-extrabold">{n}</dt>
                    <dd className="text-sm text-app-muted">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Mockup perangkat */}
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none" aria-hidden>
              <div className="animate-rise rounded-2xl border border-app-line bg-white p-2 shadow-lift [animation-delay:120ms]">
                <div className="flex items-center gap-1.5 px-2 pb-2 pt-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 flex-1 truncate rounded-md bg-app-soft px-3 py-1 text-[11px] text-app-muted">/p/raras-bagas?to=Keluarga Budi</span>
                </div>
                <div className="overflow-hidden rounded-xl">
                  <PortfolioThumb data={heroDesk} height={330} scale={0.42} maxSections={2} />
                </div>
              </div>
              <div className="animate-float absolute -bottom-10 -left-4 w-[34%] rounded-[1.8rem] border-[6px] border-app-fg bg-app-fg shadow-lift sm:-left-10">
                <div className="overflow-hidden rounded-[1.3rem]">
                  <PortfolioThumb data={heroPhone} height={300} designWidth={390} scale={0.48} maxSections={2} />
                </div>
              </div>
              <div className="animate-float absolute -right-3 -top-8 hidden w-[28%] rounded-[1.6rem] border-[6px] border-white bg-white shadow-lift [animation-delay:1.5s] sm:block">
                <div className="overflow-hidden rounded-[1.15rem]">
                  <PortfolioThumb data={heroPhone2} height={230} designWidth={390} scale={0.4} maxSections={1} />
                </div>
              </div>
              {/* Lencana mengambang */}
              <div className="card animate-float absolute -right-2 bottom-6 flex items-center gap-2 px-3 py-2 text-xs font-semibold [animation-delay:.8s] sm:-right-8">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
                Proposal disetujui · PT Maju Jaya
              </div>
              <div className="card animate-float absolute left-[30%] -top-5 flex items-center gap-2 px-3 py-2 text-xs font-semibold [animation-delay:2.2s]">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-100 text-rose-600">♥</span>
                Budi &amp; keluarga akan hadir
              </div>
            </div>
          </div>
        </section>

        {/* ================= PRODUK ================= */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Tiga produk, satu editor</span>
            <h2 className="font-display mt-4 text-4xl font-extrabold sm:text-5xl">Semua yang kamu butuhkan untuk tampil profesional</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PRODUCTS.map((p) => {
              const sample = pickTemplate(p.sample, p.kind);
              return (
                <article key={p.kind} className="card card-hover group relative flex flex-col overflow-hidden">
                  <div className={`relative bg-gradient-to-br ${p.tint} p-5 pb-0`}>
                    <div className="overflow-hidden rounded-t-xl border border-b-0 border-white/70 shadow-soft">
                      <PortfolioThumb data={sample} height={170} scale={0.27} maxSections={1} />
                    </div>
                    <span className="absolute left-5 top-5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold shadow-soft">{count(p.kind)} template</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <AppIcon name={p.icon} size={44} />
                      <h3 className="font-display text-xl font-bold">{p.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-app-muted">{p.text}</p>
                    <ul className="mt-4 flex-1 space-y-1.5 text-sm">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex gap-2">
                          <span className="text-brand">✓</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                    {/* Tautan dibentangkan menutupi kartu (bukan membungkus thumbnail yang berisi link) */}
                    <Link href={`/templates?jenis=${p.slug}`} className="mt-6 text-sm font-bold text-brand transition after:absolute after:inset-0 group-hover:translate-x-1">
                      Lihat template →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ================= PITA TEMPLATE ================= */}
        <section className="py-10" aria-label="Contoh template">
          <div className="group space-y-5 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            {[row1, row2].map((row, r) => (
              <div key={r} className={`flex w-max gap-5 ${r ? "animate-marquee-rev" : "animate-marquee"} group-hover:[animation-play-state:paused]`}>
                {[...row, ...row].map((t, i) => (
                  <div key={`${t.id}-${i}`} className="card card-hover relative w-64 shrink-0 overflow-hidden">
                    <PortfolioThumb data={t} height={150} scale={0.2} maxSections={1} />
                    <Link
                      href={`/templates/${t.id}`}
                      tabIndex={i >= row.length ? -1 : undefined}
                      className="block truncate border-t border-app-line px-3 py-2 text-xs font-semibold after:absolute after:inset-0"
                    >
                      {t.name}
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ================= FITUR (bento) ================= */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Fitur</span>
            <h2 className="font-display mt-4 text-4xl font-extrabold sm:text-5xl">Dibuat untuk hasil yang rapi, cepat, dan berkesan</h2>
          </div>
          {/* Font Aksara Jawa untuk kartu fitur; React 19 memindahkan <link precedence> ke <head>. */}
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Javanese&display=swap" precedence="default" />
          <div className="mt-12 grid auto-rows-[minmax(200px,auto)] gap-5 md:grid-cols-6">
            {/* Editor ala Figma */}
            <div className="card relative overflow-hidden p-6 md:col-span-4 md:row-span-2">
              <h3 className="font-display text-2xl font-bold">Editor bebas ala Figma</h3>
              <p className="mt-2 max-w-md text-sm text-app-muted">Geser, ubah ukuran, putar, garis bantu snap, layer, dan ketik langsung di kanvas. Undo/redo dan simpan otomatis.</p>
              <div className="bg-dots relative mt-6 h-64 rounded-xl border border-app-line bg-app-soft" aria-hidden>
                <div className="absolute left-[8%] top-[18%] h-24 w-24 rounded-full bg-[#F0532D]/85" />
                <div className="absolute left-[40%] top-[22%] w-[44%] rounded-lg bg-white p-4 shadow-soft">
                  <div className="h-3 w-3/4 rounded bg-app-fg/80" />
                  <div className="mt-2 h-2 w-full rounded bg-app-fg/20" />
                  <div className="mt-1.5 h-2 w-5/6 rounded bg-app-fg/20" />
                  <div className="bg-grad mt-4 h-6 w-24 rounded-full" />
                </div>
                <div className="absolute left-[39.3%] top-[19.5%] h-[58%] w-[45.5%] border-2 border-[#0d99ff]">
                  {["-left-1.5 -top-1.5", "-right-1.5 -top-1.5", "-left-1.5 -bottom-1.5", "-right-1.5 -bottom-1.5"].map((p) => (
                    <span key={p} className={`absolute ${p} h-3 w-3 border-2 border-[#0d99ff] bg-white`} />
                  ))}
                  <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 rounded bg-[#0d99ff] px-1.5 py-0.5 text-[10px] font-bold text-white">480 × 220</span>
                </div>
                <div className="absolute bottom-[14%] left-[8%] right-[8%] h-px bg-[#ff3d71]" />
                <div className="absolute left-3 top-3 flex gap-1 rounded-lg bg-[#1e1e1e] p-1 text-[10px] font-semibold text-white">
                  {["T Teks", "▣ Gambar", "◆ Bentuk", "▭ Tombol"].map((x) => (
                    <span key={x} className="rounded px-1.5 py-0.5">
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Personalisasi */}
            <div className="card p-6 md:col-span-2">
              <h3 className="font-display text-lg font-bold">Link pribadi per tamu & klien</h3>
              <p className="mt-1 text-sm text-app-muted">Nama muncul otomatis di sampul.</p>
              <div className="mt-4 space-y-2 text-xs" aria-hidden>
                {["?to=Keluarga Budi", "?to=PT Maju Jaya", "?to=Ibu Ratna"].map((x) => (
                  <div key={x} className="flex items-center justify-between rounded-lg bg-app-soft px-3 py-2 font-mono">
                    <span className="truncate">/p/raras-bagas{x}</span>
                    <span className="ml-2 rounded bg-[#25D366] px-1.5 py-0.5 font-sans text-[10px] font-bold text-white">WA</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Anggaran */}
            <div className="card p-6 md:col-span-2">
              <h3 className="font-display text-lg font-bold">Anggaran otomatis</h3>
              <p className="mt-1 text-sm text-app-muted">Subtotal, PPN, dan total dihitung sendiri.</p>
              <div className="mt-4 overflow-hidden rounded-lg border border-app-line text-xs" aria-hidden>
                {[
                  ["Perencanaan", "Rp 2.500.000"],
                  ["Pelaksanaan", "Rp 12.000.000"],
                  ["PPN 11%", "Rp 1.595.000"],
                ].map(([a, b]) => (
                  <div key={a} className="flex justify-between border-b border-app-line px-3 py-1.5">
                    <span>{a}</span>
                    <span className="tabular-nums">{b}</span>
                  </div>
                ))}
                <div className="flex justify-between bg-app-soft px-3 py-2 font-bold">
                  <span>Total</span>
                  <span className="tabular-nums">Rp 16.095.000</span>
                </div>
              </div>
            </div>
            {/* RSVP & persetujuan */}
            <div className="card p-6 md:col-span-2">
              <h3 className="font-display text-lg font-bold">RSVP & persetujuan</h3>
              <p className="mt-1 text-sm text-app-muted">Pantau respon di dashboard, unduh CSV.</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center" aria-hidden>
                {[
                  ["128", "Hadir", "bg-emerald-50 text-emerald-700"],
                  ["12", "Ragu", "bg-amber-50 text-amber-700"],
                  ["9", "Absen", "bg-rose-50 text-rose-700"],
                ].map(([n, l, c]) => (
                  <div key={l} className={`rounded-xl py-3 ${c}`}>
                    <p className="font-display text-2xl font-extrabold">{n}</p>
                    <p className="text-[11px] font-semibold">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Aksara Jawa */}
            <div className="card relative overflow-hidden p-6 md:col-span-2">
              <h3 className="font-display text-lg font-bold">Aksara Jawa asli</h3>
              <p className="mt-1 text-sm text-app-muted">Ketik huruf Latin, ubah jadi Hanacaraka.</p>
              <p className="mt-4 text-3xl text-[#8C6A2F]" style={{ fontFamily: '"Noto Sans Javanese", serif' }} lang="jv">
                ꦱꦸꦒꦼꦁꦫꦮꦸꦃ
              </p>
              <p className="text-xs text-app-muted">sugeng rawuh</p>
            </div>
            {/* PDF & multi-halaman */}
            <div className="card p-6 md:col-span-2">
              <h3 className="font-display text-lg font-bold">Multi-halaman & PDF</h3>
              <p className="mt-1 text-sm text-app-muted">Tombol bisa membuka halaman atau bagian lain. Proposal siap dicetak.</p>
              <div className="mt-4 flex items-end gap-2" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-20 flex-1 rounded-lg border border-app-line bg-white p-2 shadow-soft" style={{ transform: `rotate(${(i - 1) * 4}deg)` }}>
                    <div className="h-2 w-2/3 rounded bg-app-fg/70" />
                    <div className="mt-1.5 h-1.5 w-full rounded bg-app-fg/15" />
                    <div className="mt-1 h-1.5 w-4/5 rounded bg-app-fg/15" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= LANGKAH ================= */}
        <section className="border-y border-app-line bg-white/70">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Cara kerja</span>
              <h2 className="font-display mt-4 text-4xl font-extrabold sm:text-5xl">Jadi dalam hitungan menit</h2>
            </div>
            <ol className="relative mt-14 grid gap-10 md:grid-cols-3">
              <div className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-gradient-to-r from-transparent via-app-line to-transparent md:block" aria-hidden />
              {[
                ["Pilih template", `Lebih dari ${TEMPLATES.length} desain dalam ${CATEGORIES.length} kategori dan 14 gaya.`],
                ["Ubah sesukamu", "Teks, foto, warna, font, susunan bagian — semuanya bisa diedit."],
                ["Bagikan & pantau", "Kirim link lewat WhatsApp, lalu pantau respon di dashboard."],
              ].map(([t, d], i) => (
                <li key={t} className="relative text-center">
                  <span className="bg-grad font-display mx-auto grid h-14 w-14 place-items-center rounded-2xl text-xl font-extrabold text-white shadow-[0_10px_24px_-10px_rgb(240_83_45/0.8)]">{i + 1}</span>
                  <h3 className="font-display mt-5 text-xl font-bold">{t}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-app-muted">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= ADAT NUSANTARA ================= */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#1d120a] px-8 py-14 text-white sm:px-14">
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url(/ornamen/jawa-klasik-cover.svg)", backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden />
            <div className="relative grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
              <div>
                <span className="inline-flex rounded-full border border-[#D9B061]/40 bg-[#D9B061]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#E9C77A]">Kekayaan Nusantara</span>
                <h2 className="font-display mt-4 text-4xl font-extrabold sm:text-5xl">Undangan adat dengan sentuhan yang autentik</h2>
                <p className="mt-4 max-w-lg text-white/75">
                  Gunungan, motif kawung, songket, gorga, hingga Aksara Jawa — lengkap dengan susunan prosesi adat dan dress code.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Jawa", "Sunda", "Minang", "Bali", "Batak", "Betawi", "Melayu", "Bugis", "Sasak"].map((a) => (
                    <span key={a} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm">
                      {a}
                    </span>
                  ))}
                </div>
                <Link href="/templates?jenis=undangan&kategori=adat" className="btn btn-lg mt-8 bg-[#D9B061] text-[#1d120a] hover:-translate-y-px hover:bg-[#E9C77A]">
                  Lihat {adat?.label ?? "Pernikahan Adat"} →
                </Link>
              </div>
              <img src="/ornamen/gunungan.svg" alt="" className="animate-float mx-auto h-72 w-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
            </div>
          </div>
        </section>

        {/* ================= CUSTOM / KONTAK ================= */}
        <section id="custom" className="mx-auto max-w-6xl px-4 pb-20">
          <div className="card grid items-center gap-8 overflow-hidden p-8 sm:p-12 md:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow">Layanan custom</span>
              <h2 className="font-display mt-4 text-3xl font-extrabold sm:text-4xl">Butuh desain khusus untuk profilmu?</h2>
              <p className="mt-3 max-w-lg text-app-muted">
                Kami bantu buatkan profil, undangan, atau proposal custom sesuai keinginan — dari konsep, foto, hingga siap dibagikan.
              </p>
            </div>
            <div className="grid gap-3">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl border border-app-line bg-[#25D366]/5 p-4 transition hover:-translate-y-0.5 hover:border-[#25D366]/50 hover:shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#25D366] text-xl text-white" aria-hidden>
                  ✆
                </span>
                <span>
                  <span className="block text-xs font-semibold text-app-muted">WhatsApp</span>
                  <span className="font-display text-lg font-bold">{CONTACT.whatsappDisplay}</span>
                </span>
                <span className="ml-auto text-app-muted">→</span>
              </a>
              <a href={mailLink()} className="flex items-center gap-4 rounded-2xl border border-app-line bg-brand/5 p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-soft">
                <span className="bg-grad grid h-12 w-12 shrink-0 place-items-center rounded-xl text-xl text-white" aria-hidden>
                  ✉
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-app-muted">Email</span>
                  <span className="font-display block truncate text-lg font-bold">{CONTACT.email}</span>
                </span>
                <span className="ml-auto text-app-muted">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="mx-auto max-w-3xl px-4 pb-20">
          <h2 className="font-display text-center text-4xl font-extrabold">Pertanyaan umum</h2>
          <div className="mt-10 space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="card group p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-app-soft text-app-muted transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-app-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="bg-grad relative overflow-hidden rounded-[2rem] px-8 py-16 text-center text-white sm:px-16">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" aria-hidden />
            <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-black/10" aria-hidden />
            <div className="relative">
              <div className="mx-auto w-fit rounded-2xl bg-white/15 p-2 backdrop-blur">
                <LogoMark size={44} />
              </div>
              <h2 className="font-display mx-auto mt-6 max-w-2xl text-4xl font-extrabold sm:text-5xl">Siap membuat yang pertama?</h2>
              <p className="mx-auto mt-3 max-w-lg text-white/85">Daftar gratis dan pilih dari {TEMPLATES.length} template. Halamanmu bisa dibagikan hari ini juga.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/daftar" className="btn btn-lg bg-white text-app-fg shadow-lift hover:-translate-y-px">
                  Mulai gratis →
                </Link>
                <Link href="/templates" className="btn btn-lg border border-white/40 text-white hover:bg-white/10">
                  Lihat semua template
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
