import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  DuplicateAccessCodeError,
  findAdminByCode,
  persistAccessCode,
  resolveSessionSecret,
  type AdminIdentity,
} from '@/lib/admin-settings';

export const ADMIN_SESSION_COOKIE = 'admin_session';

function signSession(secret: string): string {
  return createHmac('sha256', secret).update('admin-session').digest('hex');
}

export { findAdminByCode } from '@/lib/admin-settings';

export async function createSessionCookie({ id, sessionSecret }: AdminIdentity) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, `${id}.${signSession(sessionSecret)}`, {
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
    const [id, signature] = session.split('.');
    const secret = await resolveSessionSecret(Number(id));

    if (secret === null || !signature) {
      return false;
    }

    const sessionBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(signSession(secret));

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
  const admin = await findAdminByCode(currentCode);

  if (!admin) {
    return { success: false, error: 'Código actual incorrecto', status: 401 };
  }

  try {
    await persistAccessCode(newCode, admin.id);
  } catch (error) {
    if (error instanceof DuplicateAccessCodeError) {
      return { success: false, error: error.message, status: 409 };
    }
    throw error;
  }

  await clearSessionCookie();

  return { success: true };
}
