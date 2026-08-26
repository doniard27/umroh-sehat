import { getIronSession, SessionOptions, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId: string;
  id?: string;
  email: string;
  name: string;
  role?: string;
  isLoggedIn: boolean;
  lastActivity: number;
}

const isProductionHttps =
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") === true;

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "umroh-sehat-super-secret-key-change-this-in-production-min-32-chars",
  cookieName: "umroh_sehat_session",
  cookieOptions: {
    secure: isProductionHttps,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 12 * 60 * 60, // 12 hours
  },
};

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  // Check inactivity timeout
  if (session.isLoggedIn && session.lastActivity) {
    const now = Date.now();
    if (now - session.lastActivity > INACTIVITY_TIMEOUT) {
      session.isLoggedIn = false;
    }
  }

  return session;
}

export async function createSession(
  userId: string,
  email: string,
  name: string,
  role: string = "SUPER_ADMIN"
): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  session.userId = userId;
  session.id = userId;
  session.email = email;
  session.name = name;
  session.role = role;
  session.isLoggedIn = true;
  session.lastActivity = Date.now();
  await session.save();
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  session.destroy();
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("UNAUTHORIZED");
  }
  return {
    userId: session.userId,
    id: session.userId,
    email: session.email,
    name: session.name,
    role: session.role || "SUPER_ADMIN",
    isLoggedIn: session.isLoggedIn,
    lastActivity: session.lastActivity,
  };
}
