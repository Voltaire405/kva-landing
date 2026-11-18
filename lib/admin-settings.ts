import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { adminSettings, type AdminSettings } from '@/db/schema';

const scryptAsync = promisify(scrypt);

export const BOOTSTRAP_ADMIN_ID = 0;

export type AdminIdentity = { id: number; sessionSecret: string };

export async function listAdmins(): Promise<AdminSettings[]> {
  return db.select().from(adminSettings);
}

export function isConfiguredInDatabase(admins: AdminSettings[]): boolean {
  return admins.length > 0;
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

export async function findAdminByCode(code: string): Promise<AdminIdentity | null> {
  const admins = await listAdmins();

  if (admins.length === 0) {
    return verifyBootstrapAccessCode(code)
      ? { id: BOOTSTRAP_ADMIN_ID, sessionSecret: getBootstrapAccessCode() }
      : null;
  }

  for (const admin of admins) {
    if (await verifyAccessCodeHash(code, admin.accessCodeHash)) {
      return { id: admin.id, sessionSecret: admin.sessionSecret };
    }
  }

  return null;
}

export async function resolveSessionSecret(adminId: number): Promise<string | null> {
  const admins = await listAdmins();

  if (adminId === BOOTSTRAP_ADMIN_ID) {
    return admins.length === 0 ? getBootstrapAccessCode() : null;
  }

  return admins.find((admin) => admin.id === adminId)?.sessionSecret ?? null;
}

function generateSessionSecret(): string {
  return randomBytes(32).toString('hex');
}

export class DuplicateAccessCodeError extends Error {}

/** Con `adminId` reemplaza el código de ese admin; sin él (o con el bootstrap) registra un admin nuevo. */
export async function persistAccessCode(
  newCode: string,
  adminId: number = BOOTSTRAP_ADMIN_ID
): Promise<AdminSettings> {
  const owner = await findAdminByCode(newCode);
  if (owner && owner.id !== BOOTSTRAP_ADMIN_ID) {
    throw new DuplicateAccessCodeError('El código ya está en uso');
  }

  const accessCodeHash = await hashAccessCode(newCode);
  const sessionSecret = generateSessionSecret();

  if (adminId !== BOOTSTRAP_ADMIN_ID) {
    const [updated] = await db
      .update(adminSettings)
      .set({ accessCodeHash, sessionSecret, updatedAt: new Date().toISOString() })
      .where(eq(adminSettings.id, adminId))
      .returning();

    return updated;
  }

  const [created] = await db
    .insert(adminSettings)
    .values({ accessCodeHash, sessionSecret })
    .returning();

  return created;
}
