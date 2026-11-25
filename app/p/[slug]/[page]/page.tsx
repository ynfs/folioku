import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage, guestFrom } from "@/components/ui/PublicPage";
import { backend } from "@/lib/backend";
import { getPages } from "@/lib/pages";

// Halaman tambahan portofolio publik, mis. /p/rina/tentang-saya

export async function generateMetadata(props: PageProps<"/p/[slug]/[page]">): Promise<Metadata> {
  const { slug, page } = await props.params;
  const pub = await backend.getPublication(slug);
  const p = pub && getPages(pub.data).find((x) => x.slug === page);
  if (!pub || !p) return { title: "Tidak ditemukan" };
  return { title: { absolute: pub.ownerName ? `${p.title} — ${pub.ownerName}` : p.title } };
}

export default async function PublicSubPage(props: PageProps<"/p/[slug]/[page]">) {
  const { slug, page } = await props.params;
  const { to } = await props.searchParams;
  const pub = await backend.getPublication(slug);
  if (!pub) notFound();
  const p = getPages(pub.data).find((x) => x.slug === page);
  if (!p) notFound();
  return <PublicPage pub={pub} pageId={p.id} guest={guestFrom(to)} />;
}
