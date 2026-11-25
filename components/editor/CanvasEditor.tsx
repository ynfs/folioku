"use client";

import { useRef, useState } from "react";
import { CanvasView, ElementBody, canvasHeight, elementBoxStyle, textStyle } from "@/components/sections/canvas";
import { CANVAS_WIDTH, canvasElements } from "@/lib/canvas";
import type { CanvasElement, CanvasElementType, PortfolioData, Section } from "@/lib/types";
import { patchElements, useEditor } from "./store";

// Permukaan kanvas interaktif ala Figma: pilih, geser, ubah ukuran, putar,
// seleksi kotak (marquee), garis bantu snap, dan edit teks dengan klik ganda.

const SNAP_PX = 6; // jarak snap dalam piksel layar
const FIGMA_BLUE = "#0d99ff";

type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
const HANDLES: { h: Handle; style: React.CSSProperties; cursor: string }[] = [
  { h: "nw", style: { left: 0, top: 0 }, cursor: "nwse-resize" },
  { h: "n", style: { left: "50%", top: 0 }, cursor: "ns-resize" },
  { h: "ne", style: { left: "100%", top: 0 }, cursor: "nesw-resize" },
  { h: "e", style: { left: "100%", top: "50%" }, cursor: "ew-resize" },
  { h: "se", style: { left: "100%", top: "100%" }, cursor: "nwse-resize" },
  { h: "s", style: { left: "50%", top: "100%" }, cursor: "ns-resize" },
  { h: "sw", style: { left: 0, top: "100%" }, cursor: "nesw-resize" },
  { h: "w", style: { left: 0, top: "50%" }, cursor: "ew-resize" },
];

interface Guides {
  v: number[];
  h: number[];
}

/** Mencari pergeseran snap terdekat dari titik-titik ke garis target. */
function snapDelta(points: number[], targets: number[], threshold: number): { delta: number; lines: number[] } {
  let best: { delta: number; line: number } | null = null;
  for (const p of points) {
    for (const t of targets) {
      const d = t - p;
      if (Math.abs(d) <= threshold && (!best || Math.abs(d) < Math.abs(best.delta))) best = { delta: d, line: t };
    }
  }
  if (!best) return { delta: 0, lines: [] };
  const lines = points.map((p) => p + best!.delta).filter((p) => targets.some((t) => Math.abs(t - p) < 0.5));
  return { delta: best.delta, lines: [...new Set(lines)] };
}

function onWindowDrag(move: (e: PointerEvent) => void, up: (e: PointerEvent) => void) {
  const handleUp = (e: PointerEvent) => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", handleUp);
    up(e);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", handleUp);
}

