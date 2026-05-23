import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';
import { parseId } from '@/lib/admin-validation';
import { deleteContactMessage, listContactMessages } from '@/lib/content';

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const messages = await listContactMessages();
  return NextResponse.json(messages);
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const id = parseId(request.nextUrl.searchParams.get('id') ?? '');
  if (!id) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  await deleteContactMessage(id);
  return NextResponse.json({ success: true });
}
