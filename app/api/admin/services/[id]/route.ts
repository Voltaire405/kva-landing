import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';
import {
  parseId,
  validateRequiredString,
  validateSortOrder,
} from '@/lib/admin-validation';
import { deleteService, updateService } from '@/lib/content';

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

  if (body.icon !== undefined) {
    const icon = validateRequiredString(body.icon, 'icon', 50);
    if (icon instanceof NextResponse) return icon;
    updates.icon = icon;
  }

  if (body.title !== undefined) {
    const title = validateRequiredString(body.title, 'title', 200);
    if (title instanceof NextResponse) return title;
    updates.title = title;
  }

  if (body.description !== undefined) {
    const description = validateRequiredString(body.description, 'description', 1000);
    if (description instanceof NextResponse) return description;
    updates.description = description;
  }

  if (body.sortOrder !== undefined) {
    updates.sortOrder = validateSortOrder(body.sortOrder);
  }

  const updated = await updateService(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
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

  await deleteService(id);
  return NextResponse.json({ success: true });
}
