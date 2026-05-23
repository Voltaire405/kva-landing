import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  persistAccessCode,
  resolveSessionSecret,
  verifyAccessCode,
} from '@/lib/admin-settings';

export const ADMIN_SESSION_COOKIE = 'admin_session';

async function createSessionToken(): Promise<string> {
  const secret = await resolveSessionSecret();
  return createHmac('sha256', secret).update('admin-session').digest('hex');
}

export { verifyAccessCode } from '@/lib/admin-settings';

export async function createSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!session) {
    return false;
  }

  try {
    const expected = await createSessionToken();
    const sessionBuffer = Buffer.from(session);
    const expectedBuffer = Buffer.from(expected);

    if (sessionBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(sessionBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function requireAdminSession() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  return null;
}

export async function updateAccessCode({
  currentCode,
  newCode,
}: {
  currentCode: string;
  newCode: string;
}): Promise<{ success: true } | { success: false; error: string; status: number }> {
  const currentValid = await verifyAccessCode(currentCode);

  if (!currentValid) {
    return { success: false, error: 'Código actual incorrecto', status: 401 };
  }

  await persistAccessCode(newCode);
  await clearSessionCookie();

  return { success: true };
}
