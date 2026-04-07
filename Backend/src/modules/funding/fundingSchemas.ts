import { z } from 'zod';

const payoutAmountPattern = /^\d+(\.\d{1,7})?$/;
const walletAddressPattern = /^G[A-Z2-7]{55}$/;
const txHashPattern = /^[A-Fa-f0-9]{64}$/;

export const fundTaskParamsSchema = z.object({
  id: z.string().uuid(),
});

export const fundTaskRequestSchema = z.object({
  amount: z.string().trim().regex(payoutAmountPattern),
  assetCode: z.string().trim().min(1),
  txHash: z.string().trim().regex(txHashPattern),
  fromWalletAddress: z.string().trim().regex(walletAddressPattern),
  toWalletAddress: z.string().trim().regex(walletAddressPattern),
});
