type DeterministicSubmissionCheckInput = {
  contentText: string;
  minWordCount: number;
  requiredKeywords: string[];
};

export type DeterministicSubmissionCheckResult = {
  summary: string;
  score: number;
  keywordCoverage: string[];
  missingRequirements: string[];
  toneMatch: boolean;
  audienceFit: boolean;
  recommendation: 'approve' | 'manual_review' | 'reject';
  wordCount: number;
};

function countWords(contentText: string) {
  const matches = contentText.match(/\b[\p{L}\p{N}'’-]+\b/gu);
  return matches?.length ?? 0;
}

export function runDeterministicSubmissionChecks(
  input: DeterministicSubmissionCheckInput,
): DeterministicSubmissionCheckResult {
  const wordCount = countWords(input.contentText);
  const normalizedContent = input.contentText.toLocaleLowerCase();
  const keywordCoverage = input.requiredKeywords.filter((keyword) =>
    normalizedContent.includes(keyword.toLocaleLowerCase()),
  );
  const missingRequirements: string[] = [];

  if (wordCount < input.minWordCount) {
    missingRequirements.push(
      `Minimum word count not met. Expected at least ${input.minWordCount}, received ${wordCount}.`,
    );
  }

  for (const keyword of input.requiredKeywords) {
    if (!keywordCoverage.includes(keyword)) {
      missingRequirements.push(`Required keyword missing: ${keyword}.`);
    }
  }

  const scoreBase = input.requiredKeywords.length + 1;
  const achievedScore =
    keywordCoverage.length + (wordCount >= input.minWordCount ? 1 : 0);
  const score = Math.max(0, Math.min(100, Math.round((achievedScore / scoreBase) * 100)));

  const recommendation =
    missingRequirements.length === 0
      ? 'approve'
      : keywordCoverage.length > 0 || wordCount > 0
        ? 'manual_review'
        : 'reject';

  const summary =
    missingRequirements.length === 0
      ? `Deterministic checks passed. Submission met the minimum word count and included all ${input.requiredKeywords.length} required keywords.`
      : `Deterministic checks found ${missingRequirements.length} issue(s) that require review.`;

  return {
    summary,
    score,
    keywordCoverage,
    missingRequirements,
    toneMatch: true,
    audienceFit: true,
    recommendation,
    wordCount,
  };
}

