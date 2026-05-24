import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { contactRateLimits } from '@/db/schema';

export const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000;
export const MAX_REQUESTS_PER_WINDOW = 3;

export async function checkRateLimit(identifier: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  const now = Date.now();
  const [entry] = await db
    .select()
    .from(contactRateLimits)
    .where(eq(contactRateLimits.identifier, identifier))
    .limit(1);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + RATE_LIMIT_WINDOW;
    await db
      .insert(contactRateLimits)
      .values({ identifier, count: 1, resetAt })
      .onConflictDoUpdate({
        target: contactRateLimits.identifier,
        set: { count: 1, resetAt },
      });

    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetAt,
    };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  const nextCount = entry.count + 1;
  await db
    .update(contactRateLimits)
    .set({ count: nextCount })
    .where(eq(contactRateLimits.identifier, identifier));

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - nextCount,
    resetAt: entry.resetAt,
  };
}

export function getClientIP(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const real = headers.get('x-real-ip');
  const cfConnecting = headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (real) {
    return real.trim();
  }

  if (cfConnecting) {
    return cfConnecting.trim();
  }

  return 'unknown';
}
