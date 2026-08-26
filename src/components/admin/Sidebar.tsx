'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  MessageSquare, 
  Image as ImageIcon, 
  Mail, 
  Settings, 
  LogOut, 
  User, 
  Users,
  Menu, 
  X, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  unreadCount?: number;
  userName?: string;
}

export default function Sidebar({ unreadCount: initialUnread = 0, userName: initialName = 'Admin' }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initialUnread);
  const [userName, setUserName] = useState(initialName);
  const [userRole, setUserRole] = useState('SUPER_ADMIN');

  // If on login page, DO NOT render sidebar
  if (pathname === '/admin/login') {
    return null;
  }

  useEffect(() => {
    // Fetch live session and unread count
    fetch('/api/auth/session')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.name) setUserName(data.name);
        if (data?.role) setUserRole(data.role);
      })
      .catch(() => {});

    fetch('/api/admin/enquiries')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const unread = data.filter((e: any) => e.status === 'NEW').length;
          setUnreadCount(unread);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Paket Umroh', path: '/admin/paket', icon: Package },
    { name: 'Artikel', path: '/admin/artikel', icon: FileText },
    { name: 'Testimoni', path: '/admin/testimoni', icon: MessageSquare },
    { name: 'Galeri Foto', path: '/admin/galeri', icon: ImageIcon },
    { name: 'Pesan Masuk', path: '/admin/pesan', icon: Mail, badge: unreadCount },
    { name: 'Kelola Admin', path: '/admin/pengguna', icon: Users },
    { name: 'Pengaturan', path: '/admin/pengaturan', icon: Settings },
    { name: 'Profil Saya', path: '/admin/profil', icon: User },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch {
      window.location.href = '/admin/login';
    }
  };

  const getRoleBadgeLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'ADMIN': return 'Administrator';
      case 'EDITOR': return 'Editor Konten';
      case 'CS': return 'Customer Service';
      default: return 'Admin';
    }
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-xs w-full">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 focus:outline-none"
            aria-label="Buka Menu"
          >
            {isOpen ? <X className="w-6 h-6 text-primary-700" /> : <Menu className="w-6 h-6 text-primary-700" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🕌</span>
            <span className="font-serif font-bold text-gray-900 text-lg">Umroh Sehat</span>
          </div>
        </div>
        <Link 
          href="/" 
          target="_blank" 
          className="text-xs text-[#0B6E4F] font-semibold flex items-center gap-1 bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
        >
          <span>Web</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out shadow-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen md:sticky md:top-0
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0B6E4F]/10 border border-[#0B6E4F]/20 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
              🕌
            </div>
            <div>
              <h2 className="font-serif font-bold text-gray-900 text-lg leading-tight">Umroh Sehat</h2>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide">CMS MANAGEMENT</p>
            </div>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
            Menu Utama
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/admin' 
              ? pathname === '/admin' 
              : pathname === item.path || pathname.startsWith(item.path + '/');
            
            return (
              <Link 
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#0B6E4F] text-white shadow-sm shadow-[#0B6E4F]/30 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-[#C9A227] text-white' : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
                </div>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
              Pratinjau
            </div>
            <Link 
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-[#0B6E4F] transition-all group"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#0B6E4F]" />
                <span>Buka Website</span>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-[#0B6E4F]">↗</span>
            </Link>
          </div>
        </nav>

        {/* User Profile & Logout Bottom Bar */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/70">
          <div className="flex items-center justify-between gap-3">
            <Link 
              href="/admin/profil" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-[#0B6E4F] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 truncate">{userName}</p>
                <p className="text-[10px] text-[#0B6E4F] font-semibold truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {getRoleBadgeLabel(userRole)}
                </p>
              </div>
            </Link>

            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
