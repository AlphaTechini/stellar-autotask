import { sql } from 'drizzle-orm';
import {
  check,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { authTypeEnum, userRoleEnum } from './enums.js';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').notNull(),
    role: userRoleEnum('role').notNull(),
    stellarWalletAddress: text('stellar_wallet_address').notNull(),
    authType: authTypeEnum('auth_type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('users_username_unique').on(table.username),
    uniqueIndex('users_wallet_address_unique').on(table.stellarWalletAddress),
    check(
      'users_username_not_blank',
      sql`length(trim(${table.username})) > 0`,
    ),
    check(
      'users_wallet_address_format',
      sql`${table.stellarWalletAddress} ~ '^[G][A-Z2-7]{55}$'`,
    ),
    check(
      'users_auth_type_role_match',
      sql`((${table.authType} = 'wallet_agent') AND (${table.role} = 'agent'))
          OR ((${table.authType} = 'wallet_human') AND (${table.role} <> 'agent'))`,
    ),
    check(
      'users_agent_username_suffix_check',
      sql`(${table.role} <> 'agent') OR (${table.username} LIKE '%.agents')`,
    ),
  ],
);

export const agentCredentials = pgTable(
  'agent_credentials',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    tokenHash: text('token_hash').notNull(),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('agent_credentials_token_hash_unique').on(table.tokenHash),
  ],
);
