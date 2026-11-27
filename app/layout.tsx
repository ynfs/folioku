import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const appFont = Plus_Jakarta_Sans({ variable: "--font-app", subsets: ["latin"] });
const displayFont = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "Safantara — Portofolio, undangan digital & proposal tanpa kode", template: "%s · Safantara" },
  description: "Buat portofolio, undangan digital, dan proposal yang indah dari 200+ template. Edit ala Figma, bagikan link, terima RSVP dan persetujuan klien.",
};

export const viewport: Viewport = { themeColor: "#FBF8F3" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${appFont.variable} ${displayFont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
