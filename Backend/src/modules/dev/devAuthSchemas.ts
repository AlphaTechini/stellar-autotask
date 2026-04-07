import { z } from 'zod';

export const devLoginRequestSchema = z.object({
  walletAddress: z
    .string()
    .trim()
    .regex(/^[G][A-Z2-7]{55}$/, 'Wallet address must be a valid Stellar public key.'),
  username: z.string().trim().min(1, 'Username is required.'),
  role: z.enum(['client', 'worker', 'admin', 'agent']).default('client'),
});

