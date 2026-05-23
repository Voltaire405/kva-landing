import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';
import {
  parseId,
  validateRequiredString,
  validateSortOrder,
} from '@/lib/admin-validation';
import { deletePortfolioItem, updatePortfolioItem } from '@/lib/content';
import { revalidateLandingPage } from '@/lib/revalidate-landing';

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

  if (body.imageUrl !== undefined) {
    const imageUrl = validateRequiredString(body.imageUrl, 'imageUrl', 2048);
    if (imageUrl instanceof NextResponse) return imageUrl;
    updates.imageUrl = imageUrl;
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

  const updated = await updatePortfolioItem(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
  }

  revalidateLandingPage();
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

  await deletePortfolioItem(id);
  revalidateLandingPage();
  return NextResponse.json({ success: true });
}
