import { z } from 'zod';
import { Networks } from '@stellar/stellar-sdk';
import { resolveDatabaseConfig } from './database.js';

const booleanStringSchema = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

const optionalBooleanStringSchema = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true')
  .optional();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().min(1).default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(7400),
  DATABASE_URL: z.string().min(1).optional(),
  DATABASE_HOST: z.string().min(1).optional(),
  DATABASE_PORT: z.coerce.number().int().positive().optional(),
  DATABASE_USER: z.string().min(1).default('postgres'),
  DATABASE_NAME: z.string().min(1).default('postgres'),
  DATABASE_PASSWORD: z.string().min(1).optional(),
  DATABASE_MAX_CONNECTIONS: z.coerce.number().int().positive().default(10),
  DATABASE_SSL: z.enum(['disable', 'require']).default('disable'),
  DATABASE_USE_POOLER: booleanStringSchema,
  DATABASE_ENABLE_PREPARED_STATEMENTS: optionalBooleanStringSchema,
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  STELLAR_NETWORK_PASSPHRASE: z.string().min(1).default(Networks.TESTNET),
  AUTH_HOME_DOMAIN: z.string().min(1),
  AUTH_CHALLENGE_SECRET_KEY: z.string().min(1),
  AUTH_JWT_SECRET: z.string().min(32),
  AUTH_JWT_ISSUER: z.string().min(1).default('stellar-1-backend'),
  AUTH_CHALLENGE_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  AUTH_SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(86400),
  STELLAR_HORIZON_URL: z.string().url().default('https://horizon-testnet.stellar.org'),
  STELLAR_RPC_URL: z.string().url().default('https://soroban-testnet.stellar.org:443'),
  STELLAR_PAYOUT_CONTRACT_ID: z.string().min(1),
  STELLAR_PAYOUT_ADMIN_SECRET_KEY: z.string().min(1),
  STELLAR_PAYOUT_ADMIN_PUBLIC_KEY: z.string().min(1),
  PLATFORM_FUNDING_WALLET: z.string().min(1).optional(),
  STELLAR_TRANSACTION_TIMEOUT_SECONDS: z.coerce.number().int().positive().default(30),
  STELLAR_TRANSACTION_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(1000),
  STELLAR_TRANSACTION_POLL_TIMEOUT_MS: z.coerce.number().int().positive().default(45000),
  GROQ_API_KEY: z.string().min(1).optional(),
  GROQ_API_URL: z.string().url().default('https://api.groq.com/openai/v1'),
  GROQ_WRITING_MODEL: z
    .string()
    .min(1)
    .default('meta-llama/llama-4-scout-17b-16e-instruct'),
  GROQ_WRITING_MAX_INPUT_CHARS: z.coerce.number().int().positive().default(12000),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_API_URL: z.string().url().default('https://generativelanguage.googleapis.com/v1beta'),
  GEMINI_DESIGN_MODEL: z.string().min(1).default('gemini-3.1-flash-lite-preview'),
  GEMINI_IMAGE_MAX_INLINE_BYTES: z.coerce.number().int().positive().default(20_000_000),
  SCHEDULER_AUTO_PAYOUT_ENABLED: booleanStringSchema,
  SCHEDULER_AUTO_PAYOUT_INTERVAL_MS: z.coerce.number().int().positive().default(30000),
});

type ParsedEnv = z.infer<typeof envSchema>;

export type AppEnv = Omit<
  ParsedEnv,
  'DATABASE_URL' | 'DATABASE_ENABLE_PREPARED_STATEMENTS'
> & {
  DATABASE_URL: string;
  DATABASE_ENABLE_PREPARED_STATEMENTS: boolean;
  PLATFORM_FUNDING_WALLET: string;
};

export function loadEnv(rawEnv: NodeJS.ProcessEnv = process.env): AppEnv {
  const parsedEnv = envSchema.parse(rawEnv);
  const databaseConfig = resolveDatabaseConfig({
    DATABASE_URL: parsedEnv.DATABASE_URL,
    DATABASE_HOST: parsedEnv.DATABASE_HOST,
    DATABASE_PORT: parsedEnv.DATABASE_PORT,
    DATABASE_USER: parsedEnv.DATABASE_USER,
    DATABASE_NAME: parsedEnv.DATABASE_NAME,
    DATABASE_PASSWORD: parsedEnv.DATABASE_PASSWORD,
    DATABASE_SSL: parsedEnv.DATABASE_SSL,
    DATABASE_USE_POOLER: parsedEnv.DATABASE_USE_POOLER,
    DATABASE_ENABLE_PREPARED_STATEMENTS: parsedEnv.DATABASE_ENABLE_PREPARED_STATEMENTS,
  });

  return {
    ...parsedEnv,
    DATABASE_URL: databaseConfig.databaseUrl,
    DATABASE_ENABLE_PREPARED_STATEMENTS: databaseConfig.databaseEnablePreparedStatements,
    PLATFORM_FUNDING_WALLET:
      parsedEnv.PLATFORM_FUNDING_WALLET ?? parsedEnv.STELLAR_PAYOUT_ADMIN_PUBLIC_KEY,
  };
}