export function CanvasEditable({ section }: { section: Section }) {
  const selectedId = useEditor((s) => s.selectedId);
  const selectedEls = useEditor((s) => s.selectedEls);
  const selectElements = useEditor((s) => s.selectElements);
  const beginGesture = useEditor((s) => s.beginGesture);
  const updateLive = useEditor((s) => s.updateLive);
  const updateElements = useEditor((s) => s.updateElements);
  const addElement = useEditor((s) => s.addElement);

  const frameRef = useRef<HTMLDivElement>(null);
  const [guides, setGuides] = useState<Guides>({ v: [], h: [] });
  const [marquee, setMarquee] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const height = canvasHeight(section.props);
  const elements = canvasElements(section.props.elements);
  const active = selectedId === section.id;
  const sel = active ? selectedEls : [];

  const scale = () => (frameRef.current?.getBoundingClientRect().width ?? CANVAS_WIDTH) / CANVAS_WIDTH;
  const toDesign = (e: { clientX: number; clientY: number }) => {
    const r = frameRef.current!.getBoundingClientRect();
    const s = r.width / CANVAS_WIDTH;
    return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
  };

  const snapTargets = (exclude: string[]) => {
    const others = elements.filter((el) => !exclude.includes(el.id) && !el.hidden);
    return {
      v: [0, CANVAS_WIDTH / 2, CANVAS_WIDTH, ...others.flatMap((o) => [o.x, o.x + o.w / 2, o.x + o.w])],
      h: [0, height / 2, height, ...others.flatMap((o) => [o.y, o.y + o.h / 2, o.y + o.h])],
    };
  };

  const live = (ids: string[], fn: (el: CanvasElement) => Partial<CanvasElement>) =>
    updateLive((d: PortfolioData) => patchElements(d, section.id, ids, fn));

  // ---------- geser ----------
  function startMove(e: React.PointerEvent, el: CanvasElement) {
    if (e.button !== 0) return;
    e.stopPropagation();
    if (editingId === el.id) return;

    let ids: string[];
    if (e.shiftKey) {
      ids = sel.includes(el.id) ? sel.filter((i) => i !== el.id) : [...sel, el.id];
      selectElements(section.id, ids);
      return;
    }
    ids = sel.includes(el.id) ? sel : [el.id];
    selectElements(section.id, ids);
    const movable = elements.filter((x) => ids.includes(x.id) && !x.locked);
    if (!movable.length) return;

    const starts = new Map(movable.map((m) => [m.id, { x: m.x, y: m.y }]));
    const box = {
      x: Math.min(...movable.map((m) => m.x)),
      y: Math.min(...movable.map((m) => m.y)),
      r: Math.max(...movable.map((m) => m.x + m.w)),
      b: Math.max(...movable.map((m) => m.y + m.h)),
    };
    const targets = snapTargets([...starts.keys()]);
    const s = scale();
    const origin = { x: e.clientX, y: e.clientY };
    let started = false;

    onWindowDrag(
      (ev) => {
        let dx = (ev.clientX - origin.x) / s;
        let dy = (ev.clientY - origin.y) / s;
        if (!started) {
          if (Math.hypot(dx, dy) < 2) return;
          started = true;
          beginGesture();
        }
        let gv: number[] = [];
        let gh: number[] = [];
        if (!ev.altKey) {
          const sx = snapDelta([box.x + dx, (box.x + box.r) / 2 + dx, box.r + dx], targets.v, SNAP_PX / s);
          const sy = snapDelta([box.y + dy, (box.y + box.b) / 2 + dy, box.b + dy], targets.h, SNAP_PX / s);
          dx += sx.delta;
          dy += sy.delta;
          gv = sx.lines;
          gh = sy.lines;
        }
        setGuides({ v: gv, h: gh });
        live([...starts.keys()], (m) => ({ x: Math.round(starts.get(m.id)!.x + dx), y: Math.round(starts.get(m.id)!.y + dy) }));
      },
      () => setGuides({ v: [], h: [] }),
    );
  }

  // ---------- ubah ukuran ----------
  function startResize(e: React.PointerEvent, el: CanvasElement, handle: Handle) {
    e.stopPropagation();
    if (el.locked) return;
    beginGesture();
    const s = scale();
    const start = { x: el.x, y: el.y, w: el.w, h: el.h };
    const origin = { x: e.clientX, y: e.clientY };
    const targets = snapTargets([el.id]);
    const ratio = start.w / start.h;

    onWindowDrag(
      (ev) => {
        const dx = (ev.clientX - origin.x) / s;
        const dy = (ev.clientY - origin.y) / s;
        let { x, y, w, h } = start;
        if (handle.includes("e")) w = start.w + dx;
        if (handle.includes("w")) {
          w = start.w - dx;
          x = start.x + dx;
        }
        if (handle.includes("s")) h = start.h + dy;
        if (handle.includes("n")) {
          h = start.h - dy;
          y = start.y + dy;
        }
        // Snap tepi yang sedang ditarik.
        const gv: number[] = [];
        const gh: number[] = [];
        if (!ev.altKey) {
          if (handle.includes("e")) {
            const r = snapDelta([x + w], targets.v, SNAP_PX / s);
            w += r.delta;
            gv.push(...r.lines);
          }
          if (handle.includes("w")) {
            const r = snapDelta([x], targets.v, SNAP_PX / s);
            x += r.delta;
            w -= r.delta;
            gv.push(...r.lines);
          }
          if (handle.includes("s")) {
            const r = snapDelta([y + h], targets.h, SNAP_PX / s);
            h += r.delta;
            gh.push(...r.lines);
          }
          if (handle.includes("n")) {
            const r = snapDelta([y], targets.h, SNAP_PX / s);
            y += r.delta;
            h -= r.delta;
            gh.push(...r.lines);
          }
        }
        // Shift (atau gambar di sudut) menjaga proporsi.
        if ((ev.shiftKey || el.type === "image") && handle.length === 2) {
          if (Math.abs(w / start.w) > Math.abs(h / start.h)) {
            const nh = w / ratio;
            if (handle.includes("n")) y += h - nh;
            h = nh;
          } else {
            const nw = h * ratio;
            if (handle.includes("w")) x += w - nw;
            w = nw;
          }
        }
        w = Math.max(8, w);
        h = Math.max(8, h);
        setGuides({ v: gv, h: gh });
        live([el.id], () => ({ x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) }));
      },
      () => setGuides({ v: [], h: [] }),
    );
  }

  // ---------- putar ----------
  function startRotate(e: React.PointerEvent, el: CanvasElement) {
    e.stopPropagation();
    if (el.locked) return;
    beginGesture();
    const r = frameRef.current!.getBoundingClientRect();
    const s = r.width / CANVAS_WIDTH;
    const cx = r.left + (el.x + el.w / 2) * s;
    const cy = r.top + (el.y + el.h / 2) * s;
    onWindowDrag(
      (ev) => {
        let deg = (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI + 90;
        if (ev.shiftKey) deg = Math.round(deg / 15) * 15;
        deg = ((Math.round(deg) % 360) + 540) % 360 - 180;
        live([el.id], () => ({ rotation: deg }));
      },
      () => undefined,
    );
  }

  // ---------- seleksi kotak ----------
  function startMarquee(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.stopPropagation();
    // Simpan teks yang sedang diketik (blur memicu commitText) sebelum seleksi berubah.
    const active = document.activeElement as HTMLElement | null;
    if (active?.isContentEditable) active.blur();
    useEditor.getState().select(section.id);
    if (!e.shiftKey) selectElements(section.id, []);
    const a = toDesign(e);
    const base = e.shiftKey ? sel : [];
    onWindowDrag(
      (ev) => {
        const b = toDesign(ev);
        const rect = { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
        setMarquee(rect);
        const hit = elements
          .filter((el) => !el.hidden && !el.locked)
          .filter((el) => el.x < rect.x + rect.w && el.x + el.w > rect.x && el.y < rect.y + rect.h && el.y + el.h > rect.y)
          .map((el) => el.id);
        selectElements(section.id, [...new Set([...base, ...hit])]);
      },
      () => setMarquee(null),
    );
  }

  function commitText(el: CanvasElement, text: string) {
    setEditingId(null);
    if (text !== el.text) updateElements(section.id, [el.id], { text }, false);
  }

  const single = sel.length === 1 ? elements.find((x) => x.id === sel[0]) : undefined;
  const pctX = (v: number) => `${(v / CANVAS_WIDTH) * 100}%`;
  const pctY = (v: number) => `${(v / height) * 100}%`;

  return (
    <div className="relative">
      {active && <CanvasToolbar onAdd={(t) => addElement(section.id, t, height)} />}
      <CanvasView
        p={section.props}
        frameRef={frameRef}
        onFramePointerDown={startMarquee}
        renderElement={(el, i, body) => {
          const isSel = sel.includes(el.id);
          return (
            <div
              data-element={el.id}
              style={{ ...elementBoxStyle(el, height, i), opacity: el.hidden ? 0.2 : (el.opacity ?? 1) }}
              className={`group/el ${el.locked ? "" : "cursor-move"}`}
              onPointerDown={(e) => startMove(e, el)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if ((el.type === "text" || el.type === "button") && !el.locked) setEditingId(el.id);
              }}
            >
              {editingId === el.id ? <InlineText el={el} onDone={(t) => commitText(el, t)} /> : body}
              {/* garis seleksi dan hover */}
              <div
                className={`pointer-events-none absolute inset-0 ${isSel ? "" : "opacity-0 group-hover/el:opacity-100"}`}
                style={{ outline: `${isSel ? 2 : 1}px solid ${FIGMA_BLUE}`, outlineOffset: 0 }}
              />
              {isSel && single?.id === el.id && !el.locked && editingId !== el.id && (
                <>
                  {HANDLES.map(({ h, style, cursor }) => (
                    <span
                      key={h}
                      onPointerDown={(e) => startResize(e, el, h)}
                      className="absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 border-[1.5px] bg-white"
                      style={{ ...style, cursor, borderColor: FIGMA_BLUE }}
                    />
                  ))}
                  <span
                    title="Putar (Shift: per 15°)"
                    onPointerDown={(e) => startRotate(e, el)}
                    className="absolute left-1/2 top-0 z-10 h-3 w-3 -translate-x-1/2 -translate-y-[22px] cursor-grab rounded-full border-[1.5px] bg-white"
                    style={{ borderColor: FIGMA_BLUE }}
                  />
                  <span
                    className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
                    style={{ background: FIGMA_BLUE }}
                  >
                    {el.w} × {el.h}
                  </span>
                </>
              )}
            </div>
          );
        }}
        overlay={
          <>
            {guides.v.map((x) => (
              <div key={`v${x}`} className="pointer-events-none absolute top-0 bottom-0 z-[9999] w-px bg-[#ff3d71]" style={{ left: pctX(x) }} />
            ))}
            {guides.h.map((y) => (
              <div key={`h${y}`} className="pointer-events-none absolute left-0 right-0 z-[9999] h-px bg-[#ff3d71]" style={{ top: pctY(y) }} />
            ))}
            {marquee && (
              <div
                className="pointer-events-none absolute z-[9999] border"
                style={{
                  left: pctX(marquee.x),
                  top: pctY(marquee.y),
                  width: pctX(marquee.w),
                  height: pctY(marquee.h),
                  borderColor: FIGMA_BLUE,
                  background: "rgba(13,153,255,0.08)",
                }}
              />
            )}
          </>
        }
      />
    </div>
  );
}

