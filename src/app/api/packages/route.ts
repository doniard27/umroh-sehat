import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const revalidate = 60;

// Endpoint publik: daftar paket yang published
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      where: { published: true },
      orderBy: { departureDate: 'asc' },
    });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
