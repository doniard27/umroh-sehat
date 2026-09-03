"use client";

import { useState, useEffect, useCallback } from "react";
import { ImagePlus, Trash2, Star, Upload, X } from "lucide-react";

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
  isCover: boolean;
  createdAt: string;
}

export default function GaleriAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setImages(data);
      }
    } catch {
      setError("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.token))
      .catch(() => {});
    fetchImages();
  }, [fetchImages]);

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true);
    setError("");
    setSuccess("");
    let uploadedCount = 0;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} melebihi batas 5MB`);
        continue;
      }

      try {
        // Upload file
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (!uploadData.success) {
          setError(uploadData.error || `Gagal mengunggah ${file.name}`);
          continue;
        }

        // Save gallery record
        const saveRes = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
          },
          body: JSON.stringify({
            imageUrl: uploadData.url,
            caption: file.name.replace(/\.[^/.]+$/, ""),
          }),
        });

        if (saveRes.ok) {
          uploadedCount++;
        }
      } catch {
        setError(`Gagal mengunggah ${file.name}`);
      }
    }

    if (uploadedCount > 0) {
      setSuccess(`${uploadedCount} foto berhasil diunggah`);
      fetchImages();
    }
    setUploading(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleSetCover = async (id: string) => {
    try {
      await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ isCover: true }),
      });
      fetchImages();
      setSuccess("Cover foto berhasil diubah");
    } catch {
      setError("Gagal mengubah cover foto");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        headers: { "x-csrf-token": csrfToken },
      });
      setImages(images.filter((img) => img.id !== id));
      setDeleteId(null);
      setSuccess("Foto berhasil dihapus");
    } catch {
      setError("Gagal menghapus foto");
    }
  };

  const clearMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  useEffect(() => {
    if (error || success) clearMessages();
  }, [error, success]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Galeri</h1>
        <span className="text-sm text-gray-500">{images.length} foto</span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4">{success}</div>
      )}

      {/* Upload Zone */}
      <div
        className={`admin-card mb-6 border-2 border-dashed transition-colors ${
          dragOver ? "border-primary-500 bg-primary-50" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-10">
          {uploading ? (
            <>
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600">Mengunggah foto...</p>
            </>
          ) : (
            <>
              <Upload size={40} className="text-gray-400 mb-3" />
              <p className="text-gray-600 mb-2">
                Seret & lepas foto di sini, atau
              </p>
              <label className="admin-btn-primary cursor-pointer">
                <ImagePlus size={16} />
                Pilih Foto
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 mt-2">
                Format: JPG, PNG, WebP, GIF. Maksimal 5MB per file.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="admin-card text-center py-16">
          <ImagePlus size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada foto di galeri</p>
          <p className="text-sm text-gray-400">
            Unggah foto untuk menampilkannya di website
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-square bg-gray-100">
                <img
                  src={image.imageUrl}
                  alt={image.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Cover badge */}
              {image.isCover && (
                <div className="absolute top-2 left-2 bg-gold-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} className="fill-white" />
                  Cover
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isCover && (
                  <button
                    onClick={() => handleSetCover(image.id)}
                    className="bg-gold-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gold-600 flex items-center gap-1"
                  >
                    <Star size={12} />
                    Set Cover
                  </button>
                )}
                <button
                  onClick={() => setDeleteId(image.id)}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Hapus
                </button>
              </div>

              {/* Caption */}
              <div className="p-2">
                <p className="text-xs text-gray-500 truncate">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Hapus Foto</h3>
              <button onClick={() => setDeleteId(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus foto ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="admin-btn-secondary">
                Batal
              </button>
              <button onClick={() => handleDelete(deleteId)} className="admin-btn-danger">
                <Trash2 size={16} />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
