"use client";

import { create } from "zustand";
import { canvasElements, createElement, newElementId } from "@/lib/canvas";
import { createSection, newId } from "@/lib/sections";
import type { CanvasElement, CanvasElementType, PortfolioData, PropValue, SectionType, Theme } from "@/lib/types";

const HISTORY_LIMIT = 100;
/** Ketikan beruntun pada field yang sama digabung menjadi satu langkah undo. */
const MERGE_MS = 1000;

type ElementPatch = Partial<CanvasElement> | ((el: CanvasElement) => Partial<CanvasElement>);
export type LayerMove = "front" | "forward" | "backward" | "back";

interface EditorState {
  data: PortfolioData;
  past: PortfolioData[];
  future: PortfolioData[];
  selectedId: string | null;
  /** Elemen kanvas yang dipilih (di dalam section terpilih). */
  selectedEls: string[];
  clipboard: CanvasElement[];
  lastKey: string | null;
  lastAt: number;

  init(data: PortfolioData): void;
  select(id: string | null): void;
  selectElements(sectionId: string, ids: string[]): void;
  undo(): void;
  redo(): void;
  /** Mulai gestur (geser/ubah ukuran): simpan satu langkah undo. */
  beginGesture(): void;
  /** Perubahan selama gestur, tanpa menambah riwayat. */
  updateLive(fn: (d: PortfolioData) => PortfolioData): void;

  updateProp(sectionId: string, key: string, value: PropValue): void;
  updateTheme<K extends keyof Theme>(key: K, value: Theme[K]): void;
  addSection(type: SectionType): void;
  duplicateSection(id: string): void;
  removeSection(id: string): void;
  moveSection(from: number, to: number): void;

  // ---- kanvas ----
  addElement(sectionId: string, type: CanvasElementType, frameHeight: number): void;
  /** mergeKey false = selalu jadi langkah undo tersendiri. */
  updateElements(sectionId: string, ids: string[], patch: ElementPatch, mergeKey?: string | false): void;
  removeElements(sectionId: string, ids: string[]): void;
  duplicateElements(sectionId: string, ids: string[]): void;
  copyElements(sectionId: string, ids: string[]): void;
  pasteElements(sectionId: string): void;
  moveLayer(sectionId: string, id: string, to: LayerMove): void;
}

/** Mengubah daftar elemen di satu section kanvas. */
export function mapElements(d: PortfolioData, sectionId: string, fn: (els: CanvasElement[]) => CanvasElement[]): PortfolioData {
  return {
    ...d,
    sections: d.sections.map((s) => (s.id === sectionId ? { ...s, props: { ...s.props, elements: fn(canvasElements(s.props.elements)) } } : s)),
  };
}

export function patchElements(d: PortfolioData, sectionId: string, ids: string[], patch: ElementPatch): PortfolioData {
  return mapElements(d, sectionId, (els) =>
    els.map((el) => (ids.includes(el.id) ? { ...el, ...(typeof patch === "function" ? patch(el) : patch) } : el)),
  );
}

