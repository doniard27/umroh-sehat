import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { handleFileUpload } from '@/lib/upload';
import { logAdminAction } from '@/lib/admin-log';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const { url, error } = await handleFileUpload(file);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    
    await logAdminAction(user.id, 'UPLOAD_FILE', `Uploaded file ${url}`, request);
    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error uploading file' }, { status: 500 });
  }
}
