import { Landmark, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
  settings: {
    address?: string;
    phone?: string;
    email?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    tiktokUrl?: string;
  };
  logoUrl?: string;
}

export default function Footer({ settings, logoUrl = '' }: FooterProps) {
  return (
    <footer className="bg-[#0B6E4F] text-white pt-16 pb-8 border-t-4 border-[#C9A227]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Umroh Sehat"
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <Landmark className="w-8 h-8 text-white" />
              )}
              <span className="font-serif text-2xl font-bold text-white group-hover:text-[#C9A227] transition-colors">
                Umroh Sehat
              </span>
            </Link>
            <p className="text-green-50 mb-6 leading-relaxed">
              Penyelenggara ibadah umroh resmi yang berfokus pada kenyamanan, keamanan, dan kesehatan jamaah selama di tanah suci.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-4">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A227] transition-colors">
                  <span className="sr-only">Facebook</span>
                  FB
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A227] transition-colors">
                  <span className="sr-only">Instagram</span>
                  IG
                </a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A227] transition-colors">
                  <span className="sr-only">YouTube</span>
                  YT
                </a>
              )}
              {settings.tiktokUrl && (
                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A227] transition-colors">
                  <span className="sr-only">TikTok</span>
                  TK
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Layanan */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-[#C9A227]">Layanan</h4>
            <ul className="space-y-3">
              <li><Link href="/paket-umroh" className="text-green-50 hover:text-white transition-colors flex items-center gap-2"><span>›</span> Paket Umroh</Link></li>
              <li><span className="text-green-50/70 flex items-center gap-2"><span>›</span> Umroh Reguler</span></li>
              <li><span className="text-green-50/70 flex items-center gap-2"><span>›</span> Umroh Plus</span></li>
              <li><span className="text-green-50/70 flex items-center gap-2"><span>›</span> Umroh Bisnis</span></li>
            </ul>
          </div>

          {/* Column 3: Informasi */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-[#C9A227]">Informasi</h4>
            <ul className="space-y-3">
              <li><Link href="/#tentang" className="text-green-50 hover:text-white transition-colors flex items-center gap-2"><span>›</span> Tentang Kami</Link></li>
              <li><Link href="/#artikel" className="text-green-50 hover:text-white transition-colors flex items-center gap-2"><span>›</span> Artikel</Link></li>
              <li><Link href="/kebijakan-privasi" className="text-green-50 hover:text-white transition-colors flex items-center gap-2"><span>›</span> Kebijakan Privasi</Link></li>
              <li><Link href="/#kontak" className="text-green-50 hover:text-white transition-colors flex items-center gap-2"><span>›</span> Kontak</Link></li>
            </ul>
          </div>

          {/* Column 4: Kontak */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-[#C9A227]">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-green-50">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span className="whitespace-pre-line">{settings.address || "Jakarta, Indonesia"}</span>
              </li>
              <li className="flex items-start gap-3 text-green-50">
                <Phone className="w-4 h-4 mt-1 shrink-0" />
                <span>{settings.phone || "-"}</span>
              </li>
              <li className="flex items-start gap-3 text-green-50">
                <Mail className="w-4 h-4 mt-1 shrink-0" />
                <span>{settings.email || "-"}</span>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-white/20 pt-8 mt-8 text-center text-sm text-green-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Umroh Sehat. Hak Cipta Dilindungi.</p>
          <p>Powered by <a href="#" className="hover:text-white font-medium">Digital Magnetix</a></p>
        </div>
      </div>
    </footer>
  );
}
