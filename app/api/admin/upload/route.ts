import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'La imagen no puede superar 5 MB' }, { status: 400 });
  }

  const extension = file.name.split('.').pop() || 'jpg';
  const pathname = `portfolio/${crypto.randomUUID()}.${extension}`;

  const blob = await put(pathname, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return NextResponse.json({ url: blob.url });
}
