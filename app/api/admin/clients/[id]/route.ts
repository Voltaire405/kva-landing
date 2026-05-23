import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';
import {
  parseId,
  validateRequiredString,
  validateSortOrder,
} from '@/lib/admin-validation';
import { deleteClient, updateClient } from '@/lib/content';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (!id) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const body = await request.json();
  const updates: Record<string, string | number> = {};

  if (body.name !== undefined) {
    const name = validateRequiredString(body.name, 'name', 200);
    if (name instanceof NextResponse) return name;
    updates.name = name;
  }

  if (body.sortOrder !== undefined) {
    updates.sortOrder = validateSortOrder(body.sortOrder);
  }

  const updated = await updateClient(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (!id) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  await deleteClient(id);
  return NextResponse.json({ success: true });
}
