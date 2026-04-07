import { relations } from 'drizzle-orm';
import { payouts } from './payouts.js';
import { reviewDecisions, submissions, verificationReports } from './submissions.js';
import { taskEvents, taskFundings, tasks } from './tasks.js';
import { agentCredentials, users } from './users.js';

export const usersRelations = relations(users, ({ many }) => ({
  agentCredentials: many(agentCredentials),
  createdTasks: many(tasks, { relationName: 'task_client' }),
  claimedTasks: many(tasks, { relationName: 'task_worker' }),
  submittedTasks: many(submissions),
  reviewDecisions: many(reviewDecisions),
  taskEvents: many(taskEvents),
  taskFundings: many(taskFundings),
}));

export const agentCredentialsRelations = relations(agentCredentials, ({ one }) => ({
  user: one(users, {
    fields: [agentCredentials.userId],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  client: one(users, {
    fields: [tasks.clientId],
    references: [users.id],
    relationName: 'task_client',
  }),
  worker: one(users, {
    fields: [tasks.workerId],
    references: [users.id],
    relationName: 'task_worker',
  }),
  activeSubmission: one(submissions, {
    fields: [tasks.activeSubmissionId],
    references: [submissions.id],
    relationName: 'task_active_submission',
  }),
  fundings: many(taskFundings),
  submissions: many(submissions),
  verificationReports: many(verificationReports),
  reviewDecisions: many(reviewDecisions),
  payouts: many(payouts),
  events: many(taskEvents),
}));

export const taskFundingsRelations = relations(taskFundings, ({ one }) => ({
  task: one(tasks, {
    fields: [taskFundings.taskId],
    references: [tasks.id],
  }),
  funder: one(users, {
    fields: [taskFundings.funderUserId],
    references: [users.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  task: one(tasks, {
    fields: [submissions.taskId],
    references: [tasks.id],
  }),
  activeForTask: one(tasks, {
    fields: [submissions.id],
    references: [tasks.activeSubmissionId],
    relationName: 'task_active_submission',
  }),
  worker: one(users, {
    fields: [submissions.workerId],
    references: [users.id],
  }),
  verificationReports: many(verificationReports),
}));

export const verificationReportsRelations = relations(verificationReports, ({ one }) => ({
  task: one(tasks, {
    fields: [verificationReports.taskId],
    references: [tasks.id],
  }),
  submission: one(submissions, {
    fields: [verificationReports.submissionId],
    references: [submissions.id],
  }),
}));

export const reviewDecisionsRelations = relations(reviewDecisions, ({ one }) => ({
  task: one(tasks, {
    fields: [reviewDecisions.taskId],
    references: [tasks.id],
  }),
  reviewer: one(users, {
    fields: [reviewDecisions.reviewerUserId],
    references: [users.id],
  }),
}));

export const payoutsRelations = relations(payouts, ({ one }) => ({
  task: one(tasks, {
    fields: [payouts.taskId],
    references: [tasks.id],
  }),
}));

export const taskEventsRelations = relations(taskEvents, ({ one }) => ({
  task: one(tasks, {
    fields: [taskEvents.taskId],
    references: [tasks.id],
  }),
  actor: one(users, {
    fields: [taskEvents.actorUserId],
    references: [users.id],
  }),
}));
