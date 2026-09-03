import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import { Package, FileText, MessageSquare, ImageIcon, Mail, Eye } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    totalPackages,
    totalArticles,
    totalTestimonials,
    totalGallery,
    newEnquiries,
  ] = await Promise.all([
    prisma.package.count(),
    prisma.article.count(),
    prisma.testimonial.count(),
    prisma.galleryImage.count(),
    prisma.enquiry.count({ where: { status: 'NEW' } }),
  ]);

  const recentEnquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const stats = [
    { label: 'Total Paket', value: totalPackages, icon: Package, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Total Artikel', value: totalArticles, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Testimoni', value: totalTestimonials, icon: MessageSquare, color: 'text-gold-600', bg: 'bg-gold-50' },
    { label: 'Foto Galeri', value: totalGallery, icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pesan Baru', value: newEnquiries, icon: Mail, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Status Server', value: 'Online', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="p-6 space-y-6">
        
        {/* Quick Links */}
        <div className="flex gap-4">
          <Link href="/admin/paket/tambah" className="admin-btn-primary">
            + Tambah Paket
          </Link>
          <Link href="/admin/artikel/tambah" className="admin-btn-secondary">
            + Tulis Artikel
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="admin-card flex items-center">
              <div className={`p-4 rounded-xl ${stat.bg} mr-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Enquiries Table */}
        <div className="admin-card overflow-hidden !p-0">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800">Pesan Masuk Terbaru</h2>
            <Link href="/admin/pesan" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Lihat Semua →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">No. WhatsApp</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Belum ada pesan masuk
                    </td>
                  </tr>
                ) : (
                  recentEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <Link href={`/admin/pesan/${enquiry.id}`} className="hover:text-primary-600">
                          {enquiry.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{enquiry.whatsapp}</td>
                      <td className="px-6 py-4">
                        {new Date(enquiry.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          enquiry.status === 'NEW' ? 'badge-blue' : 'badge-green'
                        }`}>
                          {enquiry.status === 'NEW' ? 'Baru' : 'Dibaca'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
