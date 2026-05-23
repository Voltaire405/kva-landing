import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';
import {
  parseId,
  validateRequiredString,
  validateSortOrder,
} from '@/lib/admin-validation';
import { deleteTestimonial, updateTestimonial } from '@/lib/content';
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

  if (body.quote !== undefined) {
    const quote = validateRequiredString(body.quote, 'quote', 2000);
    if (quote instanceof NextResponse) return quote;
    updates.quote = quote;
  }

  if (body.authorName !== undefined) {
    const authorName = validateRequiredString(body.authorName, 'authorName', 200);
    if (authorName instanceof NextResponse) return authorName;
    updates.authorName = authorName;
  }

  if (body.authorRole !== undefined) {
    const authorRole = validateRequiredString(body.authorRole, 'authorRole', 200);
    if (authorRole instanceof NextResponse) return authorRole;
    updates.authorRole = authorRole;
  }

  if (body.sortOrder !== undefined) {
    updates.sortOrder = validateSortOrder(body.sortOrder);
  }

  const updated = await updateTestimonial(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Testimonio no encontrado' }, { status: 404 });
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

  await deleteTestimonial(id);
  revalidateLandingPage();
  return NextResponse.json({ success: true });
}
