import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-24 text-center">
      <div>
        <p className="text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 text-2xl font-extrabold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-app-muted">Portofolio ini mungkin belum dipublikasikan atau alamatnya salah.</p>
        <Link href="/" className="btn-primary mt-6">
          Ke beranda
        </Link>
      </div>
    </main>
  );
}
