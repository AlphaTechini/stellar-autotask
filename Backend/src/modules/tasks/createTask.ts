import { getInitialTaskStatus } from '../../lib/taskStateMachine.js';
import { createTaskRecord } from './taskWriteRepository.js';
import type { DatabaseClient } from '../../db/client.js';

export type CreateTaskInput = {
  clientId: string;
  title: string;
  description: string;
  brief: string;
  requiredKeywords: string[];
  targetAudience: string;
  tone: string;
  minWordCount: number;
  payoutAmount: string;
  currencyAsset: string;
  reviewWindowHours: number;
  allowedClaimantType: 'human' | 'agent' | 'both';
};

function normalizeKeywords(requiredKeywords: string[]) {
  return [...new Set(requiredKeywords.map((keyword) => keyword.trim()).filter(Boolean))];
}

export async function createTask(
  db: DatabaseClient['db'],
  input: CreateTaskInput,
) {
  return createTaskRecord(db, {
    clientId: input.clientId,
    title: input.title.trim(),
    description: input.description.trim(),
    brief: input.brief.trim(),
    requiredKeywords: normalizeKeywords(input.requiredKeywords),
    targetAudience: input.targetAudience.trim(),
    tone: input.tone.trim(),
    minWordCount: input.minWordCount,
    payoutAmount: input.payoutAmount.trim(),
    currencyAsset: input.currencyAsset.trim(),
    reviewWindowHours: input.reviewWindowHours,
    allowedClaimantType: input.allowedClaimantType,
    status: getInitialTaskStatus(),
  });
}
