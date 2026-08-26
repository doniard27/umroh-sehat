import { NextResponse } from 'next/server';
import { destroySession, requireAuth } from '@/lib/auth';
import { logAdminAction } from '@/lib/admin-log';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (user) {
      await logAdminAction(user.id, 'LOGOUT', 'Admin logout', request);
    }
    
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
