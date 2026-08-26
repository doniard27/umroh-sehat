import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyCsrfToken } from '@/lib/csrf';
import { articleSchema } from '@/lib/validation';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await requireAuth();
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    await verifyCsrfToken(request);
    
    const body = await request.json();
    const result = articleSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    let slug = result.data.slug;
    let count = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${result.data.slug}-${count}`;
      count++;
    }

    const article = await prisma.article.create({
      data: { ...result.data, slug }
    });

    await logAdminAction(user.id, 'CREATE_ARTICLE', `Created article ${article.id}`, request);

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
