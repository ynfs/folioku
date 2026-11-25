/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
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
    case "url":
      return (
        <Labeled id={id} label={field.label}>
          <input
            id={id}
            className="input"
            value={str}
            placeholder={field.kind === "url" ? "https://" : ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </Labeled>
      );
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
      return <ListInput field={field} value={Array.isArray(value) ? value : []} onChange={onChange} />;
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
