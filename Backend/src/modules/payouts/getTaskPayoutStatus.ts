import type { DatabaseClient } from '../../db/client.js';
import { isTaskPayable } from '../../lib/taskStateMachine.js';
import { findPayoutExecutionContext } from './payoutRepository.js';

export async function getTaskPayoutStatus(
  db: DatabaseClient['db'],
  taskId: string,
) {
  const context = await findPayoutExecutionContext(db, taskId);

  if (!context) {
    return null;
  }

  return {
    taskId: context.task.id,
    taskStatus: context.task.status,
    isPayoutEligible: isTaskPayable(context.task.status),
    hasConfirmedFunding: context.confirmedFunding !== null,
    workerWalletAddress: context.worker?.stellarWalletAddress ?? null,
    payout: context.payout,
  };
}
