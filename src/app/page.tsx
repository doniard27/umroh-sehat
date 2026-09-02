import prisma from '@/lib/prisma';
import { getAllSettings } from '@/lib/settings';

import Header from '@/components/public/Header';
import Hero from '@/components/public/Hero';
import WhyUs from '@/components/public/WhyUs';
import Packages from '@/components/public/Packages';
import Gallery from '@/components/public/Gallery';
import Testimonials from '@/components/public/Testimonials';
import Articles from '@/components/public/Articles';
import Facilities from '@/components/public/Facilities';
import About from '@/components/public/About';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp';

export const revalidate = 60;

export default async function Home() {
  const settings = await getAllSettings();
  
  const whatsappNumber = settings.whatsapp_number || settings.whatsappNumber || '6281234567890';
  const brandName = settings.brand_name || settings.brandName || 'Umroh Sehat';
  const logoUrl = settings.logo_url || settings.logoUrl || '';
  const heroHeadline = settings.hero_title || settings.heroHeadline || 'Umroh Sehat, Ibadah Khusyuk & Tenang';
  const heroSubheadline = settings.hero_subtitle || settings.heroSubheadline || 'Biro umroh terpercaya — berangkat dengan nyaman, kembali dengan ketenangan';
  const googleRating = settings.google_rating || settings.googleRating || '4.9';
  const heroBadge = settings.license_badge || settings.heroBadge || 'PPIU RESMI • BERIZIN KEMENAG';
  const jamaahCount = settings.jamaah_count || settings.jamaahCount || '5.000+';
  const heroBgImage = settings.hero_bg_image || '/images/hero-makkah.jpg';
  const companyVisi = settings.visi || settings.companyVisi || 'Menjadi biro perjalanan umroh terdepan yang mengutamakan kenyamanan ibadah dan keselamatan jamaah.';
  const companyMisi = settings.misi || settings.companyMisi || 'Memberikan pelayanan umroh terbaik dengan bimbingan ibadah sesuai Al-Quran dan Sunnah, fasilitas premium, dan harga yang transparan.';
  const contactAddress = settings.address || settings.contactAddress || 'Jl. H.R. Rasuna Said Kav. C-22, Kuningan, Jakarta Selatan 12940';
  const contactPhone = settings.phone || settings.contactPhone || whatsappNumber;
  const contactEmail = settings.email || settings.contactEmail || 'info@umrohsehat.com';
  const contactHours = settings.operating_hours || settings.contactHours || 'Senin - Jumat: 08.00 - 17.00 WIB';

  // Facilities settings
  const facilitiesTitle = settings.facilities_title || 'Fasilitas Kami';
  const facilitiesSubtitle = settings.facilities_subtitle || 'Layanan dan fasilitas terbaik yang kami sediakan untuk memastikan kenyamanan ibadah Anda';
  let facilitiesList = undefined;
  if (settings.facilities_list) {
    try {
      const parsed = JSON.parse(settings.facilities_list);
      if (Array.isArray(parsed) && parsed.length > 0) {
        facilitiesList = parsed;
      }
    } catch {
      facilitiesList = undefined;
    }
  }

  const packages = await prisma.package.findMany({
    where: { published: true },
    orderBy: { departureDate: 'asc' },
    take: 6,
  });

  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { rating: 'desc' },
  });

  const galleryImages = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen">
      <Header whatsappNumber={whatsappNumber} brandName={brandName} logoUrl={logoUrl} />
      
      <Hero 
        headline={heroHeadline}
        subheadline={heroSubheadline}
        whatsappNumber={whatsappNumber}
        rating={googleRating}
        badge={heroBadge}
        jamaahCount={jamaahCount}
        backgroundImage={heroBgImage}
      />
      
      <WhyUs />
      
      <Packages 
        packages={packages} 
        whatsappNumber={whatsappNumber} 
      />
      
      <Facilities 
        title={facilitiesTitle}
        subtitle={facilitiesSubtitle}
        facilities={facilitiesList}
      />
      
      <About 
        visi={companyVisi} 
        misi={companyMisi} 
      />
      
      <Gallery images={galleryImages} />
      
      <Testimonials 
        testimonials={testimonials} 
        googleRating={googleRating} 
      />
      
      <Articles articles={articles} />
      
      <Contact 
        address={contactAddress}
        phone={contactPhone}
        email={contactEmail}
        hours={contactHours}
        whatsappNumber={whatsappNumber}
      />
      
      <Footer settings={settings} logoUrl={logoUrl} />
      
      <FloatingWhatsApp 
        whatsappNumber={settings.floating_wa_number || whatsappNumber}
        greetingText={settings.floating_wa_text || "Assalamu'alaikum CS Umroh Sehat, saya ingin berkonsultasi mengenai paket umroh."}
        tooltipText={settings.floating_wa_tooltip || "Chat CS Kami"}
        position={(settings.floating_wa_position as any) || 'bottom-right'}
        enabled={settings.floating_wa_enabled !== 'false'}
      />
    </main>
  );
}
