'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminHeader from '@/components/admin/AdminHeader';

export default function EditPaket({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departureDate: '',
    durationDays: '',
    price: '',
    status: 'AVAILABLE' as 'AVAILABLE' | 'FULL',
    seatsLeft: '0',
    badge: '',
    published: true,
    imageUrl: ''
  });

  useEffect(() => {
    fetch('/api/csrf')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token || data.csrfToken));

    fetch(`/api/admin/packages/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Data tidak ditemukan');
        return res.json();
      })
      .then(data => {
        setFormData({
          title: data.title,
          description: data.description || '',
          departureDate: data.departureDate ? new Date(data.departureDate).toISOString().split('T')[0] : '',
          durationDays: data.durationDays?.toString() || '',
          price: data.price?.toString() || '',
          status: data.status,
          seatsLeft: (data.seatsLeft ?? data.seatsRemaining ?? 0).toString(),
          badge: data.badge || '',
          published: data.published ?? true,
          imageUrl: data.imageUrl || data.image || ''
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setFetching(false));
  }, [params.id]);

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
      const res = await fetch(`/api/admin/packages/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({
          ...formData,
          durationDays: parseInt(formData.durationDays) || 0,
          price: parseInt(formData.price) || 0,
          seatsLeft: parseInt(formData.seatsLeft) || 0
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      router.push('/admin/paket');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-10 text-center">Memuat data...</div>;
  }

  return (
    <>
      <AdminHeader title="Edit Paket Umroh">
        <Link href="/admin/paket" className="admin-btn-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </AdminHeader>

      <div className="p-6">
        <div className="admin-card max-w-4xl">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="admin-label">Judul Paket</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>

              <div className="col-span-2">
                <label className="admin-label">Deskripsi</label>
                <textarea 
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="admin-input"
                ></textarea>
              </div>

              <div>
                <label className="admin-label">Tanggal Keberangkatan</label>
                <input 
                  type="date" 
                  name="departureDate"
                  required
                  value={formData.departureDate}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Durasi (Hari)</label>
                <input 
                  type="number" 
                  name="durationDays"
                  required
                  min="1"
                  value={formData.durationDays}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Harga (Rp)</label>
                <input 
                  type="number" 
                  name="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="admin-input"
                >
                  <option value="AVAILABLE">Tersedia (AVAILABLE)</option>
                  <option value="FULL">Penuh (FULL)</option>
                </select>
              </div>

              <div>
                <label className="admin-label">Sisa Kursi</label>
                <input 
                  type="number" 
                  name="seatsLeft"
                  required
                  min="0"
                  value={formData.seatsLeft}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Badge (Opsional)</label>
                <input 
                  type="text" 
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>

              <div className="col-span-2">
                <label className="admin-label">Gambar Paket</label>
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
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">Publikasikan Paket Ini</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={loading}
                className="admin-btn-primary flex items-center gap-2"
              >
                {loading ? 'Menyimpan...' : (
                  <>
                    <Save className="w-4 h-4" /> Simpan Perubahan
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
