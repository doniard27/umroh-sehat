import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = bcrypt.hashSync('umrohsehat123', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@umrohsehat.com' },
    update: {},
    create: {
      email: 'admin@umrohsehat.com',
      password: hashedPassword,
      name: 'Admin Umroh Sehat'
    }
  });

  await prisma.package.deleteMany();
  await prisma.package.createMany({
    data: [
      {
        title: "Umroh Reguler 9 Hari",
        description: "Paket umroh reguler dengan fasilitas lengkap. Hotel bintang 4 dekat Masjidil Haram, pesawat langsung, makan 3x sehari menu Indonesia, mutawwif berpengalaman.",
        departureDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        durationDays: 9,
        price: 29500000,
        status: "AVAILABLE",
        seatsLeft: 15,
        badge: "BEST SELLER"
      },
      {
        title: "Umroh Plus Turki 12 Hari",
        description: "Paket umroh premium dengan tambahan city tour Istanbul & Cappadocia. Hotel bintang 5, penerbangan kelas bisnis, guide lokal, makan full board.",
        departureDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        durationDays: 12,
        price: 38000000,
        status: "AVAILABLE",
        seatsLeft: 8,
        badge: "PREMIUM"
      },
      {
        title: "Umroh Ramadhan 14 Hari",
        description: "Paket umroh spesial Ramadhan. Rasakan pengalaman ibadah di Tanah Suci selama bulan Ramadhan. Termasuk itikaf 10 hari terakhir.",
        departureDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        durationDays: 14,
        price: 45000000,
        status: "FULL",
        seatsLeft: 0,
        badge: "SOLD OUT"
      }
    ]
  });

  await prisma.article.deleteMany();
  await prisma.article.createMany({
    data: [
      {
        title: "Panduan Lengkap Ibadah Umroh bagi Pemula",
        slug: "panduan-lengkap-ibadah-umroh-bagi-pemula",
        category: "Haji & Umroh",
        excerpt: "Pelajari tata cara umroh dari awal hingga akhir, mulai dari ihram, tawaf, sa'i, hingga tahallul.",
        content: "<h2>Ihram</h2><p>Ihram adalah niat masuk ke dalam ibadah umroh...</p><h2>Tawaf</h2><p>Tawaf adalah mengelilingi Ka'bah sebanyak 7 kali...</p><h2>Sa'i</h2><p>Sa'i adalah berjalan dari bukit Shafa ke Marwah...</p><h2>Tahallul</h2><p>Tahallul adalah mencukur rambut...</p>"
      },
      {
        title: "Keutamaan Shalat di Masjidil Haram dan Masjid Nabawi",
        slug: "keutamaan-shalat-masjidil-haram-masjid-nabawi",
        category: "Aqidah",
        excerpt: "Ketahui pahala berlipat ganda shalat di dua masjid termulia di dunia.",
        content: "<h2>Keutamaan Masjidil Haram</h2><p>Shalat di Masjidil Haram bernilai 100.000 kali lipat...</p><h2>Keutamaan Masjid Nabawi</h2><p>Shalat di Masjid Nabawi bernilai 1.000 kali lipat...</p>"
      },
      {
        title: "Tips Menjaga Kesehatan Selama Ibadah Umroh",
        slug: "tips-menjaga-kesehatan-selama-umroh",
        category: "Berita",
        excerpt: "Panduan praktis menjaga stamina dan kesehatan selama menjalankan ibadah umroh di Tanah Suci.",
        content: "<h2>Persiapan Fisik</h2><p>Mulailah berolahraga ringan sebelum berangkat...</p><h2>Pola Makan</h2><p>Konsumsi makanan bergizi dan perbanyak minum air putih...</p><ul><li>Banyak minum zamzam</li><li>Istirahat cukup</li></ul>"
      }
    ]
  });

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Bapak Ahmad Hidayat",
        city: "Jakarta",
        rating: 5,
        text: "Alhamdulillah, pengalaman umroh bersama Umroh Sehat sangat berkesan. Pembimbing sangat sabar dan menguasai ilmu fiqih. Hotel dekat dengan Masjidil Haram, jadi sangat memudahkan ibadah. Jazakumullahu khairan."
      },
      {
        name: "Ibu Siti Nurhaliza",
        city: "Bandung",
        rating: 5,
        text: "Pelayanan luar biasa dari awal pendaftaran hingga pulang ke tanah air. Makanan enak dan bergizi, transportasi nyaman. InsyaAllah akan berangkat lagi bersama Umroh Sehat."
      },
      {
        name: "Ustadz Muhammad Fadhil",
        city: "Surabaya",
        rating: 5,
        text: "Saya merekomendasikan Umroh Sehat kepada jamaah yang ingin umroh dengan bimbingan ibadah yang benar sesuai sunnah. Tim mereka profesional dan amanah."
      }
    ]
  });

  await prisma.galleryImage.deleteMany();
  await prisma.galleryImage.createMany({
    data: [
      { imageUrl: '/images/gallery-1.jpg', caption: 'Masjidil Haram', isCover: true },
      { imageUrl: '/images/gallery-2.jpg', caption: 'Masjid Nabawi', isCover: false },
      { imageUrl: '/images/gallery-3.jpg', caption: 'Jamaah Umroh Sehat', isCover: false },
      { imageUrl: '/images/gallery-4.jpg', caption: 'Hotel Makkah', isCover: false }
    ]
  });

  const settings = [
    { key: 'brand_name', value: 'Umroh Sehat' },
    { key: 'whatsapp_number', value: '6281234567890' },
    { key: 'whatsapp_cs', value: '6281234567891' },
    { key: 'email', value: 'info@umrohsehat.com' },
    { key: 'phone', value: '021-12345678' },
    { key: 'address', value: 'Jl. H.R. Rasuna Said Kav. C-22, Kuningan, Jakarta Selatan 12940' },
    { key: 'operating_hours', value: 'Senin - Jumat: 08.00 - 17.00 WIB, Sabtu: 09.00 - 14.00 WIB' },
    { key: 'hero_title', value: 'Umroh Sehat, Ibadah Khusyuk & Tenang' },
    { key: 'hero_subtitle', value: 'Biro umroh terpercaya — berangkat dengan nyaman, kembali dengan ketenangan' },
    { key: 'google_rating', value: '4.9' },
    { key: 'jamaah_count', value: '5000+' },
    { key: 'license_badge', value: 'PPIU RESMI • BERIZIN KEMENAG' },
    { key: 'visi', value: 'Menjadi biro perjalanan umroh terdepan yang mengutamakan kenyamanan ibadah dan keselamatan jamaah.' },
    { key: 'misi', value: 'Memberikan pelayanan umroh terbaik dengan bimbingan ibadah sesuai Al-Quran dan Sunnah, fasilitas premium, dan harga yang transparan.' },
    { key: 'facebook_url', value: 'https://facebook.com/umrohsehat' },
    { key: 'instagram_url', value: 'https://instagram.com/umrohsehat' },
    { key: 'tiktok_url', value: 'https://tiktok.com/@umrohsehat' },
    { key: 'youtube_url', value: 'https://youtube.com/@umrohsehat' },
    { key: 'telegram_url', value: 'https://t.me/umrohsehat' }
  ];

  await prisma.setting.deleteMany();
  await prisma.setting.createMany({ data: settings });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
