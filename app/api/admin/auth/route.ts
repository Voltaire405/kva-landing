import { NextRequest, NextResponse } from 'next/server';

import {
  clearSessionCookie,
  createSessionCookie,
  verifyAccessCode,
} from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = typeof body.code === 'string' ? body.code.trim() : '';

    if (!code || !verifyAccessCode(code)) {
      return NextResponse.json({ error: 'Código inválido' }, { status: 401 });
    }

    await createSessionCookie();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error de autenticación' }, { status: 500 });
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
