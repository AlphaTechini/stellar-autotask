import { desc, eq } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { payouts } from '../../db/schema/payouts.js';
import { reviewDecisions, submissions, verificationReports } from '../../db/schema/submissions.js';
import { isTaskPayable } from '../../lib/taskStateMachine.js';

export type TaskReviewSnapshot = {
  task: NonNullable<Awaited<ReturnType<DatabaseClient['db']['query']['tasks']['findFirst']>>>;
  submission: typeof submissions.$inferSelect | null;
  verificationReport: typeof verificationReports.$inferSelect | null;
  latestReviewDecision: (typeof reviewDecisions.$inferSelect & {
    reviewer: {
      id: string;
      username: string;
      role: 'client' | 'worker' | 'agent' | 'admin';
      stellarWalletAddress: string;
    } | null;
  }) | null;
  payoutStatus: {
    taskId: string;
    taskStatus: string;
    isPayoutEligible: boolean;
    hasConfirmedFunding: boolean;
    payout: typeof payouts.$inferSelect | null;
  };
};

export async function getTaskReviewSnapshot(
  db: DatabaseClient['db'],
  taskId: string,
): Promise<TaskReviewSnapshot | null> {
  const task = await db.query.tasks.findFirst({
    where: (task, operators) => eq(task.id, taskId),
  });

  if (!task) {
    return null;
  }

  const [submission, verificationReport, latestReviewDecision, confirmedFunding, payout] =
    await Promise.all([
      task.activeSubmissionId
        ? db.query.submissions.findFirst({
            where: eq(submissions.id, task.activeSubmissionId),
          })
        : Promise.resolve(null),
      task.activeSubmissionId
        ? db.query.verificationReports.findFirst({
            where: eq(verificationReports.submissionId, task.activeSubmissionId),
          })
        : Promise.resolve(null),
      db.query.reviewDecisions.findFirst({
        where: eq(reviewDecisions.taskId, taskId),
        with: {
          reviewer: true,
        },
        orderBy: [desc(reviewDecisions.createdAt)],
      }),
      db.query.taskFundings.findFirst({
        where: (funding, operators) =>
          operators.and(eq(funding.taskId, taskId), eq(funding.status, 'confirmed')),
      }),
      db.query.payouts.findFirst({
        where: eq(payouts.taskId, taskId),
      }),
    ]);

  return {
    task,
    submission: submission ?? null,
    verificationReport: verificationReport ?? null,
    latestReviewDecision: latestReviewDecision
      ? {
          ...latestReviewDecision,
          reviewer: latestReviewDecision.reviewer
            ? {
                id: latestReviewDecision.reviewer.id,
                username: latestReviewDecision.reviewer.username,
                role: latestReviewDecision.reviewer.role,
                stellarWalletAddress: latestReviewDecision.reviewer.stellarWalletAddress,
              }
            : null,
        }
      : null,
    payoutStatus: {
      taskId: task.id,
      taskStatus: task.status,
      isPayoutEligible: isTaskPayable(task.status),
      hasConfirmedFunding: confirmedFunding !== null,
      payout: payout ?? null,
    },
  };
}
