"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Star } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function TambahTestimoniPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  const [form, setForm] = useState({
    name: "",
    city: "",
    rating: 5,
    text: "",
    avatarUrl: "",
    published: true,
  });

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.token))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan");
        return;
      }

      router.push("/admin/testimoni");
    } catch {
      setError("Terjadi kesalahan saat menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/testimoni" className="admin-btn-secondary">
          <ArrowLeft size={16} />
          Kembali
        </Link>
        <h1 className="text-2xl font-bold">Tambah Testimoni</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="admin-card space-y-6">
        <div>
          <label className="admin-label">Nama</label>
          <input
            type="text"
            className="admin-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama jamaah"
            required
          />
        </div>

        <div>
          <label className="admin-label">Kota</label>
          <input
            type="text"
            className="admin-input"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="Kota asal"
            required
          />
        </div>

        <div>
          <label className="admin-label">Rating</label>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                className="focus:outline-none"
              >
                <Star
                  size={28}
                  className={
                    star <= form.rating
                      ? "fill-gold-500 text-gold-500"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500 self-center">
              {form.rating}/5
            </span>
          </div>
        </div>

        <div>
          <label className="admin-label">Teks Testimoni</label>
          <textarea
            className="admin-input min-h-[120px]"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Tulis testimoni jamaah..."
            required
          />
        </div>

        <div>
          <label className="admin-label">Foto / Avatar</label>
          <ImageUpload
            currentImage={form.avatarUrl}
            onUpload={(url) => setForm({ ...form, avatarUrl: url })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-4 h-4 text-primary-500 rounded"
          />
          <label htmlFor="published" className="text-sm text-gray-700">
            Tampilkan di website (Published)
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            <Save size={16} />
            {loading ? "Menyimpan..." : "Simpan Testimoni"}
          </button>
          <Link href="/admin/testimoni" className="admin-btn-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
