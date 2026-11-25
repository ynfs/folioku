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
      <h1 className="mb-1 text-xl font-extrabold">Masuk</h1>
      <p className="mb-6 text-sm text-app-muted">Lanjutkan mengedit portofolio kamu.</p>
      <AuthForm mode="login" next={typeof next === "string" ? next : undefined} />
    </>
  );
}
