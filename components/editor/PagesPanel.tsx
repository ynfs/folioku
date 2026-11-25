"use client";

import { useState } from "react";
import { HOME, getPages } from "@/lib/pages";
import { IconBtn } from "./fields";
import { useEditor } from "./store";

// Daftar halaman portofolio (ala panel "Pages" di Figma).

export function PagesPanel({ siteBase }: { siteBase: string | null }) {
  const data = useEditor((s) => s.data);
  const current = useEditor((s) => s.page);
  const openPage = useEditor((s) => s.openPage);
  const addPage = useEditor((s) => s.addPage);
  const renamePage = useEditor((s) => s.renamePage);
  const setPageSlug = useEditor((s) => s.setPageSlug);
  const removePage = useEditor((s) => s.removePage);
  const pages = getPages(data);

  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function create() {
    const id = addPage(title || "Halaman baru");
    openPage(id);
    setAdding(false);
    setTitle("");
  }

  const active = pages.find((p) => p.id === current);

  return (
    <div className="border-b border-app-line">
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <p className="text-xs font-bold uppercase tracking-wider text-app-muted">Halaman</p>
        <IconBtn label="Tambah halaman" onClick={() => setAdding((v) => !v)}>
          +
        </IconBtn>
      </div>
      <ul className="max-h-48 space-y-0.5 overflow-y-auto px-2 pb-2">
        <PageRow label="Beranda" active={current === HOME} onClick={() => openPage(HOME)} icon="⌂" />
        {pages.map((p) => (
          <PageRow key={p.id} label={p.title} active={current === p.id} onClick={() => openPage(p.id)} icon="▤" />
        ))}
      </ul>

      {adding && (
        <div className="flex gap-1.5 px-2 pb-2">
          <input
            autoFocus
            className="input py-1.5"
            placeholder="Nama halaman"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") create();
              if (e.key === "Escape") setAdding(false);
            }}
            aria-label="Nama halaman baru"
          />
          <button type="button" className="btn-brand shrink-0 px-3 py-1.5" onClick={create}>
            Buat
          </button>
        </div>
      )}

      {active && (
        <div className="space-y-1.5 border-t border-app-line bg-white/60 px-3 py-2">
          <input
            className="input py-1.5"
            value={active.title}
            onChange={(e) => renamePage(active.id, e.target.value)}
            aria-label="Nama halaman"
          />
          <div className="flex items-center rounded-lg border border-app-line bg-white text-xs focus-within:border-app-fg">
            <span className="pl-2 text-app-muted">/</span>
            <input
              className="w-full min-w-0 bg-transparent px-1 py-1.5 outline-none"
              value={active.slug}
              onChange={(e) => setPageSlug(active.id, e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") || "halaman")}
              aria-label="Alamat halaman"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            {siteBase ? (
              <a href={`${siteBase}/${active.slug}`} target="_blank" className="truncate text-[11px] font-semibold text-brand underline">
                Lihat halaman terbit
              </a>
            ) : (
              <span className="text-[11px] text-app-muted">Terbit setelah portofolio di-publish</span>
            )}
            {confirmDelete === active.id ? (
              <button
                type="button"
                className="rounded-md bg-red-600 px-2 py-1 text-[11px] font-semibold text-white"
                onClick={() => {
                  removePage(active.id);
                  setConfirmDelete(null);
                }}
              >
                Yakin hapus?
              </button>
            ) : (
              <button type="button" className="text-[11px] font-semibold text-red-600" onClick={() => setConfirmDelete(active.id)}>
                Hapus halaman
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PageRow({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon: string }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${
          active ? "bg-white font-bold shadow-sm" : "font-medium hover:bg-white/70"
        }`}
      >
        <span className="w-4 text-center text-app-muted">{icon}</span>
        <span className="truncate">{label || "Tanpa judul"}</span>
      </button>
    </li>
  );
}
