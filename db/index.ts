import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema';

type Database = ReturnType<typeof drizzle<typeof schema>>;

let dbInstance: Database | null = null;

function createDb(): Database {
  const url = process.env.TURSO_DATABASE_URL;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL is not configured');
  }

  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
}

export function getDb(): Database {
  if (!dbInstance) {
    dbInstance = createDb();
  }

  return dbInstance;
}

export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});
