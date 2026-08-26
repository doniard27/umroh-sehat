import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyCsrfToken } from '@/lib/csrf';
import { testimonialSchema } from '@/lib/validation';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id }
    });
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const body = await request.json();
    const result = testimonialSchema.safeParse(body);
    
    if (!result.success) return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });

    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: result.data
    });

    await logAdminAction(user.id, 'UPDATE_TESTIMONIAL', `Updated testimonial ${testimonial.id}`, request);
    return NextResponse.json(testimonial);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const testimonial = await prisma.testimonial.delete({
      where: { id: params.id }
    });

    await logAdminAction(user.id, 'DELETE_TESTIMONIAL', `Deleted testimonial ${testimonial.id}`, request);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
