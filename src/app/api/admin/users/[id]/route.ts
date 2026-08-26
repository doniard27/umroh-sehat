import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { logAdminAction } from '@/lib/admin-log';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/admin/users/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}

// PUT /api/admin/users/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();

    // Check if current user is SUPER_ADMIN
    if (session.role && session.role !== 'SUPER_ADMIN' && session.userId !== params.id) {
      return NextResponse.json({ error: 'Hanya Super Admin yang dapat mengubah data admin lain' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, role, password } = body;

    const existing = await prisma.user.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // Check duplicate email if changed
    if (email && email.toLowerCase().trim() !== existing.email) {
      const emailCheck = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
      if (emailCheck) {
        return NextResponse.json({ error: 'Email sudah terdaftar untuk pengguna lain' }, { status: 400 });
      }
    }

    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'CS'];
    const updateData: any = {};

    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (role && validRoles.includes(role)) {
      // Prevent changing own role away from SUPER_ADMIN if you are the only one
      if (existing.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN') {
        const superAdminCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
        if (superAdminCount <= 1) {
          return NextResponse.json({ error: 'Tidak dapat mengubah role Super Admin terakhir' }, { status: 400 });
        }
      }
      updateData.role = role;
    }

    if (password && password.trim().length > 0) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      }
    });

    await logAdminAction(session.userId, 'UPDATE_USER', `Updated user ${updated.email} (${updated.role})`, request);

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Update User Error:', error);
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Gagal memperbarui pengguna' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();

    // Check if current user is SUPER_ADMIN
    if (session.role && session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Hanya Super Admin yang dapat menghapus admin' }, { status: 403 });
    }

    // Prevent deleting self
    if (session.userId === params.id) {
      return NextResponse.json({ error: 'Anda tidak dapat menghapus akun Anda sendiri' }, { status: 400 });
    }

    const userToDelete = await prisma.user.findUnique({ where: { id: params.id } });
    if (!userToDelete) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // Prevent deleting the only remaining SUPER_ADMIN
    if (userToDelete.role === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: 'Tidak dapat menghapus Super Admin terakhir' }, { status: 400 });
      }
    }

    // Delete related logs first or delete user
    await prisma.adminLog.deleteMany({ where: { userId: params.id } });
    await prisma.user.delete({ where: { id: params.id } });

    await logAdminAction(session.userId, 'DELETE_USER', `Deleted user ${userToDelete.email}`, request);

    return NextResponse.json({ success: true, message: 'Pengguna berhasil dihapus' });
  } catch (error: any) {
    console.error('Delete User Error:', error);
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}
