import Sidebar from '@/components/admin/Sidebar';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/80 font-sans text-gray-900 antialiased">
      <Sidebar />
      <main className="w-full md:pl-64 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
