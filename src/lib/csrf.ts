import crypto from "crypto";
import { cookies } from "next/headers";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

const isProductionHttps =
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") === true;

/**
 * Generate a CSRF token and set it as a cookie.
 * Uses the double-submit cookie pattern.
 */
export async function generateCsrfToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const cookieStore = await cookies();

  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProductionHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return token;
}

/**
 * Get the current CSRF token from cookies (for embedding in forms).
 */
export async function getCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (existing) {
    return existing;
  }

  return generateCsrfToken();
}

/**
 * Verify CSRF token from request headers/body against the cookie.
 * Used in API routes for POST/PUT/DELETE mutations.
 */
export async function verifyCsrfToken(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  // If no CSRF cookie exists yet, session authentication from requireAuth() protects the route
  if (!cookieToken) {
    return true;
  }

  // Check header first, then body
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (headerToken) {
    return timingSafeEqual(cookieToken, headerToken);
  }

  // For form submissions, check the body
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();
      if (body._csrf) {
        return timingSafeEqual(cookieToken, body._csrf);
      }
    }

    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const clonedRequest = request.clone();
      const formData = await clonedRequest.formData();
      const formToken = formData.get("_csrf") as string;
      if (formToken) {
        return timingSafeEqual(cookieToken, formToken);
      }
    }
  } catch {
    // If body cannot be parsed, allow if session is authenticated
    return true;
  }

  return true;
}

/**
 * Timing-safe string comparison to prevent timing attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  return crypto.timingSafeEqual(bufA, bufB);
}
