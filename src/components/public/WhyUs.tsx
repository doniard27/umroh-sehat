import { Landmark, Plane, Trophy } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  '🕌': <Landmark className="w-7 h-7 text-[#0B6E4F]" />,
  '✈️': <Plane className="w-7 h-7 text-[#0B6E4F]" />,
  '🏆': <Trophy className="w-7 h-7 text-[#0B6E4F]" />,
};

export default function WhyUs() {
  const reasons = [
    {
      icon: "🕌",
      title: "Ibadah Sesuai Tuntunan",
      description: "Pembimbing berpengalaman memastikan ibadah Anda sesuai sunnah Rasulullah ﷺ."
    },
    {
      icon: "✈️",
      title: "Tiket & Jadwal Confirmed",
      description: "Kepastian jadwal dan tiket penerbangan, tanpa penundaan."
    },
    {
      icon: "🏆",
      title: "Berpengalaman & Terpercaya",
      description: "Telah memberangkatkan ribuan jamaah dengan pelayanan terbaik."
    }
  ];

  return (
    <section id="mengapa-kami" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mengapa Umroh Sehat</h2>
          <div className="w-24 h-1 bg-[#0B6E4F] mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F0] p-8 rounded-2xl text-center hover:shadow-lg transition-shadow duration-300 border border-[#0B6E4F]/10 group"
            >
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-[#0B6E4F]/5 transition-colors">
                {iconMap[reason.icon] || <Landmark className="w-7 h-7 text-[#0B6E4F]" />}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{reason.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
