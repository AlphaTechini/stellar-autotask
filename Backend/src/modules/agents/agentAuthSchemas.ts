import { z } from 'zod';
import { createTaskRequestSchema } from '../tasks/taskSchemas.js';
import { fundTaskParamsSchema, fundTaskRequestSchema } from '../funding/fundingSchemas.js';
import { submitTaskParamsSchema, submitTaskRequestSchema } from '../submissions/submissionSchemas.js';

export const agentWalletChallengeRequestSchema = z.object({
  walletAddress: z.string().trim().min(1),
});

export const agentWalletVerifyRequestSchema = z.object({
  transactionXdr: z.string().trim().min(1),
  username: z.string().trim().min(3).max(32),
  credentialLabel: z.string().trim().min(1).max(80).default('default'),
});

export const agentTaskStatusParamsSchema = z.object({
  id: z.string().uuid(),
});

export const agentCreateTaskRequestSchema = createTaskRequestSchema;
export const agentFundTaskParamsSchema = fundTaskParamsSchema;
export const agentFundTaskRequestSchema = fundTaskRequestSchema;
export const agentSubmitTaskParamsSchema = submitTaskParamsSchema;
export const agentSubmitTaskRequestSchema = submitTaskRequestSchema;
