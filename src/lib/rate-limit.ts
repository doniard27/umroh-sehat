/**
 * In-memory rate limiter with sliding window.
 * Tracks request counts per IP with configurable windows and limits.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lockedUntil?: number;
}

const stores: Map<string, Map<string, RateLimitEntry>> = new Map();

function getStore(name: string): Map<string, RateLimitEntry> {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  return stores.get(name)!;
}

// Clean up expired entries periodically
function cleanup(store: Map<string, RateLimitEntry>) {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now > entry.resetTime && (!entry.lockedUntil || now > entry.lockedUntil)) {
      store.delete(key);
    }
  });
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterMs?: number;
  isLocked?: boolean;
}

/**
 * Check rate limit for a given identifier (usually IP address).
 * @param storeName - Name of the rate limit store (e.g., 'login', 'contact', 'api')
 * @param identifier - Unique identifier (IP address)
 * @param maxRequests - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @param lockoutMs - Optional lockout duration after exceeding limit (for login)
 */
export function checkRateLimit(
  storeName: string,
  identifier: string,
  maxRequests: number,
  windowMs: number,
  lockoutMs?: number
): RateLimitResult {
  const store = getStore(storeName);
  const now = Date.now();

  // Periodic cleanup (every 100 checks)
  if (Math.random() < 0.01) {
    cleanup(store);
  }

  const entry = store.get(identifier);

  // Check if locked out
  if (entry?.lockedUntil && now < entry.lockedUntil) {
    return {
      success: false,
      remaining: 0,
      retryAfterMs: entry.lockedUntil - now,
      isLocked: true,
    };
  }

  // Reset if window has passed
  if (!entry || now > entry.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: maxRequests - 1 };
  }

  // Increment count
  entry.count += 1;

  // Check if limit exceeded
  if (entry.count > maxRequests) {
    // Apply lockout if configured
    if (lockoutMs) {
      entry.lockedUntil = now + lockoutMs;
    }
    return {
      success: false,
      remaining: 0,
      retryAfterMs: entry.resetTime - now,
      isLocked: !!lockoutMs,
    };
  }

  return {
    success: true,
    remaining: maxRequests - entry.count,
  };
}

// Pre-configured rate limiters

/** Login: 5 attempts per 15 minutes, then 15-minute lockout */
export function checkLoginRateLimit(ip: string): RateLimitResult {
  return checkRateLimit("login", ip, 5, 15 * 60 * 1000, 15 * 60 * 1000);
}

/** Contact form: 5 submissions per hour */
export function checkContactRateLimit(ip: string): RateLimitResult {
  return checkRateLimit("contact", ip, 5, 60 * 60 * 1000);
}

/** General API: 100 requests per minute */
export function checkApiRateLimit(ip: string): RateLimitResult {
  return checkRateLimit("api", ip, 100, 60 * 1000);
}
