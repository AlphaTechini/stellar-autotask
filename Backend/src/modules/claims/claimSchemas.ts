import { z } from 'zod';

export const claimTaskParamsSchema = z.object({
  id: z.string().uuid(),
});
