import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession, updateAccessCode } from '@/lib/admin-auth';
import { validateAccessCode } from '@/lib/admin-validation';

export async function PUT(request: NextRequest) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = await request.json();

  const currentCode = validateAccessCode(body.currentCode);
  if (currentCode instanceof NextResponse) return currentCode;

  const newCode = validateAccessCode(body.newCode);
  if (newCode instanceof NextResponse) return newCode;

  const confirmCode = validateAccessCode(body.confirmCode);
  if (confirmCode instanceof NextResponse) return confirmCode;

  if (newCode !== confirmCode) {
    return NextResponse.json(
      { error: 'El nuevo código y la confirmación no coinciden' },
      { status: 400 }
    );
  }

  if (currentCode === newCode) {
    return NextResponse.json(
      { error: 'El nuevo código debe ser diferente al actual' },
      { status: 400 }
    );
  }

  const result = await updateAccessCode({ currentCode, newCode });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true });
}
