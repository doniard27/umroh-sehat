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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-[#FAF7F0] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm border border-gray-100">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed font-sans">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
