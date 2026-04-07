import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { allowedClaimantTypeEnum, fundingStatusEnum, taskStatusEnum } from './enums.js';
import { users } from './users.js';

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    clientId: uuid('client_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    workerId: uuid('worker_id').references(() => users.id, { onDelete: 'restrict' }),
    activeSubmissionId: uuid('active_submission_id'),
    title: text('title').notNull(),
    description: text('description').notNull(),
    brief: varchar('brief', { length: 100 }).notNull(),
    requiredKeywords: text('required_keywords').array().notNull().default(sql`ARRAY[]::text[]`),
    targetAudience: text('target_audience').notNull(),
    tone: text('tone').notNull(),
    minWordCount: integer('min_word_count').notNull(),
    payoutAmount: numeric('payout_amount', { precision: 18, scale: 7 }).notNull(),
    currencyAsset: text('currency_asset').notNull(),
    status: taskStatusEnum('status').notNull().default('DRAFT'),
    reviewWindowHours: integer('review_window_hours').notNull(),
    reviewDeadline: timestamp('review_deadline', { withTimezone: true }),
    allowedClaimantType: allowedClaimantTypeEnum('allowed_claimant_type')
      .notNull()
      .default('both'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('tasks_client_id_idx').on(table.clientId),
    index('tasks_worker_id_idx').on(table.workerId),
    index('tasks_active_submission_id_idx').on(table.activeSubmissionId),
    index('tasks_status_idx').on(table.status),
    uniqueIndex('tasks_id_worker_id_unique').on(table.id, table.workerId),
    check('tasks_title_not_blank', sql`length(trim(${table.title})) > 0`),
    check('tasks_description_not_blank', sql`length(trim(${table.description})) > 0`),
    check('tasks_brief_not_blank', sql`length(trim(${table.brief})) > 0`),
    check('tasks_min_word_count_non_negative', sql`${table.minWordCount} >= 0`),
    check('tasks_payout_amount_positive', sql`${table.payoutAmount} > 0`),
    check('tasks_review_window_hours_positive', sql`${table.reviewWindowHours} > 0`),
  ],
);

export const taskFundings = pgTable(
  'task_fundings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    funderUserId: uuid('funder_user_id').references(() => users.id, { onDelete: 'set null' }),
    fromWalletAddress: text('from_wallet_address').notNull(),
    toWalletAddress: text('to_wallet_address').notNull(),
    amount: numeric('amount', { precision: 18, scale: 7 }).notNull(),
    assetCode: text('asset_code').notNull(),
    txHash: text('tx_hash').notNull(),
    status: fundingStatusEnum('status').notNull(),
    fundedAt: timestamp('funded_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('task_fundings_task_id_idx').on(table.taskId),
    uniqueIndex('task_fundings_tx_hash_unique').on(table.txHash),
    uniqueIndex('task_fundings_one_confirmed_per_task').on(table.taskId).where(
      sql`${table.status} = 'confirmed'`,
    ),
    check(
      'task_fundings_from_wallet_address_format',
      sql`${table.fromWalletAddress} ~ '^[G][A-Z2-7]{55}$'`,
    ),
    check(
      'task_fundings_to_wallet_address_format',
      sql`${table.toWalletAddress} ~ '^[G][A-Z2-7]{55}$'`,
    ),
    check(
      'task_fundings_tx_hash_format',
      sql`${table.txHash} ~ '^[A-Fa-f0-9]{64}$'`,
    ),
    check('task_fundings_amount_positive', sql`${table.amount} > 0`),
  ],
);

export const taskEvents = pgTable(
  'task_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    eventType: text('event_type').notNull(),
    eventData: jsonb('event_data').$type<Record<string, unknown> | null>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('task_events_task_id_idx').on(table.taskId),
    index('task_events_event_type_idx').on(table.eventType),
  ],
);
