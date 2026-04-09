import { z } from 'zod';

const payoutAmountPattern = /^\d+(\.\d{1,7})?$/;

export const createTaskRequestSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  brief: z.string().trim().min(1).max(100),
  requiredKeywords: z.array(z.string().trim()).default([]),
  targetAudience: z.string().trim().min(1),
  tone: z.string().trim().min(1),
  minWordCount: z.number().int().min(0),
  payoutAmount: z.string().trim().regex(payoutAmountPattern),
  currencyAsset: z.literal('XLM'),
  reviewWindowHours: z.number().int().positive(),
  allowedClaimantType: z.enum(['human', 'agent', 'both']).default('both'),
});

export const listTasksQuerySchema = z.object({
  status: z
    .enum([
      'DRAFT',
      'OPEN',
      'CLAIMED',
      'SUBMITTED',
      'PENDING_REVIEW',
      'APPROVED',
      'AUTO_APPROVED',
      'REJECTED',
      'PAID',
    ])
    .optional(),
  clientId: z.string().uuid().optional(),
  workerId: z.string().uuid().optional(),
});

export const taskParamsSchema = z.object({
  id: z.string().uuid(),
});
