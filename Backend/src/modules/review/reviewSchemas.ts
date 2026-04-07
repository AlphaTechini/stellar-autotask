import { z } from 'zod';

export const reviewTaskParamsSchema = z.object({
  id: z.string().uuid(),
});
