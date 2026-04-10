import crypto from 'node:crypto';
import type { DatabaseClient } from '../../db/client.js';
import { agentCredentials } from '../../db/schema/users.js';
import { hashAgentToken } from './hashAgentToken.js';

type CreateAgentCredentialInput = {
  userId: string;
  label: string;
};

export async function createAgentCredential(
  db: DatabaseClient['db'],
  input: CreateAgentCredentialInput,
) {
  const rawToken = `sta_agent_${crypto.randomBytes(32).toString('base64url')}`;

  const [credential] = await db
    .insert(agentCredentials)
    .values({
      userId: input.userId,
      label: input.label.trim(),
      tokenHash: hashAgentToken(rawToken),
    })
    .returning();

  return {
    rawToken,
    credential,
  };
}
