import { and, eq } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { reviewDecisions } from '../../db/schema/submissions.js';
import { taskEvents, tasks } from '../../db/schema/tasks.js';
import { withUpdatedAt } from '../../db/withUpdatedAt.js';
import { isTaskPendingReview } from '../../lib/taskStateMachine.js';

type RejectTaskFailure =
  | { kind: 'not_found' }
  | { kind: 'forbidden' }
  | { kind: 'not_pending_review'; status: string }
  | { kind: 'review_conflict' };

type RejectTaskSuccess = {
  kind: 'rejected';
  task: typeof tasks.$inferSelect;
  reviewDecision: typeof reviewDecisions.$inferSelect;
};

export type RejectTaskResult = RejectTaskSuccess | RejectTaskFailure;

export async function rejectTask(
  db: DatabaseClient['db'],
  taskId: string,
  reviewerUserId: string,
  reason: string,
): Promise<RejectTaskResult> {
  const existingTask = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });

  if (!existingTask) {
    return { kind: 'not_found' };
  }

  if (existingTask.clientId !== reviewerUserId) {
    return { kind: 'forbidden' };
  }

  if (existingTask.workerId === reviewerUserId) {
    return { kind: 'forbidden' };
  }

  if (!isTaskPendingReview(existingTask.status)) {
    return {
      kind: 'not_pending_review',
      status: existingTask.status,
    };
  }

  return db.transaction(async (tx) => {
    const [rejectedTask] = await tx
      .update(tasks)
      .set(
        withUpdatedAt({
          status: 'REJECTED',
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

    if (!rejectedTask) {
      return {
        kind: 'review_conflict' as const,
      };
    }

    const [reviewDecision] = await tx
      .insert(reviewDecisions)
      .values({
        taskId,
        reviewerUserId,
        decision: 'reject',
        reason,
      })
      .returning();

    await tx.insert(taskEvents).values({
      taskId,
      actorUserId: reviewerUserId,
      eventType: 'task_rejected',
      eventData: {
        decision: 'reject',
        reason,
      },
    });

    return {
      kind: 'rejected' as const,
      task: rejectedTask,
      reviewDecision,
    };
  });
}
