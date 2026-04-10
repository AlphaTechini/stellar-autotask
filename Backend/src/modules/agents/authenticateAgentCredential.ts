import { and, eq, isNull } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { agentCredentials } from '../../db/schema/users.js';
import { hashAgentToken } from './hashAgentToken.js';

export async function authenticateAgentCredential(
  db: DatabaseClient['db'],
  rawToken: string,
) {
  const tokenHash = hashAgentToken(rawToken.trim());
  const credential = await db.query.agentCredentials.findFirst({
    where: and(
      eq(agentCredentials.tokenHash, tokenHash),
      isNull(agentCredentials.revokedAt),
    ),
    with: {
      user: true,
    },
  });

  if (!credential?.user || credential.user.authType !== 'wallet_agent' || credential.user.role !== 'agent') {
    return null;
  }

  await db
    .update(agentCredentials)
    .set({
      lastUsedAt: new Date(),
    })
    .where(eq(agentCredentials.id, credential.id));

  return {
    credential,
    user: credential.user,
  };
}
