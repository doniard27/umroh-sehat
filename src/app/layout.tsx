import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { getAllSettings } from "@/lib/settings";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://umrohsehat.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Umroh Sehat — Biro Umroh Terpercaya",
    template: "%s | Umroh Sehat",
  },
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Umroh Sehat — Biro Umroh Terpercaya",
    description:
      "Biro perjalanan umroh terpercaya dengan izin resmi Kemenag. Berangkat dengan nyaman, kembali dengan ketenangan.",
    type: "website",
    locale: "id_ID",
    siteName: "Umroh Sehat",
    url: SITE_URL,
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Umroh Sehat — Biro Umroh Terpercaya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Umroh Sehat — Biro Umroh Terpercaya",
    description:
      "Biro perjalanan umroh terpercaya dengan izin resmi Kemenag. Berangkat dengan nyaman, kembali dengan ketenangan.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAllSettings();

  const metaPixelId = (settings.meta_pixel_id || "").trim();
  const googleAdsId = (settings.google_ads_id || "").trim();
  // Only allow safe ID characters (numbers, letters, dash, underscore, dot)
  const isValidId = (id: string) => /^[A-Za-z0-9._-]+$/.test(id);

  const metaPixelScript = metaPixelId && isValidId(metaPixelId)
    ? `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`
    : "";

  const googleAdsScript = googleAdsId && isValidId(googleAdsId)
    ? `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAdsId}');`
    : "";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: "Umroh Sehat",
      description:
        "Biro perjalanan umroh terpercaya dengan izin resmi Kemenag",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://umrohsehat.com",
      logo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/images/logo.png`,
      image: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/images/og-image.png`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "Indonesian",
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "ID",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Umroh Sehat",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://umrohsehat.com",
      description:
        "Biro perjalanan umroh terpercaya dengan izin resmi Kemenag. Berangkat dengan nyaman, kembali dengan ketenangan.",
      inLanguage: "id-ID",
      publisher: {
        "@type": "Organization",
        name: "Umroh Sehat",
        logo: {
          "@type": "ImageObject",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/images/logo.png`,
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Umroh Sehat",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://umrohsehat.com",
      logo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/images/logo.png`,
      image: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/images/og-image.png`,
      description: "Biro perjalanan umroh terpercaya dengan izin resmi Kemenag",
      address: {
        "@type": "PostalAddress",
        addressCountry: "ID",
      },
    },
  ];

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {metaPixelScript && (
          <>
            <script
              dangerouslySetInnerHTML={{ __html: metaPixelScript }}
            />
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        {googleAdsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
            />
            <script
              dangerouslySetInnerHTML={{ __html: googleAdsScript }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
