// Font gratis untuk komersial dari Google Fonts.
export const FONTS: { name: string; kind: "sans" | "serif" | "display" | "mono" }[] = [
  { name: "Inter", kind: "sans" },
  { name: "Plus Jakarta Sans", kind: "sans" },
  { name: "Manrope", kind: "sans" },
  { name: "Poppins", kind: "sans" },
  { name: "Space Grotesk", kind: "sans" },
  { name: "DM Sans", kind: "sans" },
  { name: "Playfair Display", kind: "serif" },
  { name: "Lora", kind: "serif" },
  { name: "Cormorant Garamond", kind: "serif" },
  { name: "Libre Baskerville", kind: "serif" },
  { name: "Fraunces", kind: "serif" },
  { name: "DM Serif Display", kind: "display" },
  { name: "Archivo Black", kind: "display" },
  { name: "Syne", kind: "display" },
  { name: "Bricolage Grotesque", kind: "display" },
  { name: "Cinzel", kind: "display" },
  { name: "Great Vibes", kind: "display" },
  { name: "IBM Plex Mono", kind: "mono" },
  { name: "Space Mono", kind: "mono" },
];

const FALLBACK: Record<string, string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  display: "ui-sans-serif, system-ui, sans-serif",
  mono: "ui-monospace, monospace",
};

export function fontStack(name: string): string {
  const f = FONTS.find((x) => x.name === name);
  return `"${name}", ${FALLBACK[f?.kind ?? "sans"]}`;
}

/** URL stylesheet Google Fonts untuk sekumpulan font. */
export function googleFontsHref(names: string[]): string | null {
  const known = [...new Set(names)].filter((n) => FONTS.some((f) => f.name === n));
  if (known.length === 0) return null;
  const families = known
    .map((n) => {
      const fam = n.replace(/ /g, "+");
      // Font yang hanya punya satu ketebalan
      if (["Archivo Black", "DM Serif Display", "Libre Baskerville", "Space Mono", "Great Vibes"].includes(n)) {
        return `family=${fam}`;
      }
      return `family=${fam}:wght@400;500;600;700`;
    })
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
