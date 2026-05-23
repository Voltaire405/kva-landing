import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';
import {
  validateRequiredString,
  validateSortOrder,
} from '@/lib/admin-validation';
import { createClient, getNextSortOrder, listClients } from '@/lib/content';
import { revalidateLandingPage } from '@/lib/revalidate-landing';

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const items = await listClients();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = await request.json();
  const name = validateRequiredString(body.name, 'name', 200);
  if (name instanceof NextResponse) return name;

  const sortOrder =
    body.sortOrder !== undefined ? validateSortOrder(body.sortOrder) : await getNextSortOrder('clients');

  const created = await createClient({ name, sortOrder });
  revalidateLandingPage();
  return NextResponse.json(created, { status: 201 });
}
