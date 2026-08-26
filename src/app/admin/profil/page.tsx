"use client";

import { useState, useEffect } from "react";
import { User, Lock, Save, Loader2 } from "lucide-react";

export default function ProfilAdminPage() {
  const [session, setSession] = useState({ email: "", name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/csrf").then((r) => r.json()),
      fetch("/api/auth/session").then((r) => r.json()),
    ])
      .then(([csrfData, sessionData]) => {
        setCsrfToken(csrfData.token);
        if (sessionData.isLoggedIn) {
          setSession({
            email: sessionData.email || "",
            name: sessionData.name || "",
          });
        }
      })
      .catch(() => setError("Gagal memuat data profil"))
      .finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    setErrors({});

    // Client-side validation
    if (passwordForm.newPassword.length < 8) {
      setErrors({ newPassword: "Password baru minimal 8 karakter" });
      setSaving(false);
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrors({ confirmPassword: "Konfirmasi password tidak cocok" });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const fieldErrors: Record<string, string> = {};
          for (const err of data.errors) {
            if (err.path?.[0]) {
              fieldErrors[err.path[0]] = err.message;
            }
          }
          setErrors(fieldErrors);
        } else {
          setError(data.error || "Gagal mengubah password");
        }
        return;
      }

      setSuccess("Password berhasil diubah!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Terjadi kesalahan saat mengubah password");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="admin-card p-6 space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profil Admin</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4">{success}</div>
      )}

      {/* Profile Info */}
      <div className="admin-card mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User size={20} className="text-primary-500" />
          Informasi Akun
        </h2>
        <div className="grid gap-4">
          <div>
            <label className="admin-label">Email</label>
            <div className="admin-input bg-gray-50 text-gray-600">{session.email}</div>
          </div>
          <div>
            <label className="admin-label">Nama</label>
            <div className="admin-input bg-gray-50 text-gray-600">{session.name}</div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="admin-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock size={20} className="text-primary-500" />
          Ubah Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="admin-label">Password Lama</label>
            <input
              type="password"
              className={`admin-input ${errors.currentPassword ? "border-red-500" : ""}`}
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              required
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="admin-label">Password Baru</label>
            <input
              type="password"
              className={`admin-input ${errors.newPassword ? "border-red-500" : ""}`}
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              required
              minLength={8}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Minimal 8 karakter, mengandung huruf kapital, huruf kecil, dan angka
            </p>
          </div>

          <div>
            <label className="admin-label">Konfirmasi Password Baru</label>
            <input
              type="password"
              className={`admin-input ${errors.confirmPassword ? "border-red-500" : ""}`}
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="pt-4 border-t">
            <button type="submit" className="admin-btn-primary" disabled={saving}>
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Menyimpan..." : "Ubah Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
