interface AboutProps {
  visi: string;
  misi: string;
}

export default function About({ visi, misi }: AboutProps) {
  return (
    <section id="tentang" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-7xl mx-auto">
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-3xl overflow-hidden aspect-square md:aspect-[4/3] lg:aspect-square bg-gradient-to-br from-[#0B6E4F] to-green-800 flex items-center justify-center shadow-xl">
              {/* Optional: if you have an image, place it here */}
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 text-white font-serif text-3xl md:text-5xl font-bold opacity-30 px-8 text-center leading-relaxed">
                Melayani Sepenuh Hati, <br /> Beribadah Lebih Berarti
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tentang Umroh Sehat</h2>
            <div className="w-20 h-1 bg-[#0B6E4F] rounded-full mb-8"></div>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Umroh Sehat adalah penyelenggara ibadah umroh resmi yang berfokus pada kenyamanan, keamanan, dan kesehatan jamaah selama menjalankan ibadah di tanah suci.
            </p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-[#C9A227]">🎯</span> Visi Kami
                </h3>
                <p className="text-gray-600 leading-relaxed bg-[#FAF7F0] p-4 rounded-xl border-l-4 border-[#0B6E4F]">
                  {visi}
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-[#C9A227]">🚀</span> Misi Kami
                </h3>
                <div className="text-gray-600 leading-relaxed bg-[#FAF7F0] p-4 rounded-xl border-l-4 border-[#0B6E4F] whitespace-pre-line">
                  {misi}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
