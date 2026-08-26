import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/admin/users - Get all admin users
export async function GET() {
  try {
    await requireAuth();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(users);
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}

// POST /api/admin/users - Create new admin user
export async function POST(request: Request) {
  try {
    const session = await requireAuth();

    // Check if current user is SUPER_ADMIN
    if (session.role && session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Hanya Super Admin yang dapat menambahkan admin baru' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }

    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'CS'];
    const userRole = validRoles.includes(role) ? role : 'ADMIN';

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar untuk pengguna lain' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: userRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    await logAdminAction(session.userId, 'CREATE_USER', `Created new user ${newUser.email} with role ${newUser.role}`, request);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Create User Error:', error);
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Gagal membuat pengguna baru' }, { status: 500 });
  }
}
