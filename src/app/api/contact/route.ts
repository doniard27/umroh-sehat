import { NextResponse } from 'next/server';
import { enquirySchema } from '@/lib/validation';
import { checkContactRateLimit } from '@/lib/rate-limit';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    const rateLimit = checkContactRateLimit(ip);
    if (!rateLimit.success) {
      return NextResponse.json({ 
        error: 'Terlalu banyak pengiriman pesan. Silakan coba lagi beberapa saat lagi.' 
      }, { status: 429 });
    }

    const body = await request.json();

    // Map Indonesian field names to standard schema fields
    const normalizedData = {
      name: body.name || body.nama || '',
      whatsapp: body.whatsapp || body.noWhatsapp || body.telepon || body.phone || '',
      email: body.email || '',
      message: body.message || body.pesan || '',
      consent: body.consent !== undefined ? Boolean(body.consent) : true,
      _honeypot: body._honeypot || body.honeypot || '',
      _timestamp: body._timestamp || body.timestamp || null
    };

    const result = enquirySchema.safeParse(normalizedData);
    
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Data formulir tidak valid';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // Bot trap: honeypot field filled
    if (result.data._honeypot && result.data._honeypot.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Pesan berhasil dikirim' });
    }

    // Email format validation only if email is provided
    let cleanEmail = result.data.email || '';
    if (cleanEmail && !cleanEmail.includes('@')) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
    }

    // Save enquiry to database
    await prisma.enquiry.create({
      data: {
        name: result.data.name,
        whatsapp: result.data.whatsapp,
        email: cleanEmail,
        message: result.data.message,
        consent: result.data.consent ?? true,
        status: 'NEW'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Pesan Anda berhasil dikirim! Tim Umroh Sehat akan segera menghubungi Anda melalui WhatsApp.' 
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat mengirim pesan' }, { status: 500 });
  }
}
