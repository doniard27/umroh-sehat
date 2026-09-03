'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminHeader from '@/components/admin/AdminHeader';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-xl p-8 min-h-[300px] bg-gray-50 flex items-center justify-center text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2 text-[#0B6E4F]" />
      <span>Memuat Editor Konten...</span>
    </div>
  )
});

export default function TambahArtikel() {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Berita',
    excerpt: '',
    content: '',
    published: true,
    imageUrl: ''
  });

  useEffect(() => {
    fetch('/api/csrf')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token || data.csrfToken || ''))
      .catch(() => {});
  }, []);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      router.push('/admin/artikel');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Tulis Artikel">
        <Link href="/admin/artikel" className="admin-btn-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </AdminHeader>

      <div className="p-6">
        <div className="admin-card max-w-5xl">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="admin-label">Judul Artikel</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="admin-input"
                  placeholder="Masukkan judul artikel..."
                />
              </div>

              <div>
                <label className="admin-label">Slug (URL)</label>
                <input 
                  type="text" 
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="admin-input font-mono text-xs"
                  placeholder="slug-artikel"
                />
              </div>

              <div>
                <label className="admin-label">Kategori</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="admin-input"
                >
                  <option value="Aqidah">Aqidah</option>
                  <option value="Fikih">Fikih</option>
                  <option value="Haji & Umroh">Haji &amp; Umroh</option>
                  <option value="Sirah">Sirah</option>
                  <option value="Tazkiyatun Nafs">Tazkiyatun Nafs</option>
                  <option value="Berita">Berita</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="admin-label">Ringkasan Singkat</label>
                <textarea 
                  name="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="admin-input"
                  placeholder="Ringkasan singkat artikel untuk preview..."
                  required
                ></textarea>
              </div>

              <div className="col-span-2">
                <label className="admin-label">Isi Konten Artikel</label>
                <RichTextEditor 
                  content={formData.content} 
                  onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} 
                />
              </div>

              <div className="col-span-2">
                <label className="admin-label">Gambar Thumbnail</label>
                <ImageUpload 
                  currentImage={formData.imageUrl} 
                  onUpload={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))} 
                />
              </div>
              
              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#0B6E4F] rounded focus:ring-[#0B6E4F]"
                  />
                  <span className="text-gray-700 font-medium text-sm">Terbitkan Sekarang (Published)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Link href="/admin/artikel" className="admin-btn-secondary">
                Batal
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className="admin-btn-primary flex items-center gap-2 bg-[#0B6E4F] hover:bg-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Simpan Artikel
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
