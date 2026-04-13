import { and, desc, eq, inArray } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { payouts } from '../../db/schema/payouts.js';
import { reviewDecisions, submissions, verificationReports } from '../../db/schema/submissions.js';
import { taskFundings, tasks } from '../../db/schema/tasks.js';
import { users } from '../../db/schema/users.js';
import { isTaskPayable } from '../../lib/taskStateMachine.js';

export const CLAIMED_TASK_STATUSES = [
  'CLAIMED',
  'SUBMITTED',
  'PENDING_REVIEW',
  'APPROVED',
] as const;

export type ClaimedTaskStatus = (typeof CLAIMED_TASK_STATUSES)[number];

type ReviewDecisionWithReviewer = typeof reviewDecisions.$inferSelect & {
  reviewer: typeof users.$inferSelect | null;
};

export async function listClaimedTaskSnapshots(
  db: DatabaseClient['db'],
  statuses: ClaimedTaskStatus[],
) {
  const taskRows = await db.query.tasks.findMany({
    where: (task, operators) => operators.inArray(task.status, statuses),
    orderBy: [desc(tasks.updatedAt)],
  });

  if (taskRows.length === 0) {
    return [];
  }

  const taskIds = taskRows.map((task) => task.id);
  const submissionIds = taskRows
    .map((task) => task.activeSubmissionId)
    .filter((id): id is string => Boolean(id));
  const workerIds = taskRows
    .map((task) => task.workerId)
    .filter((id): id is string => Boolean(id));

  const [
    submissionRows,
    verificationRows,
    reviewDecisionRows,
    fundingRows,
    payoutRows,
    workerRows,
  ] = await Promise.all([
    submissionIds.length
      ? db.query.submissions.findMany({
          where: inArray(submissions.id, submissionIds),
        })
      : Promise.resolve([]),
    submissionIds.length
      ? db.query.verificationReports.findMany({
          where: inArray(verificationReports.submissionId, submissionIds),
        })
      : Promise.resolve([]),
    db.query.reviewDecisions.findMany({
      where: inArray(reviewDecisions.taskId, taskIds),
      with: {
        reviewer: true,
      },
      orderBy: [desc(reviewDecisions.createdAt)],
    }) as Promise<ReviewDecisionWithReviewer[]>,
    db.query.taskFundings.findMany({
      where: (funding, operators) =>
        operators.and(inArray(funding.taskId, taskIds), eq(funding.status, 'confirmed')),
    }),
    db.query.payouts.findMany({
      where: inArray(payouts.taskId, taskIds),
    }),
    workerIds.length
      ? db.query.users.findMany({
          where: inArray(users.id, workerIds),
        })
      : Promise.resolve([]),
  ]);

  const submissionById = new Map(submissionRows.map((row) => [row.id, row]));
  const verificationBySubmissionId = new Map(
    verificationRows.map((row) => [row.submissionId, row]),
  );
  const fundingByTaskId = new Map(fundingRows.map((row) => [row.taskId, row]));
  const payoutByTaskId = new Map(payoutRows.map((row) => [row.taskId, row]));
  const workerById = new Map(workerRows.map((row) => [row.id, row]));

  const reviewDecisionByTaskId = new Map<string, ReviewDecisionWithReviewer>();
  for (const decision of reviewDecisionRows) {
    if (!reviewDecisionByTaskId.has(decision.taskId)) {
      reviewDecisionByTaskId.set(decision.taskId, decision);
    }
  }

  return taskRows.map((task) => {
    const submission = task.activeSubmissionId
      ? submissionById.get(task.activeSubmissionId) ?? null
      : null;
    const verificationReport = task.activeSubmissionId
      ? verificationBySubmissionId.get(task.activeSubmissionId) ?? null
      : null;
    const latestReviewDecision = reviewDecisionByTaskId.get(task.id);
    const confirmedFunding = fundingByTaskId.get(task.id) ?? null;
    const payout = payoutByTaskId.get(task.id) ?? null;
    const worker = task.workerId ? workerById.get(task.workerId) ?? null : null;

    return {
      task,
      submission,
      verificationReport,
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
      funding: confirmedFunding,
      payoutStatus: {
        taskId: task.id,
        taskStatus: task.status,
        isPayoutEligible: isTaskPayable(task.status),
        hasConfirmedFunding: confirmedFunding !== null,
        workerWalletAddress: worker?.stellarWalletAddress ?? null,
        payout,
      },
    };
  });
}
