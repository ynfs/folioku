import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createOrderAction } from "@/app/actions";
import { AppHeader } from "@/components/ui/AppHeader";
import { AppIcon } from "@/components/ui/AppIcons";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { backend, requireUser } from "@/lib/backend";
import { PLANS, TIER_LABEL, formatRupiah, invitationAccess, isPlanKey, isPremiumTemplate, proUntil } from "@/lib/billing";
import { PortfolioThumb } from "@/lib/renderer/Portfolio";
import { findTemplate } from "@/lib/templates-server";

export const metadata: Metadata = { title: "Pilih paket" };

const dateFmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "long" });
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function BayarPage(props: PageProps<"/bayar">) {
  const sp = await props.searchParams;
  const paket = one(sp.paket);
  const proyek = one(sp.proyek);
  const user = await requireUser(`/bayar?paket=${encodeURIComponent(paket)}${proyek ? `&proyek=${encodeURIComponent(proyek)}` : ""}`);
  if (!isPlanKey(paket)) redirect("/harga");
  const plan = PLANS[paket];
  const isInvitation = plan.product === "undangan";
  const paid = await backend.paidOrders(user.id);

  // Paket undangan: pilih undangan yang akan di-upgrade dulu.
  if (isInvitation && !proyek) {
    const invitations = (await backend.listProjects(user.id)).filter((p) => p.kind === "invitation");
    return (
      <Shell>
        <h1 className="font-display text-3xl font-extrabold">Pilih undangan untuk paket {plan.name.replace("Undangan ", "")}</h1>
        <p className="mt-1 text-app-muted">Paket undangan berlaku untuk satu undangan.</p>
        {invitations.length === 0 ? (
          <div className="card mt-6 p-8 text-center">
            <p className="font-bold">Kamu belum punya undangan.</p>
            <p className="mt-1 text-sm text-app-muted">Buat undangan dulu dari template, lalu kembali ke sini.</p>
            <Link href="/templates?jenis=undangan" className="btn-brand mt-5">
              Pilih template undangan
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {invitations.map((p) => {
              const a = invitationAccess(paid, p.id, p.publishedAt);
              return (
                <Link key={p.id} href={`/bayar?paket=${paket}&proyek=${p.id}`} className="card card-hover overflow-hidden">
                  <PortfolioThumb data={p.data} height={160} />
                  <div className="border-t border-app-line p-4">
                    <p className="font-bold">{p.name}</p>
                    <p className="mt-1 text-xs text-app-muted">Paket sekarang: {TIER_LABEL[a.tier]}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Shell>
    );
  }

  let project = null;
  let notes: { tone: "info" | "warn"; text: string; href?: string; cta?: string }[] = [];
  if (isInvitation) {
    project = await backend.getProject(proyek, user.id);
    if (!project || project.kind !== "invitation") redirect(`/bayar?paket=${paket}`);
    const a = invitationAccess(paid, project.id, project.publishedAt);
    const template = await findTemplate(project.templateId, { allowDraft: true });
    const premiumTemplate = template ? isPremiumTemplate(template) : false;
    if (paket === "upgrade-premium" && a.tier !== "basic") redirect(`/bayar?paket=premium&proyek=${project.id}`);
    if (paket === "premium" && a.tier === "basic") {
      notes.push({ tone: "info", text: `Undangan ini sudah Basic. Cukup bayar selisihnya ${formatRupiah(PLANS["upgrade-premium"].price)}.`, href: `/bayar?paket=upgrade-premium&proyek=${project.id}`, cta: "Pakai harga upgrade" });
    }
    if (paket === "basic" && premiumTemplate) {
      notes.push({ tone: "warn", text: "Undangan ini memakai template Premium. Paket Basic tidak cukup untuk menerbitkannya.", href: `/bayar?paket=premium&proyek=${project.id}`, cta: "Pilih Premium" });
    }
    if (a.tier !== "free" && a.until) notes.push({ tone: "info", text: `Paket ${TIER_LABEL[a.tier]} undangan ini aktif sampai ${dateFmt.format(a.until)}.` });
  } else {
    const until = proUntil(paid);
    if (until) notes = [{ tone: "info", text: `Pro kamu aktif sampai ${dateFmt.format(until)}. Pembayaran ini akan menambah masa aktif.` }];
  }

  return (
    <Shell>
      <Link href="/harga" className="text-sm font-semibold text-app-muted hover:text-app-fg">
        ← Semua paket
      </Link>
      <h1 className="font-display mt-3 text-3xl font-extrabold">Ringkasan pesanan</h1>
      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center gap-4 p-6">
          <AppIcon name={isInvitation ? "undangan" : "proposal"} size={52} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-bold">{plan.name}</p>
            <p className="text-sm text-app-muted">
              {plan.period}
              {project && <> · untuk “{project.name}”</>}
            </p>
          </div>
          <p className="font-display text-2xl font-extrabold">{formatRupiah(plan.price)}</p>
        </div>
        {notes.length > 0 && (
          <div className="space-y-2 border-t border-app-line bg-app-soft/50 p-4">
            {notes.map((n) => (
              <div key={n.text} className={`rounded-xl p-3 text-sm ${n.tone === "warn" ? "bg-amber-50 text-amber-900" : "bg-white"}`}>
                {n.text}{" "}
                {n.href && (
                  <Link href={n.href} className="font-bold text-brand underline">
                    {n.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
        <form action={createOrderAction} className="border-t border-app-line p-6">
          <input type="hidden" name="plan" value={paket} />
          <input type="hidden" name="projectId" value={project?.id ?? ""} />
          <button className="btn-brand btn-lg w-full">Lanjut bayar dengan DANA</button>
          <p className="mt-3 text-center text-xs text-app-muted">Nominal akhir ditambah kode unik 3 digit agar pembayaranmu mudah dicocokkan.</p>
        </form>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">{children}</main>
      <SiteFooter />
    </>
  );
}
