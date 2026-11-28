import Link from "next/link";
import { PRODUCTS } from "@/lib/templates";
import type { ProductKind } from "@/lib/types";
import { AppIcon, type AppIconName } from "./AppIcons";

const ICON: Record<ProductKind, AppIconName> = { portfolio: "portofolio", invitation: "undangan", proposal: "proposal" };

/**
 * Tab produk Safantara: Portofolio | Undangan Digital | Proposal.
 * Di HP ketiga tab dibagi rata selebar layar dengan label pendek (tidak terpotong).
 */
export function ProductTabs({ active, hrefFor }: { active: ProductKind; hrefFor: (k: ProductKind) => string }) {
  return (
    <nav className="grid w-full grid-cols-3 gap-1 rounded-2xl border border-app-line bg-white p-1 shadow-soft sm:inline-flex sm:w-auto" aria-label="Produk">
      {PRODUCTS.map((p) => (
        <Link
          key={p.value}
          href={hrefFor(p.value)}
          aria-current={active === p.value ? "page" : undefined}
          className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-1.5 py-2 text-[13px] font-semibold transition sm:gap-2 sm:px-4 sm:text-sm ${
            active === p.value ? "bg-app-fg text-white shadow-soft" : "text-app-muted hover:bg-app-soft hover:text-app-fg"
          }`}
        >
          <AppIcon name={ICON[p.value]} size={20} />
          <span className="truncate sm:hidden">{p.short}</span>
          <span className="hidden truncate sm:inline">{p.label}</span>
        </Link>
      ))}
    </nav>
  );
}
