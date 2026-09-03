'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Clock, Loader2, Search, Trash2 } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

interface Enquiry {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function PesanMasukPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState('');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/enquiries');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setEnquiries(Array.isArray(data) ? data : []);
      }
    } catch {
      console.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/csrf')
      .then(r => r.json())
      .then(d => setCsrfToken(d.token || d.csrfToken || ''))
      .catch(() => {});
    fetchEnquiries();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${deleteId}`, {
        method: 'DELETE',
        headers: { 'x-csrf-token': csrfToken }
      });
      if (res.ok) {
        setEnquiries(prev => prev.filter(e => e.id !== deleteId));
        setDeleteId(null);
      }
    } catch {
      alert('Gagal menghapus pesan');
    }
  };

  const filtered = enquiries.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.whatsapp.includes(search) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.message.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = enquiries.filter((e) => e.status === 'NEW').length;

  return (
    <>
      <AdminHeader title="Pesan Masuk">
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs">
            {unreadCount} Pesan Baru
          </span>
        )}
      </AdminHeader>

      <div className="p-6 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari nama, no. WhatsApp, atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0B6E4F] focus:border-[#0B6E4F] outline-none"
            />
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Total: {enquiries.length} pesan
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Nama Pengirim</th>
                  <th className="px-6 py-4">WhatsApp &amp; Email</th>
                  <th className="px-6 py-4">Isi Pesan</th>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0B6E4F] mb-2" />
                      <span>Memuat pesan masuk...</span>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      <Mail size={36} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-base font-medium text-gray-600 mb-1">Belum ada pesan masuk</p>
                      <p className="text-xs">Pesan dari formulir kontak website akan muncul di sini.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        <Link
                          href={`/admin/pesan/${enquiry.id}`}
                          className="hover:text-[#0B6E4F] transition-colors"
                        >
                          {enquiry.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 text-xs text-gray-700 font-medium font-mono">
                            <MessageCircle size={13} className="text-green-600" />
                            {enquiry.whatsapp}
                          </span>
                          <span className="text-xs text-gray-400 truncate max-w-[180px]">
                            {enquiry.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                        {enquiry.message}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {new Date(enquiry.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          enquiry.status === 'NEW' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse' 
                            : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                          {enquiry.status === 'NEW' ? 'Baru' : 'Dibaca'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link
                            href={`/admin/pesan/${enquiry.id}`}
                            className="text-xs bg-gray-100 hover:bg-[#0B6E4F] hover:text-white text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                          >
                            Buka
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteId(enquiry.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Pesan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Pesan Masuk"
        message="Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan."
      />
    </>
  );
}
