/* eslint-disable @next/next/no-img-element -- logo lokal di /public/karya */
import type { Karya } from "@/lib/apps";
import { AppIcon } from "./AppIcons";

/** Logo sebuah karya dalam ubin persegi; ikon bila belum ada logo. */
export function KaryaLogo({ karya, size = 40 }: { karya: Karya; size?: number }) {
  if (!karya.logo) return <AppIcon name={karya.icon ?? "custom"} size={size} />;
  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-[11px] shadow-[0_6px_10px_rgba(22,19,15,0.18)] ring-1 ring-black/5"
      style={{ width: size, height: size, background: karya.tile }}
    >
      <img src={karya.logo} alt="" className="h-full w-full object-contain p-[12%]" loading="lazy" />
    </span>
  );
}
