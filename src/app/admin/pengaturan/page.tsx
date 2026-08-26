"use client";

import { useState, useEffect } from "react";
import { Save, Download, Loader2, Plus, Trash2, RotateCcw, MessageCircle, Sparkles } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface FacilityItem {
  icon: string;
  title: string;
  desc: string;
}

const defaultFacilityItems: FacilityItem[] = [
  { icon: "🎫", title: "Jadwal & Tiket Confirmed", desc: "Penerbangan langsung maskapai ternama" },
  { icon: "🛂", title: "Visa Umroh Resmi", desc: "Proses cepat & terjamin legalitasnya" },
  { icon: "🏨", title: "Hotel Dekat Masjid", desc: "Jarak dekat Masjidil Haram & Nabawi" },
  { icon: "🎓", title: "Muthawwif Berpengalaman", desc: "Bimbingan ibadah intensif sesuai sunnah" },
  { icon: "🍽️", title: "Konsumsi Menu Indonesia", desc: "Makanan higienis & bergizi 3x sehari" },
  { icon: "🎒", title: "Perlengkapan Lengkap", desc: "Koper, ihram/mukena, tas & seragam" },
  { icon: "🚌", title: "Transportasi Bus AC", desc: "Bus eksekutif modern & nyaman" },
  { icon: "🏙️", title: "City Tour & Ziarah", desc: "Ziarah bersejarah di Makkah & Madinah" },
];

const emojiOptions = ["🎫", "🛂", "🏨", "🎓", "🍽️", "🎒", "🚌", "🏙️", "🕌", "✈️", "🩺", "📱", "🕋", "⭐", "👥", "📜", "💼", "💎"];

interface SettingsForm {
  brand_name: string;
  logo_url: string;
  whatsapp_number: string;
  whatsapp_cs: string;
  email: string;
  phone: string;
  address: string;
  operating_hours: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  telegram_url: string;
  hero_title: string;
  hero_subtitle: string;
  hero_bg_image: string;
  google_rating: string;
  jamaah_count: string;
  license_badge: string;
  facilities_title: string;
  facilities_subtitle: string;
  facilities_list: string;
  floating_wa_number: string;
  floating_wa_text: string;
  floating_wa_tooltip: string;
  floating_wa_position: string;
  floating_wa_enabled: string;
  visi: string;
  misi: string;
  [key: string]: string;
}

const defaultSettings: SettingsForm = {
  brand_name: "",
  logo_url: "",
  whatsapp_number: "",
  whatsapp_cs: "",
  email: "",
  phone: "",
  address: "",
  operating_hours: "",
  facebook_url: "",
  instagram_url: "",
  tiktok_url: "",
  youtube_url: "",
  telegram_url: "",
  hero_title: "",
  hero_subtitle: "",
  hero_bg_image: "/images/hero-makkah.jpg",
  google_rating: "",
  jamaah_count: "",
  license_badge: "",
  facilities_title: "Fasilitas Kami",
  facilities_subtitle: "Layanan dan fasilitas terbaik yang kami sediakan untuk memastikan kenyamanan ibadah Anda",
  facilities_list: JSON.stringify(defaultFacilityItems),
  floating_wa_number: "",
  floating_wa_text: "Assalamu'alaikum CS Umroh Sehat, saya ingin berkonsultasi mengenai paket umroh.",
  floating_wa_tooltip: "Chat CS Kami",
  floating_wa_position: "bottom-right",
  floating_wa_enabled: "true",
  visi: "",
  misi: "",
};

