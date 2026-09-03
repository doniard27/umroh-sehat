'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  Users, 
  Plus, 
  Search, 
  PenSquare, 
  Trash2, 
  Loader2, 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Check, 
  Lock, 
  Mail, 
  User as UserIcon,
  Crown,
  Edit3,
  MessageSquare
} from 'lucide-react';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const roleConfigs: Record<string, { label: string; bg: string; text: string; icon: any; desc: string }> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    bg: 'bg-purple-50 border-purple-200',
    text: 'text-purple-700',
    icon: Crown,
    desc: 'Akses penuh ke seluruh menu, pengaturan, manajemen pengguna & backup data.'
  },
  ADMIN: {
    label: 'Admin',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    icon: ShieldCheck,
    desc: 'Dapat mengelola paket umroh, artikel, galeri, testimoni, dan pesan masuk.'
  },
  EDITOR: {
    label: 'Editor Konten',
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    icon: Edit3,
    desc: 'Fokus membuat & mengedit artikel berita, panduan manasik, dan galeri foto.'
  },
  CS: {
    label: 'Customer Service',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    icon: MessageSquare,
    desc: 'Melihat pesan masuk dari jamaah dan menghubungi jamaah via WhatsApp.'
  },
};

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentSession, setCurrentSession] = useState<{ id?: string; userId?: string; role?: string }>({});
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch {
      console.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.ok ? r.json() : {})
      .then(d => setCurrentSession(d))
      .catch(() => {});

    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'ADMIN'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role || 'ADMIN'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      if (editingUser) {
        // Edit User
        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal memperbarui admin');
      } else {
        // Create User
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal menambahkan admin');
      }

      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/users/${deleteId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Gagal menghapus admin');
        return;
      }
      setUsers(prev => prev.filter(u => u.id !== deleteId));
      setDeleteId(null);
    } catch {
      alert('Terjadi kesalahan sistem saat menghapus admin');
    }
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const isSuperAdmin = currentSession.role === 'SUPER_ADMIN';

  return (
    <>
      <AdminHeader title="Kelola Admin &amp; Pengguna">
        {isSuperAdmin && (
          <button 
            onClick={openCreateModal}
            className="bg-[#0B6E4F] hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Admin Baru
          </button>
        )}
      </AdminHeader>

      <div className="p-6 space-y-5 max-w-6xl">
        {/* Info Card Role Permissions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Object.entries(roleConfigs).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={key} className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`p-1.5 rounded-lg ${cfg.bg} ${cfg.text}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm">{cfg.label}</h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{cfg.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-50 text-[11px] font-semibold text-gray-400">
                  {users.filter(u => u.role === key).length} Akun Terdaftar
                </div>
              </div>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari nama, email, atau role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0B6E4F] focus:border-[#0B6E4F] outline-none"
            />
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Total: {users.length} pengguna
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Nama Admin</th>
                  <th className="px-6 py-4">Email Login</th>
                  <th className="px-6 py-4">Hak Akses (Role)</th>
                  <th className="px-6 py-4">Tanggal Dibuat</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0B6E4F] mb-2" />
                      <span>Memuat daftar admin...</span>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-base font-medium text-gray-600 mb-1">Tidak ada admin ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const cfg = roleConfigs[user.role] || roleConfigs.ADMIN;
                    const RoleIcon = cfg.icon;
                    const isCurrent = (currentSession.userId === user.id || currentSession.id === user.id);

                    return (
                      <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#0B6E4F] text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span>{user.name}</span>
                                {isCurrent && (
                                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-normal">
                                    (Anda)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-700">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text}`}>
                            <RoleIcon className="w-3.5 h-3.5" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {isSuperAdmin && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openEditModal(user)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Admin"
                                >
                                  <PenSquare className="w-4 h-4" />
                                </button>
                                {!isCurrent && (
                                  <button
                                    type="button"
                                    onClick={() => setDeleteId(user.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus Admin"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 font-serif">
                {editingUser ? 'Edit Data Admin' : 'Tambah Admin / Pengguna Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div>
                <label className="admin-label">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Ustadz Rahmat Hidayat"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#0B6E4F] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Email Login</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@umrohsehat.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#0B6E4F] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">
                  {editingUser ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password Login'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required={!editingUser}
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? '•••••••• (Biarkan kosong jika tidak diubah)' : 'Minimal 6 karakter'}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#0B6E4F] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Hak Akses (Role)</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {Object.entries(roleConfigs).map(([key, cfg]) => {
                    const isSelected = formData.role === key;
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: key })}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected 
                            ? 'border-[#0B6E4F] bg-emerald-50/50 ring-2 ring-[#0B6E4F]/20' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold ${cfg.text}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {cfg.label}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#0B6E4F]" />}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-tight line-clamp-2">
                          {cfg.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="admin-btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="admin-btn-primary flex items-center gap-2 bg-[#0B6E4F] hover:bg-emerald-700"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    'Simpan Akun'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteUser}
        title="Hapus Akun Admin"
        message="Apakah Anda yakin ingin menghapus akun admin ini? Pengguna ini tidak akan dapat login lagi ke panel admin."
      />
    </>
  );
}
