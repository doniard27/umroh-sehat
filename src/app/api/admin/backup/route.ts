import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    
    const [packages, articles, testimonials, gallery, enquiries, settings] = await Promise.all([
      prisma.package.findMany(),
      prisma.article.findMany(),
      prisma.testimonial.findMany(),
      prisma.galleryImage.findMany(),
      prisma.enquiry.findMany(),
      prisma.setting.findMany()
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      data: {
        packages,
        articles,
        testimonials,
        gallery,
        enquiries,
        settings
      }
    };

    await logAdminAction(user.id, 'BACKUP', 'Exported database backup', request);

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="umrohsehat-backup-${new Date().toISOString().slice(0, 10)}.json"`
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error generating backup' }, { status: 500 });
  }
}
