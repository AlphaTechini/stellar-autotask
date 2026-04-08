import { z } from 'zod';

export const walletChallengeRequestSchema = z.object({
  walletAddress: z.string().trim().min(1),
});

export const walletVerifyRequestSchema = z.object({
  transactionXdr: z.string().trim().min(1),
  username: z.string().trim().min(3).max(32).optional(),
  role: z.enum(['client', 'worker']).optional(),
});
