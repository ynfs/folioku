"use client";

import { create } from "zustand";
import { createSection, newId } from "@/lib/sections";
import type { PortfolioData, PropValue, SectionType, Theme } from "@/lib/types";

const HISTORY_LIMIT = 100;
/** Ketikan beruntun pada field yang sama digabung menjadi satu langkah undo. */
const MERGE_MS = 1000;

interface EditorState {
  data: PortfolioData;
  past: PortfolioData[];
  future: PortfolioData[];
  selectedId: string | null;
  lastKey: string | null;
  lastAt: number;

  init(data: PortfolioData): void;
  select(id: string | null): void;
  undo(): void;
  redo(): void;

  updateProp(sectionId: string, key: string, value: PropValue): void;
  updateTheme<K extends keyof Theme>(key: K, value: Theme[K]): void;
  addSection(type: SectionType): void;
  duplicateSection(id: string): void;
  removeSection(id: string): void;
  moveSection(from: number, to: number): void;
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

  return {
    data: { theme: {} as Theme, sections: [] },
    past: [],
    future: [],
    selectedId: null,
    lastKey: null,
    lastAt: 0,

    init(data) {
      set({ data, past: [], future: [], selectedId: data.sections[0]?.id ?? null, lastKey: null, lastAt: 0 });
    },

    select(id) {
      set({ selectedId: id });
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
        { selectedId: section.id },
      );
    },

    duplicateSection(id) {
      const { data } = get();
      const idx = data.sections.findIndex((s) => s.id === id);
      if (idx === -1) return;
      const copy = { ...structuredClone(data.sections[idx]), id: newId() };
      apply(
        (d) => {
          const sections = [...d.sections];
          sections.splice(idx + 1, 0, copy);
          return { ...d, sections };
        },
        undefined,
        { selectedId: copy.id },
      );
    },

    removeSection(id) {
      const { data } = get();
      const idx = data.sections.findIndex((s) => s.id === id);
      const rest = data.sections.filter((s) => s.id !== id);
      const nextSel = rest[Math.min(idx, rest.length - 1)]?.id ?? null;
      apply((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }), undefined, { selectedId: nextSel });
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
  };
});
