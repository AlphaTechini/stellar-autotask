import { config as loadDotenv } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const projectEnvPath = resolve(currentDir, '..', '.env');

loadDotenv({ path: projectEnvPath });

const envSchema = z.object({
  BACKEND_BASE_URL: z.string().url(),
  AGENT_TOKEN: z.string().trim().min(1).optional(),
  AGENT_WALLET_SECRET_KEY: z.string().trim().min(1).optional(),
  AGENT_USERNAME: z.string().trim().min(3).max(32).optional(),
  AGENT_CREDENTIAL_LABEL: z.string().trim().min(1).max(80).default('default'),
  SPONSORED_AGENT_ACCOUNT_URL: z.string().url().optional(),
  MCP_SERVER_NAME: z.string().trim().min(1).default('stellar-autotask-mcp'),
  MCP_SERVER_VERSION: z.string().trim().min(1).default('0.1.0'),
});

export type McpEnv = z.infer<typeof envSchema>;

export function loadEnv(rawEnv: NodeJS.ProcessEnv = process.env): McpEnv {
  return envSchema.parse(rawEnv);
}
