import {
  Ticket, BadgeCheck, Hotel, GraduationCap, UtensilsCrossed,
  Backpack, Bus, Compass, Sparkles, Plane, Landmark, type LucideIcon,
} from 'lucide-react';

export interface FacilityItem {
  icon: string;
  title?: string;
  text?: string;
  desc?: string;
}

const facilityIcons: Record<string, LucideIcon> = {
  '🎫': Ticket,
  '🛂': BadgeCheck,
  '🏨': Hotel,
  '🎓': GraduationCap,
  '🍽️': UtensilsCrossed,
  '🍽': UtensilsCrossed,
  '🎒': Backpack,
  '🚌': Bus,
  '🏙️': Compass,
  '🏙': Compass,
  '✈️': Plane,
  '🕋': Landmark,
  '🕌': Landmark,
};

function FacilityIcon({ icon }: { icon: string }) {
  const IconCmp = facilityIcons[icon] || Sparkles;
  return <IconCmp className="w-6 h-6 text-[#0B6E4F]" />;
}

interface FacilitiesProps {
  title?: string;
  subtitle?: string;
  facilities?: FacilityItem[];
}

export const defaultFacilities: FacilityItem[] = [
  { icon: "🎫", title: "Jadwal & Tiket Confirmed", desc: "Penerbangan langsung maskapai ternama" },
  { icon: "🛂", title: "Visa Umroh Resmi", desc: "Proses cepat & terjamin legalitasnya" },
  { icon: "🏨", title: "Hotel Dekat Masjid", desc: "Jarak dekat Masjidil Haram & Nabawi" },
  { icon: "🎓", title: "Muthawwif Berpengalaman", desc: "Bimbingan ibadah intensif sesuai sunnah" },
  { icon: "🍽️", title: "Konsumsi Menu Indonesia", desc: "Makanan higienis & bergizi 3x sehari" },
  { icon: "🎒", title: "Perlengkapan Lengkap", desc: "Koper, ihram/mukena, tas & seragam" },
  { icon: "🚌", title: "Transportasi Bus AC", desc: "Bus eksekutif modern & nyaman" },
  { icon: "🏙️", title: "City Tour & Ziarah", desc: "Ziarah bersejarah di Makkah & Madinah" },
];

export default function Facilities({
  title = "Fasilitas Kami",
  subtitle = "Layanan dan fasilitas terbaik yang kami sediakan untuk memastikan kenyamanan ibadah Anda",
  facilities
}: FacilitiesProps) {
  const items = facilities && facilities.length > 0 ? facilities : defaultFacilities;

  return (
    <section id="fasilitas" className="py-20 bg-[#FAF7F0] relative overflow-hidden">
      {/* Subtle decorative background circle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B6E4F]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#C9A227] font-semibold text-xs uppercase tracking-widest bg-[#C9A227]/10 px-3.5 py-1.5 rounded-full border border-[#C9A227]/20">
            Layanan Terpadu
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="w-20 h-1 bg-[#0B6E4F] mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {items.map((fac, idx) => {
            const itemTitle = fac.title || fac.text || `Fasilitas ${idx + 1}`;
            return (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl shadow-xs hover:shadow-md border border-gray-100/80 text-center flex flex-col items-center justify-start gap-3.5 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#FAF7F0] group-hover:bg-[#0B6E4F]/10 rounded-2xl flex items-center justify-center transition-colors shrink-0 shadow-inner">
                  <FacilityIcon icon={fac.icon || ''} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-[#0B6E4F] transition-colors">
                    {itemTitle}
                  </h3>
                  {fac.desc && (
                    <p className="text-xs text-gray-500 leading-normal">
                      {fac.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
