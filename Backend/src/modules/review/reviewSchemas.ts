import { z } from 'zod';

export const reviewTaskParamsSchema = z.object({
  id: z.string().uuid(),
});

export const rejectTaskRequestSchema = z.object({
  reason: z.string().trim().min(1).max(2000),
});
