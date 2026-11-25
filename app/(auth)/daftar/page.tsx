import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/ui/AuthForm";
import { backend } from "@/lib/backend";

export const metadata: Metadata = { title: "Daftar" };

export default async function DaftarPage(props: PageProps<"/daftar">) {
  const { next } = await props.searchParams;
  if (await backend.getCurrentUser()) redirect("/dashboard");
  return (
    <>
      <h1 className="mb-1 text-xl font-extrabold">Buat akun</h1>
      <p className="mb-6 text-sm text-app-muted">Gratis. Mulai buat portofolio dalam beberapa menit.</p>
      <AuthForm mode="daftar" next={typeof next === "string" ? next : undefined} />
    </>
  );
}
