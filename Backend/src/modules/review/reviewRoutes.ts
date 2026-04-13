import type { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import { getTaskPayoutStatus } from '../payouts/getTaskPayoutStatus.js';
import { approveTask } from './approveTask.js';
import { getTaskReviewSnapshot } from './getTaskReviewSnapshot.js';
import { rejectTask } from './rejectTask.js';
import { rejectTaskRequestSchema, reviewTaskParamsSchema } from './reviewSchemas.js';

const reviewRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/:id/report', async (request) => {
    try {
      const params = reviewTaskParamsSchema.parse(request.params);
      const snapshot = await getTaskReviewSnapshot(fastify.db, params.id);

      if (!snapshot) {
        throw fastify.httpErrors.notFound('Task not found.');
      }

      return {
        task: snapshot.task,
        submission: snapshot.submission,
        verificationReport: snapshot.verificationReport,
        latestReviewDecision: snapshot.latestReviewDecision,
        payoutStatus: snapshot.payoutStatus,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid route params.');
      }

      throw error;
    }
  });

  fastify.post('/:id/approve', async (request, reply) => {
    if (!request.authUser) {
      throw fastify.httpErrors.unauthorized('Authentication is required to approve a task.');
    }

    try {
      const params = reviewTaskParamsSchema.parse(request.params);
      const result = await approveTask(
        fastify.db,
        fastify.env,
        params.id,
        request.authUser.userId,
        'client',
      );

      if (result.kind === 'not_found') {
        throw fastify.httpErrors.notFound('Task not found.');
      }

      if (result.kind === 'forbidden') {
        throw fastify.httpErrors.forbidden('Only the task creator can approve this task.');
      }

      if (result.kind === 'not_pending_review') {
        throw fastify.httpErrors.conflict('Task is not awaiting review approval.');
      }

      if (result.kind === 'review_conflict') {
        throw fastify.httpErrors.conflict(
          'Task review state changed while this approval was being processed.',
        );
      }

      if (result.kind === 'missing_funding') {
        throw fastify.httpErrors.conflict(
          'Approved task cannot be paid because no confirmed funding record exists.',
        );
      }

      if (result.kind === 'missing_worker_wallet') {
        throw fastify.httpErrors.conflict(
          'Approved task cannot be paid because the assigned worker has no valid Stellar wallet address.',
        );
      }

      if (result.kind === 'on_chain_mismatch') {
        throw fastify.httpErrors.conflict(result.message);
      }

      if (result.kind === 'payout_failed') {
        throw fastify.httpErrors.badGateway(result.message);
      }

      return reply.send({
        task: result.task,
        payout: result.payout,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid route params.');
      }

      throw error;
    }
  });

  fastify.post('/:id/reject', async (request, reply) => {
    if (!request.authUser) {
      throw fastify.httpErrors.unauthorized('Authentication is required to reject a task.');
    }

    try {
      const params = reviewTaskParamsSchema.parse(request.params);
      const input = rejectTaskRequestSchema.parse(request.body);
      const result = await rejectTask(
        fastify.db,
        params.id,
        request.authUser.userId,
        input.reason,
      );

      if (result.kind === 'not_found') {
        throw fastify.httpErrors.notFound('Task not found.');
      }

      if (result.kind === 'forbidden') {
        throw fastify.httpErrors.forbidden('Only the task creator can reject this task.');
      }

      if (result.kind === 'not_pending_review') {
        throw fastify.httpErrors.conflict('Task is not awaiting review rejection.');
      }

      if (result.kind === 'review_conflict') {
        throw fastify.httpErrors.conflict(
          'Task review state changed while this rejection was being processed.',
        );
      }

      return reply.send({
        task: result.task,
        reviewDecision: result.reviewDecision,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid request.');
      }

      throw error;
    }
  });

  fastify.get('/:id/payout-status', async (request) => {
    try {
      const params = reviewTaskParamsSchema.parse(request.params);
      const payoutStatus = await getTaskPayoutStatus(fastify.db, params.id);

      if (!payoutStatus) {
        throw fastify.httpErrors.notFound('Task not found.');
      }

      return {
        payoutStatus,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid route params.');
      }

      throw error;
    }
  });
};

export default reviewRoutes;
