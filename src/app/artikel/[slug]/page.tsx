import prisma from '@/lib/prisma';
import { getAllSettings } from '@/lib/settings';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp';

export const dynamic = 'force-dynamic';

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug }
  });
  
  if (!article) return { title: 'Artikel Tidak Ditemukan - Umroh Sehat' };
  
  return {
    title: `${article.title} - Umroh Sehat`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug }
  });

  if (!article || !article.published) {
    notFound();
  }

  const settings = await getAllSettings();
  const whatsappNumber = settings.whatsapp_number || settings.whatsappNumber || '6281234567890';

  const relatedArticles = await prisma.article.findMany({
    where: { 
      published: true,
      id: { not: article.id }
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header whatsappNumber={whatsappNumber} />
      
      <div className="pt-32 pb-20 flex-grow container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#0B6E4F] transition-colors">Beranda</Link>
          <span className="mx-2">›</span>
          <Link href="/#artikel" className="hover:text-[#0B6E4F] transition-colors">Artikel</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 line-clamp-1 inline-block align-bottom max-w-xs">{article.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <article className="w-full lg:w-2/3">
            <div className="mb-8">
              <span className="inline-block bg-[#0B6E4F] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                {article.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>
              <div className="text-gray-500 flex items-center gap-2">
                <span>📅</span> {formatDate(article.createdAt)}
              </div>
            </div>

            <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-10 shadow-sm bg-gradient-to-br from-[#0B6E4F] to-green-900 relative">
              <img 
                src={article.imageUrl || '/images/gallery-1.jpg'} 
                alt={article.title} 
                className="w-full h-full object-cover" 
              />
            </div>

            <div 
              className="article-content max-w-none text-gray-700 font-sans leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3">
            <div className="sticky top-32">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6 border-b-2 border-[#0B6E4F] pb-2 inline-block">
                Artikel Terbaru
              </h3>
              
              <div className="space-y-6">
                {relatedArticles.map((rel, index) => (
                  <Link key={rel.id} href={`/artikel/${rel.slug}`} className="group block">
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100 relative shadow-sm">
                        <img 
                          src={rel.imageUrl || `/images/gallery-${(index % 4) + 1}.jpg`} 
                          alt={rel.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-[#0B6E4F] transition-colors line-clamp-2 mb-1 text-sm md:text-base">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-gray-500">{formatDate(rel.createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer settings={settings} />
      <FloatingWhatsApp 
        whatsappNumber={settings.floating_wa_number || whatsappNumber}
        greetingText={settings.floating_wa_text || "Assalamu'alaikum CS Umroh Sehat, saya ingin bertanya seputar artikel & paket umroh."}
        tooltipText={settings.floating_wa_tooltip || "Chat CS Kami"}
        position={(settings.floating_wa_position as any) || 'bottom-right'}
        enabled={settings.floating_wa_enabled !== 'false'}
      />
    </main>
  );
}
