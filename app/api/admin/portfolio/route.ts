import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';
import {
  validateRequiredString,
  validateSortOrder,
} from '@/lib/admin-validation';
import {
  createPortfolioItem,
  getNextSortOrder,
  listPortfolioItems,
} from '@/lib/content';

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const items = await listPortfolioItems();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = await request.json();
  const imageUrl = validateRequiredString(body.imageUrl, 'imageUrl', 2048);
  if (imageUrl instanceof NextResponse) return imageUrl;

  const title = validateRequiredString(body.title, 'title', 200);
  if (title instanceof NextResponse) return title;

  const description = validateRequiredString(body.description, 'description', 1000);
  if (description instanceof NextResponse) return description;

  const sortOrder =
    body.sortOrder !== undefined
      ? validateSortOrder(body.sortOrder)
      : await getNextSortOrder('portfolio');

  const created = await createPortfolioItem({ imageUrl, title, description, sortOrder });
  return NextResponse.json(created, { status: 201 });
}
