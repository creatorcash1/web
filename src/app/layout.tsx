// ─── Root Layout ─────────────────────────────────────────────────────────────
// Sets global metadata, Google Fonts (Montserrat + Inter), and renders children.
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CreatorCashCow — Build Your Creator Empire",
  description:
    "Learn to monetize social media, build digital products, and scale your creator income with CC Mendel. 5 premium courses, PDF products, and 1:1 mentorship.",
  keywords: [
    "creator economy",
    "UGC",
    "TikTok Shop",
    "dropshipping",
    "digital products",
    "CC Mendel",
    "creator monetization",
  ],
  openGraph: {
    title: "CreatorCashCow — Build Your Creator Empire",
    description: "From 0 to Platform Owner with CC Mendel.",
    siteName: "CreatorCashCow",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="antialiased font-[family-name:var(--font-inter)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
