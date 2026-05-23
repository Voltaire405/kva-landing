import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';
import {
  validateRequiredString,
  validateSortOrder,
} from '@/lib/admin-validation';
import {
  createTestimonial,
  getNextSortOrder,
  listTestimonials,
} from '@/lib/content';

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const items = await listTestimonials();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = await request.json();
  const quote = validateRequiredString(body.quote, 'quote', 2000);
  if (quote instanceof NextResponse) return quote;

  const authorName = validateRequiredString(body.authorName, 'authorName', 200);
  if (authorName instanceof NextResponse) return authorName;

  const authorRole = validateRequiredString(body.authorRole, 'authorRole', 200);
  if (authorRole instanceof NextResponse) return authorRole;

  const sortOrder =
    body.sortOrder !== undefined
      ? validateSortOrder(body.sortOrder)
      : await getNextSortOrder('testimonials');

  const created = await createTestimonial({ quote, authorName, authorRole, sortOrder });
  return NextResponse.json(created, { status: 201 });
}
