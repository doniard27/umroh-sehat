'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import FacilitiesEditor, { FacilityItem } from '@/components/admin/FacilitiesEditor';
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
    details: '',
    category: 'REGULER' as 'HEMAT' | 'REGULER' | 'PREMIUM',
    departureDate: '',
    durationDays: '',
    price: '',
    status: 'AVAILABLE' as 'AVAILABLE' | 'FULL',
    seatsLeft: '0',
    badge: '',
    published: true,
    imageUrl: ''
  });
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);

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
          details: data.details || '',
          category: (data.category || 'REGULER') as 'HEMAT' | 'REGULER' | 'PREMIUM',
          departureDate: data.departureDate ? new Date(data.departureDate).toISOString().split('T')[0] : '',
          durationDays: data.durationDays?.toString() || '',
          price: data.price?.toString() || '',
          status: data.status,
          seatsLeft: (data.seatsLeft ?? data.seatsRemaining ?? 0).toString(),
          badge: data.badge || '',
          published: data.published ?? true,
          imageUrl: data.imageUrl || data.image || ''
        });
        try {
          const parsed = JSON.parse(data.facilities || '[]');
          if (Array.isArray(parsed)) setFacilities(parsed);
        } catch { setFacilities([]); }
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
          seatsLeft: parseInt(formData.seatsLeft) || 0,
          facilities: JSON.stringify(facilities)
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

              <div className="col-span-2 md:col-span-1">
                <label className="admin-label">Kategori Paket</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['HEMAT', 'REGULER', 'PREMIUM'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleChange({ target: { name: 'category', value: cat } } as any)}
                      className={`p-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        formData.category === cat
                          ? cat === 'HEMAT'
                            ? 'border-[#C9A227] bg-amber-50 text-amber-700 ring-2 ring-[#C9A227]/30'
                            : cat === 'REGULER'
                              ? 'border-[#0B6E4F] bg-green-50 text-[#0B6E4F] ring-2 ring-[#0B6E4F]/30'
                              : 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-500/30'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat === 'HEMAT' ? '💸 Hemat' : cat === 'REGULER' ? '🕋 Reguler' : '👑 Premium'}
                    </button>
                  ))}
                </div>
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
                  placeholder="Penjelasan singkat paket (tampil di kartu & halaman detail)..."
                ></textarea>
              </div>

              <div className="col-span-2">
                <label className="admin-label">Penjelasan Lengkap / Itinerary (tampil di halaman detail)</label>
                <textarea 
                  name="details"
                  rows={10}
                  value={formData.details}
                  onChange={handleChange}
                  className="admin-input font-mono text-sm"
                  placeholder={"Contoh:\nHari 1: Jakarta - Jeddah, terbang dengan maskapai...\nHari 2: Tiba di Madinah, ziarah...\n\nAtau tulis fasilitas lengkap, hotel, dan keunggulan paket ini."}
                ></textarea>
              </div>

              <div className="col-span-2">
                <label className="admin-label">Fasilitas Khusus Paket Ini</label>
                <FacilitiesEditor value={facilities} onChange={setFacilities} />
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
