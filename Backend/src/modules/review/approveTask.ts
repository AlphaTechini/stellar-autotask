import { and, eq } from 'drizzle-orm';
import type { AppEnv } from '../../config/env.js';
import type { DatabaseClient } from '../../db/client.js';
import { reviewDecisions } from '../../db/schema/submissions.js';
import { taskEvents, tasks } from '../../db/schema/tasks.js';
import { withUpdatedAt } from '../../db/withUpdatedAt.js';
import { isTaskPendingReview, TASK_APPROVED_STATUS } from '../../lib/taskStateMachine.js';
import { executeTaskPayout } from '../payouts/stellarPayoutService.js';

type ApproveTaskFailure =
  | { kind: 'not_found' }
  | { kind: 'forbidden' }
  | { kind: 'not_pending_review'; status: string }
  | { kind: 'review_conflict' }
  | { kind: 'missing_funding'; task: typeof tasks.$inferSelect }
  | { kind: 'missing_worker_wallet'; task: typeof tasks.$inferSelect }
  | { kind: 'on_chain_mismatch'; message: string; task: typeof tasks.$inferSelect }
  | { kind: 'payout_failed'; message: string; task: typeof tasks.$inferSelect };

type ApproveTaskSuccess = {
  kind: 'approved_and_paid' | 'approved_and_reconciled';
  task: typeof tasks.$inferSelect;
  payout: {
    id: string;
    taskId: string;
    amount: string;
    assetCode: string;
    workerWalletAddress: string;
    txHash: string | null;
    status: 'pending' | 'confirmed' | 'failed';
    triggeredBy: 'client' | 'system' | 'agent';
    paidAt: Date | null;
    createdAt: Date;
  };
};

export type ApproveTaskResult = ApproveTaskSuccess | ApproveTaskFailure;

export async function approveTask(
  db: DatabaseClient['db'],
  env: AppEnv,
  taskId: string,
  reviewerUserId: string,
  triggeredBy: 'client' | 'agent',
): Promise<ApproveTaskResult> {
  const approvalState = await markTaskApproved(db, taskId, reviewerUserId);

  if (approvalState.kind !== 'approved') {
    return approvalState;
  }

  const payoutResult = await executeTaskPayout(db, env, {
    taskId,
    triggeredBy,
    actorUserId: reviewerUserId,
  });

  if (payoutResult.kind === 'paid') {
    return {
      kind: 'approved_and_paid',
      task: payoutResult.task,
      payout: payoutResult.payout,
    };
  }

  if (payoutResult.kind === 'reconciled_on_chain' || payoutResult.kind === 'already_paid') {
    return {
      kind: 'approved_and_reconciled',
      task: payoutResult.task,
      payout: payoutResult.payout,
    };
  }

  if (payoutResult.kind === 'missing_funding') {
    return {
      kind: 'missing_funding',
      task: approvalState.task,
    };
  }

  if (payoutResult.kind === 'missing_worker_wallet') {
    return {
      kind: 'missing_worker_wallet',
      task: approvalState.task,
    };
  }

  if (payoutResult.kind === 'on_chain_mismatch') {
    return {
      kind: 'on_chain_mismatch',
      message: payoutResult.message,
      task: approvalState.task,
    };
  }

  if (payoutResult.kind === 'payout_failed') {
    return {
      kind: 'payout_failed',
      message: payoutResult.message,
      task: approvalState.task,
    };
  }

  return {
    kind: 'payout_failed',
    message: 'Task approval completed, but payout could not be finalized.',
    task: approvalState.task,
  };
}

async function markTaskApproved(
  db: DatabaseClient['db'],
  taskId: string,
  reviewerUserId: string,
) {
  const existingTask = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });

  if (!existingTask) {
    return { kind: 'not_found' as const };
  }

  if (existingTask.clientId !== reviewerUserId) {
    return { kind: 'forbidden' as const };
  }

  if (existingTask.workerId === reviewerUserId) {
    return { kind: 'forbidden' as const };
  }

  if (!isTaskPendingReview(existingTask.status)) {
    return {
      kind: 'not_pending_review' as const,
      status: existingTask.status,
    };
  }

  return db.transaction(async (tx) => {
    const [approvedTask] = await tx
      .update(tasks)
      .set(
        withUpdatedAt({
          status: TASK_APPROVED_STATUS,
        }),
      )
      .where(
        and(
          eq(tasks.id, taskId),
          eq(tasks.clientId, reviewerUserId),
          eq(tasks.status, 'PENDING_REVIEW'),
        ),
      )
      .returning();

    if (!approvedTask) {
      return {
        kind: 'review_conflict' as const,
      };
    }

    await tx.insert(reviewDecisions).values({
      taskId,
      reviewerUserId,
      decision: 'approve',
      reason: null,
    });

    await tx.insert(taskEvents).values({
      taskId,
      actorUserId: reviewerUserId,
      eventType: 'task_approved',
      eventData: {
        decision: 'approve',
      },
    });

    return {
      kind: 'approved' as const,
      task: approvedTask,
    };
  });
}
