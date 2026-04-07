import type { AppEnv } from '../../config/env.js';
import type { DeterministicSubmissionCheckResult } from '../submissions/deterministicSubmissionChecks.js';
import { verifyWritingWithGroq } from './groqWritingVerifier.js';
import type { VerificationExecutionMeta } from './verificationResultSchema.js';

type VerifyWritingSubmissionInput = {
  task: {
    title: string;
    description: string;
    brief: string;
    requiredKeywords: string[];
    targetAudience: string;
    tone: string;
    minWordCount: number;
  };
  submission: {
    contentText: string;
    notes?: string;
  };
  deterministicResult: DeterministicSubmissionCheckResult;
};

function combineMissingRequirements(
  deterministicMissingRequirements: string[],
  aiMissingRequirements: string[],
) {
  return [...new Set([...deterministicMissingRequirements, ...aiMissingRequirements])];
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

export async function verifyWritingSubmission(
  env: AppEnv,
  input: VerifyWritingSubmissionInput,
) {
  const groqResult = await verifyWritingWithGroq(env, {
    task: input.task,
    submission: input.submission,
  }).catch(
    (): { kind: 'failed'; meta: VerificationExecutionMeta } => ({
      kind: 'failed',
      meta: {
        provider: 'groq',
        model: env.GROQ_WRITING_MODEL,
        degraded: true,
        reason: 'Groq request failed before a verification result was returned.',
      },
    }),
  );

  if (groqResult.kind === 'failed') {
    return {
      verificationReport: {
        summary:
          input.deterministicResult.summary +
          ' AI writing review did not complete, so the backend stored a deterministic-only report.',
        score: input.deterministicResult.score,
        keywordCoverage: input.deterministicResult.keywordCoverage,
        missingRequirements: input.deterministicResult.missingRequirements,
        toneMatch: input.deterministicResult.toneMatch,
        audienceFit: input.deterministicResult.audienceFit,
        recommendation: input.deterministicResult.recommendation,
      },
      meta: groqResult.meta,
    };
  }

  const aiOutput = groqResult.output;
  const missingRequirements = combineMissingRequirements(
    input.deterministicResult.missingRequirements,
    aiOutput.missingRequirements,
  );
  const qualitativeRecommendation =
    missingRequirements.length === 0 ? aiOutput.recommendation : 'manual_review';
  const recommendation =
    input.deterministicResult.recommendation === 'reject'
      ? 'reject'
      : input.deterministicResult.recommendation === 'manual_review'
        ? 'manual_review'
        : qualitativeRecommendation;

  return {
    verificationReport: {
      summary: aiOutput.summary,
      score: clampScore(input.deterministicResult.score + aiOutput.scoreAdjustment),
      keywordCoverage: input.deterministicResult.keywordCoverage,
      missingRequirements,
      toneMatch: aiOutput.toneMatch,
      audienceFit: aiOutput.audienceFit,
      recommendation,
    },
    meta: groqResult.meta,
  };
}

