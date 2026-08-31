import { Landmark, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  headline?: string;
  subheadline?: string;
  whatsappNumber: string;
  rating?: string;
  badge?: string;
  jamaahCount?: string;
  backgroundImage?: string;
}

export default function Hero({
  headline = "Umroh Sehat, Ibadah Khusyuk & Tenang",
  subheadline = "Biro perjalanan umroh resmi & terpercaya. Nikmati kenyamanan beribadah di Tanah Suci dengan pendampingan ibadah sesuai sunnah dan fasilitas terbaik.",
  whatsappNumber,
  rating = "4.9",
  badge = "PPIU RESMI • BERIZIN KEMENAG",
  jamaahCount = "5.000+",
  backgroundImage = "/images/hero-makkah.jpg"
}: HeroProps) {
  const cleanWaNumber = (whatsappNumber || '6281234567890').replace(/^0/, '62');
  const bgImg = backgroundImage && backgroundImage.trim() !== '' ? backgroundImage : '/images/hero-makkah.jpg';

  return (
    <section id="beranda" className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background Image with Kaaba and Masjidil Haram */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
        style={{
          backgroundImage: `url('${bgImg}')`,
        }}
      >
        {/* Multilayer gradient overlays for contrast and luxury aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#032319]/95 via-[#0B6E4F]/80 to-[#032319]/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#021811] via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/15 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Official License Badge */}
          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md border border-[#C9A227]/50 text-[#C9A227] px-5 py-2 rounded-full text-xs md:text-sm font-bold tracking-wider mb-8 shadow-lg animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-ping"></span>
            <span>{badge}</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight drop-shadow-md">
            {headline}
          </h1>
          
          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto text-green-50/95 leading-relaxed font-sans drop-shadow">
            {subheadline}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="#paket" 
              className="w-full sm:w-auto bg-[#C9A227] hover:bg-[#b08d20] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 text-base md:text-lg"
            >
              <Landmark className="w-5 h-5" />
              <span>Lihat Paket Umroh</span>
            </Link>
            <a 
              href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent("Assalamu'alaikum, saya ingin konsultasi paket umroh di Umroh Sehat.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/40 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 text-base md:text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Konsultasi &amp; Daftar</span>
            </a>
          </div>
          
          {/* Trust Row / Key Statistics */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 shadow-2xl">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-xl md:text-3xl font-extrabold text-[#C9A227] mb-1">
                ⭐ {rating}
              </span>
              <span className="text-xs md:text-sm text-green-100 font-medium">
                Rating Google
              </span>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center border-x border-white/20 px-2">
              <span className="text-xl md:text-3xl font-extrabold text-emerald-400 mb-1">
                100%
              </span>
              <span className="text-xs md:text-sm text-green-100 font-medium">
                Berizin Resmi Kemenag
              </span>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-xl md:text-3xl font-extrabold text-white mb-1">
                {jamaahCount}
              </span>
              <span className="text-xs md:text-sm text-green-100 font-medium">
                Jamaah Terberangkatkan
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
