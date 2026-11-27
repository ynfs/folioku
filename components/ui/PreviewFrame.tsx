"use client";

import { useState } from "react";
import { SiteProvider } from "@/components/sections/site-context";
import { Portfolio } from "@/lib/renderer/Portfolio";
import type { PortfolioData } from "@/lib/types";

const DEVICES = [
  { id: "desktop", label: "Desktop", width: 1200 },
  { id: "tablet", label: "Tablet", width: 768 },
  { id: "mobile", label: "HP", width: 390 },
] as const;

/** Pratinjau template dalam bingkai perangkat yang bisa diganti. */
export function PreviewFrame({ data, description }: { data: PortfolioData; description: string }) {
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("desktop");
  const width = DEVICES.find((d) => d.id === device)!.width;
  const phone = device === "mobile";

  return (
    <main className="flex-1 px-4 py-8">
      <div className="mx-auto mb-6 flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-app-muted">{description}</p>
        <div className="flex rounded-xl border border-app-line bg-white p-1 shadow-soft" role="tablist" aria-label="Ukuran layar">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={device === d.id}
              onClick={() => setDevice(d.id)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${device === d.id ? "bg-app-fg text-white" : "text-app-muted hover:text-app-fg"}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
      <div
        className={`mx-auto overflow-hidden bg-white shadow-lift transition-[width] duration-500 ${phone ? "rounded-[2.2rem] border-[10px] border-app-fg" : "rounded-2xl border border-app-line"}`}
        style={{ width, maxWidth: "100%" }}
        onClickCapture={(e) => {
          // Pratinjau: tautan di dalam template tidak berpindah halaman.
          if ((e.target as HTMLElement).closest("a")) e.preventDefault();
        }}
      >
        {!phone && (
          <div className="flex items-center gap-1.5 border-b border-app-line bg-app-soft px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            <span className="ml-3 rounded-md bg-white px-3 py-0.5 text-[11px] text-app-muted">pratinjau template</span>
          </div>
        )}
        <SiteProvider value={{ slug: null, guest: "", editing: true }}>
          <Portfolio data={data} />
        </SiteProvider>
      </div>
    </main>
  );
}
