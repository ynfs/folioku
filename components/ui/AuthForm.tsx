"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, signUpAction } from "@/app/actions";

export function AuthForm({ mode, next }: { mode: "login" | "daftar"; next?: string }) {
  const isSignUp = mode === "daftar";
  const [state, action, pending] = useActionState(isSignUp ? signUpAction : signInAction, undefined);

  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      {isSignUp && (
        <div>
          <label className="label" htmlFor="name">
            Nama
          </label>
          <input id="name" name="name" className="input" autoComplete="name" required />
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" className="input" autoComplete="email" required />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password {isSignUp && <span className="font-normal">(minimal 8 karakter)</span>}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={isSignUp ? 8 : undefined}
          required
        />
      </div>
      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button className="btn-brand w-full py-2.5" disabled={pending}>
        {pending ? "Memproses…" : isSignUp ? "Buat akun" : "Masuk"}
      </button>
      <p className="text-center text-sm text-app-muted">
        {isSignUp ? "Sudah punya akun? " : "Belum punya akun? "}
        <Link
          href={`/${isSignUp ? "login" : "daftar"}${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-app-fg underline"
        >
          {isSignUp ? "Masuk" : "Daftar"}
        </Link>
      </p>
    </form>
  );
}
