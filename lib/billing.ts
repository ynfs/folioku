// Paket berbayar Safantara: harga, fitur, template premium, dan perhitungan hak akses.
// Semua fungsi di sini murni (tanpa I/O) agar bisa dipakai di server maupun klien
// dan mudah diuji. Hak akses SELALU dihitung dari pesanan berstatus "lunas"
// (yang hanya bisa diubah admin), bukan dari kolom yang bisa diubah pengguna.

import type { Order, PaidOrder, PlanKey, ProductKind, Template } from "./types";

const DAY = 86_400_000;

/** Masa aktif undangan paket Gratis sejak pertama kali terbit. */
export const FREE_INVITATION_DAYS = 7;
/** Batas waktu membayar pesanan sebelum dianggap kedaluwarsa. */
export const ORDER_PAY_HOURS = 24;

export type Product = "undangan" | "pro";

export interface Plan {
  key: PlanKey;
  product: Product;
  name: string;
  price: number;
  days: number;
  period: string;
}

export const PLANS: Record<PlanKey, Plan> = {
  basic: { key: "basic", product: "undangan", name: "Undangan Basic", price: 59_000, days: 180, period: "aktif 6 bulan" },
  premium: { key: "premium", product: "undangan", name: "Undangan Premium", price: 129_000, days: 365, period: "aktif 1 tahun" },
  "upgrade-premium": { key: "upgrade-premium", product: "undangan", name: "Upgrade Basic → Premium", price: 70_000, days: 365, period: "aktif 1 tahun" },
  "pro-bulanan": { key: "pro-bulanan", product: "pro", name: "Safantara Pro (bulanan)", price: 39_000, days: 30, period: "per bulan" },
  "pro-tahunan": { key: "pro-tahunan", product: "pro", name: "Safantara Pro (tahunan)", price: 349_000, days: 365, period: "per tahun" },
};

export const isPlanKey = (v: unknown): v is PlanKey => typeof v === "string" && Object.prototype.hasOwnProperty.call(PLANS, v);

export const orderAmount = (o: Pick<Order, "plan" | "uniqueCode">) => PLANS[o.plan].price + o.uniqueCode;

const idr = new Intl.NumberFormat("id-ID");
export const formatRupiah = (n: number) => `Rp ${idr.format(n)}`;

// ---------- Template premium ----------

const PREMIUM_STYLES = new Set(["nusantara", "retro", "klasik", "elegan", "gelap", "editorial", "kreatif"]);

/** Template adat (termasuk Jawa/gunungan) dan gaya-gaya eksklusif termasuk Premium. */
export function isPremiumTemplate(t: Pick<Template, "category" | "style">): boolean {
  return t.category === "adat" || (!!t.style && PREMIUM_STYLES.has(t.style));
}

// ---------- Hak akses ----------

export type Tier = "free" | "basic" | "premium";
const RANK: Record<Tier, number> = { free: 0, basic: 1, premium: 2 };

export interface InvitationAccess {
  tier: Tier;
  /** Akhir masa aktif (paket berbayar, atau 7 hari sejak terbit untuk Gratis) */
  until: Date | null;
  expired: boolean;
}

const byApproved = (a: PaidOrder, b: PaidOrder) => a.approvedAt.localeCompare(b.approvedAt);

export function invitationAccess(orders: PaidOrder[], projectId: string, publishedAt: string | null | undefined, now = Date.now()): InvitationAccess {
  const own = orders.filter((o) => o.projectId === projectId).sort(byApproved);
  const hasBasic = own.some((o) => o.plan === "basic");
  let best: { tier: Tier; until: number } | null = null;
  for (const o of own) {
    const tier: Tier | null =
      o.plan === "basic" ? "basic" : o.plan === "premium" ? "premium" : o.plan === "upgrade-premium" && hasBasic ? "premium" : null;
    if (!tier) continue;
    const until = Date.parse(o.approvedAt) + PLANS[o.plan].days * DAY;
    if (until < now) continue;
    if (!best || RANK[tier] > RANK[best.tier] || (tier === best.tier && until > best.until)) best = { tier, until };
  }
  if (best) return { tier: best.tier, until: new Date(best.until), expired: false };
  const freeUntil = publishedAt ? Date.parse(publishedAt) + FREE_INVITATION_DAYS * DAY : null;
  return { tier: "free", until: freeUntil ? new Date(freeUntil) : null, expired: freeUntil !== null && freeUntil < now };
}

