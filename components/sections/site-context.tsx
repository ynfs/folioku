"use client";

import { createContext, useContext, type ReactNode } from "react";

// Informasi situs untuk bagian interaktif (RSVP, sampul, musik).
export interface SiteInfo {
  /** Slug publik; null di editor atau saat belum terbit. */
  slug: string | null;
  /** Nama tamu dari link ?to=… */
  guest: string;
  /** true di editor: form tidak dikirim, musik tidak diputar otomatis. */
  editing: boolean;
}

const SiteContext = createContext<SiteInfo>({ slug: null, guest: "", editing: false });

export function SiteProvider({ value, children }: { value: SiteInfo; children: ReactNode }) {
  return <SiteContext value={value}>{children}</SiteContext>;
}

export const useSite = () => useContext(SiteContext);
