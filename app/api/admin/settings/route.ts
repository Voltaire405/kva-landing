import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';
import { isConfiguredInDatabase, listAdmins } from '@/lib/admin-settings';

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const admins = await listAdmins();

  return NextResponse.json({
    configuredInDatabase: isConfiguredInDatabase(admins),
  });
}
