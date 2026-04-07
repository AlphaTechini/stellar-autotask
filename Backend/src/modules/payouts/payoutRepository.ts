import { and, eq, inArray } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { payouts } from '../../db/schema/payouts.js';
import { taskEvents, taskFundings, tasks } from '../../db/schema/tasks.js';
import { users } from '../../db/schema/users.js';
import { withUpdatedAt } from '../../db/withUpdatedAt.js';
import {
  TASK_APPROVED_STATUS,
  TASK_AUTO_APPROVED_STATUS,
  TASK_PAID_STATUS,
} from '../../lib/taskStateMachine.js';

type TaskRecord = typeof tasks.$inferSelect;
type FundingRecord = typeof taskFundings.$inferSelect;
type WorkerRecord = typeof users.$inferSelect;
type PayoutRecord = typeof payouts.$inferSelect;

export type PayoutExecutionContext = {
  task: TaskRecord;
  confirmedFunding: FundingRecord | null;
  worker: WorkerRecord | null;
  payout: PayoutRecord | null;
};

type ConfirmedPayoutInput = {
  taskId: string;
  amount: string;
  assetCode: string;
  workerWalletAddress: string;
  txHash: string | null;
  triggeredBy: typeof payouts.$inferInsert.triggeredBy;
  actorUserId?: string | null;
  reconciledFromContract: boolean;
};

export async function findPayoutExecutionContext(
  db: DatabaseClient['db'],
  taskId: string,
): Promise<PayoutExecutionContext | null> {
  const [record] = await db
    .select({
      task: tasks,
      confirmedFunding: taskFundings,
      worker: users,
      payout: payouts,
    })
    .from(tasks)
    .leftJoin(
      taskFundings,
      and(eq(taskFundings.taskId, tasks.id), eq(taskFundings.status, 'confirmed')),
    )
    .leftJoin(users, eq(users.id, tasks.workerId))
    .leftJoin(payouts, eq(payouts.taskId, tasks.id))
    .where(eq(tasks.id, taskId))
    .limit(1);

  if (!record) {
    return null;
  }

  return record;
}

export async function recordConfirmedPayout(
  db: DatabaseClient['db'],
  input: ConfirmedPayoutInput,
) {
  return db.transaction(async (tx) => {
    const existingPayout = await tx.query.payouts.findFirst({
      where: eq(payouts.taskId, input.taskId),
    });

    const payoutRecord =
      existingPayout &&
      existingPayout.status === 'confirmed' &&
      existingPayout.workerWalletAddress === input.workerWalletAddress &&
      existingPayout.amount === input.amount
        ? existingPayout
        : existingPayout
          ? (
              await tx
                .update(payouts)
                .set({
                  amount: input.amount,
                  assetCode: input.assetCode,
                  workerWalletAddress: input.workerWalletAddress,
                  txHash: input.txHash,
                  status: 'confirmed',
                  triggeredBy: input.triggeredBy,
                  paidAt: new Date(),
                })
                .where(eq(payouts.id, existingPayout.id))
                .returning()
            )[0]
          : (
              await tx
                .insert(payouts)
                .values({
                  taskId: input.taskId,
                  amount: input.amount,
                  assetCode: input.assetCode,
                  workerWalletAddress: input.workerWalletAddress,
                  txHash: input.txHash,
                  status: 'confirmed',
                  triggeredBy: input.triggeredBy,
                  paidAt: new Date(),
                })
                .returning()
            )[0];

    const [paidTask] = await tx
      .update(tasks)
      .set(
        withUpdatedAt({
          status: TASK_PAID_STATUS,
        }),
      )
      .where(
        and(
          eq(tasks.id, input.taskId),
          inArray(tasks.status, [
            TASK_APPROVED_STATUS,
            TASK_AUTO_APPROVED_STATUS,
            TASK_PAID_STATUS,
          ]),
        ),
      )
      .returning();

    if (!paidTask || paidTask.status !== TASK_PAID_STATUS) {
      throw new Error('Task could not be finalized as paid after payout confirmation.');
    }

    await tx.insert(taskEvents).values({
      taskId: input.taskId,
      actorUserId: input.actorUserId ?? null,
      eventType: 'payout_sent',
      eventData: {
        txHash: input.txHash,
        triggeredBy: input.triggeredBy,
        reconciledFromContract: input.reconciledFromContract,
      },
    });

    return {
      task: paidTask,
      payout: payoutRecord,
    };
  });
}
