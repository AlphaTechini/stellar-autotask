import type { DeterministicSubmissionCheckResult } from './deterministicSubmissionChecks.js';

export function createVerificationReport(
  deterministicResult: DeterministicSubmissionCheckResult,
) {
  return {
    summary: deterministicResult.summary,
    score: deterministicResult.score,
    keywordCoverage: deterministicResult.keywordCoverage,
    missingRequirements: deterministicResult.missingRequirements,
    toneMatch: deterministicResult.toneMatch,
    audienceFit: deterministicResult.audienceFit,
    recommendation: deterministicResult.recommendation,
  };
}

