import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-auth';
import { getAdminSettings, isConfiguredInDatabase } from '@/lib/admin-settings';

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const settings = await getAdminSettings();

  return NextResponse.json({
    configuredInDatabase: isConfiguredInDatabase(settings),
  });
}
