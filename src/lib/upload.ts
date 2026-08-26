import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Allowed MIME types and their extensions
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Upload directory
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Validate and save an uploaded file.
 * - Checks MIME type against allowlist
 * - Validates file extension
 * - Enforces 5MB size limit
 * - Generates random filename (UUID-based)
 * - Saves to public/uploads/
 */
export async function handleFileUpload(file: File): Promise<UploadResult> {
  // Validate MIME type
  if (!ALLOWED_TYPES[file.type]) {
    return {
      success: false,
      error: "Tipe file tidak diizinkan. Hanya JPG, PNG, WebP, dan GIF yang diterima.",
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: "Ukuran file melebihi batas maksimal 5MB.",
    };
  }

  // Validate extension from filename
  const originalExt = path.extname(file.name).toLowerCase();
  const allowedExts = Object.values(ALLOWED_TYPES);
  if (originalExt && !allowedExts.includes(originalExt) && originalExt !== ".jpeg") {
    return {
      success: false,
      error: "Ekstensi file tidak diizinkan.",
    };
  }

  try {
    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate magic bytes (MIME from actual file content)
    const detectedType = detectMimeType(buffer);
    if (!detectedType || !ALLOWED_TYPES[detectedType]) {
      return {
        success: false,
        error: "Konten file tidak sesuai dengan tipe yang diizinkan.",
      };
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Generate random filename
    const ext = ALLOWED_TYPES[detectedType];
    const filename = `${Date.now()}-${uuidv4()}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Write file
    await writeFile(filepath, buffer);

    return {
      success: true,
      url: `/uploads/${filename}`,
    };
  } catch (error) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengunggah file.",
    };
  }
}

/**
 * Handle multiple file uploads.
 */
export async function handleMultipleUploads(files: File[]): Promise<UploadResult[]> {
  return Promise.all(files.map(handleFileUpload));
}

/**
 * Delete an uploaded file.
 */
export async function deleteUploadedFile(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl.startsWith("/uploads/")) {
      return false;
    }
    const filename = path.basename(fileUrl);
    // Prevent path traversal
    if (filename.includes("..") || filename.includes("/")) {
      return false;
    }
    const filepath = path.join(UPLOAD_DIR, filename);
    await unlink(filepath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect MIME type from file magic bytes.
 */
function detectMimeType(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  // GIF: 47 49 46 38
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return "image/gif";
  }

  // WebP: 52 49 46 46 ... 57 45 42 50
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer.length >= 12 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}
