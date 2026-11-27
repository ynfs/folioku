// Ikon aplikasi Safantara: gambar garis putih di atas ubin bergradasi.
// Dipakai di menu Aplikasi, beranda, dashboard, dan tab produk.

export type AppIconName = "undangan" | "adat" | "proposal" | "portofolio" | "rsvp" | "persetujuan" | "editor" | "custom" | "kopi";

const GRADIENTS: Record<AppIconName, [string, string]> = {
  undangan: ["#FF8A9B", "#D9365E"],
  adat: ["#C9973F", "#6E3B12"],
  proposal: ["#4FB6FF", "#2563EB"],
  portofolio: ["#A78BFA", "#6D28D9"],
  rsvp: ["#34D399", "#0E8F6B"],
  persetujuan: ["#2DD4BF", "#0F766E"],
  editor: ["#FF8A3D", "#F0532D"],
  custom: ["#FBBF24", "#E36414"],
  kopi: ["#B07A4F", "#4A2A16"],
};

const S = { fill: "none", stroke: "#fff", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Glyph({ name }: { name: AppIconName }) {
  switch (name) {
    case "undangan": // amplop dengan hati
      return (
        <>
          <rect x="9" y="13" width="22" height="16" rx="2.5" {...S} />
          <path d="M9.8 14.5 20 22l10.2-7.5" {...S} />
          <path d="M20 9.6c-.9-1.6-3.4-1.4-3.4.6 0 1.4 1.7 2.5 3.4 3.6 1.7-1.1 3.4-2.2 3.4-3.6 0-2-2.5-2.2-3.4-.6z" fill="#fff" />
        </>
      );
    case "adat": // gunungan
      return (
        <>
          <path d="M20 7c2.8 4.6 8.6 9 8.6 15.6 0 5-3.8 8-8.6 8s-8.6-3-8.6-8C11.4 16 17.2 11.6 20 7z" {...S} />
          <path d="M20 13v12M20 17l-3.4-2.4M20 17l3.4-2.4M20 21l-4.2-2.6M20 21l4.2-2.6" {...S} strokeWidth={1.7} />
          <path d="M16.6 30.6v-4h6.8v4" {...S} strokeWidth={1.7} />
        </>
      );
    case "proposal": // dokumen dengan grafik naik
      return (
        <>
          <path d="M13 8h10l5 5v18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 12 31V9.5A1.5 1.5 0 0 1 13.5 8z" {...S} />
          <path d="M23 8v5h5" {...S} />
          <path d="M16 27v-3M20 27v-6M24 27v-9" {...S} />
        </>
      );
    case "portofolio": // tas kerja dengan bintang
      return (
        <>
          <rect x="8.5" y="14" width="23" height="15" rx="2.5" {...S} />
          <path d="M16 14v-2.5A1.5 1.5 0 0 1 17.5 10h5a1.5 1.5 0 0 1 1.5 1.5V14" {...S} />
          <path d="M20 18.4l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" fill="#fff" />
        </>
      );
    case "rsvp": // dua orang + centang
      return (
        <>
          <circle cx="15.5" cy="15" r="3.4" {...S} />
          <path d="M9.5 28c.6-3.6 3-5.6 6-5.6s5.4 2 6 5.6" {...S} />
          <circle cx="24.5" cy="13.5" r="2.8" {...S} strokeWidth={1.8} />
          <path d="M24.2 19.8c2.4.2 4.2 1.8 4.8 4.4" {...S} strokeWidth={1.8} />
          <path d="M24.5 29l2.2 2.2 4.6-4.6" {...S} />
        </>
      );
    case "persetujuan": // stempel centang + garis tanda tangan
      return (
        <>
          <circle cx="20" cy="17" r="8" {...S} />
          <path d="M16.4 17.2l2.5 2.5 4.8-4.8" {...S} />
          <path d="M10 31c2-1.6 3.4-1.6 4.6 0s2.6 1.6 4.2 0 3-1.6 4.4 0 2.8 1.6 6.8-.4" {...S} strokeWidth={1.8} />
        </>
      );
    case "editor": // bingkai seleksi + kursor
      return (
        <>
          <rect x="9" y="9" width="17" height="14" rx="1" {...S} strokeDasharray="3 2.4" />
          <rect x="7.6" y="7.6" width="2.8" height="2.8" fill="#fff" />
          <rect x="24.6" y="7.6" width="2.8" height="2.8" fill="#fff" />
          <rect x="7.6" y="21.6" width="2.8" height="2.8" fill="#fff" />
          <path d="M21 19l9.5 4-4 1.6-1.6 4z" fill="#fff" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
        </>
      );
    case "custom": // pena + kilau
      return (
        <>
          <path d="M11 29l2-6 11-11a2.6 2.6 0 0 1 3.7 3.7l-11 11z" {...S} />
          <path d="M22 14l3.7 3.7" {...S} />
          <path d="M28.5 23.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" fill="#fff" />
          <path d="M12 9.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="#fff" />
        </>
      );
    case "kopi": // cangkir kopi
      return (
        <>
          <path d="M10 17h16v6a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7z" {...S} />
          <path d="M26 19h1.5a3 3 0 0 1 0 6H25.5" {...S} />
          <path d="M15 9.5c-1 1.2 1 2.2 0 3.4M19.5 9.5c-1 1.2 1 2.2 0 3.4" {...S} strokeWidth={1.8} />
        </>
      );
  }
}

/**
 * Ikon aplikasi dalam ubin bergradasi. Gradasi dibuat dengan CSS (bukan <linearGradient>)
 * agar tidak ada id SVG ganda — id ganda membuat ikon kosong bila salinan pertamanya
 * berada di elemen tersembunyi (mis. menu desktop saat dilihat di HP).
 */
export function AppIcon({ name, size = 40, className = "" }: { name: AppIconName; size?: number; className?: string }) {
  const [a, b] = GRADIENTS[name];
  return (
    <span
      aria-hidden
      className={`relative inline-block shrink-0 overflow-hidden shadow-[0_6px_10px_rgba(22,19,15,0.18)] ${className}`}
      style={{ width: size, height: size, borderRadius: size * 0.275, background: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      <span className="absolute inset-x-[2.5%] top-[2.5%] h-[47.5%] rounded-[inherit] bg-white/12" />
      <svg width={size} height={size} viewBox="0 0 40 40" className="relative">
        <Glyph name={name} />
      </svg>
    </span>
  );
}
