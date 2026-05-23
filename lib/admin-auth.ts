import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'admin_session';

function getAccessCode(): string {
  const code = process.env.ADMIN_ACCESS_CODE;
  if (!code) {
    throw new Error('ADMIN_ACCESS_CODE is not configured');
  }
  return code;
}

function createSessionToken(): string {
  return createHmac('sha256', getAccessCode()).update('admin-session').digest('hex');
}

export function verifyAccessCode(code: string): boolean {
  const expected = getAccessCode();
  const provided = Buffer.from(code);
  const expectedBuffer = Buffer.from(expected);

  if (provided.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(provided, expectedBuffer);
}

export async function createSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
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
    const expected = createSessionToken();
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
