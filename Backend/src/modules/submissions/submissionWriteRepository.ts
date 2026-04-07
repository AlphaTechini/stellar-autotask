import { and, eq } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { submissions, verificationReports } from '../../db/schema/submissions.js';
import { taskEvents, tasks } from '../../db/schema/tasks.js';
import { withUpdatedAt } from '../../db/withUpdatedAt.js';
import {
  TASK_CLAIMED_STATUS,
  TASK_PENDING_REVIEW_STATUS,
  TASK_SUBMITTED_STATUS,
} from '../../lib/taskStateMachine.js';

type CreateSubmissionRecordInput = {
  taskId: string;
  workerId: string;
  contentText: string;
  notes?: string;
  documentUrl?: string;
  reviewWindowHours: number;
  verificationReport: {
    summary: string;
    score: number;
    keywordCoverage: string[];
    missingRequirements: string[];
    toneMatch: boolean;
    audienceFit: boolean;
    recommendation: 'approve' | 'manual_review' | 'reject';
  };
};

export async function createSubmissionForClaimedTask(
  db: DatabaseClient['db'],
  input: CreateSubmissionRecordInput,
) {
  return db.transaction(async (tx) => {
    const [submittedTask] = await tx
      .update(tasks)
      .set(
        withUpdatedAt({
          status: TASK_SUBMITTED_STATUS,
        }),
      )
      .where(
        and(
          eq(tasks.id, input.taskId),
          eq(tasks.workerId, input.workerId),
          eq(tasks.status, TASK_CLAIMED_STATUS),
        ),
      )
      .returning();

    if (!submittedTask) {
      return null;
    }

    const [submissionRecord] = await tx
      .insert(submissions)
      .values({
        taskId: input.taskId,
        workerId: input.workerId,
        contentText: input.contentText,
        notes: input.notes ?? null,
        documentUrl: input.documentUrl ?? null,
      })
      .returning();

    const [verificationReport] = await tx
      .insert(verificationReports)
      .values({
        taskId: input.taskId,
        submissionId: submissionRecord.id,
        summary: input.verificationReport.summary,
        score: input.verificationReport.score,
        keywordCoverage: input.verificationReport.keywordCoverage,
        missingRequirements: input.verificationReport.missingRequirements,
        toneMatch: input.verificationReport.toneMatch,
        audienceFit: input.verificationReport.audienceFit,
        recommendation: input.verificationReport.recommendation,
      })
      .returning();

    const reviewDeadline = new Date(Date.now() + input.reviewWindowHours * 60 * 60 * 1000);

    const [reviewReadyTask] = await tx
      .update(tasks)
      .set(
        withUpdatedAt({
          activeSubmissionId: submissionRecord.id,
          reviewDeadline,
          status: TASK_PENDING_REVIEW_STATUS,
        }),
      )
      .where(eq(tasks.id, input.taskId))
      .returning();

    await tx.insert(taskEvents).values([
      {
        taskId: input.taskId,
        actorUserId: input.workerId,
        eventType: 'submission_created',
        eventData: {
          submissionId: submissionRecord.id,
        },
      },
      {
        taskId: input.taskId,
        actorUserId: input.workerId,
        eventType: 'verification_completed',
        eventData: {
          submissionId: submissionRecord.id,
          recommendation: verificationReport.recommendation,
          score: verificationReport.score,
        },
      },
    ]);

    return {
      task: reviewReadyTask,
      submission: submissionRecord,
      verificationReport,
    };
  });
}

