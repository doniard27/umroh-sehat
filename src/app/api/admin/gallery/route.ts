import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyCsrfToken } from '@/lib/csrf';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const gallerySchema = z.object({
  imageUrl: z.string().min(1),
  caption: z.string().default(''),
  isCover: z.boolean().default(false)
});

export async function GET() {
  try {
    await requireAuth();
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const body = await request.json();
    const result = gallerySchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const image = await prisma.galleryImage.create({
      data: result.data
    });

    await logAdminAction(user.id, 'CREATE_GALLERY_IMAGE', `Created gallery image ${image.id}`, request);

    return NextResponse.json(image, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
