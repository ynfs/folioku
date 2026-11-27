import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { KARYA, SAFANTARA_APPS } from "@/lib/apps";
import { backend } from "@/lib/backend";
import { AppIcon } from "./AppIcons";
import { KaryaLogo } from "./KaryaLogo";
import { MenuAutoClose } from "./MenuAutoClose";

/** Logo Safantara: monogram S + bintang kecil di atas gradasi koral (gradasi via CSS, tanpa id SVG). */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0"
      style={{ width: size, height: size, borderRadius: size * 0.275, background: "linear-gradient(135deg, #FF8A3D, #F0532D 50%, #D9365E)" }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40">
        <path d="M26.5 13.2c-1.6-1.6-3.9-2.4-6.4-2.4-4 0-6.9 2.1-6.9 5.2 0 3.2 2.8 4.3 6.4 5.1 3.3.8 4.6 1.4 4.6 2.9 0 1.6-1.8 2.7-4.3 2.7-2.4 0-4.4-.9-5.9-2.4" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M30 6.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="#FFE1A8" />
      </svg>
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label="Safantara — beranda">
      <LogoMark />
      <span className="font-display text-xl font-extrabold tracking-tight">Safantara</span>
    </Link>
  );
}

const NAV = [
  { href: "/templates?jenis=undangan", label: "Undangan" },
  { href: "/templates?jenis=proposal", label: "Proposal" },
  { href: "/templates?jenis=portofolio", label: "Portofolio" },
];

