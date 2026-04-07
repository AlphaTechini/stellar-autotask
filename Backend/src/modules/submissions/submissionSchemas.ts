import { z } from 'zod';

export const submitTaskParamsSchema = z.object({
  id: z.string().uuid(),
});

export const submitTaskRequestSchema = z.object({
  contentText: z.string().trim().min(1, 'Submission content is required.'),
  notes: z.string().trim().min(1).optional(),
  documentUrl: z.string().trim().url('Document URL must be a valid URL.').optional(),
});

