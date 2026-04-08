import { and, eq } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { withUpdatedAt } from '../../db/withUpdatedAt.js';
import { users } from '../../db/schema/users.js';

type UserRecord = typeof users.$inferSelect;

export type UpsertWalletHumanUserInput = {
  walletAddress: string;
  username?: string;
  role?: 'client' | 'worker';
};

export async function upsertWalletHumanUser(
  db: DatabaseClient['db'],
  input: UpsertWalletHumanUserInput,
) {
  const normalizedWalletAddress = input.walletAddress.trim().toUpperCase();
  const normalizedUsername = input.username?.trim();
  const normalizedRole = input.role;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.stellarWalletAddress, normalizedWalletAddress),
  });

  if (!existingUser) {
    if (!normalizedUsername) {
      return {
        kind: 'missing_username' as const,
      };
    }

    if (!normalizedRole) {
      return {
        kind: 'missing_role' as const,
      };
    }

    const [createdUser] = await db
      .insert(users)
      .values({
        username: normalizedUsername,
        role: normalizedRole,
        stellarWalletAddress: normalizedWalletAddress,
        authType: 'wallet_human',
      })
      .returning();

    return {
      kind: 'created' as const,
      user: createdUser,
    };
  }

  if (existingUser.authType !== 'wallet_human') {
    return {
      kind: 'auth_type_conflict' as const,
      user: existingUser,
    };
  }

  if (!normalizedUsername || normalizedUsername === existingUser.username) {
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

export type WalletHumanUserWriteResult =
  | Awaited<ReturnType<typeof upsertWalletHumanUser>>
  | { kind: 'missing_role' }
  | { kind: 'missing_username' }
  | { kind: 'auth_type_conflict'; user: UserRecord };
