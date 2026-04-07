import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { resolveDatabaseConfig } from './src/config/database.ts';

const databaseConfig = resolveDatabaseConfig({
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_SSL: process.env.DATABASE_SSL as 'disable' | 'require' | undefined,
  DATABASE_USE_POOLER: process.env.DATABASE_USE_POOLER,
  DATABASE_ENABLE_PREPARED_STATEMENTS: process.env.DATABASE_ENABLE_PREPARED_STATEMENTS,
});

export default defineConfig({
  out: './drizzle',
  schema: './dist/src/db/schema/index.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseConfig.databaseUrl,
  },
  strict: true,
  verbose: true,
});
