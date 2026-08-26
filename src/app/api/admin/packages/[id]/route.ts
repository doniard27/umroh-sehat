import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyCsrfToken } from '@/lib/csrf';
import { packageSchema } from '@/lib/validation';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    const pkg = await prisma.package.findUnique({
      where: { id: params.id }
    });
    if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(pkg);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const body = await request.json();
    const result = packageSchema.safeParse(body);
    
    if (!result.success) return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });

    const pkg = await prisma.package.update({
      where: { id: params.id },
      data: {
        ...result.data,
        departureDate: new Date(result.data.departureDate),
      }
    });

    await logAdminAction(user.id, 'UPDATE_PACKAGE', `Updated package ${pkg.id}`, request);
    return NextResponse.json(pkg);
  } catch (error: any) {
    console.error('Update package error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const pkg = await prisma.package.delete({
      where: { id: params.id }
    });

    await logAdminAction(user.id, 'DELETE_PACKAGE', `Deleted package ${pkg.id}`, request);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete package error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
