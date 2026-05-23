import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { adminSettings, type AdminSettings } from '@/db/schema';

const scryptAsync = promisify(scrypt);
const ADMIN_SETTINGS_ID = 1;

export async function getAdminSettings(): Promise<AdminSettings | null> {
  const rows = await db
    .select()
    .from(adminSettings)
    .where(eq(adminSettings.id, ADMIN_SETTINGS_ID))
    .limit(1);

  return rows[0] ?? null;
}

export function isConfiguredInDatabase(settings: AdminSettings | null): boolean {
  return settings !== null;
}

export function getBootstrapAccessCode(): string {
  const code = process.env.ADMIN_ACCESS_CODE;
  if (!code) {
    throw new Error('ADMIN_ACCESS_CODE is not configured');
  }
  return code;
}

export async function hashAccessCode(code: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scryptAsync(code, salt, 64)) as Buffer;
  return `${salt}:${derived.toString('hex')}`;
}

export async function verifyAccessCodeHash(code: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) {
    return false;
  }

  const derived = (await scryptAsync(code, salt, 64)) as Buffer;
  const hashBuffer = Buffer.from(hash, 'hex');

  if (derived.length !== hashBuffer.length) {
    return false;
  }

  return timingSafeEqual(derived, hashBuffer);
}

function verifyBootstrapAccessCode(code: string): boolean {
  const expected = getBootstrapAccessCode();
  const provided = Buffer.from(code);
  const expectedBuffer = Buffer.from(expected);

  if (provided.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(provided, expectedBuffer);
}

export async function verifyAccessCode(code: string): Promise<boolean> {
  const settings = await getAdminSettings();

  if (settings) {
    return verifyAccessCodeHash(code, settings.accessCodeHash);
  }

  return verifyBootstrapAccessCode(code);
}

export async function resolveSessionSecret(): Promise<string> {
  const settings = await getAdminSettings();

  if (settings) {
    return settings.sessionSecret;
  }

  return getBootstrapAccessCode();
}

function generateSessionSecret(): string {
  return randomBytes(32).toString('hex');
}

export async function persistAccessCode(newCode: string): Promise<AdminSettings> {
  const accessCodeHash = await hashAccessCode(newCode);
  const sessionSecret = generateSessionSecret();
  const existing = await getAdminSettings();

  if (existing) {
    const [updated] = await db
      .update(adminSettings)
      .set({
        accessCodeHash,
        sessionSecret,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(adminSettings.id, ADMIN_SETTINGS_ID))
      .returning();

    return updated;
  }

  const [created] = await db
    .insert(adminSettings)
    .values({
      id: ADMIN_SETTINGS_ID,
      accessCodeHash,
      sessionSecret,
    })
    .returning();

  return created;
}
