import type { DatabaseClient } from '../../db/client.js';
import { matchesAllowedClaimantType } from '../../lib/claimantType.js';
import { getTaskPayoutStatus } from '../payouts/getTaskPayoutStatus.js';
import { getTaskById } from '../tasks/getTaskById.js';

export async function getAgentTaskStatus(
  db: DatabaseClient['db'],
  taskId: string,
  input: {
    userId: string;
    authType: string;
  },
) {
  const [task, payoutStatus] = await Promise.all([
    getTaskById(db, taskId),
    getTaskPayoutStatus(db, taskId),
  ]);

  if (!task || !payoutStatus) {
    return null;
  }

  const canClaim =
    task.status === 'OPEN' &&
    task.clientId !== input.userId &&
    matchesAllowedClaimantType(task.allowedClaimantType, input.authType);

  return {
    task,
    payoutStatus,
    agentEligibility: {
      canClaim,
      allowedClaimantType: task.allowedClaimantType,
      isTaskCreator: task.clientId === input.userId,
      isAssignedWorker: task.workerId === input.userId,
    },
  };
}
