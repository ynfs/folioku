import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/ui/AuthForm";
import { backend } from "@/lib/backend";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage(props: PageProps<"/login">) {
  const { next } = await props.searchParams;
  if (await backend.getCurrentUser()) redirect("/dashboard");
  return (
    <>
      <h1 className="font-display mb-1 text-3xl font-extrabold">Selamat datang kembali</h1>
      <p className="mb-6 text-sm text-app-muted">Masuk untuk melanjutkan undangan, proposal, atau portofoliomu.</p>
      <AuthForm mode="login" next={typeof next === "string" ? next : undefined} />
    </>
  );
}
