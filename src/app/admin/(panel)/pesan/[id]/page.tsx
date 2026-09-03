import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, MessageCircle, Trash2, Mail, Phone, Calendar } from "lucide-react";
import DeleteEnquiryButton from "./DeleteButton";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function PesanDetailPage({ params }: Props) {
  const enquiry = await prisma.enquiry.findUnique({
    where: { id: params.id },
  });

  if (!enquiry) {
    notFound();
  }

  // Auto-mark as read
  if (enquiry.status === "NEW") {
    await prisma.enquiry.update({
      where: { id: params.id },
      data: { status: "READ" },
    });
  }

  const waLink = `https://wa.me/${enquiry.whatsapp.replace(/^0/, "62")}?text=${encodeURIComponent(
    `Assalamu'alaikum ${enquiry.name}, terima kasih telah menghubungi Umroh Sehat. `
  )}`;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/pesan" className="admin-btn-secondary">
          <ArrowLeft size={16} />
          Kembali
        </Link>
        <h1 className="text-2xl font-bold">Detail Pesan</h1>
      </div>

      <div className="admin-card">
        <div className="grid gap-6">
          {/* Sender Info */}
          <div className="grid md:grid-cols-2 gap-4 pb-6 border-b">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Nama</label>
              <p className="font-medium text-lg mt-1">{enquiry.name}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Tanggal</label>
              <p className="flex items-center gap-2 mt-1">
                <Calendar size={16} className="text-gray-400" />
                {new Date(enquiry.createdAt).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid md:grid-cols-2 gap-4 pb-6 border-b">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">No. WhatsApp</label>
              <p className="flex items-center gap-2 mt-1">
                <Phone size={16} className="text-green-500" />
                {enquiry.whatsapp}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Email</label>
              <p className="flex items-center gap-2 mt-1">
                <Mail size={16} className="text-blue-500" />
                {enquiry.email}
              </p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide">Pesan</label>
            <div className="mt-2 bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap leading-relaxed">
              {enquiry.message}
            </div>
          </div>

          {/* Consent */}
          <div className="text-sm text-gray-500">
            Persetujuan privasi: {enquiry.consent ? "✅ Menyetujui" : "❌ Belum menyetujui"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-sm"
          >
            <MessageCircle size={16} />
            Balas via WhatsApp
          </a>
          <a
            href={`mailto:${enquiry.email}?subject=Re: Pesan dari ${enquiry.name} - Umroh Sehat`}
            className="admin-btn-secondary text-sm"
          >
            <Mail size={16} />
            Balas via Email
          </a>
          <DeleteEnquiryButton id={enquiry.id} />
        </div>
      </div>
    </div>
  );
}
