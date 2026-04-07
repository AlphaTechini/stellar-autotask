import { createHash } from 'node:crypto';

export function taskIdToContractKey(taskId: string) {
  const normalizedTaskId = taskId.trim();

  if (!normalizedTaskId) {
    throw new Error('Task id is required to derive the contract payout key.');
  }

  return createHash('sha256').update(normalizedTaskId, 'utf8').digest();
}
