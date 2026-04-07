import type { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import { approveTask } from './approveTask.js';
import { reviewTaskParamsSchema } from './reviewSchemas.js';

const reviewRoutes: FastifyPluginAsync = async (fastify) => {
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
};

export default reviewRoutes;
