import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { backend } from "@/lib/backend";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
      <span className="grid h-7 w-7 place-items-center rounded-md bg-brand text-sm text-white">S</span>
      Safantara
    </Link>
  );
}

export async function AppHeader() {
  const user = await backend.getCurrentUser();
  return (
    <header className="border-b border-app-line bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/templates" className="rounded-lg px-3 py-2 font-semibold hover:bg-app-bg">
            Template
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="rounded-lg px-3 py-2 font-semibold hover:bg-app-bg">
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="rounded-lg px-3 py-2 font-semibold hover:bg-app-bg">
                  Admin
                </Link>
              )}
              <form action={signOutAction}>
                <button className="btn-ghost" title={user.email}>
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 font-semibold hover:bg-app-bg">
                Masuk
              </Link>
              <Link href="/daftar" className="btn-primary">
                Daftar gratis
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
