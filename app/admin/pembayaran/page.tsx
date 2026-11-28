/* eslint-disable @next/next/no-img-element -- bukti transfer dari unggahan pengguna */
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { reviewOrderAction } from "@/app/actions";
import { AppHeader } from "@/components/ui/AppHeader";
import { backend, requireUser } from "@/lib/backend";
import { PLANS, STATUS_TONE, formatRupiah, orderAmount, orderStatusLabel } from "@/lib/billing";
import { isDanaConfigured } from "@/lib/payment";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "Pembayaran — Admin" };

const dateFmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });
const monthFmt = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "Asia/Jakarta" });

const FILTERS = [
  { key: "diperiksa", label: "Perlu dicek" },
  { key: "menunggu", label: "Menunggu bayar" },
  { key: "lunas", label: "Lunas" },
  { key: "ditolak", label: "Ditolak" },
  { key: "semua", label: "Semua" },
] as const;

/** Ringkasan pendapatan dari pesanan lunas. */
function revenueSummary(orders: Order[]) {
  const paid = orders.filter((o) => o.status === "lunas" && o.approvedAt);
  const total = paid.reduce((s, o) => s + orderAmount(o), 0);
  const ym = (d: string) => d.slice(0, 7);
  const thisMonth = ym(new Date().toISOString());
  const month = paid.filter((o) => ym(o.approvedAt!) === thisMonth).reduce((s, o) => s + orderAmount(o), 0);
  const byProduct = { undangan: 0, pro: 0 };
  for (const o of paid) byProduct[PLANS[o.plan].product] += orderAmount(o);
  const byMonth = new Map<string, number>();
  for (const o of paid) byMonth.set(ym(o.approvedAt!), (byMonth.get(ym(o.approvedAt!)) ?? 0) + orderAmount(o));
  return { total, month, count: paid.length, byProduct, byMonth: [...byMonth.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6) };
}

export default async function AdminPembayaranPage(props: PageProps<"/admin/pembayaran">) {
  const user = await requireUser("/admin/pembayaran");
  if (user.role !== "admin") redirect("/dashboard");
  const { status } = await props.searchParams;
  const filter = FILTERS.find((f) => f.key === status)?.key ?? "diperiksa";
  const orders = await backend.adminListOrders();
  const rev = revenueSummary(orders);
  const shown = filter === "semua" ? orders : orders.filter((o) => o.status === filter);
  const count = (k: string) => orders.filter((o) => o.status === k).length;
  const maxMonth = Math.max(1, ...rev.byMonth.map(([, v]) => v));

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <Link href="/admin" className="text-sm font-semibold text-app-muted hover:text-app-fg">
          ← Panel admin
        </Link>
        <h1 className="font-display mt-3 text-3xl font-extrabold">Pembayaran & pendapatan</h1>
        {!isDanaConfigured() && (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Nomor DANA belum diatur. Isi variabel <code>DANA_NUMBER</code> dan <code>DANA_NAME</code> (lihat <code>lib/payment.ts</code>) agar pembeli melihat nomor tujuan.
          </p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total pendapatan" value={formatRupiah(rev.total)} sub={`${rev.count} transaksi lunas`} />
          <Stat label="Bulan ini" value={formatRupiah(rev.month)} sub={monthFmt.format(new Date())} />
          <Stat label="Undangan" value={formatRupiah(rev.byProduct.undangan)} sub="paket per undangan" />
          <Stat label="Pro" value={formatRupiah(rev.byProduct.pro)} sub="langganan" />
        </div>

        {rev.byMonth.length > 0 && (
          <div className="card mt-4 p-5">
            <p className="text-sm font-bold">Pendapatan per bulan</p>
            <div className="mt-3 space-y-2">
              {rev.byMonth.map(([m, v]) => (
                <div key={m} className="flex items-center gap-3 text-sm">
                  <span className="w-32 shrink-0 text-app-muted">{monthFmt.format(new Date(`${m}-15T00:00:00Z`))}</span>
                  <span className="h-3 rounded-full bg-brand" style={{ width: `${Math.max(2, (v / maxMonth) * 60)}%` }} />
                  <span className="font-semibold">{formatRupiah(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link key={f.key} href={`/admin/pembayaran?status=${f.key}`} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === f.key ? "bg-app-fg text-white" : "bg-white text-app-fg/80 ring-1 ring-app-line"}`}>
              {f.label}
              {f.key !== "semua" && <span className="ml-1.5 opacity-70">{count(f.key)}</span>}
            </Link>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="mt-6 text-app-muted">Tidak ada pesanan di sini.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {shown.map((o) => {
              const s = orderStatusLabel(o);
              return (
                <article key={o.id} className="card grid gap-4 p-5 md:grid-cols-[1fr_auto]" data-order={o.id}>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold">#{o.id.slice(0, 8).toUpperCase()}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_TONE[s.tone]}`}>{s.label}</span>
                      <span className="text-xs text-app-muted">{dateFmt.format(new Date(o.createdAt))}</span>
                    </div>
                    <p className="mt-2 font-display text-xl font-extrabold">{formatRupiah(orderAmount(o))}</p>
                    <p className="text-sm">
                      {PLANS[o.plan].name}
                      {o.projectName && <span className="text-app-muted"> · {o.projectName}</span>}
                    </p>
                    <p className="mt-1 text-sm text-app-muted">
                      Pembeli: {o.userName || "—"}
                      {o.userEmail && <> ({o.userEmail})</>}
                      {o.senderName && <> · Pengirim DANA: <b className="text-app-fg">{o.senderName}</b></>}
                    </p>
                    {o.note && <p className="mt-1 text-xs text-app-muted">Catatan: {o.note}</p>}
                    {o.approvedAt && <p className="mt-1 text-xs text-green-700">Dikonfirmasi {dateFmt.format(new Date(o.approvedAt))}</p>}
                  </div>
                  <div className="flex flex-col items-stretch gap-3 md:w-72">
                    {o.proofUrl ? (
                      <a href={o.proofUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-app-line">
                        <img src={o.proofUrl} alt="Bukti transfer" className="h-36 w-full object-cover" />
                      </a>
                    ) : (
                      <p className="rounded-xl bg-app-bg p-3 text-center text-xs text-app-muted">Belum ada bukti transfer</p>
                    )}
                    {o.status !== "lunas" && (
                      <form action={reviewOrderAction} className="space-y-2">
                        <input type="hidden" name="id" value={o.id} />
                        <input name="note" className="input" placeholder="Catatan (opsional, mis. nominal kurang)" maxLength={300} />
                        <div className="flex gap-2">
                          <button name="status" value="lunas" className="btn-brand flex-1">
                            ✓ Lunas
                          </button>
                          {o.status !== "ditolak" && (
                            <button name="status" value="ditolak" className="btn-ghost flex-1 text-red-600">
                              Tolak
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-app-muted">{label}</p>
      <p className="font-display mt-1 text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-app-muted">{sub}</p>
    </div>
  );
}
