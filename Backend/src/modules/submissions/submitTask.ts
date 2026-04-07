import { loadEnv } from '../../config/env.js';
import type { DatabaseClient } from '../../db/client.js';
import { isTaskSubmittable } from '../../lib/taskStateMachine.js';
import { findTaskRecordById } from '../tasks/taskReadRepository.js';
import { runDeterministicSubmissionChecks } from './deterministicSubmissionChecks.js';
import { sanitizeSubmissionInput } from './sanitizeSubmissionInput.js';
import { createSubmissionForClaimedTask } from './submissionWriteRepository.js';
import { verifyWritingSubmission } from '../verification/verifyWritingSubmission.js';

type SubmitTaskInput = {
  contentText: string;
  notes?: string;
  documentUrl?: string;
};

type SubmitTaskFailure =
  | { kind: 'not_found' }
  | { kind: 'forbidden' }
  | { kind: 'not_submittable'; status: string }
  | { kind: 'submission_conflict' };

type SubmitTaskSuccess = {
  kind: 'submitted';
  task: NonNullable<Awaited<ReturnType<typeof findTaskRecordById>>>;
  submission: {
    id: string;
    taskId: string;
    workerId: string;
    contentText: string;
    notes: string | null;
    documentUrl: string | null;
    submittedAt: Date;
    createdAt: Date;
  };
  verificationReport: {
    id: string;
    taskId: string;
    submissionId: string;
    summary: string;
    score: number;
    keywordCoverage: string[];
    missingRequirements: string[];
    toneMatch: boolean;
    audienceFit: boolean;
    recommendation: 'approve' | 'manual_review' | 'reject';
    createdAt: Date;
  };
};

export type SubmitTaskResult = SubmitTaskSuccess | SubmitTaskFailure;

export async function submitTask(
  db: DatabaseClient['db'],
  taskId: string,
  workerUserId: string,
  input: SubmitTaskInput,
): Promise<SubmitTaskResult> {
  const existingTask = await findTaskRecordById(db, taskId);

  if (!existingTask) {
    return { kind: 'not_found' };
  }

  if (existingTask.workerId !== workerUserId) {
    return { kind: 'forbidden' };
  }

  if (!isTaskSubmittable(existingTask.status)) {
    return {
      kind: 'not_submittable',
      status: existingTask.status,
    };
  }

  const sanitizedInput = sanitizeSubmissionInput(input);
  const deterministicResult = runDeterministicSubmissionChecks({
    contentText: sanitizedInput.contentText,
    minWordCount: existingTask.minWordCount,
    requiredKeywords: existingTask.requiredKeywords,
  });
  const verificationResult = await verifyWritingSubmission(loadEnv(), {
    task: {
      title: existingTask.title,
      description: existingTask.description,
      brief: existingTask.brief,
      requiredKeywords: existingTask.requiredKeywords,
      targetAudience: existingTask.targetAudience,
      tone: existingTask.tone,
      minWordCount: existingTask.minWordCount,
    },
    submission: {
      contentText: sanitizedInput.contentText,
      notes: sanitizedInput.notes,
    },
    deterministicResult,
  });

  const createdSubmission = await createSubmissionForClaimedTask(db, {
    taskId,
    workerId: workerUserId,
    contentText: sanitizedInput.contentText,
    notes: sanitizedInput.notes,
    documentUrl: sanitizedInput.documentUrl,
    reviewWindowHours: existingTask.reviewWindowHours,
    verificationReport: verificationResult.verificationReport,
    verificationMeta: verificationResult.meta,
  });

  if (!createdSubmission) {
    return { kind: 'submission_conflict' };
  }

  return {
    kind: 'submitted',
    task: createdSubmission.task,
    submission: createdSubmission.submission,
    verificationReport: createdSubmission.verificationReport,
  };
}
