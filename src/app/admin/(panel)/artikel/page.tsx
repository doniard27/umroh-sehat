'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { PenSquare, Plus, Trash2, Loader2, Search, CheckCircle, XCircle } from 'lucide-react';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  createdAt: string;
}

export default function KelolaArtikel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/articles');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } else {
        setError('Gagal memuat daftar artikel');
      }
    } catch {
      setError('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/csrf')
      .then(r => r.json())
      .then(d => setCsrfToken(d.token || d.csrfToken || ''))
      .catch(() => {});
    fetchArticles();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${deleteId}`, {
        method: 'DELETE',
        headers: { 'x-csrf-token': csrfToken }
      });
      if (res.ok) {
        setArticles(prev => prev.filter(a => a.id !== deleteId));
        setDeleteId(null);
      } else {
        alert('Gagal menghapus artikel');
      }
    } catch {
      alert('Terjadi kesalahan saat menghapus artikel');
    } finally {
      setDeleting(false);
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AdminHeader title="Kelola Artikel">
        <Link 
          href="/admin/artikel/tambah" 
          className="bg-[#0B6E4F] hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tulis Artikel
        </Link>
      </AdminHeader>

      <div className="p-6 space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari judul artikel atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0B6E4F] focus:border-[#0B6E4F] outline-none"
            />
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Total: {articles.length} artikel
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Judul Artikel</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Tanggal Buat</th>
                  <th className="px-6 py-4 text-center">Status Tayang</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0B6E4F] mb-2" />
                      <span>Memuat daftar artikel...</span>
                    </td>
                  </tr>
                ) : filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <p className="text-base font-medium text-gray-600 mb-1">Belum ada artikel</p>
                      <p className="text-xs">Klik tombol &ldquo;Tulis Artikel&rdquo; untuk membuat artikel baru.</p>
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        <Link href={`/admin/artikel/edit/${article.id}`} className="hover:text-[#0B6E4F] transition-colors">
                          {article.title}
                        </Link>
                        <div className="text-xs text-gray-400 font-normal mt-0.5 font-mono">
                          /artikel/{article.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(article.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.published 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}>
                          {article.published ? (
                            <>
                              <CheckCircle className="w-3 h-3" /> Tayang
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Draft
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link 
                            href={`/admin/artikel/edit/${article.id}`} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Edit Artikel"
                          >
                            <PenSquare className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteId(article.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Artikel"
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
        title="Hapus Artikel"
        message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
      />
    </>
  );
}
