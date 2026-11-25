import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage, guestFrom } from "@/components/ui/PublicPage";
import { backend } from "@/lib/backend";

// Halaman portofolio publik (beranda).

export async function generateMetadata(props: PageProps<"/p/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const pub = await backend.getPublication(slug);
  if (!pub) return { title: "Tidak ditemukan" };
  const cover = pub.data.sections.find((s) => s.type === "cover");
  if (cover && typeof cover.props.title === "string") {
    // Undangan: "The Wedding of Rina & Dimas"
    const eyebrow = typeof cover.props.eyebrow === "string" ? cover.props.eyebrow : "Undangan";
    const sub = typeof cover.props.subtitle === "string" ? cover.props.subtitle : undefined;
    return { title: { absolute: `${eyebrow} ${cover.props.title}` }, description: sub };
  }
  const hero = pub.data.sections.find((s) => s.type === "hero");
  const title = typeof hero?.props.title === "string" ? hero.props.title : pub.name;
  const description = typeof hero?.props.subtitle === "string" ? hero.props.subtitle : undefined;
  return { title: { absolute: pub.ownerName ? `${pub.ownerName} — ${title}` : title }, description };
}

export default async function PublicPortfolio(props: PageProps<"/p/[slug]">) {
  const { slug } = await props.params;
  const { to } = await props.searchParams;
  const pub = await backend.getPublication(slug);
  if (!pub) notFound();
  return <PublicPage pub={pub} guest={guestFrom(to)} />;
}
