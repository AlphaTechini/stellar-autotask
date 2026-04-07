import { eq } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { users } from '../../db/schema/users.js';
import { withUpdatedAt } from '../../db/withUpdatedAt.js';

type DevUserRole = 'client' | 'worker' | 'admin' | 'agent';

type UpsertDevAuthUserInput = {
  walletAddress: string;
  username: string;
  role: DevUserRole;
};

function normalizeDevUsername(username: string, role: DevUserRole) {
  const trimmedUsername = username.trim();

  if (role === 'agent' && !trimmedUsername.endsWith('.agents')) {
    return `${trimmedUsername}.agents`;
  }

  return trimmedUsername;
}

function getAuthType(role: DevUserRole) {
  return role === 'agent' ? 'wallet_agent' : 'wallet_human';
}

export async function upsertDevAuthUser(
  db: DatabaseClient['db'],
  input: UpsertDevAuthUserInput,
) {
  const walletAddress = input.walletAddress.trim().toUpperCase();
  const username = normalizeDevUsername(input.username, input.role);
  const authType = getAuthType(input.role);

  const conflictingUsername = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (conflictingUsername && conflictingUsername.stellarWalletAddress !== walletAddress) {
    return {
      kind: 'username_taken' as const,
    };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.stellarWalletAddress, walletAddress),
  });

  if (!existingUser) {
    const [createdUser] = await db
      .insert(users)
      .values({
        username,
        role: input.role,
        stellarWalletAddress: walletAddress,
        authType,
      })
      .returning();

    return {
      kind: 'created' as const,
      user: createdUser,
    };
  }

  const [updatedUser] = await db
    .update(users)
    .set(
      withUpdatedAt({
        username,
        role: input.role,
        authType,
      }),
    )
    .where(eq(users.id, existingUser.id))
    .returning();

  return {
    kind: 'updated' as const,
    user: updatedUser,
  };
}
