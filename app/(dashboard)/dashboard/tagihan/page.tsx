import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "@/components/ui/AppHeader";
import { AppIcon } from "@/components/ui/AppIcons";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { backend, requireUser } from "@/lib/backend";
import { PLANS, STATUS_TONE, TIER_LABEL, formatRupiah, invitationAccess, orderAmount, orderStatusLabel, proUntil } from "@/lib/billing";

export const metadata: Metadata = { title: "Paket & tagihan" };

const dateFmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });

export default async function TagihanPage() {
  const user = await requireUser("/dashboard/tagihan");
  const [orders, paid, projects] = await Promise.all([backend.listOrders(user.id), backend.paidOrders(user.id), backend.listProjects(user.id)]);
  const pro = proUntil(paid);
  const invitations = projects.filter((p) => p.kind === "invitation");

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <Link href="/dashboard" className="text-sm font-semibold text-app-muted hover:text-app-fg">
          ← Dashboard
        </Link>
        <h1 className="font-display mt-3 text-4xl font-extrabold">Paket & tagihan</h1>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="card flex items-start gap-4 p-6">
            <AppIcon name="proposal" size={48} />
            <div className="flex-1">
              <p className="font-display text-lg font-bold">Safantara Pro</p>
              {user.role === "admin" ? (
                <p className="text-sm text-app-muted">Akun admin: semua fitur aktif.</p>
              ) : pro ? (
                <p className="text-sm text-green-700">Aktif sampai {dateFmt.format(pro)}</p>
              ) : (
                <p className="text-sm text-app-muted">Paket Gratis — 1 portofolio/proposal terbit, dengan watermark.</p>
              )}
              <Link href="/bayar?paket=pro-bulanan" className="btn-primary mt-4">
                {pro ? "Perpanjang" : "Langganan Pro"}
              </Link>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <AppIcon name="undangan" size={48} />
              <p className="font-display text-lg font-bold">Paket undangan</p>
            </div>
            {invitations.length === 0 ? (
              <p className="mt-3 text-sm text-app-muted">Belum ada undangan.</p>
            ) : (
              <ul className="mt-3 divide-y divide-app-line text-sm">
                {invitations.map((p) => {
                  const a = invitationAccess(paid, p.id, p.publishedAt);
                  return (
                    <li key={p.id} className="flex items-center justify-between gap-3 py-2">
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{p.name}</span>
                        <span className={`text-xs ${a.expired ? "text-red-600" : "text-app-muted"}`}>
                          {TIER_LABEL[a.tier]}
                          {a.until && (a.expired ? " · masa aktif habis" : ` · s.d. ${dateFmt.format(a.until)}`)}
                          {!p.publishedAt && a.tier === "free" && " · belum terbit"}
                        </span>
                      </span>
                      {a.tier !== "premium" && user.role !== "admin" && (
                        <Link href={`/bayar?paket=${a.tier === "basic" ? "upgrade-premium" : "premium"}&proyek=${p.id}`} className="shrink-0 font-bold text-brand">
                          Upgrade
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <h2 className="font-display mt-10 text-2xl font-extrabold">Riwayat transaksi</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-app-muted">
            Belum ada transaksi.{" "}
            <Link href="/harga" className="font-bold text-brand">
              Lihat paket
            </Link>
          </p>
        ) : (
          <div className="card mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-app-soft/60 text-left text-xs uppercase tracking-wider text-app-muted">
                <tr>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Paket</th>
                  <th className="p-3 text-right">Nominal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-app-line">
                {orders.map((o) => {
                  const s = orderStatusLabel(o);
                  return (
                    <tr key={o.id}>
                      <td className="whitespace-nowrap p-3">{dateFmt.format(new Date(o.createdAt))}</td>
                      <td className="p-3">
                        <span className="font-semibold">{PLANS[o.plan].name}</span>
                        {o.projectName && <span className="block text-xs text-app-muted">{o.projectName}</span>}
                      </td>
                      <td className="whitespace-nowrap p-3 text-right font-semibold">{formatRupiah(orderAmount(o))}</td>
                      <td className="p-3">
                        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_TONE[s.tone]}`}>{s.label}</span>
                      </td>
                      <td className="p-3 text-right">
                        <Link href={`/bayar/${o.id}`} className="font-bold text-brand">
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
