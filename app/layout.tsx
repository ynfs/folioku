import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const appFont = Plus_Jakarta_Sans({ variable: "--font-app", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Folioku — Buat portofolio tanpa kode", template: "%s · Folioku" },
  description: "Pilih template, edit, dan publikasikan portofolio kamu tanpa menulis kode.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${appFont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
