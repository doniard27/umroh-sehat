import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyCsrfToken } from '@/lib/csrf';
import { getAllSettings, updateSettings } from '@/lib/settings';
import { logAdminAction } from '@/lib/admin-log';

export async function GET() {
  try {
    await requireAuth();
    const settings = await getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const body = await request.json();
    await updateSettings(body);

    await logAdminAction(user.id, 'UPDATE_SETTINGS', 'Updated system settings', request);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
