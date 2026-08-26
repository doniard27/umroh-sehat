import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyCsrfToken } from '@/lib/csrf';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';
import { deleteUploadedFile } from '@/lib/upload';
import { z } from 'zod';

const updateGallerySchema = z.object({
  caption: z.string().optional(),
  isCover: z.boolean().optional()
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const body = await request.json();
    const result = updateGallerySchema.safeParse(body);
    
    if (!result.success) return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });

    const image = await prisma.galleryImage.update({
      where: { id: params.id },
      data: result.data
    });

    await logAdminAction(user.id, 'UPDATE_GALLERY_IMAGE', `Updated gallery image ${image.id}`, request);
    return NextResponse.json(image);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const image = await prisma.galleryImage.findUnique({ where: { id: params.id } });
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.galleryImage.delete({
      where: { id: params.id }
    });
    
    if (image.imageUrl) {
      await deleteUploadedFile(image.imageUrl);
    }

    await logAdminAction(user.id, 'DELETE_GALLERY_IMAGE', `Deleted gallery image ${image.id}`, request);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
