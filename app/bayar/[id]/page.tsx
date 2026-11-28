/* eslint-disable @next/next/no-img-element -- QR DANA & bukti transfer dari unggahan */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/ui/AppHeader";
import { CopyButton, ProofForm } from "@/components/ui/PaymentClient";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { backend, requireUser } from "@/lib/backend";
import { ORDER_PAY_HOURS, PLANS, STATUS_TONE, formatRupiah, orderAmount, orderStatusLabel } from "@/lib/billing";
import { waLink } from "@/lib/contact";
import { DANA, isDanaConfigured } from "@/lib/payment";

export const metadata: Metadata = { title: "Pembayaran" };

const dateFmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });

export default async function OrderPage(props: PageProps<"/bayar/[id]">) {
  const { id } = await props.params;
  const user = await requireUser(`/bayar/${id}`);
  const order = await backend.getOrder(id, user.id);
  if (!order) notFound();
  const plan = PLANS[order.plan];
  const amount = orderAmount(order);
  const status = orderStatusLabel(order);
  const expired = status.label === "Kedaluwarsa";
  const canPay = order.status === "menunggu" || order.status === "ditolak";
  const deadline = new Date(Date.parse(order.createdAt) + ORDER_PAY_HOURS * 3_600_000);
  const ref = order.id.slice(0, 8).toUpperCase();
  const danaReady = isDanaConfigured();

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <Link href="/dashboard/tagihan" className="text-sm font-semibold text-app-muted hover:text-app-fg">
          ← Tagihan saya
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-extrabold">Pembayaran #{ref}</h1>
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${STATUS_TONE[status.tone]}`} data-status={order.status}>
            {status.label}
          </span>
        </div>
        <p className="mt-1 text-app-muted">
          {plan.name} · {plan.period}
          {order.projectName && <> · “{order.projectName}”</>}
        </p>

        {order.status === "lunas" && (
          <div className="card mt-6 bg-green-50 p-6 text-green-900">
            <p className="font-display text-xl font-bold">Pembayaran diterima 🎉</p>
            <p className="mt-1 text-sm">Paket sudah aktif. Terima kasih sudah memakai Safantara!</p>
            <Link href={order.projectId ? `/editor/${order.projectId}` : "/dashboard"} className="btn-primary mt-4">
              {order.projectId ? "Buka undangan" : "Ke dashboard"}
            </Link>
          </div>
        )}

        {order.status === "diperiksa" && (
          <div className="card mt-6 bg-amber-50 p-6 text-amber-900">
            <p className="font-display text-xl font-bold">Bukti sedang diperiksa</p>
            <p className="mt-1 text-sm">Admin akan mencocokkan pembayaranmu, biasanya kurang dari 1×24 jam. Halaman ini akan berubah menjadi “Lunas” setelah dikonfirmasi.</p>
            {order.proofUrl && (
              <a href={order.proofUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold underline">
                Lihat bukti yang dikirim
              </a>
            )}
          </div>
        )}

        {order.status === "ditolak" && (
          <div className="card mt-6 bg-red-50 p-5 text-sm text-red-800">
            <p className="font-bold">Pembayaran belum bisa dikonfirmasi.</p>
            {order.note && <p className="mt-1">Catatan admin: {order.note}</p>}
            <p className="mt-1">Silakan kirim ulang bukti yang benar di bawah, atau hubungi kami lewat WhatsApp.</p>
          </div>
        )}

        {canPay && !expired && (
          <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_1fr]">
            <div className="card p-6">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-app-muted">1 · Transfer lewat DANA</p>
              <p className="mt-4 text-sm text-app-muted">Nominal tepat (termasuk kode unik)</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="font-display text-3xl font-extrabold" data-amount={amount}>
                  {formatRupiah(amount)}
                </p>
                <CopyButton value={String(amount)} />
              </div>
              <p className="mt-1 text-xs text-app-muted">
                {formatRupiah(plan.price)} + kode unik {order.uniqueCode}
              </p>

              {danaReady ? (
                <div className="mt-5 rounded-2xl bg-[#118EEA]/8 p-4">
                  <p className="text-xs font-bold text-[#118EEA]">DANA</p>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="font-mono text-xl font-bold tracking-wider">{DANA.number}</p>
                    <CopyButton value={DANA.number.replace(/\D/g, "")} />
                  </div>
                  {DANA.name && <p className="text-sm">a.n. {DANA.name}</p>}
                  {DANA.qr && <img src={DANA.qr} alt="QR DANA" className="mx-auto mt-4 w-48 rounded-xl bg-white p-2" />}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                  Nomor DANA sedang disiapkan. Hubungi kami untuk mendapatkan nomor tujuan.
                  <a href={waLink(`Halo Safantara, saya ingin membayar pesanan #${ref} (${plan.name}) sebesar ${formatRupiah(amount)} lewat DANA.`)} target="_blank" rel="noopener noreferrer" className="btn-brand mt-3 w-full">
                    Minta nomor DANA via WhatsApp
                  </a>
                </div>
              )}

              <ol className="mt-5 list-decimal space-y-1 pl-5 text-sm text-app-muted">
                <li>Buka aplikasi DANA → Kirim → ke nomor di atas.</li>
                <li>Masukkan nominal persis {formatRupiah(amount)}.</li>
                <li>Tulis catatan: <b>SFT-{ref}</b>.</li>
                <li>Simpan screenshot bukti transfer.</li>
              </ol>
              <p className="mt-4 text-xs text-app-muted">Bayar sebelum {dateFmt.format(deadline)} WIB.</p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-app-muted">2 · Kirim bukti</p>
              <div className="mt-4">
                <ProofForm orderId={order.id} initialSender={order.senderName} />
              </div>
              <a href={waLink(`Halo Safantara, saya sudah membayar pesanan #${ref} (${plan.name}) sebesar ${formatRupiah(amount)}.`)} target="_blank" rel="noopener noreferrer" className="mt-4 block text-center text-sm font-semibold text-app-muted underline">
                Ada kendala? Chat WhatsApp
              </a>
            </div>
          </div>
        )}

        {canPay && expired && (
          <div className="card mt-6 p-6 text-center">
            <p className="font-bold">Batas waktu pembayaran sudah lewat.</p>
            <p className="mt-1 text-sm text-app-muted">Buat pesanan baru untuk mendapatkan nominal yang baru.</p>
            <Link href={`/bayar?paket=${order.plan}${order.projectId ? `&proyek=${order.projectId}` : ""}`} className="btn-brand mt-4">
              Buat pesanan baru
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
