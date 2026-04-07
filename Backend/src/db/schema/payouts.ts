import { sql } from 'drizzle-orm';
import {
  check,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { payoutStatusEnum, payoutTriggeredByEnum } from './enums.js';
import { tasks } from './tasks.js';

export const payouts = pgTable(
  'payouts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    amount: numeric('amount', { precision: 18, scale: 7 }).notNull(),
    assetCode: text('asset_code').notNull(),
    workerWalletAddress: text('worker_wallet_address').notNull(),
    txHash: text('tx_hash'),
    status: payoutStatusEnum('status').notNull().default('pending'),
    triggeredBy: payoutTriggeredByEnum('triggered_by').notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('payouts_task_id_idx').on(table.taskId),
    uniqueIndex('payouts_task_id_unique').on(table.taskId),
    uniqueIndex('payouts_tx_hash_unique').on(table.txHash).where(sql`${table.txHash} IS NOT NULL`),
    check(
      'payouts_worker_wallet_address_format',
      sql`${table.workerWalletAddress} ~ '^[G][A-Z2-7]{55}$'`,
    ),
    check(
      'payouts_tx_hash_format',
      sql`${table.txHash} IS NULL OR ${table.txHash} ~ '^[A-Fa-f0-9]{64}$'`,
    ),
    check('payouts_amount_positive', sql`${table.amount} > 0`),
  ],
);
