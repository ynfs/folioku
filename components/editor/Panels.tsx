"use client";

import { useState } from "react";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FONTS } from "@/lib/fonts";
import { SECTION_DEFS, SECTION_ORDER } from "@/lib/sections";
import type { ProductKind, Section, SectionType, Theme } from "@/lib/types";

/** Bagian yang paling cocok dengan produk tampil lebih dulu di "Tambah bagian". */
function orderFor(kind: ProductKind): SectionType[] {
  const fits = (t: SectionType) => {
    const f = SECTION_DEFS[t].for;
    return !f || f === kind;
  };
  return [...SECTION_ORDER.filter(fits), ...SECTION_ORDER.filter((t) => !fits(t))];
}
import { ElementPanel, LayersList } from "./ElementPanel";
import { FieldInput, IconBtn } from "./fields";
import { currentSections, useEditor } from "./store";

// ---------- Panel kiri: daftar section ----------

function sectionTitle(s: Section): string {
  const p = s.props;
  const t = p.title ?? p.heading ?? p.quote ?? p.author;
  return typeof t === "string" && t ? t : SECTION_DEFS[s.type].label;
}

function SortableRow({ section, index, total }: { section: Section; index: number; total: number }) {
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);
  const moveSection = useEditor((s) => s.moveSection);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const active = selectedId === section.id;
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={isDragging ? "relative z-10 opacity-80" : ""}>
    <div
      className={`group flex items-center gap-1 rounded-lg border px-1.5 py-1.5 ${
        active ? "border-app-fg bg-white shadow-sm" : "border-transparent hover:bg-white"
      } ${isDragging ? "shadow-lg" : ""}`}
    >
      <button
        type="button"
        className="cursor-grab touch-none px-1 text-app-muted active:cursor-grabbing"
        aria-label="Geser untuk mengurutkan"
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>
      <button type="button" onClick={() => select(section.id)} className="min-w-0 flex-1 text-left">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-app-muted">{SECTION_DEFS[section.type].label}</span>
        <span className="block truncate text-sm font-semibold">{sectionTitle(section)}</span>
      </button>
      <span className="flex opacity-0 group-hover:opacity-100">
        <IconBtn label="Naik" onClick={() => moveSection(index, index - 1)} disabled={index === 0}>
          ↑
        </IconBtn>
        <IconBtn label="Turun" onClick={() => moveSection(index, index + 1)} disabled={index === total - 1}>
          ↓
        </IconBtn>
      </span>
    </div>
    {active && section.type === "canvas" && !isDragging && <LayersList section={section} />}
    </li>
  );
}

