import Link from "next/link";
import { PRODUCTS } from "@/lib/templates";
import type { ProductKind } from "@/lib/types";

const ICON: Record<ProductKind, string> = { portfolio: "▦", invitation: "✉", proposal: "▤" };

/** Tab produk Safantara: Portofolio | Undangan Digital | Proposal. */
export function ProductTabs({ active, hrefFor }: { active: ProductKind; hrefFor: (k: ProductKind) => string }) {
  return (
    <nav className="inline-flex max-w-full overflow-x-auto rounded-2xl border border-app-line bg-white p-1 shadow-soft" aria-label="Produk">
      {PRODUCTS.map((p) => (
        <Link
          key={p.value}
          href={hrefFor(p.value)}
          aria-current={active === p.value ? "page" : undefined}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            active === p.value ? "bg-app-fg text-white shadow-soft" : "text-app-muted hover:bg-app-soft hover:text-app-fg"
          }`}
        >
          <span aria-hidden>{ICON[p.value]}</span>
          {p.label}
        </Link>
      ))}
    </nav>
  );
}
