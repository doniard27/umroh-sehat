'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp';
import CategoryBadge from '@/components/public/CategoryBadge';

interface Package {
  id: string;
  title: string;
  departureDate: string;
  durationDays: number;
  price: number;
  seatsLeft: number;
  status: string;
  badge?: string;
  category?: string;
  description: string;
  imageUrl?: string;
}

type CategoryFilter = 'SEMUA' | 'HEMAT' | 'REGULER' | 'PREMIUM';

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

export default function PaketUmrohPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CategoryFilter>('SEMUA');

  useEffect(() => {
    Promise.all([
      fetch('/api/packages').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/settings').then(r => r.ok ? r.json() : {}).catch(() => {})
    ]).then(([pkgs, setts]) => {
      setPackages(Array.isArray(pkgs) ? pkgs : []);
      setSettings(setts || {});
      setLoading(false);
    });
  }, []);

  const whatsappNumber = settings.whatsapp_number || settings.whatsappNumber || '6281234567890';
  const filteredPackages = filter === 'SEMUA'
    ? packages
    : packages.filter((p) => (p.category || 'REGULER').toUpperCase() === filter);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F0]">
      <Header whatsappNumber={whatsappNumber} />
      
      <div className="pt-32 pb-20 flex-grow container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#0B6E4F] transition-colors">Beranda</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Paket Umroh</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Paket Umroh</h1>
          <div className="w-24 h-1 bg-[#0B6E4F] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Pilih paket umroh yang sesuai dengan kebutuhan Anda. Kami menyediakan berbagai pilihan dengan fasilitas terbaik.
          </p>
        </div>

        {/* Filter Kategori */}
        {!loading && packages.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {(['SEMUA', 'HEMAT', 'REGULER', 'PREMIUM'] as CategoryFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  filter === f
                    ? f === 'HEMAT'
                      ? 'bg-[#C9A227] text-white shadow-md'
                      : f === 'PREMIUM'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-[#0B6E4F] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0B6E4F]/40'
                }`}
              >
                {f === 'SEMUA' ? 'Semua Paket' : f === 'HEMAT' ? '💸 Hemat' : f === 'REGULER' ? '🕋 Reguler' : '👑 Premium'}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative aspect-[4/5] bg-gradient-to-br from-[#0B6E4F] to-green-700 flex items-center justify-center overflow-hidden">
                  <img 
                    src={pkg.imageUrl || '/images/package-default.jpg'} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/package-default.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <CategoryBadge category={pkg.category} />
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    {pkg.badge && (
                      <span className="bg-[#C9A227] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        {pkg.badge}
                      </span>
                    )}
                    {pkg.status === 'FULL' || pkg.seatsLeft <= 0 ? (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">FULLSEAT</span>
                    ) : (
                      <span className="bg-[#0B6E4F] text-white text-xs font-bold px-3 py-1 rounded-full shadow border border-white/20">
                        SISA {pkg.seatsLeft} KURSI
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">{pkg.title}</h3>
                  
                  <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{formatDate(pkg.departureDate)} ({pkg.durationDays} Hari)</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">{pkg.description}</p>
                  
                  <div className="mt-auto">
                    <div className="text-[#C9A227] font-bold text-2xl mb-4">
                      {formatPrice(pkg.price)}
                    </div>
                    <Link
                      href={`/paket-umroh/${pkg.id}`}
                      className="block w-full text-center bg-[#0B6E4F] hover:bg-green-800 text-white py-3 rounded-xl font-bold transition-colors"
                    >
                      SELENGKAPNYA
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && packages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Belum ada paket umroh yang tersedia saat ini.</p>
          </div>
        )}
      </div>

      <Footer settings={settings} />
      <FloatingWhatsApp 
        whatsappNumber={settings.floating_wa_number || whatsappNumber}
        greetingText={settings.floating_wa_text || "Assalamu'alaikum CS Umroh Sehat, saya ingin bertanya seputar paket umroh."}
        tooltipText={settings.floating_wa_tooltip || "Chat CS Kami"}
        position={(settings.floating_wa_position as any) || 'bottom-right'}
        enabled={settings.floating_wa_enabled !== 'false'}
      />
    </main>
  );
}
