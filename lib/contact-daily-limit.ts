import { sql } from 'drizzle-orm';

import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { isContactTestMode } from '@/lib/contact-test-mode';

export const DEFAULT_CONTACT_DAILY_MESSAGE_LIMIT = 50;

const BOGOTA_UTC_OFFSET = '-5 hours';

export function getContactDailyMessageLimit(): number {
  const raw = process.env.CONTACT_DAILY_MESSAGE_LIMIT;

  if (raw === undefined || raw.trim() === '') {
    return DEFAULT_CONTACT_DAILY_MESSAGE_LIMIT;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_CONTACT_DAILY_MESSAGE_LIMIT;
  }

  return parsed;
}

export async function countContactMessagesToday(): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(contactMessages)
    .where(
      sql`date(${contactMessages.createdAt}, ${BOGOTA_UTC_OFFSET}) = date('now', ${BOGOTA_UTC_OFFSET})`
    );

  return Number(result?.count ?? 0);
}

export async function isContactDailyLimitReached(): Promise<{
  reached: boolean;
  count: number;
  limit: number;
}> {
  const limit = getContactDailyMessageLimit();

  if (isContactTestMode()) {
    return { reached: false, count: 0, limit };
  }

  const count = await countContactMessagesToday();

  return {
    reached: count >= limit,
    count,
    limit,
  };
}
