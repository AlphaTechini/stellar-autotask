import type { DatabaseClient } from '../../db/client.js';
import { tasks } from '../../db/schema/tasks.js';

export type CreateTaskRecordInput = {
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
  status: 'DRAFT';
};

export async function createTaskRecord(
  db: DatabaseClient['db'],
  input: CreateTaskRecordInput,
) {
  const [createdTask] = await db
    .insert(tasks)
    .values({
      clientId: input.clientId,
      title: input.title,
      description: input.description,
      brief: input.brief,
      requiredKeywords: input.requiredKeywords,
      targetAudience: input.targetAudience,
      tone: input.tone,
      minWordCount: input.minWordCount,
      payoutAmount: input.payoutAmount,
      currencyAsset: input.currencyAsset,
      status: input.status,
      reviewWindowHours: input.reviewWindowHours,
      allowedClaimantType: input.allowedClaimantType,
    })
    .returning();

  return createdTask;
}