export async function AppHeader() {
  const user = await backend.getCurrentUser();
  const initial = (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();
  const link = "rounded-xl px-3 py-2 text-sm font-semibold text-app-fg/80 transition hover:bg-app-soft hover:text-app-fg";

  return (
    <header className="sticky top-0 z-40 border-b border-app-line/70 bg-app-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-app-bg/65">
      <MenuAutoClose />
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Utama">
          {/* Menu Aplikasi (panel besar) */}
          <details data-menu className="group">
            <summary className={`${link} flex cursor-pointer list-none items-center gap-1 [&::-webkit-details-marker]:hidden`}>
              Aplikasi <span className="text-app-muted transition group-open:rotate-180">▾</span>
            </summary>
            <div className="card absolute left-1/2 top-full mt-2 w-[min(860px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden p-0">
              <div className="grid md:grid-cols-[1.5fr_1fr]">
                <div className="p-5">
                  <p className="px-2 text-xs font-bold uppercase tracking-[0.16em] text-app-muted">Aplikasi Safantara</p>
                  <ul className="mt-3 grid grid-cols-2 gap-1">
                    {SAFANTARA_APPS.map((a) => (
                      <li key={a.key}>
                        <Link href={a.href} className="flex gap-3 rounded-xl p-2.5 transition hover:bg-app-soft">
                          <AppIcon name={a.icon} size={38} />
                          <span className="min-w-0">
                            <span className="block text-sm font-bold">{a.title}</span>
                            <span className="block text-xs leading-snug text-app-muted">{a.desc}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-app-line bg-app-soft/60 p-5 md:border-l md:border-t-0">
                  <p className="px-2 text-xs font-bold uppercase tracking-[0.16em] text-app-muted">Karya kami</p>
                  <ul className="mt-3 space-y-1">
                    {KARYA.map((k) => (
                      <li key={k.key}>
                        {k.url ? (
                          <a href={k.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white">
                            <KaryaLogo karya={k} size={34} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-bold">{k.name}</span>
                              <span className="block truncate text-xs text-app-muted">{k.category}</span>
                            </span>
                            <span className="text-xs text-app-muted">↗</span>
                          </a>
                        ) : (
                          <span className="flex items-center gap-3 rounded-xl p-2 opacity-80">
                            <KaryaLogo karya={k} size={34} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-bold">{k.name}</span>
                              <span className="block truncate text-xs text-app-muted">{k.category}</span>
                            </span>
                            <span className="chip">segera</span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <Link href="/aplikasi" className="mt-3 block rounded-xl px-2 py-2 text-sm font-bold text-brand hover:bg-white">
                    Lihat semua aplikasi & karya →
                  </Link>
                </div>
              </div>
            </div>
          </details>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={link}>
              {n.label}
            </Link>
          ))}
          {user && (
            <Link href="/dashboard" className={link}>
              Dashboard
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" className={link}>
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <details data-menu className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-app-line bg-white py-1 pl-1 pr-3 text-sm font-semibold shadow-soft [&::-webkit-details-marker]:hidden">
                <span className="bg-grad grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white">{initial}</span>
                <span className="max-w-32 truncate">{user.name || "Akun"}</span>
                <span className="text-app-muted transition group-open:rotate-180">▾</span>
              </summary>
              <div className="card absolute right-0 mt-2 w-56 p-2">
                <p className="truncate px-3 py-2 text-xs text-app-muted">{user.email}</p>
                <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-app-soft">
                  Dashboard
                </Link>
                <Link href="/templates" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-app-soft">
                  Buat baru
                </Link>
                <form action={signOutAction}>
                  <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50">Keluar</button>
                </form>
              </div>
            </details>
          ) : (
            <>
              <Link href="/login" className={link}>
                Masuk
              </Link>
              <Link href="/daftar" className="btn-brand">
                Mulai gratis
              </Link>
            </>
          )}
        </div>

        {/* Menu HP */}
        <details data-menu className="group relative md:hidden">
          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl border border-app-line bg-white text-lg [&::-webkit-details-marker]:hidden" aria-label="Menu">
            <span className="group-open:hidden">☰</span>
            <span className="hidden group-open:inline">✕</span>
          </summary>
          <div className="card absolute right-0 mt-2 max-h-[80vh] w-72 overflow-y-auto p-2">
            <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-app-muted">Aplikasi</p>
            {SAFANTARA_APPS.map((a) => (
              <Link key={a.key} href={a.href} className="flex items-center gap-3 rounded-lg px-2 py-2 font-semibold hover:bg-app-soft">
                <AppIcon name={a.icon} size={30} />
                <span className="text-sm">{a.title}</span>
              </Link>
            ))}
            <p className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-app-muted">Karya kami</p>
            {KARYA.map((k) =>
              k.url ? (
                <a key={k.key} href={k.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-2 py-2 font-semibold hover:bg-app-soft">
                  <KaryaLogo karya={k} size={30} />
                  <span className="text-sm">{k.name}</span>
                </a>
              ) : (
                <span key={k.key} className="flex items-center gap-3 px-2 py-2 text-sm font-semibold opacity-75">
                  <KaryaLogo karya={k} size={30} />
                  {k.name} <span className="chip">segera</span>
                </span>
              ),
            )}
            <Link href="/aplikasi" className="block rounded-lg px-3 py-2 text-sm font-bold text-brand hover:bg-app-soft">
              Semua aplikasi →
            </Link>
            <div className="my-2 border-t border-app-line" />
            {user ? (
              <>
                <Link href="/dashboard" className="block rounded-lg px-3 py-2.5 font-semibold hover:bg-app-soft">
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="block rounded-lg px-3 py-2.5 font-semibold hover:bg-app-soft">
                    Admin
                  </Link>
                )}
                <form action={signOutAction}>
                  <button className="w-full rounded-lg px-3 py-2.5 text-left font-semibold text-red-600 hover:bg-red-50">Keluar</button>
                </form>
              </>
            ) : (
              <div className="grid gap-2 p-1">
                <Link href="/login" className="btn-ghost">
                  Masuk
                </Link>
                <Link href="/daftar" className="btn-brand">
                  Mulai gratis
                </Link>
              </div>
            )}
          </div>
        </details>
      </div>
    </header>
  );
}
