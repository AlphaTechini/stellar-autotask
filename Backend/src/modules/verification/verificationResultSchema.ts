import { z } from 'zod';

export const writingVerificationOutputSchema = z.object({
  summary: z.string().trim().min(1),
  scoreAdjustment: z.number().int().min(-30).max(20),
  toneMatch: z.boolean(),
  audienceFit: z.boolean(),
  briefAdherence: z.boolean(),
  structureCompleteness: z.boolean(),
  ctaRelevance: z.boolean(),
  missingRequirements: z.array(z.string().trim().min(1)).max(10),
  recommendation: z.enum(['approve', 'manual_review', 'reject']),
});

export type WritingVerificationOutput = z.infer<typeof writingVerificationOutputSchema>;

export const designVerificationOutputSchema = z.object({
  summary: z.string().trim().min(1),
  scoreAdjustment: z.number().int().min(-30).max(20),
  visualHierarchy: z.boolean(),
  contrastReadability: z.boolean(),
  brandAlignment: z.boolean(),
  layoutConsistency: z.boolean(),
  accessibilityFit: z.boolean(),
  missingRequirements: z.array(z.string().trim().min(1)).max(10),
  recommendation: z.enum(['approve', 'manual_review', 'reject']),
});

export type DesignVerificationOutput = z.infer<typeof designVerificationOutputSchema>;

export type VerificationExecutionMeta = {
  provider: 'deterministic_only' | 'groq' | 'gemini';
  model: string | null;
  degraded: boolean;
  reason: string | null;
};
