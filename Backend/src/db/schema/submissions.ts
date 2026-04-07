import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { verificationRecommendationEnum, reviewDecisionEnum } from './enums.js';
import { tasks } from './tasks.js';
import { users } from './users.js';

export const submissions = pgTable(
  'submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    workerId: uuid('worker_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    contentText: text('content_text').notNull(),
    notes: text('notes'),
    documentUrl: text('document_url'),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('submissions_task_id_idx').on(table.taskId),
    index('submissions_worker_id_idx').on(table.workerId),
    index('submissions_submitted_at_idx').on(table.submittedAt),
    uniqueIndex('submissions_id_task_id_unique').on(table.id, table.taskId),
    foreignKey({
      name: 'submissions_task_worker_claim_fk',
      columns: [table.taskId, table.workerId],
      foreignColumns: [tasks.id, tasks.workerId],
    }),
  ],
);

export const verificationReports = pgTable(
  'verification_reports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => submissions.id, { onDelete: 'cascade' })
      .unique(),
    summary: text('summary').notNull(),
    score: integer('score').notNull(),
    keywordCoverage: jsonb('keyword_coverage').$type<string[]>().notNull(),
    missingRequirements: jsonb('missing_requirements').$type<string[]>().notNull(),
    toneMatch: boolean('tone_match').notNull(),
    audienceFit: boolean('audience_fit').notNull(),
    recommendation: verificationRecommendationEnum('recommendation').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('verification_reports_task_id_idx').on(table.taskId),
  ],
);

export const reviewDecisions = pgTable(
  'review_decisions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    reviewerUserId: uuid('reviewer_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    decision: reviewDecisionEnum('decision').notNull(),
    reason: text('reason'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('review_decisions_task_id_idx').on(table.taskId),
    check(
      'review_decisions_reject_reason_required',
      sql`(${table.decision} <> 'reject') OR length(trim(coalesce(${table.reason}, ''))) > 0`,
    ),
  ],
);
