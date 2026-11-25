/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { THEME_COLORS, resolveColor } from "@/lib/canvas";
import { HOME, getPages, linkedPageId, pageLink } from "@/lib/pages";
import { useEditor } from "./store";
import type { Field } from "@/lib/sections";
import type { PropValue } from "@/lib/types";

// Input untuk panel properti editor.

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: PropValue | undefined;
  onChange: (v: PropValue) => void;
}) {
  const str = typeof value === "string" || typeof value === "number" ? String(value) : "";
  const id = `f-${field.key}`;

  switch (field.kind) {
    case "text":
      return (
        <Labeled id={id} label={field.label}>
          <input id={id} className="input" value={str} onChange={(e) => onChange(e.target.value)} />
        </Labeled>
      );
    case "url":
      return <LinkInput id={id} label={field.label} value={str} onChange={onChange} />;
    case "textarea":
      return (
        <Labeled id={id} label={field.label}>
          <textarea id={id} className="input min-h-24 resize-y" value={str} onChange={(e) => onChange(e.target.value)} />
        </Labeled>
      );
    case "select":
      return (
        <Labeled id={id} label={field.label}>
          <select id={id} className="input" value={str} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Labeled>
      );
    case "number":
      return (
        <Labeled id={id} label={field.label}>
          <div className="flex gap-1">
            {Array.from({ length: field.max - field.min + 1 }, (_, i) => field.min + i).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                className={`flex-1 rounded-lg border py-1.5 text-sm font-semibold ${
                  Number(value) === n ? "border-app-fg bg-app-fg text-white" : "border-app-line bg-white"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </Labeled>
      );
    case "image":
      return <ImageInput id={id} label={field.label} value={str} onChange={onChange} />;
    case "list":
      return <ListInput field={field} value={Array.isArray(value) ? (value as Record<string, string>[]) : []} onChange={onChange} />;
    case "size":
      return (
        <Labeled id={id} label={field.label}>
          <NumberInput id={id} value={Number(value) || field.min} min={field.min} max={field.max} step={field.step} unit={field.unit} onChange={onChange} />
        </Labeled>
      );
    case "color":
      return (
        <div>
          <p className="label">{field.label}</p>
          <ColorPicker value={str} onChange={onChange} />
        </div>
      );
  }
}

function Labeled({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
    </div>
  );
}

export function ImageInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error || "Gagal mengunggah.");
      onChange(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-app-line bg-app-bg">
          {value && <img src={value} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <input id={id} className="input py-1.5 text-xs" value={value} placeholder="URL gambar" onChange={(e) => onChange(e.target.value)} />
          <div className="flex gap-1.5">
            <button type="button" className="btn-ghost flex-1 px-2 py-1 text-xs" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? "Mengunggah…" : "Unggah"}
            </button>
            {value && (
              <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => onChange("")}>
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
    </div>
  );
}

function ListInput({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: "list" }>;
  value: Record<string, string>[];
  onChange: (v: Record<string, string>[]) => void;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const update = (i: number, key: string, v: string) => onChange(value.map((it, j) => (j === i ? { ...it, [key]: v } : it)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(j);
  };
  const add = () => {
    onChange([...value, Object.fromEntries(field.itemFields.map((f) => [f.key, ""]))]);
    setOpen(value.length);
  };
  const remove = (i: number) => {
    onChange(value.filter((_, j) => j !== i));
    setOpen(null);
  };

  const titleOf = (it: Record<string, string>, i: number) => {
    const first = field.itemFields.find((f) => f.kind === "text");
    return (first && it[first.key]) || `${field.itemLabel} ${i + 1}`;
  };

  return (
    <div>
      <p className="label">{field.label}</p>
      <ul className="space-y-1.5">
        {value.map((it, i) => (
          <li key={i} className="rounded-lg border border-app-line bg-white">
            <div className="flex items-center gap-1 px-2 py-1.5">
              <button type="button" className="min-w-0 flex-1 truncate text-left text-sm font-semibold" onClick={() => setOpen(open === i ? null : i)}>
                {open === i ? "▾ " : "▸ "}
                {titleOf(it, i)}
              </button>
              <IconBtn label="Naik" onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </IconBtn>
              <IconBtn label="Turun" onClick={() => move(i, 1)} disabled={i === value.length - 1}>
                ↓
              </IconBtn>
              <IconBtn label="Hapus" onClick={() => remove(i)}>
                ✕
              </IconBtn>
            </div>
            {open === i && (
              <div className="space-y-3 border-t border-app-line p-2">
                {field.itemFields.map((f) => (
                  <FieldInput key={f.key} field={{ ...f, key: `${field.key}-${i}-${f.key}` }} value={it[f.key]} onChange={(v) => update(i, f.key, String(v))} />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      <button type="button" className="btn-ghost mt-2 w-full py-1.5 text-xs" onClick={add}>
        + Tambah {field.itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

export function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-sm text-app-muted hover:bg-app-bg hover:text-app-fg disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/** Input angka yang hanya menyimpan nilai valid (boleh dikosongkan sementara saat mengetik). */
export function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  label,
}: {
  id?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
}) {
  const [text, setText] = useState(String(value));
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    setPrev(value);
    setText(String(value));
  }
  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
  return (
    <div className="flex items-center rounded-lg border border-app-line bg-white focus-within:border-app-fg">
      {label && <span className="pl-2 text-[11px] font-semibold text-app-muted">{label}</span>}
      <input
        id={id}
        type="number"
        className="w-full min-w-0 bg-transparent px-2 py-1.5 text-sm outline-none"
        value={text}
        step={step}
        min={min}
        max={max}
        onChange={(e) => {
          setText(e.target.value);
          const n = Number(e.target.value);
          if (e.target.value !== "" && Number.isFinite(n)) onChange(clamp(n));
        }}
        onBlur={() => setText(String(value))}
      />
      {unit && <span className="pr-2 text-[11px] text-app-muted">{unit}</span>}
    </div>
  );
}

/** Pemilih warna: warna tema (ikut berubah saat palet diganti) atau warna bebas. */
export function ColorPicker({ value, onChange, allowNone }: { value: string; onChange: (v: string) => void; allowNone?: boolean }) {
  const theme = useEditor((s) => s.data.theme);
  const isHex = /^#[0-9a-f]{6}$/i.test(value);
  const [text, setText] = useState(isHex ? value : "");
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    setPrev(value);
    setText(/^#[0-9a-f]{6}$/i.test(value) ? value : "");
  }
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1">
        {THEME_COLORS.map((c) => (
          <button
            key={c.token}
            type="button"
            title={`Warna tema: ${c.label}`}
            onClick={() => onChange(c.token)}
            className={`flex items-center gap-1 rounded-md border px-1.5 py-1 text-[11px] font-semibold ${value === c.token ? "border-app-fg" : "border-app-line"}`}
          >
            <span className="h-3 w-3 rounded-sm border border-black/10" style={{ background: resolveColor(c.token, theme) }} />
            {c.label}
          </button>
        ))}
        {allowNone && (
          <button
            type="button"
            onClick={() => onChange("transparent")}
            className={`rounded-md border px-1.5 py-1 text-[11px] font-semibold ${value === "transparent" ? "border-app-fg" : "border-app-line"}`}
          >
            Tanpa
          </button>
        )}
      </div>
      <div className="flex items-center gap-1.5 rounded-lg border border-app-line bg-white p-1">
        <input
          type="color"
          aria-label="Pilih warna"
          value={isHex ? value : /^#[0-9a-f]{6}$/i.test(resolveColor(value, theme)) ? resolveColor(value, theme) : "#000000"}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-6 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
        />
        <input
          aria-label="Kode warna"
          className="w-full min-w-0 font-mono text-xs uppercase outline-none"
          placeholder={isHex ? "" : "warna tema"}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (/^#[0-9a-f]{6}$/i.test(e.target.value)) onChange(e.target.value.toUpperCase());
          }}
        />
      </div>
    </div>
  );
}

/** Tujuan link: URL bebas, beranda, halaman lain, atau buat halaman baru. */
export function LinkInput({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const data = useEditor((st) => st.data);
  const addPage = useEditor((st) => st.addPage);
  const openPage = useEditor((st) => st.openPage);
  const pages = getPages(data);
  const pid = linkedPageId(value);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");

  const mode = creating ? "new" : pid ? pageLink(pid) : "url";
  const target = pid === HOME ? "Beranda" : pages.find((p) => p.id === pid)?.title;

  function create() {
    const newId = addPage(title || "Halaman baru");
    onChange(pageLink(newId));
    setCreating(false);
    setTitle("");
  }

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <select
        id={id}
        className="input mb-1.5"
        value={mode}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "new") {
            setCreating(true);
            return;
          }
          setCreating(false);
          onChange(v === "url" ? "" : v);
        }}
      >
        <option value="url">Link / URL</option>
        <option value={pageLink(HOME)}>Halaman: Beranda</option>
        {pages.map((p) => (
          <option key={p.id} value={pageLink(p.id)}>
            Halaman: {p.title}
          </option>
        ))}
        <option value="new">+ Buat halaman baru…</option>
      </select>

      {mode === "url" && (
        <input className="input" value={value} placeholder="https://… atau #kontak" onChange={(e) => onChange(e.target.value)} aria-label={`${label} (URL)`} />
      )}

      {creating && (
        <div className="flex gap-1.5">
          <input
            autoFocus
            className="input"
            placeholder="Nama halaman, mis. Tentang saya"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
            aria-label="Nama halaman baru"
          />
          <button type="button" className="btn-brand shrink-0 px-3" onClick={create}>
            Buat
          </button>
        </div>
      )}

      {pid && !creating && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-[#0d99ff]/10 px-2.5 py-1.5 text-xs">
          <span className="truncate text-[#0b6fb8]">
            → {target ?? <span className="text-red-600">halaman sudah dihapus</span>}
          </span>
          {target && (
            <button type="button" className="shrink-0 font-semibold text-[#0b6fb8] underline" onClick={() => openPage(pid)}>
              Buka halaman
            </button>
          )}
        </div>
      )}
    </div>
  );
}
