import { z } from "zod";

// ============================================
// Helpers
// ============================================

/** Generate a URL-safe slug from a string */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
}

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password lama wajib diisi"),
  newPassword: z
    .string()
    .min(8, "Password baru minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf kapital")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung angka"),
  confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

// ============================================
// Package Schemas
// ============================================

export const packageSchema = z.object({
  title: z
    .string()
    .min(1, "Judul paket wajib diisi")
    .max(200, "Judul maksimal 200 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi paket wajib diisi")
    .max(5000, "Deskripsi maksimal 5000 karakter"),
  details: z
    .string()
    .max(20000, "Detail maksimal 20000 karakter")
    .optional()
    .default(""),
  category: z
    .string()
    .refine((v) => ["HEMAT", "REGULER", "PREMIUM"].includes(v), "Kategori paket tidak valid")
    .optional()
    .default("REGULER"),
  facilities: z
    .string()
    .max(20000, "Fasilitas maksimal 20000 karakter")
    .optional()
    .default(""),
  departureDate: z.string().min(1, "Tanggal keberangkatan wajib diisi"),
  durationDays: z
    .number({ invalid_type_error: "Durasi harus berupa angka" })
    .int("Durasi harus berupa bilangan bulat")
    .min(1, "Durasi minimal 1 hari")
    .max(60, "Durasi maksimal 60 hari"),
  price: z
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .int("Harga harus berupa bilangan bulat")
    .min(0, "Harga tidak boleh negatif"),
  status: z.enum(["AVAILABLE", "FULL"], {
    errorMap: () => ({ message: "Status harus AVAILABLE atau FULL" }),
  }),
  seatsLeft: z
    .number({ invalid_type_error: "Sisa kursi harus berupa angka" })
    .int("Sisa kursi harus berupa bilangan bulat")
    .min(0, "Sisa kursi tidak boleh negatif"),
  badge: z.string().max(50, "Badge maksimal 50 karakter").default(""),
  imageUrl: z.string().default(""),
  published: z.boolean().default(true),
});

// ============================================
// Article Schemas
// ============================================

export const articleCategories = [
  "Aqidah",
  "Fikih",
  "Haji & Umroh",
  "Sirah",
  "Tazkiyatun Nafs",
  "Berita",
] as const;

export const articleSchema = z.object({
  title: z
    .string()
    .min(1, "Judul artikel wajib diisi")
    .max(200, "Judul maksimal 200 karakter"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(200, "Slug maksimal 200 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan strip"),
  category: z.enum(articleCategories, {
    errorMap: () => ({ message: "Kategori tidak valid" }),
  }),
  excerpt: z
    .string()
    .min(1, "Ringkasan wajib diisi")
    .max(500, "Ringkasan maksimal 500 karakter"),
  content: z
    .string()
    .min(1, "Konten artikel wajib diisi"),
  imageUrl: z.string().default(""),
  published: z.boolean().default(true),
});

// ============================================
// Testimonial Schemas
// ============================================

export const testimonialSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  city: z
    .string()
    .min(1, "Kota wajib diisi")
    .max(100, "Kota maksimal 100 karakter"),
  rating: z
    .number()
    .int()
    .min(1, "Rating minimal 1")
    .max(5, "Rating maksimal 5"),
  text: z
    .string()
    .min(1, "Teks testimoni wajib diisi")
    .max(2000, "Teks maksimal 2000 karakter"),
  avatarUrl: z.string().default(""),
  published: z.boolean().default(true),
});

// ============================================
// Enquiry Schemas
// ============================================

export const enquirySchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter")
    .transform((v) => v.trim()),
  whatsapp: z
    .string()
    .min(6, "No. WhatsApp wajib diisi")
    .max(30, "No. WhatsApp terlalu panjang")
    .transform((v) => v.replace(/[\s\-\(\)\.]/g, "")),
  email: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || ""),
  message: z
    .string()
    .min(1, "Pesan wajib diisi")
    .max(3000, "Pesan maksimal 3000 karakter")
    .transform((v) => v.trim()),
  consent: z
    .boolean()
    .optional()
    .default(true),
  _honeypot: z.string().optional().default(""),
  _timestamp: z.any().optional(),
});

// ============================================
// Settings Schema
// ============================================

export const settingsSchema = z.record(z.string(), z.string());
