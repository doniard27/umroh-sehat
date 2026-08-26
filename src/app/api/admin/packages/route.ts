import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyCsrfToken } from '@/lib/csrf';
import { packageSchema } from '@/lib/validation';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await requireAuth();
    const packages = await prisma.package.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const body = await request.json();
    const result = packageSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const pkg = await prisma.package.create({
      data: {
        ...result.data,
        departureDate: new Date(result.data.departureDate),
      }
    });

    await logAdminAction(user.id, 'CREATE_PACKAGE', `Created package ${pkg.id}`, request);

    return NextResponse.json(pkg, { status: 201 });
  } catch (error: any) {
    console.error('Create package error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
