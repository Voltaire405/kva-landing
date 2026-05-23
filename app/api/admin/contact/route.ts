import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';
import { validateEmail, validateRequiredString } from '@/lib/admin-validation';
import { getContactInfo, updateContactInfo } from '@/lib/content';
import { revalidateLandingPage } from '@/lib/revalidate-landing';

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const contact = await getContactInfo();
  return NextResponse.json(contact);
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = await request.json();
  const phone = validateRequiredString(body.phone, 'phone', 500);
  if (phone instanceof NextResponse) return phone;

  const email = validateEmail(body.email);
  if (email instanceof NextResponse) return email;

  const address = validateRequiredString(body.address, 'address', 500);
  if (address instanceof NextResponse) return address;

  const updated = await updateContactInfo({ phone, email, address });
  revalidateLandingPage();
  return NextResponse.json(updated);
}
