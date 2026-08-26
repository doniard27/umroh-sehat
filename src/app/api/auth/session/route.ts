import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.isLoggedIn) {
      return NextResponse.json({ isLoggedIn: false, user: null });
    }
    return NextResponse.json({
      isLoggedIn: true,
      id: session.userId || session.id,
      userId: session.userId || session.id,
      email: session.email,
      name: session.name,
      role: session.role || 'SUPER_ADMIN',
      user: {
        id: session.userId || session.id,
        email: session.email,
        name: session.name,
        role: session.role || 'SUPER_ADMIN',
      }
    });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false, user: null });
  }
}
