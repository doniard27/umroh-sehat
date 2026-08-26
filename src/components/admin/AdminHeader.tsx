import { ReactNode } from 'react';

interface AdminHeaderProps {
  title: string;
  children?: ReactNode;
}

export default function AdminHeader({ title, children }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800 md:pl-0 pl-12">{title}</h1>
        <div className="flex items-center space-x-4">
          {children}
        </div>
      </div>
    </header>
  );
}