export const useEditor = create<EditorState>((set, get) => {
  /** Menerapkan perubahan dan mencatatnya di riwayat undo. */
  function apply(fn: (d: PortfolioData) => PortfolioData, mergeKey?: string, extra?: Partial<EditorState>) {
    const { data, past, lastKey, lastAt } = get();
    const now = Date.now();
    const merge = mergeKey !== undefined && mergeKey === lastKey && now - lastAt < MERGE_MS;
    set({
      data: fn(data),
      past: merge ? past : [...past, data].slice(-HISTORY_LIMIT),
      future: [],
      lastKey: mergeKey ?? null,
      lastAt: now,
      ...extra,
    });
  }

  const elementsOf = (sectionId: string) => canvasElements(get().data.sections.find((s) => s.id === sectionId)?.props.elements);

  return {
    data: { theme: {} as Theme, sections: [] },
    past: [],
    future: [],
    selectedId: null,
    selectedEls: [],
    clipboard: [],
    lastKey: null,
    lastAt: 0,

    init(data) {
      set({ data, past: [], future: [], selectedId: data.sections[0]?.id ?? null, selectedEls: [], lastKey: null, lastAt: 0 });
    },

    select(id) {
      // Memilih section yang sama tidak menghapus pilihan elemen di dalamnya.
      if (id !== get().selectedId) set({ selectedId: id, selectedEls: [] });
    },

    selectElements(sectionId, ids) {
      set({ selectedId: sectionId, selectedEls: ids });
    },

    undo() {
      const { past, data, future } = get();
      if (!past.length) return;
      set({ data: past[past.length - 1], past: past.slice(0, -1), future: [data, ...future], lastKey: null });
    },

    redo() {
      const { past, data, future } = get();
      if (!future.length) return;
      set({ data: future[0], past: [...past, data], future: future.slice(1), lastKey: null });
    },

    beginGesture() {
      const { data, past } = get();
      set({ past: [...past, data].slice(-HISTORY_LIMIT), future: [], lastKey: null });
    },

    updateLive(fn) {
      set({ data: fn(get().data) });
    },

    updateProp(sectionId, key, value) {
      apply(
        (d) => ({
          ...d,
          sections: d.sections.map((s) => (s.id === sectionId ? { ...s, props: { ...s.props, [key]: value } } : s)),
        }),
        `${sectionId}:${key}`,
      );
    },

    updateTheme(key, value) {
      apply((d) => ({ ...d, theme: { ...d.theme, [key]: value } }), `theme:${key}`);
    },

    addSection(type) {
      const section = createSection(type);
      const { selectedId, data } = get();
      const idx = data.sections.findIndex((s) => s.id === selectedId);
      apply(
        (d) => {
          const sections = [...d.sections];
          sections.splice(idx === -1 ? sections.length : idx + 1, 0, section);
          return { ...d, sections };
        },
        undefined,
        { selectedId: section.id, selectedEls: [] },
      );
    },

    duplicateSection(id) {
      const { data } = get();
      const idx = data.sections.findIndex((s) => s.id === id);
      if (idx === -1) return;
      const copy = { ...structuredClone(data.sections[idx]), id: newId() };
      if (copy.type === "canvas") {
        copy.props.elements = canvasElements(copy.props.elements).map((e) => ({ ...e, id: newElementId() }));
      }
      apply(
        (d) => {
          const sections = [...d.sections];
          sections.splice(idx + 1, 0, copy);
          return { ...d, sections };
        },
        undefined,
        { selectedId: copy.id, selectedEls: [] },
      );
    },

    removeSection(id) {
      const { data } = get();
      const idx = data.sections.findIndex((s) => s.id === id);
      const rest = data.sections.filter((s) => s.id !== id);
      const nextSel = rest[Math.min(idx, rest.length - 1)]?.id ?? null;
      apply((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }), undefined, { selectedId: nextSel, selectedEls: [] });
    },

    moveSection(from, to) {
      const { data } = get();
      if (from === to || to < 0 || to >= data.sections.length) return;
      apply((d) => {
        const sections = [...d.sections];
        const [item] = sections.splice(from, 1);
        sections.splice(to, 0, item);
        return { ...d, sections };
      });
    },

    // ---------- kanvas ----------

    addElement(sectionId, type, frameHeight) {
      const el = createElement(type, frameHeight);
      apply((d) => mapElements(d, sectionId, (els) => [...els, el]), undefined, { selectedId: sectionId, selectedEls: [el.id] });
    },

    updateElements(sectionId, ids, patch, mergeKey) {
      if (!ids.length) return;
      apply((d) => patchElements(d, sectionId, ids, patch), mergeKey === false ? undefined : mergeKey ?? `${sectionId}:${ids.join(",")}:${Object.keys(typeof patch === "function" ? {} : patch).join(",")}`);
    },

    removeElements(sectionId, ids) {
      if (!ids.length) return;
      apply((d) => mapElements(d, sectionId, (els) => els.filter((e) => !ids.includes(e.id))), undefined, { selectedEls: [] });
    },

    duplicateElements(sectionId, ids) {
      const copies = elementsOf(sectionId)
        .filter((e) => ids.includes(e.id))
        .map((e) => ({ ...structuredClone(e), id: newElementId(), x: e.x + 20, y: e.y + 20, locked: false }));
      if (!copies.length) return;
      apply((d) => mapElements(d, sectionId, (els) => [...els, ...copies]), undefined, { selectedEls: copies.map((c) => c.id) });
    },

    copyElements(sectionId, ids) {
      set({ clipboard: structuredClone(elementsOf(sectionId).filter((e) => ids.includes(e.id))) });
    },

    pasteElements(sectionId) {
      const { clipboard } = get();
      if (!clipboard.length) return;
      const copies = clipboard.map((e) => ({ ...structuredClone(e), id: newElementId(), x: e.x + 20, y: e.y + 20 }));
      // Tempel berikutnya bergeser lagi agar tidak menumpuk persis.
      set({ clipboard: copies });
      apply((d) => mapElements(d, sectionId, (els) => [...els, ...copies]), undefined, { selectedId: sectionId, selectedEls: copies.map((c) => c.id) });
    },

    moveLayer(sectionId, id, to) {
      apply((d) =>
        mapElements(d, sectionId, (els) => {
          const i = els.findIndex((e) => e.id === id);
          if (i === -1) return els;
          const next = [...els];
          const [el] = next.splice(i, 1);
          const target = { front: next.length, back: 0, forward: Math.min(next.length, i + 1), backward: Math.max(0, i - 1) }[to];
          next.splice(target, 0, el);
          return next;
        }),
      );
    },
  };
});
