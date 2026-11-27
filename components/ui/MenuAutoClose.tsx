"use client";

import { useEffect } from "react";

/**
 * Menutup menu <details data-menu> saat tautan di dalamnya diklik,
 * saat klik di luar menu, atau saat menekan Esc.
 */
export function MenuAutoClose() {
  useEffect(() => {
    const closeAll = (except?: Element | null) =>
      document.querySelectorAll<HTMLDetailsElement>("details[data-menu][open]").forEach((d) => {
        if (d !== except) d.open = false;
      });
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element;
      const menu = t.closest("details[data-menu]");
      if (!menu) return closeAll();
      if (t.closest("a, button[type=submit], form button")) closeAll();
      else closeAll(menu);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAll();
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return null;
}
