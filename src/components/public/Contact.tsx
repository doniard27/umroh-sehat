'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';

interface ContactProps {
  address: string;
  phone: string;
  email: string;
  hours: string;
  whatsappNumber: string;
}

export default function Contact({ address, phone, email, hours, whatsappNumber }: ContactProps) {
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    email: '',
    pesan: '',
    _honeypot: '',
    consent: false
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    
    // Antispam basic check
    if (formData._honeypot) {
      setStatus('idle');
      return;
    }
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nama,
          nama: formData.nama,
          whatsapp: formData.whatsapp,
          email: formData.email,
          message: formData.pesan,
          pesan: formData.pesan,
          consent: formData.consent,
          _honeypot: formData._honeypot
        })
      });
      
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Pesan Anda berhasil dikirim! Tim kami akan segera menghubungi Anda.');
        setFormData({ nama: '', whatsapp: '', email: '', pesan: '', _honeypot: '', consent: false });
      } else {
        setStatus('error');
        setMessage(data.error || 'Terjadi kesalahan saat mengirim pesan. Silakan periksa kembali isian Anda.');
      }
    } catch {
      setStatus('error');
      setMessage('Terjadi gangguan jaringan saat mengirim pesan. Silakan coba beberapa saat lagi.');
    }
  };

  return (
    <section id="kontak" className="py-20 bg-[#FAF7F0] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#C9A227] font-semibold text-xs uppercase tracking-widest bg-[#C9A227]/10 px-3.5 py-1.5 rounded-full border border-[#C9A227]/20">
            Layanan Konsultasi
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">
            Hubungi Kami
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Punya pertanyaan seputar paket umroh, jadwal keberangkatan, atau fasilitas? Kirimkan pesan atau konsultasikan langsung dengan tim kami.
          </p>
          <div className="w-20 h-1 bg-[#0B6E4F] mx-auto rounded-full mt-4"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto items-stretch">
          {/* Form Card */}
          <div className="w-full lg:w-3/5 bg-white p-8 md:p-10 rounded-3xl shadow-xs border border-gray-100/90 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Kirim Pesan &amp; Konsultasi</h3>
              <p className="text-xs text-gray-500 mb-6">Isi formulir di bawah ini, tim customer service kami akan merespons dalam 1x24 jam.</p>
              
              {status === 'success' && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Alhamdulillah, Pesan Terkirim!</p>
                    <p className="text-xs text-emerald-700 mt-0.5">{message}</p>
                  </div>
                </div>
              )}
              
              {status === 'error' && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Gagal Mengirim Pesan</p>
                    <p className="text-xs text-red-700 mt-0.5">{message}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <input 
                  type="text" 
                  name="_honeypot" 
                  className="hidden" 
                  value={formData._honeypot} 
                  onChange={handleChange} 
                  tabIndex={-1} 
                  autoComplete="off" 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nama" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      id="nama" 
                      name="nama" 
                      value={formData.nama} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0B6E4F] focus:border-transparent transition-all outline-none text-sm" 
                      placeholder="Contoh: Ahmad Fauzi" 
                    />
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      No. WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input 
                      required 
                      type="tel" 
                      id="whatsapp" 
                      name="whatsapp" 
                      value={formData.whatsapp} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0B6E4F] focus:border-transparent transition-all outline-none text-sm font-mono" 
                      placeholder="08xxxxxxxxxx" 
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Alamat Email <span className="text-gray-400 font-normal lowercase">(opsional)</span>
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0B6E4F] focus:border-transparent transition-all outline-none text-sm" 
                    placeholder="nama@email.com" 
                  />
                </div>
                
                <div>
                  <label htmlFor="pesan" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Pesan / Pertanyaan <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    required 
                    id="pesan" 
                    name="pesan" 
                    rows={4} 
                    value={formData.pesan} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0B6E4F] focus:border-transparent transition-all outline-none resize-none text-sm" 
                    placeholder="Tuliskan paket umroh yang diminati atau pertanyaan Anda..."
                  ></textarea>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input 
                    required 
                    type="checkbox" 
                    id="consent" 
                    name="consent" 
                    checked={formData.consent} 
                    onChange={handleChange} 
                    className="mt-1 w-4 h-4 text-[#0B6E4F] rounded focus:ring-[#0B6E4F] cursor-pointer" 
                  />
                  <label htmlFor="consent" className="text-xs text-gray-600 leading-relaxed cursor-pointer select-none">
                    Saya menyetujui data saya diproses untuk keperluan komunikasi &amp; penawaran sesuai <Link href="/kebijakan-privasi" className="text-[#0B6E4F] font-semibold hover:underline">kebijakan privasi</Link>.
                  </label>
                </div>
                
                <button 
                  disabled={status === 'loading'} 
                  type="submit" 
                  className="w-full bg-[#0B6E4F] hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 text-base"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Mengirim Pesan...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Kirim Pesan Sekarang
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="w-full lg:w-2/5 bg-white p-8 md:p-10 rounded-3xl shadow-xs border border-gray-100/90 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Informasi Kantor</h3>
                <p className="text-xs text-gray-500">Kunjungi kantor operasional kami atau hubungi nomor layanan resmi.</p>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-emerald-50 text-[#0B6E4F] rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">Alamat Kantor</h4>
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-emerald-50 text-[#0B6E4F] rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">Telepon / WhatsApp</h4>
                    <p className="text-xs text-gray-600 font-mono">{phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-emerald-50 text-[#0B6E4F] rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">Email</h4>
                    <p className="text-xs text-gray-600">{email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-emerald-50 text-[#0B6E4F] rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">Jam Operasional</h4>
                    <p className="text-xs text-gray-600 whitespace-pre-line">{hours}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Assalamu'alaikum CS Umroh Sehat, saya ingin bertanya seputar paket umroh.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#C9A227] hover:bg-[#b08d20] text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md text-sm"
              >
                <MessageCircle className="w-5 h-5" /> Chat WhatsApp Langsung
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
