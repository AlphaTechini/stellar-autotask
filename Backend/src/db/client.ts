import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema/index.js';
import type { AppEnv } from '../config/env.js';

export function createDatabaseClient(env: AppEnv) {
  const client = postgres(env.DATABASE_URL, {
    max: env.DATABASE_MAX_CONNECTIONS,
    ssl: env.DATABASE_SSL === 'require' ? 'require' : undefined,
    prepare: env.DATABASE_ENABLE_PREPARED_STATEMENTS,
  });

  return {
    client,
    db: drizzle(client, { schema }),
  };
}

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;
