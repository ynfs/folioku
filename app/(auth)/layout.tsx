import { Logo } from "@/components/ui/AppHeader";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { getTemplate } from "@/lib/templates";

const COLLAGE = ["tpl-adat-jawa", "prop-pitch-deck-01", "tpl-retro-ultah", "kol-pernikahan-02", "tpl-retro-company", "prop-sponsorship-01"];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const thumbs = COLLAGE.map((id) => getTemplate(id)).filter((t) => t !== undefined);
  return (
    <main className="grid min-h-screen flex-1 lg:grid-cols-[1.05fr_1fr]">
      {/* Panel merek */}
      <aside className="bg-grad relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-black/10" aria-hidden />
        <div className="relative rounded-2xl bg-white/95 px-4 py-2 text-app-fg shadow-lift w-fit">
          <Logo />
        </div>
        <div className="relative mt-auto">
          <h2 className="font-display max-w-md text-4xl font-extrabold leading-tight">Undangan, proposal &amp; portofolio — sekali klik jadi.</h2>
          <p className="mt-3 max-w-sm text-white/85">Ratusan template siap pakai, editor ala Figma, dan link yang bisa langsung dibagikan.</p>
        </div>
        <div className="relative mt-10 grid grid-cols-3 gap-3 [transform:rotate(-4deg)_translateX(-4%)]" aria-hidden>
          {thumbs.map((t, i) => (
            <div key={t.id} className={`overflow-hidden rounded-xl border-4 border-white/80 shadow-lift ${i % 2 ? "translate-y-6" : ""}`}>
              <PortfolioThumb data={t} height={150} scale={0.16} maxSections={1} />
            </div>
          ))}
        </div>
      </aside>

      {/* Formulir */}
      <section className="bg-dots flex flex-col items-center justify-center px-4 py-14">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <div className="card w-full max-w-sm p-7">{children}</div>
        <p className="mt-6 text-xs text-app-muted">Dengan mendaftar, kamu menyetujui penggunaan data untuk menjalankan layanan ini.</p>
      </section>
    </main>
  );
}
