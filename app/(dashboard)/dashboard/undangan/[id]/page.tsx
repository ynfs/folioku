import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/ui/AppHeader";
import { GuestLinks, RsvpTable } from "@/components/ui/GuestTools";
import { backend, requireUser } from "@/lib/backend";

export const metadata: Metadata = { title: "Respon" };

export default async function GuestPage(props: PageProps<"/dashboard/undangan/[id]">) {
  const { id } = await props.params;
  const user = await requireUser(`/dashboard/undangan/${id}`);
  const project = await backend.getProject(id, user.id);
  if (!project) notFound();
  const rsvps = await backend.listRsvps(project.id, user.id);

  const isProposal = project.kind === "proposal";
  const hadir = rsvps.filter((r) => r.attendance === "hadir");
  const count = (a: string) => rsvps.filter((r) => r.attendance === a).length;
  const stats = isProposal
    ? [
        { label: "Total respon", value: rsvps.length },
        { label: "Setuju", value: hadir.length },
        { label: "Perlu diskusi", value: count("ragu") },
        { label: "Tidak setuju", value: count("tidak") },
        { label: "Tingkat persetujuan", value: rsvps.length ? `${Math.round((hadir.length / rsvps.length) * 100)}%` : "–" },
      ]
    : [
        { label: "Total respon", value: rsvps.length },
        { label: "Hadir", value: hadir.length },
        { label: "Perkiraan orang hadir", value: hadir.reduce((n, r) => n + r.guests, 0) },
        { label: "Tidak hadir", value: count("tidak") },
        { label: "Masih ragu", value: count("ragu") },
      ];

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <Link href={isProposal ? "/dashboard?jenis=proposal" : "/dashboard?jenis=undangan"} className="text-sm font-semibold text-app-muted hover:text-app-fg">
          ← {isProposal ? "Proposal saya" : "Undangan saya"}
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">{project.name}</h1>
            <p className="mt-1 text-app-muted">{isProposal ? "Link proposal per klien dan keputusan persetujuan." : "Tamu, link undangan, dan konfirmasi kehadiran."}</p>
          </div>
          <Link href={`/editor/${project.id}`} className="btn-primary">
            {isProposal ? "Edit proposal" : "Edit undangan"}
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-app-line bg-white p-4">
              <p className="text-xs text-app-muted">{s.label}</p>
              <p className="mt-1 text-2xl font-extrabold">{s.value}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-app-line bg-white p-6">
          <h2 className="text-xl font-extrabold">{isProposal ? "Link untuk setiap klien" : "Link untuk setiap tamu"}</h2>
          {project.published && project.slug ? (
            <GuestLinks slug={project.slug} title={project.name} kind={isProposal ? "proposal" : "invitation"} />
          ) : (
            <p className="mt-2 text-sm text-app-muted">
              {isProposal ? "Proposal" : "Undangan"} belum terbit. Buka editor lalu klik <b>Publish</b> untuk mendapatkan link {isProposal ? "proposal" : "undangan"}.
            </p>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-app-line bg-white p-6">
          <h2 className="text-xl font-extrabold">{isProposal ? "Keputusan klien" : "RSVP & ucapan"} ({rsvps.length})</h2>
          <RsvpTable rsvps={rsvps} filename={`${isProposal ? "persetujuan" : "rsvp"}-${project.slug ?? project.id}.csv`} kind={isProposal ? "proposal" : "invitation"} />
        </section>
      </main>
    </>
  );
}
