"use client";

import { useState } from "react";
import { deleteTemplateAction } from "@/app/actions";

// Hapus dua langkah tanpa dialog browser.
export function DeleteTemplateButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button type="button" className="btn-ghost text-red-600" onClick={() => setConfirming(true)}>
        Hapus
      </button>
    );
  }
  return (
    <form action={deleteTemplateAction} className="flex gap-2">
      <input type="hidden" name="id" value={id} />
      <button className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">Yakin hapus?</button>
      <button type="button" className="btn-ghost" onClick={() => setConfirming(false)}>
        Batal
      </button>
    </form>
  );
}
