"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  publishAction,
  renameProjectAction,
  saveProjectAction,
  saveTemplateAction,
  unpublishAction,
  updateTemplateMetaAction,
  type TemplateMeta,
} from "@/app/actions";
import { HOME, findSection, getPages, pageSections, resolvePageLinks } from "@/lib/pages";
import { Portfolio } from "@/lib/renderer/Portfolio";
import { CATEGORIES } from "@/lib/templates";
import type { PortfolioData, Project, Template } from "@/lib/types";
import { CanvasEditable, handleCanvasKey } from "./CanvasEditor";
import { PagesPanel } from "./PagesPanel";
import { PropertiesPanel, SectionsPanel, ThemePanel } from "./Panels";
import { useEditor } from "./store";

type SaveState = "saved" | "dirty" | "saving" | "error";
type Device = "desktop" | "tablet" | "mobile";

const DEVICES: { id: Device; label: string; width: string }[] = [
  { id: "desktop", label: "Desktop", width: "100%" },
  { id: "tablet", label: "Tablet", width: "768px" },
  { id: "mobile", label: "HP", width: "390px" },
];

const AUTOSAVE_MS = 800;
const MAX_WAIT_MS = 3000;
const PREVIEW_BASE = "#folioku";

export type EditorMode = { kind: "project"; project: Project } | { kind: "template"; template: Template };

export function Editor({ mode }: { mode: EditorMode }) {
  const initial: PortfolioData =
    mode.kind === "project" ? mode.project.data : { theme: mode.template.theme, sections: mode.template.sections };
  // Muat data ke store sebelum komponen editor yang membaca store dirender.
  useState(() => useEditor.getState().init(initial));
  return <EditorInner mode={mode} />;
}

