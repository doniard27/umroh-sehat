import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyCsrfToken } from '@/lib/csrf';
import { articleSchema } from '@/lib/validation';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    const article = await prisma.article.findUnique({
      where: { id: params.id }
    });
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const body = await request.json();
    const result = articleSchema.safeParse(body);
    
    if (!result.success) return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });

    let slug = result.data.slug;
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing && existing.id !== params.id) {
      let count = 1;
      while (await prisma.article.findUnique({ where: { slug } })) {
        slug = `${result.data.slug}-${count}`;
        count++;
      }
    }

    const article = await prisma.article.update({
      where: { id: params.id },
      data: { ...result.data, slug }
    });

    await logAdminAction(user.id, 'UPDATE_ARTICLE', `Updated article ${article.id}`, request);
    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const article = await prisma.article.delete({
      where: { id: params.id }
    });

    await logAdminAction(user.id, 'DELETE_ARTICLE', `Deleted article ${article.id}`, request);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