export function SectionsPanel({ kind = "portfolio" }: { kind?: ProductKind }) {
  const data = useEditor((s) => s.data);
  const page = useEditor((s) => s.page);
  const sections = currentSections({ data, page });
  const moveSection = useEditor((s) => s.moveSection);
  const addSection = useEditor((s) => s.addSection);
  const [adding, setAdding] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = sections.findIndex((s) => s.id === active.id);
    const to = sections.findIndex((s) => s.id === over.id);
    moveSection(from, to);
  }

  return (
    <div className="flex h-full flex-col">
      <p className="px-3 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-app-muted">Bagian halaman</p>
      <div className="flex-1 overflow-y-auto px-2">
        {sections.length === 0 && <p className="px-2 py-4 text-sm text-app-muted">Belum ada bagian. Tambahkan di bawah.</p>}
        <DndContext id="sections-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-1">
              {sections.map((s, i) => (
                <SortableRow key={s.id} section={s} index={i} total={sections.length} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
      <div className="border-t border-app-line p-2">
        {adding ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-bold uppercase tracking-wider text-app-muted">Tambah bagian</p>
              <IconBtn label="Tutup" onClick={() => setAdding(false)}>
                ✕
              </IconBtn>
            </div>
            <div className="grid max-h-72 gap-1 overflow-y-auto">
              {orderFor(kind).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    addSection(type);
                    setAdding(false);
                  }}
                  className="rounded-lg px-2 py-1.5 text-left hover:bg-white"
                >
                  <span className="block text-sm font-semibold">{SECTION_DEFS[type].label}</span>
                  <span className="block text-xs text-app-muted">{SECTION_DEFS[type].description}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button type="button" className="btn-primary w-full" onClick={() => setAdding(true)}>
            + Tambah bagian
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- Panel kanan: properti section ----------

export function PropertiesPanel() {
  const section = useEditor((s) => currentSections(s).find((x) => x.id === s.selectedId));
  const hasElementSelection = useEditor((s) => s.selectedEls.length > 0);
  const updateProp = useEditor((s) => s.updateProp);
  const duplicateSection = useEditor((s) => s.duplicateSection);
  const removeSection = useEditor((s) => s.removeSection);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!section) {
    return <p className="p-4 text-sm text-app-muted">Klik salah satu bagian di pratinjau untuk mengeditnya.</p>;
  }
  const def = SECTION_DEFS[section.type];
  if (section.type === "canvas" && hasElementSelection) return <ElementPanel section={section} />;

  return (
    <div className="space-y-4 p-4" key={section.id}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-app-muted">Bagian</p>
          <p className="font-bold">{def.label}</p>
        </div>
        <div className="flex gap-1">
          <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => duplicateSection(section.id)}>
            Duplikat
          </button>
          {confirmDelete ? (
            <button
              type="button"
              className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white"
              onClick={() => {
                removeSection(section.id);
                setConfirmDelete(false);
              }}
            >
              Yakin?
            </button>
          ) : (
            <button type="button" className="btn-ghost px-2 py-1 text-xs text-red-600" onClick={() => setConfirmDelete(true)}>
              Hapus
            </button>
          )}
        </div>
      </div>
      {section.type === "canvas" && (
        <p className="rounded-lg bg-[#0d99ff]/10 px-3 py-2 text-xs text-[#0b6fb8]">
          Pilih elemen di kanvas untuk mengedit teks, warna, dan posisinya. Tambah elemen lewat toolbar hitam di atas kanvas.
        </p>
      )}
      {def.fields.map((f) => (
        <FieldInput key={f.key} field={f} value={section.props[f.key]} onChange={(v) => updateProp(section.id, f.key, v)} />
      ))}
    </div>
  );
}

// ---------- Panel kanan: tema ----------

const PRESETS: { name: string; colors: Pick<Theme, "colorPrimary" | "colorAccent" | "colorBackground" | "colorSurface"> }[] = [
  { name: "Terang", colors: { colorPrimary: "#111111", colorAccent: "#FF5A36", colorBackground: "#FFFFFF", colorSurface: "#F4F4F2" } },
  { name: "Krem", colors: { colorPrimary: "#2B2118", colorAccent: "#8C5A2B", colorBackground: "#FBF7F0", colorSurface: "#F1E9DC" } },
  { name: "Gelap", colors: { colorPrimary: "#EDEDED", colorAccent: "#7CFFB2", colorBackground: "#0E0F12", colorSurface: "#1A1C21" } },
  { name: "Retro", colors: { colorPrimary: "#1F1A17", colorAccent: "#E4572E", colorBackground: "#F6E7C8", colorSurface: "#F2C14E" } },
  { name: "Pastel", colors: { colorPrimary: "#2E2A47", colorAccent: "#6C5CE7", colorBackground: "#F5F3FF", colorSurface: "#E8E3FF" } },
  { name: "Hutan", colors: { colorPrimary: "#14261C", colorAccent: "#2F855A", colorBackground: "#F3F7F2", colorSurface: "#DCEBDD" } },
];

export function ThemePanel() {
  const theme = useEditor((s) => s.data.theme);
  const updateTheme = useEditor((s) => s.updateTheme);

  return (
    <div className="space-y-5 p-4">
      <div>
        <p className="label">Palet cepat</p>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => (Object.keys(p.colors) as (keyof typeof p.colors)[]).forEach((k) => updateTheme(k, p.colors[k]))}
              className="overflow-hidden rounded-lg border border-app-line text-left hover:border-app-fg"
            >
              <span className="flex h-6">
                {Object.values(p.colors).map((c) => (
                  <span key={c} className="flex-1" style={{ background: c }} />
                ))}
              </span>
              <span className="block px-1.5 py-1 text-[11px] font-semibold">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <FontSelect label="Font judul" value={theme.fontHeading} onChange={(v) => updateTheme("fontHeading", v)} />
      <FontSelect label="Font isi" value={theme.fontBody} onChange={(v) => updateTheme("fontBody", v)} />

      <div className="grid grid-cols-2 gap-3">
        <ColorInput label="Teks" value={theme.colorPrimary} onChange={(v) => updateTheme("colorPrimary", v)} />
        <ColorInput label="Aksen" value={theme.colorAccent} onChange={(v) => updateTheme("colorAccent", v)} />
        <ColorInput label="Latar" value={theme.colorBackground} onChange={(v) => updateTheme("colorBackground", v)} />
        <ColorInput label="Kartu" value={theme.colorSurface ?? theme.colorBackground} onChange={(v) => updateTheme("colorSurface", v)} />
      </div>

      <div>
        <label className="label" htmlFor="t-radius">
          Sudut
        </label>
        <select id="t-radius" className="input" value={theme.radius ?? "sm"} onChange={(e) => updateTheme("radius", e.target.value as Theme["radius"])}>
          <option value="none">Tajam</option>
          <option value="sm">Sedikit membulat</option>
          <option value="lg">Membulat</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="t-case">
          Gaya judul
        </label>
        <select
          id="t-case"
          className="input"
          value={theme.headingCase ?? "normal"}
          onChange={(e) => updateTheme("headingCase", e.target.value as Theme["headingCase"])}
        >
          <option value="normal">Normal</option>
          <option value="uppercase">HURUF BESAR</option>
        </select>
      </div>
    </div>
  );
}

function FontSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = `font-${label}`;
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {["sans", "serif", "display", "mono"].map((kind) => (
          <optgroup key={kind} label={{ sans: "Sans serif", serif: "Serif", display: "Display", mono: "Monospace" }[kind]}>
            {FONTS.filter((f) => f.kind === kind).map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [text, setText] = useState(value);
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    setPrev(value);
    setText(value);
  }
  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex items-center gap-1.5 rounded-lg border border-app-line bg-white p-1">
        <input
          type="color"
          aria-label={`Warna ${label}`}
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-7 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
        />
        <input
          aria-label={`Kode warna ${label}`}
          className="w-full min-w-0 text-xs font-mono uppercase outline-none"
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
