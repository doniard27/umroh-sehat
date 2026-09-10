import prisma from '@/lib/prisma';
import { getAllSettings } from '@/lib/settings';
import type { Metadata } from 'next';
import Link from 'next/link';

import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp';
import Gallery from '@/components/public/Gallery';

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://umrohsehat.my.id";

export const metadata: Metadata = {
  title: 'Galeri Foto Kegiatan',
  description:
    'Galeri foto kegiatan Umroh Sehat: dokumentasi jamaah di Makkah, Madinah, dan rangkaian cek kesehatan sebelum keberangkatan.',
  alternates: { canonical: '/galeri' },
  openGraph: {
    title: 'Galeri Foto — Umroh Sehat',
    description:
      'Dokumentasi jamaah Umroh Sehat di Makkah, Madinah, dan cek kesehatan.',
    type: 'website',
    url: `${SITE_URL}/galeri`,
    siteName: 'Umroh Sehat',
    locale: 'id_ID',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
  },
};

export default async function GaleriPage() {
  const settings = await getAllSettings();
  const whatsappNumber = settings.whatsapp_number || settings.whatsappNumber || '6281234567890';
  const brandName = settings.brand_name || settings.brandName || 'Umroh Sehat';
  const logoUrl = settings.logo_url || settings.logoUrl || '';

  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header whatsappNumber={whatsappNumber} brandName={brandName} logoUrl={logoUrl} />

      <div className="pt-32 pb-20 flex-grow container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#0B6E4F] transition-colors">Beranda</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Galeri</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Galeri Foto</h1>
          <div className="w-24 h-1 bg-[#0B6E4F] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Dokumentasi perjalanan ibadah jamaah — cek kesehatan, keberangkatan, dan kegiatan di tanah suci.
          </p>
        </div>

        {images.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Belum ada foto galeri.</p>
        ) : (
          <Gallery images={images} hideHeader />
        )}
      </div>

      <Footer settings={settings} logoUrl={logoUrl} />
      <FloatingWhatsApp
        whatsappNumber={settings.floating_wa_number || whatsappNumber}
        greetingText={settings.floating_wa_text || "Assalamu'alaikum CS Umroh Sehat, saya ingin bertanya seputar galeri & kegiatan umroh."}
        tooltipText={settings.floating_wa_tooltip || 'Chat CS Kami'}
        position={(settings.floating_wa_position as any) || 'bottom-right'}
        enabled={settings.floating_wa_enabled !== 'false'}
      />
    </main>
  );
}