function InlineText({ el, onDone }: { el: CanvasElement; onDone: (text: string) => void }) {
  return (
    <div
      ref={(node) => {
        if (node && document.activeElement !== node) {
          node.focus();
          const range = document.createRange();
          range.selectNodeContents(node);
          window.getSelection()?.removeAllRanges();
          window.getSelection()?.addRange(range);
        }
      }}
      contentEditable
      suppressContentEditableWarning
      className="h-full w-full cursor-text outline-none"
      style={{
        ...textStyle(el),
        display: el.type === "button" ? "flex" : undefined,
        alignItems: "center",
        justifyContent: el.align === "left" ? "flex-start" : el.align === "right" ? "flex-end" : "center",
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Escape") (e.target as HTMLElement).blur();
        e.stopPropagation();
      }}
      onBlur={(e) => onDone(e.currentTarget.innerText.replace(/\n$/, ""))}
    >
      {el.text}
    </div>
  );
}

const TOOLS: { type: CanvasElementType; label: string; icon: string }[] = [
  { type: "text", label: "Teks", icon: "T" },
  { type: "image", label: "Gambar", icon: "▣" },
  { type: "shape", label: "Bentuk", icon: "◆" },
  { type: "button", label: "Tombol", icon: "▭" },
];

function CanvasToolbar({ onAdd }: { onAdd: (t: CanvasElementType) => void }) {
  return (
    <div
      className="absolute left-1/2 top-3 z-[10000] flex -translate-x-1/2 gap-1 rounded-xl bg-[#1e1e1e] p-1 shadow-lg"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {TOOLS.map((t) => (
        <button
          key={t.type}
          type="button"
          onClick={() => onAdd(t.type)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
          title={`Tambah ${t.label.toLowerCase()}`}
        >
          <span className="text-sm leading-none">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** Pintasan keyboard kanvas. Mengembalikan true jika tombol ditangani. */
export function handleCanvasKey(e: KeyboardEvent): boolean {
  const st = useEditor.getState();
  const section = st.data.sections.find((s) => s.id === st.selectedId);
  if (!section || section.type !== "canvas") return false;
  const ids = st.selectedEls;
  const mod = e.ctrlKey || e.metaKey;
  const k = e.key.toLowerCase();

  if (mod && k === "v") {
    st.pasteElements(section.id);
    return true;
  }
  if (mod && k === "a") {
    st.selectElements(section.id, canvasElements(section.props.elements).filter((el) => !el.locked && !el.hidden).map((el) => el.id));
    return true;
  }
  if (!ids.length) return false;

  if (k === "delete" || k === "backspace") {
    st.removeElements(section.id, ids);
    return true;
  }
  if (k === "escape") {
    st.selectElements(section.id, []);
    return true;
  }
  if (mod && k === "d") {
    st.duplicateElements(section.id, ids);
    return true;
  }
  if (mod && k === "c") {
    st.copyElements(section.id, ids);
    return true;
  }
  if (mod && k === "x") {
    st.copyElements(section.id, ids);
    st.removeElements(section.id, ids);
    return true;
  }
  if (k === "]" || k === "[") {
    const to = k === "]" ? (mod ? "front" : "forward") : mod ? "back" : "backward";
    ids.forEach((id) => st.moveLayer(section.id, id, to));
    return true;
  }
  const arrows: Record<string, [number, number]> = { arrowleft: [-1, 0], arrowright: [1, 0], arrowup: [0, -1], arrowdown: [0, 1] };
  if (arrows[k]) {
    const step = e.shiftKey ? 10 : 1;
    const [dx, dy] = arrows[k];
    st.updateElements(section.id, ids, (el) => (el.locked ? {} : { x: el.x + dx * step, y: el.y + dy * step }), `nudge:${ids.join(",")}`);
    return true;
  }
  return false;
}

export { ElementBody };
