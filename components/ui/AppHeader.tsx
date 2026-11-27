import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { backend } from "@/lib/backend";

/** Logo Safantara: monogram S dari dua lengkung + bintang kecil, di atas gradasi koral. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id="safantara-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8A3D" />
          <stop offset=".5" stopColor="#F0532D" />
          <stop offset="1" stopColor="#D9365E" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#safantara-g)" />
      <path d="M26.5 13.2c-1.6-1.6-3.9-2.4-6.4-2.4-4 0-6.9 2.1-6.9 5.2 0 3.2 2.8 4.3 6.4 5.1 3.3.8 4.6 1.4 4.6 2.9 0 1.6-1.8 2.7-4.3 2.7-2.4 0-4.4-.9-5.9-2.4" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M30 6.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="#FFE1A8" />
    </svg>
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Utama">
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
            <details className="group relative">
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
        <details className="group relative md:hidden">
          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl border border-app-line bg-white text-lg [&::-webkit-details-marker]:hidden" aria-label="Menu">
            <span className="group-open:hidden">☰</span>
            <span className="hidden group-open:inline">✕</span>
          </summary>
          <div className="card absolute right-0 mt-2 w-64 p-2">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2.5 font-semibold hover:bg-app-soft">
                {n.label}
              </Link>
            ))}
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
