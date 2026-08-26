'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function DeleteTestimonialButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const resToken = await fetch('/api/csrf');
      const dataToken = await resToken.json();
      const token = dataToken.token || dataToken.csrfToken;
      
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'x-csrf-token': token,
        },
      });

      if (!res.ok) throw new Error('Gagal menghapus testimoni');
      
      router.refresh();
      setIsOpen(false);
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus testimoni');
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        title="Hapus Testimoni"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <DeleteConfirmModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Testimoni"
        message="Apakah Anda yakin ingin menghapus testimoni ini? Tindakan ini tidak dapat dibatalkan."
      />
    </>
  );
}
