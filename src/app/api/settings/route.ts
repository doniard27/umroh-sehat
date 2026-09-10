import { NextResponse } from 'next/server';
import { getAllSettings } from '@/lib/settings';

export const revalidate = 60;

// Endpoint publik: pengaturan website (tanpa data sensitif selain konten publik)
export async function GET() {
  try {
    const settings = await getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
