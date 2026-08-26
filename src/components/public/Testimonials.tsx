interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  avatarUrl?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  googleRating: string;
}

export default function Testimonials({ testimonials, googleRating }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimoni" className="py-20 bg-[#FAF7F0]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Testimoni Jamaah</h2>
          <div className="w-24 h-1 bg-[#0B6E4F] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <span className="text-[#C9A227] font-bold">⭐ {googleRating}</span> Rating Google
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testi) => (
            <div key={testi.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                {testi.avatarUrl ? (
                  <img src={testi.avatarUrl} alt={testi.name} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#0B6E4F] text-white flex items-center justify-center text-xl font-bold">
                    {testi.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900">{testi.name}</h4>
                  <p className="text-sm text-gray-500">{testi.city}</p>
                </div>
              </div>
              
              <div className="flex text-[#C9A227] mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < testi.rating ? '★' : '☆'}</span>
                ))}
              </div>
              
              <p className="text-gray-600 italic flex-grow">"{testi.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
