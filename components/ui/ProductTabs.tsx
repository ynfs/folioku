import Link from "next/link";
import { PRODUCTS } from "@/lib/templates";
import type { ProductKind } from "@/lib/types";

const ICON: Record<ProductKind, string> = { portfolio: "▦", invitation: "✉" };

/** Tab produk Safantara: Portofolio | Undangan Digital. */
export function ProductTabs({ active, hrefFor }: { active: ProductKind; hrefFor: (k: ProductKind) => string }) {
  return (
    <nav className="inline-flex rounded-xl border border-app-line bg-white p-1" aria-label="Produk">
      {PRODUCTS.map((p) => (
        <Link
          key={p.value}
          href={hrefFor(p.value)}
          aria-current={active === p.value ? "page" : undefined}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
            active === p.value ? "bg-app-fg text-white" : "text-app-muted hover:text-app-fg"
          }`}
        >
          <span aria-hidden>{ICON[p.value]}</span>
          {p.label}
        </Link>
      ))}
    </nav>
  );
}
