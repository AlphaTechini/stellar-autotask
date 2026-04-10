import { and, eq } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { withUpdatedAt } from '../../db/withUpdatedAt.js';
import { users } from '../../db/schema/users.js';

type UserRecord = typeof users.$inferSelect;

type UpsertWalletAgentUserInput = {
  walletAddress: string;
  username: string;
};

function normalizeAgentUsername(username: string) {
  const trimmedUsername = username.trim();

  if (trimmedUsername.endsWith('.agents')) {
    return trimmedUsername;
  }

  return `${trimmedUsername}.agents`;
}

export async function upsertWalletAgentUser(
  db: DatabaseClient['db'],
  input: UpsertWalletAgentUserInput,
) {
  const normalizedWalletAddress = input.walletAddress.trim().toUpperCase();
  const normalizedUsername = normalizeAgentUsername(input.username);

  const existingUser = await db.query.users.findFirst({
    where: eq(users.stellarWalletAddress, normalizedWalletAddress),
  });

  if (!existingUser) {
    const [createdUser] = await db
      .insert(users)
      .values({
        username: normalizedUsername,
        role: 'agent',
        stellarWalletAddress: normalizedWalletAddress,
        authType: 'wallet_agent',
      })
      .returning();

    return {
      kind: 'created' as const,
      user: createdUser,
    };
  }

  if (existingUser.authType !== 'wallet_agent' || existingUser.role !== 'agent') {
    return {
      kind: 'auth_type_conflict' as const,
      user: existingUser,
    };
  }

  if (existingUser.username === normalizedUsername) {
    return {
      kind: 'unchanged' as const,
      user: existingUser,
    };
  }

  const [updatedUser] = await db
    .update(users)
    .set(
      withUpdatedAt({
        username: normalizedUsername,
      }),
    )
    .where(
      and(
        eq(users.id, existingUser.id),
        eq(users.stellarWalletAddress, normalizedWalletAddress),
      ),
    )
    .returning();

  return {
    kind: 'updated' as const,
    user: updatedUser,
  };
}

export type WalletAgentUserWriteResult =
  | Awaited<ReturnType<typeof upsertWalletAgentUser>>
  | { kind: 'auth_type_conflict'; user: UserRecord };
