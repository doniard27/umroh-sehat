import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Umroh Sehat — Biro Umroh Terpercaya",
  description:
    "Umroh Sehat - Biro perjalanan umroh terpercaya dengan izin resmi Kemenag. Berangkat dengan nyaman, kembali dengan ketenangan. PPIU Resmi & Berizin.",
  keywords: [
    "umroh",
    "umrah",
    "biro umroh",
    "travel umroh",
    "paket umroh",
    "umroh murah",
    "umroh terpercaya",
    "PPIU",
    "Kemenag",
    "haji",
    "umroh sehat",
  ],
  openGraph: {
    title: "Umroh Sehat — Biro Umroh Terpercaya",
    description:
      "Biro perjalanan umroh terpercaya dengan izin resmi Kemenag. Berangkat dengan nyaman, kembali dengan ketenangan.",
    type: "website",
    locale: "id_ID",
    siteName: "Umroh Sehat",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Umroh Sehat",
    description:
      "Biro perjalanan umroh terpercaya dengan izin resmi Kemenag",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://umrohsehat.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/images/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Indonesian",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
    },
  };

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
