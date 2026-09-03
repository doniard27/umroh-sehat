"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteEnquiryButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.token))
      .catch(() => {});
  }, []);

  const handleDelete = async () => {
    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
        headers: { "x-csrf-token": csrfToken },
      });
      router.push("/admin/pesan");
    } catch {
      alert("Gagal menghapus pesan");
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">Yakin hapus?</span>
        <button onClick={handleDelete} className="admin-btn-danger text-sm">
          Ya, Hapus
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="admin-btn-secondary text-sm"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="admin-btn-danger text-sm"
    >
      <Trash2 size={16} />
      Hapus Pesan
    </button>
  );
}
