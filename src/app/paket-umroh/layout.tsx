import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://umrohsehat.my.id";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Paket Umroh",
  description:
    "Lihat jadwal, harga, dan fasilitas paket umroh Umroh Sehat — PPIU resmi berizin Kemenag dengan bimbingan ibadah intensif, hotel dekat masjid, dan konsumsi menu Indonesia.",
  alternates: {
    canonical: "/paket-umroh",
  },
  openGraph: {
    title: "Paket Umroh — Umroh Sehat",
    description:
      "Jadwal keberangkatan, harga, dan fasilitas paket umroh terbaik dari biro umroh resmi berizin Kemenag.",
    type: "website",
    url: `${SITE_URL}/paket-umroh`,
    siteName: "Umroh Sehat",
    locale: "id_ID",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Paket Umroh — Umroh Sehat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paket Umroh — Umroh Sehat",
    description:
      "Jadwal keberangkatan, harga, dan fasilitas paket umroh terbaik dari biro umroh resmi berizin Kemenag.",
    images: ["/images/og-image.png"],
  },
};

export default function PaketUmrohLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
