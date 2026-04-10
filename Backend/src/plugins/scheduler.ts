import { and, eq, isNull, lte } from 'drizzle-orm';
import fp from 'fastify-plugin';
import type { FastifyBaseLogger, FastifyPluginAsync } from 'fastify';
import type { AppEnv } from '../config/env.js';
import { payouts } from '../db/schema/payouts.js';
import { taskEvents, taskFundings, tasks } from '../db/schema/tasks.js';
import { withUpdatedAt } from '../db/withUpdatedAt.js';
import { TASK_AUTO_APPROVED_STATUS, TASK_PENDING_REVIEW_STATUS } from '../lib/taskStateMachine.js';
import { executeTaskPayout } from '../modules/payouts/stellarPayoutService.js';

const schedulerPlugin: FastifyPluginAsync<{ env: AppEnv }> = async (fastify, options) => {
  if (!options.env.SCHEDULER_AUTO_PAYOUT_ENABLED) {
    fastify.log.info('Auto-payout scheduler is disabled.');
    return;
  }

  let isRunning = false;

  const runSweep = async () => {
    if (isRunning) {
      return;
    }

    isRunning = true;

    try {
      await runAutoApprovalSweep(fastify.db, fastify.env, fastify.log);
    } catch (error) {
      fastify.log.error({ err: error }, 'Auto-payout scheduler sweep failed.');
    } finally {
      isRunning = false;
    }
  };

  const timer = setInterval(runSweep, options.env.SCHEDULER_AUTO_PAYOUT_INTERVAL_MS);
  timer.unref?.();

  fastify.addHook('onReady', async () => {
    fastify.log.info(
      { intervalMs: options.env.SCHEDULER_AUTO_PAYOUT_INTERVAL_MS },
      'Auto-payout scheduler started.',
    );

    // Let the server finish booting before the first sweep so slow payout retries
    // cannot trip Fastify's onReady timeout.
    queueMicrotask(() => {
      void runSweep();
    });
  });

  fastify.addHook('onClose', async () => {
    clearInterval(timer);
  });
};

async function runAutoApprovalSweep(
  db: Parameters<typeof findEligibleAutoApprovalTaskIds>[0],
  env: AppEnv,
  log: FastifyBaseLogger,
) {
  const eligibleTaskIds = await findEligibleAutoApprovalTaskIds(db);

  for (const taskId of eligibleTaskIds) {
    const autoApprovedTask = await markTaskAutoApproved(db, taskId);

    if (!autoApprovedTask) {
      continue;
    }

    const payoutResult = await executeTaskPayout(db, env, {
      taskId,
      triggeredBy: 'system',
      actorUserId: null,
    });

    if (payoutResult.kind === 'paid' || payoutResult.kind === 'reconciled_on_chain') {
      log.info(
        { taskId, txHash: payoutResult.txHash, payoutKind: payoutResult.kind },
        'Scheduler auto-approved and paid task.',
      );
      continue;
    }

    if (payoutResult.kind === 'already_paid') {
      log.info({ taskId }, 'Scheduler found an already-paid task after auto-approval.');
      continue;
    }

    log.warn(
      {
        taskId,
        failureKind: payoutResult.kind,
        message: 'message' in payoutResult ? payoutResult.message : undefined,
      },
      'Scheduler auto-approved task but payout did not finalize.',
    );
  }
}

async function findEligibleAutoApprovalTaskIds(
  db: Parameters<typeof executeTaskPayout>[0],
) {
  const records = await db
    .select({
      taskId: tasks.id,
    })
    .from(tasks)
    .innerJoin(
      taskFundings,
      and(eq(taskFundings.taskId, tasks.id), eq(taskFundings.status, 'confirmed')),
    )
    .leftJoin(payouts, eq(payouts.taskId, tasks.id))
    .where(
      and(
        eq(tasks.status, TASK_PENDING_REVIEW_STATUS),
        lte(tasks.reviewDeadline, new Date()),
        isNull(payouts.id),
      ),
    );

  return records.map((record) => record.taskId);
}

async function markTaskAutoApproved(
  db: Parameters<typeof executeTaskPayout>[0],
  taskId: string,
) {
  return db.transaction(async (tx) => {
    const [autoApprovedTask] = await tx
      .update(tasks)
      .set(
        withUpdatedAt({
          status: TASK_AUTO_APPROVED_STATUS,
        }),
      )
      .where(
        and(
          eq(tasks.id, taskId),
          eq(tasks.status, TASK_PENDING_REVIEW_STATUS),
          lte(tasks.reviewDeadline, new Date()),
        ),
      )
      .returning();

    if (!autoApprovedTask) {
      return null;
    }

    await tx.insert(taskEvents).values({
      taskId,
      actorUserId: null,
      eventType: 'task_auto_approved',
      eventData: {
        trigger: 'scheduler',
      },
    });

    return autoApprovedTask;
  });
}

export default fp(schedulerPlugin, {
  name: 'scheduler-plugin',
});