export default function PengaturanPage() {
  const [form, setForm] = useState<SettingsForm>(defaultSettings);
  const [facilities, setFacilities] = useState<FacilityItem[]>(defaultFacilityItems);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/csrf").then((r) => r.json()),
      fetch("/api/admin/settings").then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin/login";
          throw new Error("Unauthorized");
        }
        return r.json();
      }),
    ])
      .then(([csrfData, settings]) => {
        setCsrfToken(csrfData.token || csrfData.csrfToken || "");
        setForm({ ...defaultSettings, ...settings });

        // Parse facilities list if exists
        if (settings.facilities_list) {
          try {
            const parsed = JSON.parse(settings.facilities_list);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setFacilities(parsed);
            }
          } catch {
            setFacilities(defaultFacilityItems);
          }
        }
      })
      .catch(() => setError("Gagal memuat pengaturan"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFacilityChange = (index: number, field: keyof FacilityItem, value: string) => {
    const updated = [...facilities];
    updated[index] = { ...updated[index], [field]: value };
    setFacilities(updated);
  };

  const addFacility = () => {
    setFacilities((prev) => [
      ...prev,
      { icon: "✨", title: "Fasilitas Baru", desc: "Deskripsi fasilitas yang disediakan" }
    ]);
  };

  const removeFacility = (index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  const resetFacilities = () => {
    if (confirm("Kembalikan daftar fasilitas ke default bawaan?")) {
      setFacilities(defaultFacilityItems);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      facilities_list: JSON.stringify(facilities),
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan pengaturan");
        return;
      }

      setSuccess("Pengaturan berhasil disimpan!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      const res = await fetch("/api/admin/backup");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `umroh-sehat-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Gagal mengunduh backup");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="admin-card space-y-4 p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Website</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola identitas, hero banner, tombol floating WhatsApp, fasilitas, kontak, dan informasi situs</p>
        </div>
        <button onClick={handleBackup} className="admin-btn-secondary flex items-center gap-2">
          <Download size={16} />
          Backup Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-[#0B6E4F] p-4 rounded-xl text-sm font-semibold border border-green-200">{success}</div>
      )}

      <div className="space-y-6">
        {/* Identitas Situs */}
        <div className="admin-card">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-800">🏢 Identitas Situs</h2>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Nama Brand</label>
              <input
                type="text"
                className="admin-input"
                value={form.brand_name}
                onChange={(e) => handleChange("brand_name", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Logo Brand</label>
              <ImageUpload
                currentImage={form.logo_url}
                onUpload={(url) => handleChange("logo_url", url)}
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="admin-card">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-800">🖼️ Hero Section (Banner Utama)</h2>
          <div className="space-y-5">
            <div>
              <label className="admin-label">Gambar Background Hero Section</label>
              <p className="text-xs text-gray-500 mb-2">
                Unggah foto panorama Kaaba / Masjidil Haram atau gambar beresolusi tinggi (format JPG/PNG/WebP, disarankan 1920x1080px).
              </p>
              <ImageUpload
                currentImage={form.hero_bg_image || "/images/hero-makkah.jpg"}
                onUpload={(url) => handleChange("hero_bg_image", url)}
              />
            </div>

            <div>
              <label className="admin-label">Judul Utama (Headline)</label>
              <input
                type="text"
                className="admin-input"
                value={form.hero_title}
                onChange={(e) => handleChange("hero_title", e.target.value)}
                placeholder="Contoh: Umroh Sehat, Ibadah Khusyuk & Tenang"
              />
            </div>

            <div>
              <label className="admin-label">Sub-Judul Hero</label>
              <textarea
                rows={2}
                className="admin-input"
                value={form.hero_subtitle}
                onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                placeholder="Contoh: Biro perjalanan umroh resmi & terpercaya..."
              />
            </div>
          </div>
        </div>

        {/* Floating WhatsApp Settings */}
        <div className="admin-card">
          <div className="flex items-center justify-between pb-3 border-b mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">💬 Tombol WhatsApp Melayang (Floating Button)</h2>
                <p className="text-xs text-gray-500">Atur nomor CS khusus tombol melayang, pesan sapaan otomatis, posisi, dan teks tooltip</p>
              </div>
            </div>

            {/* Toggle Active */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                {form.floating_wa_enabled !== 'false' ? 'Aktif' : 'Nonaktif'}
              </label>
              <input
                type="checkbox"
                checked={form.floating_wa_enabled !== 'false'}
                onChange={(e) => handleChange("floating_wa_enabled", e.target.checked ? "true" : "false")}
                className="w-5 h-5 text-[#25D366] rounded focus:ring-[#25D366] cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Nomor WhatsApp CS (Tombol Melayang)</label>
                <input
                  type="text"
                  className="admin-input font-mono"
                  value={form.floating_wa_number}
                  onChange={(e) => handleChange("floating_wa_number", e.target.value)}
                  placeholder="Contoh: 6281234567890 (kosongkan jika sama dengan nomor utama)"
                />
                <p className="text-[11px] text-gray-400 mt-1">Gunakan format internasional diawali 62 atau 08</p>
              </div>

              <div>
                <label className="admin-label">Teks Label / Tooltip (Saat Hover)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.floating_wa_tooltip}
                  onChange={(e) => handleChange("floating_wa_tooltip", e.target.value)}
                  placeholder="Contoh: Chat CS Kami"
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Pesan Sapaan Otomatis (Prefilled Text)</label>
              <textarea
                rows={2}
                className="admin-input"
                value={form.floating_wa_text}
                onChange={(e) => handleChange("floating_wa_text", e.target.value)}
                placeholder="Contoh: Assalamu'alaikum CS Umroh Sehat, saya ingin bertanya seputar paket umroh."
              />
              <p className="text-[11px] text-gray-400 mt-1">Pesan ini akan otomatis terketik di aplikasi WhatsApp jamaah saat mengklik tombol</p>
            </div>

            <div>
              <label className="admin-label">Posisi Tombol di Layar</label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => handleChange("floating_wa_position", "bottom-right")}
                  className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    (form.floating_wa_position || 'bottom-right') === 'bottom-right'
                      ? 'border-[#25D366] bg-emerald-50 text-[#0B6E4F] ring-2 ring-[#25D366]/30'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>↘️ Kanan Bawah (Standar)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("floating_wa_position", "bottom-left")}
                  className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    form.floating_wa_position === 'bottom-left'
                      ? 'border-[#25D366] bg-emerald-50 text-[#0B6E4F] ring-2 ring-[#25D366]/30'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>↙️ Kiri Bawah</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fasilitas Kami */}
        <div className="admin-card">
          <div className="flex items-center justify-between pb-3 border-b mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span>✨</span> Section &ldquo;Fasilitas Kami&rdquo;
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Kelola judul, sub-judul, icon emoji, dan daftar kartu fasilitas yang tampil di website publik</p>
            </div>
            <button
              type="button"
              onClick={resetFacilities}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Default
            </button>
          </div>

          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Judul Section</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.facilities_title}
                  onChange={(e) => handleChange("facilities_title", e.target.value)}
                  placeholder="Fasilitas Kami"
                />
              </div>

              <div>
                <label className="admin-label">Sub-Judul / Deskripsi Singkat</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.facilities_subtitle}
                  onChange={(e) => handleChange("facilities_subtitle", e.target.value)}
                  placeholder="Layanan dan fasilitas terbaik yang kami sediakan..."
                />
              </div>
            </div>

            {/* List of Facility Cards */}
            <div className="space-y-3">
              <label className="admin-label flex items-center justify-between">
                <span>Daftar Fasilitas ({facilities.length} item)</span>
                <span className="text-xs font-normal text-gray-400">Pilih icon atau ketik emoji, isi judul &amp; deskripsi</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {facilities.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50/90 border border-gray-200 rounded-xl p-3.5 flex flex-col gap-2.5 relative group hover:border-[#0B6E4F]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={4}
                            value={item.icon}
                            onChange={(e) => handleFacilityChange(index, "icon", e.target.value)}
                            className="w-12 h-10 text-center text-xl bg-white border border-gray-200 rounded-lg shadow-xs focus:ring-2 focus:ring-[#0B6E4F] outline-none"
                            title="Klik atau ketik emoji"
                          />
                        </div>

                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleFacilityChange(index, "title", e.target.value)}
                          placeholder="Nama Fasilitas"
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-[#0B6E4F] outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFacility(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus fasilitas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) => handleFacilityChange(index, "desc", e.target.value)}
                      placeholder="Penjelasan detail singkat (contoh: Jarak dekat Masjidil Haram)"
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 focus:ring-2 focus:ring-[#0B6E4F] outline-none"
                    />

                    <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-xs text-gray-400">
                      <span className="text-[10px] shrink-0 mr-1 text-gray-400">Pilihan:</span>
                      {emojiOptions.slice(0, 8).map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => handleFacilityChange(index, "icon", em)}
                          className="hover:scale-125 transition-transform px-0.5"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addFacility}
                className="w-full py-3 bg-emerald-50/70 hover:bg-emerald-100/70 border-2 border-dashed border-[#0B6E4F]/30 hover:border-[#0B6E4F]/60 rounded-xl text-[#0B6E4F] font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-2"
              >
                <Plus className="w-4 h-4" />
                Tambah Fasilitas Baru
              </button>
            </div>
          </div>
        </div>

        {/* Kontak */}
        <div className="admin-card">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-800">📞 Informasi Kontak</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">No. WhatsApp Utama</label>
              <input
                type="text"
                className="admin-input"
                value={form.whatsapp_number}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                placeholder="6281234567890"
              />
            </div>
            <div>
              <label className="admin-label">WhatsApp CS Cadangan</label>
              <input
                type="text"
                className="admin-input"
                value={form.whatsapp_cs}
                onChange={(e) => handleChange("whatsapp_cs", e.target.value)}
                placeholder="6281234567891"
              />
            </div>
            <div>
              <label className="admin-label">Email Resmi</label>
              <input
                type="email"
                className="admin-input"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Nomor Telepon Kantor</label>
              <input
                type="text"
                className="admin-input"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Alamat Kantor</label>
              <textarea
                className="admin-input min-h-[80px]"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Jam Operasional</label>
              <input
                type="text"
                className="admin-input"
                value={form.operating_hours}
                onChange={(e) => handleChange("operating_hours", e.target.value)}
                placeholder="Senin - Jumat: 08.00 - 17.00 WIB"
              />
            </div>
          </div>
        </div>

        {/* Media Sosial */}
        <div className="admin-card">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-800">🌐 Tautan Media Sosial</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/..." },
              { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/..." },
              { key: "tiktok_url", label: "TikTok URL", placeholder: "https://tiktok.com/@..." },
              { key: "youtube_url", label: "YouTube URL", placeholder: "https://youtube.com/@..." },
              { key: "telegram_url", label: "Telegram URL", placeholder: "https://t.me/..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                <input
                  type="url"
                  className="admin-input"
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Statistik */}
        <div className="admin-card">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-800">📊 Statistik &amp; Trust Badge</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="admin-label">Rating Google</label>
              <input
                type="text"
                className="admin-input"
                value={form.google_rating}
                onChange={(e) => handleChange("google_rating", e.target.value)}
                placeholder="4.9"
              />
            </div>
            <div>
              <label className="admin-label">Jumlah Jamaah</label>
              <input
                type="text"
                className="admin-input"
                value={form.jamaah_count}
                onChange={(e) => handleChange("jamaah_count", e.target.value)}
                placeholder="5.000+"
              />
            </div>
            <div>
              <label className="admin-label">Teks Badge Izin Kemenag</label>
              <input
                type="text"
                className="admin-input"
                value={form.license_badge}
                onChange={(e) => handleChange("license_badge", e.target.value)}
                placeholder="PPIU RESMI • BERIZIN KEMENAG"
              />
            </div>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="admin-card">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-800">🎯 Visi &amp; Misi Perusahaan</h2>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Visi</label>
              <textarea
                className="admin-input min-h-[80px]"
                value={form.visi}
                onChange={(e) => handleChange("visi", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Misi</label>
              <textarea
                className="admin-input min-h-[80px]"
                value={form.misi}
                onChange={(e) => handleChange("misi", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-4 sticky bottom-4 z-20">
          <button
            onClick={handleSave}
            className="admin-btn-primary flex items-center gap-2 bg-[#0B6E4F] hover:bg-emerald-700 shadow-lg px-6 py-3 text-base"
            disabled={saving}
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </div>
    </div>
  );
}
