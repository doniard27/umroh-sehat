'use client';
import Link from 'next/link';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  createdAt?: string | Date;
  date?: string | Date;
  imageUrl?: string;
}

interface ArticlesProps {
  articles: Article[];
}

function formatDate(date?: string | Date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Articles({ articles }: ArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section id="artikel" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Artikel Terbaru</h2>
          <div className="w-24 h-1 bg-[#0B6E4F] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {articles.map((article, index) => {
            const fallbackImg = `/images/gallery-${(index % 4) + 1}.jpg`;
            return (
              <Link key={article.id} href={`/artikel/${article.slug}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col">
                  <div className="relative h-48 bg-gradient-to-br from-[#0B6E4F] to-green-900 overflow-hidden">
                    <img 
                      src={article.imageUrl || fallbackImg} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      onError={(e) => {
                        e.currentTarget.src = fallbackImg;
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#0B6E4F] text-white text-xs font-medium px-3 py-1 rounded-full shadow">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-sm text-gray-500 mb-3">{formatDate(article.createdAt || article.date)}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0B6E4F] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 text-sm mb-4 flex-grow">
                      {article.excerpt}
                    </p>
                    <div className="text-[#0B6E4F] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Baca Selengkapnya <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
