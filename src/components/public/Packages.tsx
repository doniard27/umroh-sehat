'use client';
import Link from 'next/link';

interface Package {
  id: string;
  title: string;
  departureDate: string | Date;
  durationDays: number;
  price: number;
  seatsLeft: number;
  status: string;
  badge?: string;
  description: string;
  imageUrl?: string;
}

interface PackagesProps {
  packages: Package[];
  whatsappNumber: string;
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

export default function Packages({ packages, whatsappNumber }: PackagesProps) {
  return (
    <section id="paket" className="py-20 bg-[#FAF7F0]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Paket Umroh</h2>
          <div className="w-24 h-1 bg-[#0B6E4F] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <div className="relative h-60 bg-gradient-to-br from-[#0B6E4F] to-green-700 flex items-center justify-center overflow-hidden">
                <img 
                  src={pkg.imageUrl || '/images/package-default.jpg'} 
                  alt={pkg.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/package-default.jpg';
                  }}
                />
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

                <p className="text-gray-600 text-sm mb-6 line-clamp-2">{pkg.description}</p>
                
                <div className="mt-auto">
                  <div className="text-[#C9A227] font-bold text-2xl mb-4">
                    {formatPrice(pkg.price)}
                  </div>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/^0/, '62')}?text=${encodeURIComponent(`Assalamu'alaikum, saya tertarik dengan paket ${pkg.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-[#0B6E4F] hover:bg-green-800 text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    SELENGKAPNYA
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/paket-umroh" className="inline-block text-[#0B6E4F] font-semibold hover:text-green-800 transition-colors border-b-2 border-[#0B6E4F] hover:border-green-800 pb-1">
            Lihat Semua Paket Umroh →
          </Link>
        </div>
      </div>
    </section>
  );
}
