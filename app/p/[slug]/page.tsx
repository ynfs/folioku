import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { backend } from "@/lib/backend";
import { Portfolio } from "@/lib/renderer/Portfolio";

// Halaman portofolio publik.

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

  return (
    <main className="flex-1" style={{ background: pub.data.theme.colorBackground }}>
      <Portfolio data={pub.data} />
      <footer className="py-6 text-center text-xs opacity-60" style={{ color: pub.data.theme.colorPrimary }}>
        Dibuat dengan{" "}
        <Link href="/" className="font-semibold underline">
          Folioku
        </Link>
      </footer>
    </main>
  );
}
