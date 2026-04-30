import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { defaultLocale } from "@/i18n/config";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Milano Marin | Cuisine Italienne Raffinée",
  description: "Découvrez l'authenticité de la cuisine italienne au cœur de la ville.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
