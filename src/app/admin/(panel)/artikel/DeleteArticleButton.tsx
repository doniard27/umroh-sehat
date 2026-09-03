'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function DeleteArticleButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const resToken = await fetch('/api/csrf');
      const dataToken = await resToken.json();
      const token = dataToken.token || dataToken.csrfToken;
      
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'x-csrf-token': token
        }
      });

      if (!res.ok) throw new Error('Gagal menghapus artikel');
      
      router.refresh();
      setIsOpen(false);
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus artikel');
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        title="Hapus Artikel"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <DeleteConfirmModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Artikel"
        message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
      />
    </>
  );
}