/** Akhir langganan Pro; perpanjangan ditumpuk setelah masa yang masih berjalan. */
export function proUntil(orders: PaidOrder[], now = Date.now()): Date | null {
  let until = 0;
  for (const o of orders.filter((x) => PLANS[x.plan]?.product === "pro").sort(byApproved)) {
    until = Math.max(until, Date.parse(o.approvedAt)) + PLANS[o.plan].days * DAY;
  }
  return until > now ? new Date(until) : null;
}

export interface PageAccess {
  watermark: boolean;
  expired: boolean;
}

/** Apakah halaman publik menampilkan watermark / sudah habis masa aktifnya. */
export function pageAccess(
  p: { kind: ProductKind; projectId: string; publishedAt: string | null; paidOrders: PaidOrder[]; ownerIsAdmin: boolean },
  now = Date.now(),
): PageAccess {
  if (p.ownerIsAdmin) return { watermark: false, expired: false };
  if (p.kind === "invitation") {
    const a = invitationAccess(p.paidOrders, p.projectId, p.publishedAt, now);
    return { watermark: a.tier === "free", expired: a.expired };
  }
  return { watermark: !proUntil(p.paidOrders, now), expired: false };
}

export interface PublishBlock {
  error: string;
  href: string;
  cta: string;
}

/** Alasan proyek belum boleh terbit pada paketnya sekarang (null = boleh). */
export function publishBlock(
  p: {
    kind: ProductKind;
    projectId: string;
    publishedAt: string | null | undefined;
    templatePremium: boolean;
    paidOrders: PaidOrder[];
    isAdmin: boolean;
    /** Jumlah portofolio/proposal lain milik pengguna yang sedang terbit */
    otherPublished: number;
  },
  now = Date.now(),
): PublishBlock | null {
  if (p.isAdmin) return null;
  if (p.kind === "invitation") {
    const a = invitationAccess(p.paidOrders, p.projectId, p.publishedAt, now);
    if (p.templatePremium && a.tier !== "premium") {
      const plan = a.tier === "basic" ? "upgrade-premium" : "premium";
      return {
        error: "Template ini termasuk koleksi Premium. Kamu tetap bisa mengedit, tapi untuk menerbitkannya pilih paket Premium.",
        href: `/bayar?paket=${plan}&proyek=${p.projectId}`,
        cta: a.tier === "basic" ? "Upgrade ke Premium" : "Pilih Premium",
      };
    }
    if (a.expired) {
      return {
        error: `Masa aktif gratis (${FREE_INVITATION_DAYS} hari) undangan ini sudah habis. Pilih paket agar undangan aktif lagi.`,
        href: `/bayar?paket=basic&proyek=${p.projectId}`,
        cta: "Lihat paket",
      };
    }
    return null;
  }
  if (proUntil(p.paidOrders, now)) return null;
  if (p.templatePremium) {
    return { error: "Template ini termasuk koleksi Premium. Menerbitkannya butuh Safantara Pro.", href: "/bayar?paket=pro-bulanan", cta: "Langganan Pro" };
  }
  if (p.otherPublished >= 1) {
    return {
      error: "Paket Gratis hanya bisa menerbitkan 1 portofolio/proposal. Batalkan publikasi yang lain atau langganan Pro.",
      href: "/bayar?paket=pro-bulanan",
      cta: "Langganan Pro",
    };
  }
  return null;
}

/** Status tampilan pesanan (pesanan "menunggu" lewat 24 jam dianggap kedaluwarsa). */
export function orderStatusLabel(o: Pick<Order, "status" | "createdAt">, now = Date.now()): { label: string; tone: "gray" | "amber" | "green" | "red" } {
  if (o.status === "lunas") return { label: "Lunas", tone: "green" };
  if (o.status === "ditolak") return { label: "Ditolak", tone: "red" };
  if (o.status === "diperiksa") return { label: "Sedang diperiksa", tone: "amber" };
  if (now - Date.parse(o.createdAt) > ORDER_PAY_HOURS * 3_600_000) return { label: "Kedaluwarsa", tone: "gray" };
  return { label: "Menunggu pembayaran", tone: "amber" };
}

export const TIER_LABEL: Record<Tier, string> = { free: "Gratis", basic: "Basic", premium: "Premium" };

export const STATUS_TONE = { gray: "bg-app-bg text-app-muted", amber: "bg-amber-100 text-amber-900", green: "bg-green-100 text-green-800", red: "bg-red-100 text-red-700" } as const;
