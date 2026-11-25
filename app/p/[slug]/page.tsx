import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/ui/PublicPage";
import { backend } from "@/lib/backend";

// Halaman portofolio publik (beranda).

export async function generateMetadata(props: PageProps<"/p/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const pub = await backend.getPublication(slug);
  if (!pub) return { title: "Tidak ditemukan" };
  const hero = pub.data.sections.find((s) => s.type === "hero");
  const title = typeof hero?.props.title === "string" ? hero.props.title : pub.name;
  const description = typeof hero?.props.subtitle === "string" ? hero.props.subtitle : undefined;
  return { title: { absolute: pub.ownerName ? `${pub.ownerName} — ${title}` : title }, description };
}

export default async function PublicPortfolio(props: PageProps<"/p/[slug]">) {
  const { slug } = await props.params;
  const pub = await backend.getPublication(slug);
  if (!pub) notFound();
  return <PublicPage pub={pub} />;
}
