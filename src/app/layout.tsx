import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import { Providers } from "@/components/ui/Providers";
import { event } from "@/config/event";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = `${event.name} · ${event.dateLabelLong}`;
const description =
  "Tres ambientes. Diferentes ritmos. Una noche que no se repite. Solicita tu lugar en la lista FREE COVER.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: event.name,
    title,
    description,
    // La imagen se genera en src/app/opengraph-image.tsx.
    // Para usar la pieza oficial, reemplaza ese archivo por opengraph-image.jpg (1200x630).
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${anton.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
