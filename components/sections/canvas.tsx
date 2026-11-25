/* eslint-disable @next/next/no-img-element -- gambar bisa berasal dari URL apa pun milik klien */
import type { CSSProperties, ReactNode } from "react";
import { CANVAS_WIDTH, canvasElements, cssColor } from "@/lib/canvas";
import { fontStack } from "@/lib/fonts";
import type { CanvasElement, PropValue } from "@/lib/types";

// Bagian "Desain Bebas": frame dengan elemen berposisi bebas (ala Figma).
// Frame memakai rasio tetap 1200 × tinggi, dan ukuran huruf memakai satuan cqw
// sehingga seluruh desain mengecil proporsional di layar yang lebih sempit.

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const cqw = (px: number) => `${(px / CANVAS_WIDTH) * 100}cqw`;

export function safeHref(url: string | undefined): string {
  const u = (url ?? "").trim();
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:)/i.test(u) || u.startsWith("#") || (u.startsWith("/") && !u.startsWith("//"))) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return "#";
  return `https://${u}`;
}

function fontOf(f: string | undefined): string {
  if (!f || f === "body") return "var(--fb)";
  if (f === "heading") return "var(--fh)";
  return fontStack(f);
}

export function textStyle(el: CanvasElement): CSSProperties {
  return {
    fontFamily: fontOf(el.fontFamily),
    fontSize: cqw(el.fontSize ?? 20),
    fontWeight: el.fontWeight ?? 400,
    fontStyle: el.italic ? "italic" : undefined,
    textTransform: el.uppercase ? "uppercase" : undefined,
    textAlign: el.align ?? "left",
    lineHeight: el.lineHeight ?? 1.3,
    letterSpacing: el.letterSpacing ? cqw(el.letterSpacing) : undefined,
    color: cssColor(el.color, "var(--c-text)"),
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
  };
}

/** Isi visual sebuah elemen (tanpa posisi). */
export function ElementBody({ el, editing }: { el: CanvasElement; editing?: boolean }) {
  const radius = el.radius ? cqw(el.radius) : undefined;
  switch (el.type) {
    case "text":
      return editing ? null : (
        <div className="h-full w-full" style={textStyle(el)}>
          {el.text}
        </div>
      );
    case "image":
      return el.src ? (
        <img src={el.src} alt={el.name ?? ""} draggable={false} className="h-full w-full select-none" style={{ objectFit: el.fit ?? "cover", borderRadius: radius }} />
      ) : (
        <div className="grid h-full w-full place-items-center bg-black/10 text-xs" style={{ borderRadius: radius }}>
          Gambar
        </div>
      );
    case "shape":
      return (
        <div
          className="h-full w-full"
          style={{
            background: cssColor(el.fill),
            borderRadius: radius,
            border: el.borderWidth ? `${cqw(el.borderWidth)} solid ${cssColor(el.borderColor, "var(--c-text)")}` : undefined,
          }}
        />
      );
    case "button":
      return (
        <a
          href={safeHref(el.link)}
          className="flex h-full w-full items-center"
          style={{
            ...textStyle(el),
            justifyContent: el.align === "left" ? "flex-start" : el.align === "right" ? "flex-end" : "center",
            padding: `0 ${cqw(16)}`,
            background: cssColor(el.fill),
            borderRadius: radius,
            border: el.borderWidth ? `${cqw(el.borderWidth)} solid ${cssColor(el.borderColor, "var(--c-text)")}` : undefined,
            whiteSpace: "nowrap",
            textDecoration: "none",
          }}
        >
          {editing ? null : el.text}
        </a>
      );
  }
}

export function elementBoxStyle(el: CanvasElement, height: number, index: number): CSSProperties {
  return {
    position: "absolute",
    left: pct(el.x, CANVAS_WIDTH),
    top: pct(el.y, height),
    width: pct(el.w, CANVAS_WIDTH),
    height: pct(el.h, height),
    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
    opacity: el.opacity ?? 1,
    zIndex: index + 1,
  };
}

export function canvasHeight(p: Record<string, PropValue>): number {
  return Math.max(120, Number(p.height) || 600);
}

export function CanvasView({
  p,
  renderElement,
  overlay,
  frameRef,
  onFramePointerDown,
}: {
  p: Record<string, PropValue>;
  /** Dipakai editor untuk membungkus elemen dengan pegangan geser/ubah ukuran. */
  renderElement?: (el: CanvasElement, index: number, body: ReactNode) => ReactNode;
  overlay?: ReactNode;
  frameRef?: React.Ref<HTMLDivElement>;
  onFramePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}) {
  const height = canvasHeight(p);
  const elements = canvasElements(p.elements);
  const bgImage = typeof p.backgroundImage === "string" && p.backgroundImage ? p.backgroundImage : "";
  return (
    <section
      ref={frameRef}
      onPointerDown={onFramePointerDown}
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: `${CANVAS_WIDTH} / ${height}`,
        containerType: "inline-size",
        background: cssColor(typeof p.background === "string" ? p.background : "", "var(--c-bg)"),
        backgroundImage: bgImage ? `url("${bgImage.replace(/["\\]/g, "")}")` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {elements.map((el, i) => {
        if (el.hidden && !renderElement) return null;
        const body = <ElementBody el={el} />;
        return renderElement ? (
          <div key={el.id}>{renderElement(el, i, body)}</div>
        ) : (
          <div key={el.id} style={elementBoxStyle(el, height, i)}>
            {body}
          </div>
        );
      })}
      {overlay}
    </section>
  );
}