function EditorInner({ mode }: { mode: EditorMode }) {
  const data = useEditor((s) => s.data);
  const page = useEditor((s) => s.page);
  const openPage = useEditor((s) => s.openPage);
  const goToSection = useEditor((s) => s.goToSection);
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);
  const undo = useEditor((s) => s.undo);
  const redo = useEditor((s) => s.redo);
  const canUndo = useEditor((s) => s.past.length > 0);
  const canRedo = useEditor((s) => s.future.length > 0);

  const [save, setSave] = useState<SaveState>("saved");
  const [saveError, setSaveError] = useState("");
  const [device, setDevice] = useState<Device>("desktop");
  const [tab, setTab] = useState<"section" | "theme">("section");

  const docId = mode.kind === "project" ? mode.project.id : mode.template.id;

  // Simpan otomatis setelah pengguna berhenti mengedit sebentar.
  const firstRun = useRef(true);
  const dirtySince = useRef<number | null>(null);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setSave("dirty");
    // Tunggu jeda mengetik, tapi jangan lebih dari MAX_WAIT_MS sejak perubahan pertama.
    const now = Date.now();
    dirtySince.current ??= now;
    const delay = Math.max(0, Math.min(AUTOSAVE_MS, dirtySince.current + MAX_WAIT_MS - now));
    const t = setTimeout(async () => {
      dirtySince.current = null;
      setSave("saving");
      const res = mode.kind === "project" ? await saveProjectAction(docId, data) : await saveTemplateAction(docId, data);
      setSave(res.ok ? "saved" : "error");
      setSaveError(res.error ?? "");
    }, delay);
    return () => clearTimeout(t);
  }, [data, docId, mode.kind]);

  // Peringatkan jika menutup tab saat ada perubahan yang belum tersimpan.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (save !== "saved") e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [save]);

  // Pintasan keyboard di luar kolom input.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable]")) return;
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      if (mod && k === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (mod && ((k === "z" && e.shiftKey) || k === "y")) {
        e.preventDefault();
        redo();
      } else if (handleCanvasKey(e)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  // Gulir pratinjau ke bagian yang dipilih.
  const previewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selectedId) return;
    previewRef.current?.querySelector(`[data-section="${selectedId}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId, page]);

  /** Ctrl+klik di pratinjau: ikuti link ke halaman dan/atau bagian tujuannya. */
  function followLink(href: string) {
    let anchor = "";
    if (href.startsWith(PREVIEW_BASE)) {
      const [path, hash = ""] = href.slice(PREVIEW_BASE.length).split("#");
      const slug = path.replace(/^\//, "");
      openPage(slug ? (getPages(data).find((p) => p.slug === slug)?.id ?? HOME) : HOME);
      anchor = hash;
    } else if (href.startsWith("#")) {
      anchor = href.slice(1);
    }
    if (!anchor) return;
    if (findSection(data, anchor)) {
      goToSection(anchor);
    } else {
      // Anchor bawaan template (mis. #kontak) di dalam sebuah bagian.
      previewRef.current?.querySelector(`[id="${anchor.replace(/["\\]/g, "")}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const width = DEVICES.find((d) => d.id === device)!.width;
  // Link halaman di pratinjau menjadi "#folioku/<slug>" agar bisa dibuka dengan Ctrl+klik.
  const resolved = resolvePageLinks(data, PREVIEW_BASE, page);
  const preview = { theme: data.theme, sections: pageSections(resolved, page) };
  const pageTitle = page === HOME ? "Beranda" : getPages(data).find((p) => p.id === page)?.title;
  const siteBase = mode.kind === "project" && mode.project.published && mode.project.slug ? `/p/${mode.project.slug}` : null;

  return (
    <div className="flex h-screen flex-col">
      {/* Bilah atas */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-app-line bg-white px-3">
        <Link href={mode.kind === "project" ? "/dashboard" : "/admin"} className="btn-ghost px-2.5" title="Kembali">
          ←
        </Link>
        {mode.kind === "project" ? (
          <ProjectName project={mode.project} />
        ) : (
          <span className="rounded-md bg-[#0d99ff]/10 px-2 py-1 text-xs font-bold text-[#0b6fb8]">MODE TEMPLATE</span>
        )}
        <SaveBadge state={save} error={saveError} />

        <div className="mx-auto flex rounded-lg border border-app-line p-0.5">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className={`rounded-md px-3 py-1 text-sm font-semibold ${device === d.id ? "bg-app-fg text-white" : "text-app-muted"}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button type="button" className="btn-ghost px-2.5" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            ↶
          </button>
          <button type="button" className="btn-ghost px-2.5" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
            ↷
          </button>
        </div>
        {mode.kind === "project" ? <ProjectPublish project={mode.project} /> : <TemplateSettings template={mode.template} />}
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Kiri: daftar bagian & layer */}
        <aside className="flex w-64 shrink-0 flex-col border-r border-app-line bg-app-bg">
          <PagesPanel siteBase={siteBase} />
          <div className="min-h-0 flex-1">
            <SectionsPanel />
          </div>
        </aside>

        {/* Tengah: pratinjau */}
        <main className="min-w-0 flex-1 overflow-y-auto bg-[#e9e7e2] p-4" onClick={() => select(null)}>
          <p className="mx-auto mb-2 flex max-w-full items-center justify-between text-xs text-app-muted" style={{ width }}>
            <span>
              Halaman: <b className="text-app-fg">{pageTitle}</b>
            </span>
            <span>Ctrl+klik tombol untuk menuju halaman atau bagian tujuannya</span>
          </p>
          <div
            ref={previewRef}
            className="mx-auto rounded-md bg-white shadow-xl transition-[width] duration-300"
            style={{ width, maxWidth: "100%" }}
            onClickCapture={(e) => {
              // Link di pratinjau tidak boleh berpindah halaman situs.
              const a = (e.target as HTMLElement).closest("a");
              if (!a) return;
              e.preventDefault();
              const href = a.getAttribute("href") ?? "";
              if (!(e.ctrlKey || e.metaKey)) return;
              e.stopPropagation();
              followLink(href);
            }}
          >
            <Portfolio
              key={page}
              data={preview}
              className="overflow-hidden rounded-md"
              renderSection={(section, node) => (
                <div
                  data-section={section.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    select(section.id);
                    setTab("section");
                  }}
                  className={`relative outline-offset-[-3px] ${section.type === "canvas" ? "" : "cursor-pointer"} ${
                    selectedId === section.id ? "outline-3 outline-brand" : "hover:outline-2 hover:outline-dashed hover:outline-brand/60"
                  }`}
                >
                  {section.type === "canvas" ? <CanvasEditable section={section} /> : node}
                </div>
              )}
            />
            {preview.sections.length === 0 && (
              <div className="p-16 text-center text-app-muted">Halaman kosong. Tambahkan bagian dari panel kiri.</div>
            )}
          </div>
        </main>

        {/* Kanan: properti */}
        <aside className="flex w-80 shrink-0 flex-col border-l border-app-line bg-white">
          <div className="flex border-b border-app-line">
            {(
              [
                ["section", "Desain"],
                ["theme", "Tema"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex-1 py-3 text-sm font-semibold ${tab === id ? "border-b-2 border-app-fg" : "text-app-muted"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{tab === "section" ? <PropertiesPanel /> : <ThemePanel />}</div>
        </aside>
      </div>
    </div>
  );
}

function SaveBadge({ state, error }: { state: SaveState; error: string }) {
  const map: Record<SaveState, [string, string]> = {
    saved: ["Tersimpan", "text-green-700"],
    dirty: ["Belum tersimpan…", "text-app-muted"],
    saving: ["Menyimpan…", "text-app-muted"],
    error: [error || "Gagal menyimpan", "text-red-600"],
  };
  const [label, cls] = map[state];
  return <span className={`hidden whitespace-nowrap text-xs font-semibold sm:inline ${cls}`}>{label}</span>;
}

// ---------- Mode proyek ----------

function ProjectName({ project }: { project: Project }) {
  const [name, setName] = useState(project.name);
  return (
    <input
      aria-label="Nama proyek"
      className="w-56 min-w-0 rounded-md px-2 py-1 font-bold outline-none hover:bg-app-bg focus:bg-app-bg"
      value={name}
      onChange={(e) => setName(e.target.value)}
      onBlur={() => name.trim() && name !== project.name && renameProjectAction(project.id, name)}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
    />
  );
}

function slugify(s: string): string {
  const base = s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
  return base.length >= 3 ? base : `portofolio-${Math.random().toString(36).slice(2, 7)}`;
}

function ProjectPublish({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({ published: project.published, slug: project.slug });
  const [slug, setSlug] = useState(project.slug ?? slugify(project.name));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function publish() {
    setBusy(true);
    setError("");
    // Simpan perubahan terbaru dulu agar yang terbit adalah versi terkini.
    const saved = await saveProjectAction(project.id, useEditor.getState().data);
    if (!saved.ok) {
      setBusy(false);
      setError(saved.error ?? "Gagal menyimpan sebelum publish.");
      return;
    }
    const res = await publishAction(project.id, slug);
    setBusy(false);
    if (res.error) setError(res.error);
    else setState({ published: true, slug: res.slug! });
  }

  async function unpublish() {
    setBusy(true);
    await unpublishAction(project.id, state.slug);
    setBusy(false);
    setState((s) => ({ ...s, published: false }));
  }

  return (
    <div className="relative">
      <button type="button" className="btn-brand" onClick={() => setOpen((v) => !v)}>
        {state.published ? "Terbit ✓" : "Publish"}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-app-line bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-bold">Publikasikan portofolio</p>
            <button type="button" onClick={() => setOpen(false)} className="text-app-muted" aria-label="Tutup">
              ✕
            </button>
          </div>
          <label className="label" htmlFor="slug">
            Alamat portofolio
          </label>
          <div className="flex items-center rounded-lg border border-app-line bg-white text-sm focus-within:border-app-fg">
            <span className="pl-3 text-app-muted">/p/</span>
            <input
              id="slug"
              className="w-full min-w-0 bg-transparent px-1 py-2 outline-none"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            />
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button type="button" className="btn-brand mt-3 w-full" disabled={busy} onClick={publish}>
            {busy ? "Memproses…" : state.published ? "Perbarui alamat" : "Publish sekarang"}
          </button>
          {state.published && state.slug && (
            <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm">
              <p className="font-semibold text-green-800">Portofolio sudah terbit</p>
              <a href={`/p/${state.slug}`} target="_blank" className="mt-1 block break-all font-semibold text-brand underline">
                {origin}/p/{state.slug}
              </a>
              <div className="mt-2 flex gap-2">
                <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => navigator.clipboard?.writeText(`${origin}/p/${state.slug}`)}>
                  Salin link
                </button>
                <button type="button" className="btn-ghost px-2 py-1 text-xs text-red-600" disabled={busy} onClick={unpublish}>
                  Batalkan publikasi
                </button>
              </div>
            </div>
          )}
          <p className="mt-3 text-xs text-app-muted">Perubahan yang kamu simpan langsung tampil di link publik.</p>
        </div>
      )}
    </div>
  );
}

// ---------- Mode template ----------

function TemplateSettings({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState<TemplateMeta>({
    name: template.name,
    category: template.category,
    description: template.description,
    tags: template.tags,
    published: !!template.published,
  });
  const [tagsText, setTagsText] = useState(template.tags.join(", "));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function saveMeta(next: TemplateMeta) {
    setBusy(true);
    const res = await updateTemplateMetaAction(template.id, next);
    setBusy(false);
    if (res.ok) {
      setMeta(next);
      setMsg({ ok: true, text: next.published ? "Tersimpan dan tampil di galeri." : "Tersimpan sebagai draf." });
    } else setMsg({ ok: false, text: res.error ?? "Gagal menyimpan." });
  }

  const withTags = (): TemplateMeta => ({ ...meta, tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean) });

  return (
    <div className="relative flex items-center gap-2">
      <button type="button" className="btn-ghost" onClick={() => setOpen((v) => !v)}>
        {meta.name.length > 22 ? `${meta.name.slice(0, 22)}…` : meta.name} ⚙
      </button>
      <button
        type="button"
        className={meta.published ? "btn-ghost" : "btn-brand"}
        disabled={busy}
        onClick={() => saveMeta({ ...withTags(), published: !meta.published })}
      >
        {meta.published ? "Tarik dari galeri" : "Terbitkan ke galeri"}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 space-y-3 rounded-xl border border-app-line bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="font-bold">Info template</p>
            <button type="button" onClick={() => setOpen(false)} className="text-app-muted" aria-label="Tutup">
              ✕
            </button>
          </div>
          <div>
            <label className="label" htmlFor="tpl-name">
              Nama
            </label>
            <input id="tpl-name" className="input" value={meta.name} onChange={(e) => setMeta({ ...meta, name: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="tpl-cat">
              Gaya / kategori
            </label>
            <select
              id="tpl-cat"
              className="input"
              value={meta.category}
              onChange={(e) => setMeta({ ...meta, category: e.target.value as TemplateMeta["category"] })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="tpl-desc">
              Deskripsi singkat
            </label>
            <textarea id="tpl-desc" className="input min-h-16" value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="tpl-tags">
              Tag (pisahkan dengan koma)
            </label>
            <input id="tpl-tags" className="input" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="fotografer, gelap" />
          </div>
          <button type="button" className="btn-primary w-full" disabled={busy} onClick={() => saveMeta(withTags())}>
            Simpan info
          </button>
          <p className="text-xs text-app-muted">
            Status: <b>{meta.published ? "Terbit di galeri" : "Draf (hanya admin)"}</b>
          </p>
        </div>
      )}
      {msg && (
        <span className={`absolute right-0 top-12 whitespace-nowrap text-xs font-semibold ${msg.ok ? "text-green-700" : "text-red-600"} ${open ? "hidden" : ""}`}>
          {msg.text}
        </span>
      )}
    </div>
  );
}
