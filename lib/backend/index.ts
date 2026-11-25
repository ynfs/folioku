import "server-only";
import { redirect } from "next/navigation";
import { localBackend } from "./local";
import { supabaseBackend } from "./supabase";
import type { Backend } from "./types";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/** Backend aktif: Supabase jika variabelnya diisi, selain itu mode lokal. */
export const backend: Backend = isSupabaseConfigured ? supabaseBackend : localBackend;

/** Mengambil pengguna yang login, atau mengarahkan ke halaman login. */
export async function requireUser(next?: string) {
  const user = await backend.getCurrentUser();
  if (!user) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  return user;
}
