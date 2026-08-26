import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation';
import { checkLoginRateLimit } from '@/lib/rate-limit';
import { createSession } from '@/lib/auth';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Check rate limit
    const rateLimit = checkLoginRateLimit(ip);
    if (!rateLimit.success) {
      const minutes = Math.ceil((rateLimit.retryAfterMs || 60000) / 60000);
      return NextResponse.json({ 
        error: `Terlalu banyak percobaan login gagal. Akun dikunci sementara. Silakan coba lagi dalam ${minutes} menit.` 
      }, { status: 429 });
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { email, password } = result.data;
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Small delay for anti-brute-force
      await new Promise(resolve => setTimeout(resolve, 500));
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    // Create session with role
    await createSession(user.id, user.email, user.name, user.role || 'SUPER_ADMIN');
    
    // Log action
    await logAdminAction(user.id, 'LOGIN', `Admin login: ${user.email} (${user.role || 'SUPER_ADMIN'})`, request);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
