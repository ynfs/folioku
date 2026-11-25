"use client";

import { useState } from "react";
import { deleteProjectAction } from "@/app/actions";

// Hapus dua langkah tanpa dialog browser: klik "Hapus" lalu "Yakin hapus?".
export function DeleteProjectButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button type="button" className="btn-ghost" onClick={() => setConfirming(true)}>
        Hapus
      </button>
    );
  }
  return (
    <form action={deleteProjectAction} className="flex gap-2">
      <input type="hidden" name="id" value={id} />
      <button className="btn bg-red-600 text-white hover:bg-red-700 inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold">
        Yakin hapus?
      </button>
      <button type="button" className="btn-ghost" onClick={() => setConfirming(false)}>
        Batal
      </button>
    </form>
  );
}
