"use client";

import { CANVAS_WIDTH, canvasElements, elementLabel } from "@/lib/canvas";
import { FONTS } from "@/lib/fonts";
import type { CanvasElement, Section } from "@/lib/types";
import { canvasHeight } from "@/components/sections/canvas";
import { ColorPicker, IconBtn, ImageInput, LinkInput, NumberInput } from "./fields";
import { useEditor, type LayerMove } from "./store";

// Panel properti elemen kanvas (kanan) dan daftar layer (kiri), ala Figma.

const TYPE_ICON: Record<CanvasElement["type"], string> = { text: "T", image: "▣", shape: "◆", button: "▭" };

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 border-b border-app-line px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-app-muted">{title}</p>
      {children}
    </div>
  );
}

function Seg<T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-lg border border-app-line p-0.5">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={`flex-1 rounded-md py-1 text-xs font-semibold ${value === o.v ? "bg-app-fg text-white" : "text-app-muted hover:text-app-fg"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ElementPanel({ section }: { section: Section }) {
  const ids = useEditor((s) => s.selectedEls);
  const update = useEditor((s) => s.updateElements);
  const removeElements = useEditor((s) => s.removeElements);
  const duplicateElements = useEditor((s) => s.duplicateElements);
  const moveLayer = useEditor((s) => s.moveLayer);

  const all = canvasElements(section.props.elements);
  const selected = all.filter((e) => ids.includes(e.id));
  if (!selected.length) return null;
  const el = selected[0];
  const multi = selected.length > 1;
  const height = canvasHeight(section.props);
  const set = (patch: Partial<CanvasElement>) => update(section.id, ids, patch);

  const align = (mode: "left" | "hcenter" | "right" | "top" | "vcenter" | "bottom") =>
    update(
      section.id,
      ids,
      (e) =>
        ({
          left: { x: 0 },
          hcenter: { x: Math.round((CANVAS_WIDTH - e.w) / 2) },
          right: { x: CANVAS_WIDTH - e.w },
          top: { y: 0 },
          vcenter: { y: Math.round((height - e.h) / 2) },
          bottom: { y: height - e.h },
        })[mode],
      false,
    );

  const isText = el.type === "text" || el.type === "button";

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-app-muted">{multi ? "Beberapa elemen" : "Elemen"}</p>
          {multi ? (
            <p className="font-bold">{selected.length} dipilih</p>
          ) : (
            <input
              aria-label="Nama layer"
              className="w-full rounded px-1 font-bold outline-none hover:bg-app-bg focus:bg-app-bg"
              value={el.name ?? ""}
              placeholder={elementLabel(el)}
              onChange={(e) => set({ name: e.target.value })}
            />
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => duplicateElements(section.id, ids)} title="Ctrl+D">
            Duplikat
          </button>
          <button type="button" className="btn-ghost px-2 py-1 text-xs text-red-600" onClick={() => removeElements(section.id, ids)} title="Delete">
            Hapus
          </button>
        </div>
      </div>

      <Group title="Rata ke frame">
        <div className="grid grid-cols-6 gap-1">
          {(
            [
              ["left", "⇤", "Rata kiri"],
              ["hcenter", "↔", "Tengah horizontal"],
              ["right", "⇥", "Rata kanan"],
              ["top", "⤒", "Rata atas"],
              ["vcenter", "↕", "Tengah vertikal"],
              ["bottom", "⤓", "Rata bawah"],
            ] as const
          ).map(([m, icon, label]) => (
            <button key={m} type="button" title={label} onClick={() => align(m)} className="rounded-md border border-app-line py-1 text-sm hover:border-app-fg">
              {icon}
            </button>
          ))}
        </div>
      </Group>

      {!multi && (
        <Group title="Posisi & ukuran">
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="X" value={el.x} onChange={(v) => set({ x: v })} />
            <NumberInput label="Y" value={el.y} onChange={(v) => set({ y: v })} />
            <NumberInput label="W" value={el.w} min={8} onChange={(v) => set({ w: v })} />
            <NumberInput label="H" value={el.h} min={8} onChange={(v) => set({ h: v })} />
            <NumberInput label="↻" value={el.rotation ?? 0} min={-180} max={180} unit="°" onChange={(v) => set({ rotation: v })} />
            <NumberInput label="◐" value={Math.round((el.opacity ?? 1) * 100)} min={0} max={100} unit="%" onChange={(v) => set({ opacity: v / 100 })} />
          </div>
          <div className="grid grid-cols-4 gap-1 pt-1">
            {(
              [
                ["back", "Paling belakang"],
                ["backward", "Mundur"],
                ["forward", "Maju"],
                ["front", "Paling depan"],
              ] as [LayerMove, string][]
            ).map(([to, label]) => (
              <button key={to} type="button" onClick={() => moveLayer(section.id, el.id, to)} className="rounded-md border border-app-line px-1 py-1 text-[11px] font-semibold hover:border-app-fg">
                {label}
              </button>
            ))}
          </div>
        </Group>
      )}

      {!multi && isText && (
        <Group title={el.type === "button" ? "Teks tombol" : "Teks"}>
          <textarea className="input min-h-16 resize-y" value={el.text ?? ""} onChange={(e) => set({ text: e.target.value })} aria-label="Isi teks" />
          <select className="input" aria-label="Font" value={el.fontFamily ?? "body"} onChange={(e) => set({ fontFamily: e.target.value })}>
            <option value="heading">Font judul tema</option>
            <option value="body">Font isi tema</option>
            {FONTS.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="Ukuran" value={el.fontSize ?? 20} min={6} max={400} onChange={(v) => set({ fontSize: v })} />
            <select className="input py-1.5" aria-label="Ketebalan" value={el.fontWeight ?? 400} onChange={(e) => set({ fontWeight: Number(e.target.value) })}>
              {[300, 400, 500, 600, 700, 800, 900].map((w) => (
                <option key={w} value={w}>
                  {{ 300: "Tipis", 400: "Normal", 500: "Medium", 600: "Semi tebal", 700: "Tebal", 800: "Sangat tebal", 900: "Hitam" }[w]}
                </option>
              ))}
            </select>
            <NumberInput label="Spasi baris" value={el.lineHeight ?? 1.3} min={0.6} max={3} step={0.05} onChange={(v) => set({ lineHeight: v })} />
            <NumberInput label="Spasi huruf" value={el.letterSpacing ?? 0} min={-10} max={40} step={0.5} onChange={(v) => set({ letterSpacing: v })} />
          </div>
          <Seg
            value={el.align ?? "left"}
            options={[
              { v: "left", label: "Kiri" },
              { v: "center", label: "Tengah" },
              { v: "right", label: "Kanan" },
            ]}
            onChange={(v) => set({ align: v })}
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => set({ italic: !el.italic })} className={`btn-ghost flex-1 py-1 text-xs italic ${el.italic ? "!border-app-fg" : ""}`}>
              Miring
            </button>
            <button type="button" onClick={() => set({ uppercase: !el.uppercase })} className={`btn-ghost flex-1 py-1 text-xs ${el.uppercase ? "!border-app-fg" : ""}`}>
              HURUF BESAR
            </button>
          </div>
          <p className="label !mb-0 pt-1">Warna teks</p>
          <ColorPicker value={el.color ?? ""} onChange={(v) => set({ color: v })} />
        </Group>
      )}

      {!multi && (el.type === "shape" || el.type === "button") && (
        <Group title="Isian & garis">
          <ColorPicker value={el.fill ?? ""} onChange={(v) => set({ fill: v })} allowNone />
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="Sudut" value={el.radius ?? 0} min={0} max={999} onChange={(v) => set({ radius: v })} />
            <NumberInput label="Garis" value={el.borderWidth ?? 0} min={0} max={40} onChange={(v) => set({ borderWidth: v })} />
          </div>
          {(el.borderWidth ?? 0) > 0 && <ColorPicker value={el.borderColor ?? ""} onChange={(v) => set({ borderColor: v })} />}
        </Group>
      )}

      {!multi && el.type === "button" && (
        <Group title="Aksi tombol">
          <LinkInput id={`link-${el.id}`} label="Saat tombol ditekan, buka" value={el.link ?? ""} onChange={(v) => set({ link: v })} />
        </Group>
      )}

      {!multi && el.type === "image" && (
        <Group title="Gambar">
          <ImageInput id={`img-${el.id}`} label="Sumber" value={el.src ?? ""} onChange={(v) => set({ src: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Seg
              value={el.fit ?? "cover"}
              options={[
                { v: "cover", label: "Isi" },
                { v: "contain", label: "Muat" },
              ]}
              onChange={(v) => set({ fit: v })}
            />
            <NumberInput label="Sudut" value={el.radius ?? 0} min={0} max={999} onChange={(v) => set({ radius: v })} />
          </div>
        </Group>
      )}

      <p className="px-4 py-3 text-[11px] leading-relaxed text-app-muted">
        Klik ganda teks untuk mengetik langsung. Shift+klik untuk pilih banyak, seret area kosong untuk seleksi kotak. Panah untuk geser
        (Shift = 10px), Alt saat menyeret untuk mematikan snap, Ctrl+C/V/D, Delete, [ dan ] untuk urutan layer.
      </p>
    </div>
  );
}

/** Daftar layer untuk section kanvas yang sedang dipilih (elemen teratas di atas). */
export function LayersList({ section }: { section: Section }) {
  const ids = useEditor((s) => s.selectedEls);
  const selectElements = useEditor((s) => s.selectElements);
  const update = useEditor((s) => s.updateElements);
  const elements = canvasElements(section.props.elements);

  if (!elements.length) {
    return <p className="py-2 pl-8 pr-2 text-xs text-app-muted">Belum ada layer. Tambah lewat toolbar di kanvas.</p>;
  }

  return (
    <ul className="mb-1 ml-5 border-l border-app-line pl-1">
      {[...elements].reverse().map((el) => {
        const sel = ids.includes(el.id);
        return (
          <li
            key={el.id}
            className={`group/layer flex items-center gap-1 rounded-md pl-1.5 ${sel ? "bg-[#0d99ff]/15" : "hover:bg-white"} ${el.hidden ? "opacity-50" : ""}`}
          >
            <span className="w-4 text-center text-xs text-app-muted">{TYPE_ICON[el.type]}</span>
            <button
              type="button"
              className="min-w-0 flex-1 truncate py-1 text-left text-xs font-medium"
              onClick={(e) =>
                selectElements(section.id, e.shiftKey ? (sel ? ids.filter((i) => i !== el.id) : [...ids, el.id]) : [el.id])
              }
            >
              {elementLabel(el)}
            </button>
            <span className={`flex ${el.hidden || el.locked ? "" : "opacity-0 group-hover/layer:opacity-100"}`}>
              <IconBtn label={el.hidden ? "Tampilkan" : "Sembunyikan"} onClick={() => update(section.id, [el.id], { hidden: !el.hidden }, false)}>
                {el.hidden ? "◌" : "◉"}
              </IconBtn>
              <IconBtn label={el.locked ? "Buka kunci" : "Kunci"} onClick={() => update(section.id, [el.id], { locked: !el.locked }, false)}>
                {el.locked ? "🔒" : "🔓"}
              </IconBtn>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
