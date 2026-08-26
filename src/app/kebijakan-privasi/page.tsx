import { getAllSettings } from '@/lib/settings';
import Link from 'next/link';

import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp';

export const metadata = {
  title: 'Kebijakan Privasi - Umroh Sehat',
  description: 'Kebijakan Privasi dan Perlindungan Data Pelanggan Umroh Sehat.',
};

export default async function KebijakanPrivasiPage() {
  const settings = await getAllSettings();
  const whatsappNumber = settings.whatsappNumber || '6281234567890';
  const email = settings.contactEmail || 'info@umrohsehat.com';

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header whatsappNumber={whatsappNumber} />
      
      <div className="pt-32 pb-20 flex-grow container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#0B6E4F] transition-colors">Beranda</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Kebijakan Privasi</span>
        </nav>

        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Kebijakan Privasi</h1>
          <div className="w-24 h-1 bg-[#0B6E4F] rounded-full mb-6"></div>
          <p className="text-gray-500">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 font-sans space-y-6">
          <p>
            Umroh Sehat ("kami", "milik kami") menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi yang Anda bagikan kepada kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, memproses, dan melindungi informasi pribadi Anda sesuai dengan Undang-Undang Pelindungan Data Pribadi (UU PDP) Republik Indonesia.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Data yang Kami Kumpulkan</h2>
          <p>Kami dapat mengumpulkan data pribadi berikut dari Anda:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Data Identitas:</strong> Nama lengkap, NIK (Nomor Induk Kependudukan), nomor paspor, tempat dan tanggal lahir, jenis kelamin.</li>
            <li><strong>Data Kontak:</strong> Alamat email, nomor telepon/WhatsApp, alamat tempat tinggal.</li>
            <li><strong>Data Transaksi:</strong> Rincian pembayaran, riwayat pemesanan paket umroh.</li>
            <li><strong>Data Kesehatan:</strong> Rekam medis dasar, riwayat vaksinasi (sebagaimana disyaratkan untuk perjalanan ibadah).</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Penggunaan Data</h2>
          <p>Kami menggunakan data pribadi Anda untuk tujuan berikut:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Memproses pendaftaran dan pemberangkatan umroh Anda.</li>
            <li>Mengurus visa, tiket pesawat, dan akomodasi hotel di Arab Saudi.</li>
            <li>Berkomunikasi dengan Anda terkait layanan, jadwal, dan informasi penting lainnya.</li>
            <li>Memberikan pelayanan kesehatan dan pendampingan yang sesuai selama ibadah.</li>
            <li>Memenuhi kewajiban hukum dan regulasi yang berlaku di Indonesia maupun Arab Saudi.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Pembagian Data</h2>
          <p>Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Kami hanya membagikan data Anda kepada pihak yang secara langsung berkaitan dengan penyelenggaraan ibadah umroh Anda, seperti:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Kedutaan Besar Arab Saudi (untuk pemrosesan visa).</li>
            <li>Maskapai penerbangan dan pihak hotel.</li>
            <li>Pemerintah Republik Indonesia (Kementerian Agama, Imigrasi, dll) untuk keperluan pelaporan resmi.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Hak Anda atas Data Pribadi</h2>
          <p>Sesuai dengan UU PDP, Anda memiliki hak-hak berikut terkait data pribadi Anda:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Hak Akses:</strong> Anda berhak meminta salinan data pribadi Anda yang kami simpan.</li>
            <li><strong>Hak Perbaikan:</strong> Anda berhak meminta kami untuk memperbaiki data yang tidak akurat atau tidak lengkap.</li>
            <li><strong>Hak Penghapusan (Right to Erasure):</strong> Anda berhak meminta kami menghapus data pribadi Anda jika data tersebut tidak lagi diperlukan untuk tujuan pengumpulan awal, atau jika Anda menarik persetujuan.</li>
            <li><strong>Hak Keberatan:</strong> Anda berhak menolak pemrosesan data untuk tujuan pemasaran langsung.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Keamanan Data</h2>
          <p>
            Kami menerapkan standar keamanan teknis dan organisasi yang ketat untuk melindungi data pribadi Anda dari akses, pengungkapan, perubahan, atau penghancuran yang tidak sah.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Hubungi Kami</h2>
          <p>
            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin melaksanakan hak Anda (termasuk permohonan penghapusan data), silakan hubungi kami melalui:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-4 border border-gray-200">
            <p className="mb-2"><strong>Email:</strong> {email}</p>
            <p><strong>WhatsApp:</strong> {whatsappNumber}</p>
          </div>
        </div>
      </div>

      <Footer settings={settings} />
      <FloatingWhatsApp 
        whatsappNumber={settings.floating_wa_number || whatsappNumber}
        greetingText={settings.floating_wa_text || "Assalamu'alaikum CS Umroh Sehat, saya ingin bertanya seputar kebijakan privasi & pendaftaran."}
        tooltipText={settings.floating_wa_tooltip || "Chat CS Kami"}
        position={(settings.floating_wa_position as any) || 'bottom-right'}
        enabled={settings.floating_wa_enabled !== 'false'}
      />
    </main>
  );
}
