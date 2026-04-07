import type { DatabaseClient } from '../../db/client.js';
import { isTaskClaimable } from '../../lib/taskStateMachine.js';
import { findTaskRecordById } from '../tasks/taskReadRepository.js';
import { claimOpenTaskRecord } from './claimTaskRepository.js';

type ClaimTaskSuccess = {
  kind: 'claimed' | 'already_claimed_by_requester';
  task: Awaited<ReturnType<typeof findTaskRecordById>>;
};

type ClaimTaskFailure =
  | { kind: 'not_found' }
  | { kind: 'self_claim_forbidden' }
  | { kind: 'not_claimable'; reason: 'status' | 'claimed' }
  | { kind: 'claim_conflict' };

export type ClaimTaskResult = ClaimTaskSuccess | ClaimTaskFailure;

export async function claimTask(
  db: DatabaseClient['db'],
  taskId: string,
  claimantUserId: string,
): Promise<ClaimTaskResult> {
  const existingTask = await findTaskRecordById(db, taskId);

  if (!existingTask) {
    return {
      kind: 'not_found',
    };
  }

  if (existingTask.clientId === claimantUserId) {
    return {
      kind: 'self_claim_forbidden',
    };
  }

  if (existingTask.workerId === claimantUserId && existingTask.status === 'CLAIMED') {
    return {
      kind: 'already_claimed_by_requester',
      task: existingTask,
    };
  }

  if (!isTaskClaimable(existingTask.status)) {
    return {
      kind: 'not_claimable',
      reason: existingTask.workerId ? 'claimed' : 'status',
    };
  }

  if (existingTask.workerId) {
    return {
      kind: 'not_claimable',
      reason: 'claimed',
    };
  }

  const claimedTask = await claimOpenTaskRecord(db, taskId, claimantUserId);

  if (claimedTask) {
    return {
      kind: 'claimed',
      task: claimedTask,
    };
  }

  return {
    kind: 'claim_conflict',
  };
}
