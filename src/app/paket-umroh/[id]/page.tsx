import prisma from '@/lib/prisma';
import { getAllSettings } from '@/lib/settings';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Clock, Wallet, Users, CheckCircle2, ArrowLeft, MessageCircle } from 'lucide-react';

import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp';
import CategoryBadge from '@/components/public/CategoryBadge';

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://umrohsehat.my.id";

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

function normalizeWa(number: string) {
  return number.replace(/[^0-9]/g, '').replace(/^0/, '62');
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const pkg = await prisma.package.findUnique({ where: { id: params.id } });
  if (!pkg || !pkg.published) return { title: 'Paket Tidak Ditemukan | Umroh Sehat' };

  const image = pkg.imageUrl
    ? pkg.imageUrl.startsWith('http') ? pkg.imageUrl : `${SITE_URL}${pkg.imageUrl}`
    : `${SITE_URL}/images/og-image.png`;

  return {
    title: `${pkg.title} — Paket Umroh`,
    description: pkg.description,
    alternates: { canonical: `/paket-umroh/${pkg.id}` },
    openGraph: {
      title: `${pkg.title} — ${formatPrice(pkg.price)}`,
      description: pkg.description,
      type: 'website',
      url: `${SITE_URL}/paket-umroh/${pkg.id}`,
      siteName: 'Umroh Sehat',
      locale: 'id_ID',
      images: [{ url: image, width: 1200, height: 630, alt: pkg.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pkg.title} — Paket Umroh`,
      description: pkg.description,
      images: [image],
    },
  };
}

export default async function PackageDetailPage({ params }: { params: { id: string } }) {
  const pkg = await prisma.package.findUnique({ where: { id: params.id } });
  if (!pkg || !pkg.published) notFound();

  const settings = await getAllSettings();
  const whatsappNumber = settings.whatsapp_number || settings.whatsappNumber || '6281234567890';
  const brandName = settings.brand_name || settings.brandName || 'Umroh Sehat';

  const isFull = pkg.status === 'FULL' || pkg.seatsLeft <= 0;
  const settingsFacilities: { icon: string; title: string; desc: string }[] = [];
  try {
    const parsed = JSON.parse(settings.facilities_list || '[]');
    if (Array.isArray(parsed)) settingsFacilities.push(...parsed);
  } catch { /* ignore */ }

  // Fasilitas khusus paket ini; fallback ke fasilitas umum website
  const pkgFacilities: { icon: string; title: string; desc: string }[] = [];
  try {
    const parsed = JSON.parse(pkg.facilities || '[]');
    if (Array.isArray(parsed)) pkgFacilities.push(...parsed);
  } catch { /* ignore */ }
  const facilities = pkgFacilities.length > 0 ? pkgFacilities : settingsFacilities;
  const facilitiesTitle = pkgFacilities.length > 0 ? 'Fasilitas Paket Ini' : 'Fasilitas Paket';

  const waMessage = `Assalamu'alaikum, saya tertarik dengan paket ${pkg.title} — keberangkatan ${formatDate(pkg.departureDate)} (${pkg.durationDays} hari), harga ${formatPrice(pkg.price)}. Mohon informasi lebih lanjut.`;
  const waUrl = `https://wa.me/${normalizeWa(whatsappNumber)}?text=${encodeURIComponent(waMessage)}`;

  const detailLines = pkg.details ? pkg.details.split('\n').map(l => l.trim()).filter(Boolean) : [];
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pkg.title,
    description: pkg.description,
    image: pkg.imageUrl
      ? pkg.imageUrl.startsWith('http') ? pkg.imageUrl : `${SITE_URL}${pkg.imageUrl}`
      : `${SITE_URL}/images/og-image.png`,
    brand: { '@type': 'Brand', name: brandName },
    offers: {
      '@type': 'Offer',
      price: (pkg.price / 1000000).toFixed(2),
      priceCurrency: 'IDR' as string,
      availability: isFull ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      url: `${SITE_URL}/paket-umroh/${pkg.id}`,
    },
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Header whatsappNumber={whatsappNumber} brandName={brandName} logoUrl={settings.logo_url || '/images/logo.png'} />

      {/* Breadcrumb */}
      <div className="pt-28 pb-4 container mx-auto px-4 max-w-6xl">
        <nav className="text-sm text-gray-500 font-medium flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#0B6E4F] transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/paket-umroh" className="hover:text-[#0B6E4F] transition-colors">Paket Umroh</Link>
          <span>/</span>
          <span className="text-gray-800 line-clamp-1">{pkg.title}</span>
        </nav>
      </div>

      <div className="flex-grow container mx-auto px-4 pb-20 max-w-6xl">
        {/* Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
          <div className="relative aspect-[4/5] md:aspect-[16/9] bg-gradient-to-br from-[#0B6E4F] to-green-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pkg.imageUrl || '/images/package-default.jpg'}
              alt={pkg.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <CategoryBadge category={pkg.category} />
                {pkg.badge && (
                  <span className="bg-[#C9A227] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">{pkg.badge}</span>
                )}
                <span className={`text-white text-xs font-bold px-3 py-1.5 rounded-full shadow ${isFull ? 'bg-red-500' : 'bg-[#0B6E4F] border border-white/30'}`}>
                  {isFull ? 'FULLSEAT' : `SISA ${pkg.seatsLeft} KURSI`}
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-4xl font-bold text-white drop-shadow">{pkg.title}</h1>
            </div>
          </div>

          <div className="p-6 md:p-10">
            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#FAF7F0] rounded-2xl p-4 flex items-start gap-3">
                <CalendarDays className="w-5 h-5 text-[#0B6E4F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 font-bold">Keberangkatan</p>
                  <p className="text-sm font-bold text-gray-900">{formatDate(pkg.departureDate)}</p>
                </div>
              </div>
              <div className="bg-[#FAF7F0] rounded-2xl p-4 flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#0B6E4F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 font-bold">Durasi</p>
                  <p className="text-sm font-bold text-gray-900">{pkg.durationDays} Hari</p>
                </div>
              </div>
              <div className="bg-[#FAF7F0] rounded-2xl p-4 flex items-start gap-3">
                <Wallet className="w-5 h-5 text-[#0B6E4F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 font-bold">Harga</p>
                  <p className="text-sm font-bold text-[#0B6E4F]">{formatPrice(pkg.price)}</p>
                </div>
              </div>
              <div className="bg-[#FAF7F0] rounded-2xl p-4 flex items-start gap-3">
                <Users className="w-5 h-5 text-[#0B6E4F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 font-bold">Kuota</p>
                  <p className="text-sm font-bold text-gray-900">{isFull ? 'Penuh' : `${pkg.seatsLeft} Kursi Tersisa`}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#25D366] hover:bg-green-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-200 transition-colors mb-10"
            >
              <MessageCircle className="w-6 h-6" />
              Saya Minat Paket Ini — Chat WhatsApp
            </a>

            {/* Description */}
            <div className="mb-10">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#0B6E4F] rounded-full inline-block"></span>
                Deskripsi Paket
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{pkg.description}</p>
            </div>

            {/* Details / Itinerary */}
            {detailLines.length > 0 && (
              <div className="mb-10">
                <h2 className="font-serif text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#0B6E4F] rounded-full inline-block"></span>
                  Penjelasan Lengkap & Itinerary
                </h2>
                <div className="space-y-3">
                  {detailLines.map((line, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#0B6E4F] shrink-0 mt-0.5" />
                      <p className="text-gray-700 leading-relaxed">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            {facilities.length > 0 && (
              <div className="mb-10">
                <h2 className="font-serif text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#0B6E4F] rounded-full inline-block"></span>
                  {facilitiesTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilities.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <span className="text-2xl">{f.icon || '✅'}</span>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="bg-gradient-to-br from-[#0B6E4F] to-green-800 rounded-2xl p-6 md:p-8 text-center">
              <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-2">Tertarik dengan paket ini?</h3>
              <p className="text-green-100 mb-5 text-sm md:text-base">
                Konsultasi gratis dengan tim kami — jadwal, harga, dan persiapan keberangkatan.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-green-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat WhatsApp Sekarang
              </a>
              <div className="mt-5">
                <Link href="/paket-umroh" className="text-green-100 text-sm hover:text-white inline-flex items-center gap-1.5 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Lihat paket umroh lainnya
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer settings={settings} logoUrl={settings.logo_url || '/images/logo.png'} />
      <FloatingWhatsApp
        whatsappNumber={settings.floating_wa_number || whatsappNumber}
        greetingText={settings.floating_wa_text || "Assalamu'alaikum CS Umroh Sehat, saya ingin bertanya seputar paket umroh."}
        tooltipText={settings.floating_wa_tooltip || 'Chat CS Kami'}
        position={(settings.floating_wa_position as any) || 'bottom-right'}
        enabled={settings.floating_wa_enabled !== 'false'}
      />
    </main>
  );
}
