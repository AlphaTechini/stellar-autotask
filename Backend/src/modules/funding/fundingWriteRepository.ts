import { and, eq, isNull } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { withUpdatedAt } from '../../db/withUpdatedAt.js';
import { taskFundings, tasks } from '../../db/schema/tasks.js';
import { TASK_CLAIMABLE_STATUS, TASK_FUNDABLE_STATUS } from '../../lib/taskStateMachine.js';

type ConfirmFundingRecordInput = {
  taskId: string;
  funderUserId: string;
  fromWalletAddress: string;
  toWalletAddress: string;
  amount: string;
  assetCode: string;
  txHash: string;
};

export async function confirmFundingForTask(
  db: DatabaseClient['db'],
  input: ConfirmFundingRecordInput,
) {
  return db.transaction(async (tx) => {
    const [openedTask] = await tx
      .update(tasks)
      .set(
        withUpdatedAt({
          status: TASK_CLAIMABLE_STATUS,
        }),
      )
      .where(
        and(
          eq(tasks.id, input.taskId),
          eq(tasks.status, TASK_FUNDABLE_STATUS),
          isNull(tasks.workerId),
        ),
      )
      .returning();

    if (!openedTask) {
      return null;
    }

    const [fundingRecord] = await tx
      .insert(taskFundings)
      .values({
        taskId: input.taskId,
        funderUserId: input.funderUserId,
        fromWalletAddress: input.fromWalletAddress,
        toWalletAddress: input.toWalletAddress,
        amount: input.amount,
        assetCode: input.assetCode,
        txHash: input.txHash,
        status: 'confirmed',
        fundedAt: new Date(),
      })
      .returning();

    return {
      task: openedTask,
      funding: fundingRecord,
    };
  });
}
