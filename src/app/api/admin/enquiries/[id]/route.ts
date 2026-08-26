import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyCsrfToken } from '@/lib/csrf';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id }
    });
    if (!enquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (enquiry.status === 'NEW') {
      const updated = await prisma.enquiry.update({
        where: { id: params.id },
        data: { status: 'READ' }
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    if (body.status) {
      const updated = await prisma.enquiry.update({
        where: { id: params.id },
        data: { status: body.status }
      });
      await logAdminAction(user.id, 'UPDATE_ENQUIRY', `Updated enquiry ${updated.id}`, request);
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid update' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const enquiry = await prisma.enquiry.delete({
      where: { id: params.id }
    });

    await logAdminAction(user.id, 'DELETE_ENQUIRY', `Deleted enquiry ${enquiry.id}`, request);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
