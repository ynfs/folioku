import type { CSSProperties, ReactNode } from "react";
import { SectionView } from "@/components/sections";
import { canvasElements, canvasFonts } from "@/lib/canvas";
import { fontStack, googleFontsHref } from "@/lib/fonts";
import type { PortfolioData, Section, Theme } from "@/lib/types";

// Mengubah JSON portofolio (theme + sections) menjadi halaman.

const RADIUS = { none: "0px", sm: "6px", lg: "20px" } as const;

export function themeVars(theme: Theme): CSSProperties {
  return {
    "--fh": fontStack(theme.fontHeading),
    "--fb": fontStack(theme.fontBody),
    "--c-text": theme.colorPrimary,
    "--c-accent": theme.colorAccent,
    "--c-bg": theme.colorBackground,
    "--c-surface": theme.colorSurface || theme.colorBackground,
    "--radius": RADIUS[theme.radius ?? "sm"],
    "--hcase": theme.headingCase === "uppercase" ? "uppercase" : "none",
  } as CSSProperties;
}

export function FontLinks({ theme, extra = [] }: { theme: Theme; extra?: string[] }) {
  const href = googleFontsHref([theme.fontHeading, theme.fontBody, ...extra]);
  if (!href) return null;
  // React 19 memindahkan <link precedence> ke <head> dan menghapus duplikat.
  return <link rel="stylesheet" href={href} precedence="default" />;
}

/** Font tambahan yang dipakai elemen di bagian Desain Bebas. */
function usedFonts(data: PortfolioData): string[] {
  return data.sections.filter((s) => s.type === "canvas").flatMap((s) => canvasFonts(canvasElements(s.props.elements)));
}

export function Portfolio({
  data,
  renderSection,
  className = "",
}: {
  data: PortfolioData;
  /** Dipakai editor untuk membungkus section (klik untuk memilih). */
  renderSection?: (section: Section, node: ReactNode) => ReactNode;
  className?: string;
}) {
  return (
    <div className={`pf-root ${className}`} style={themeVars(data.theme)}>
      <FontLinks theme={data.theme} extra={usedFonts(data)} />
      {data.sections.map((section) => {
        const node = <SectionView section={section} />;
        return renderSection ? (
          <div key={section.id}>{renderSection(section, node)}</div>
        ) : (
          <div key={section.id}>{node}</div>
        );
      })}
    </div>
  );
}

/** Pratinjau kecil (thumbnail) dengan merender halaman lebar 1280px lalu diperkecil. */
export function PortfolioThumb({ data, height = 220 }: { data: PortfolioData; height?: number }) {
  const scale = 0.3;
  return (
    <div className="relative w-full overflow-hidden" style={{ height, background: data.theme.colorBackground }} aria-hidden>
      <div className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: 1280, transform: `scale(${scale})` }}>
        <Portfolio data={{ ...data, sections: data.sections.slice(0, 3) }} />
      </div>
    </div>
  );
}
