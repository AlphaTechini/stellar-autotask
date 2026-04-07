import type { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import { claimTask } from './claimTask.js';
import { claimTaskParamsSchema } from './claimSchemas.js';

const claimRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/:id/claim', async (request, reply) => {
    if (!request.authUser) {
      throw fastify.httpErrors.unauthorized('Authentication is required to claim a task.');
    }

    try {
      const params = claimTaskParamsSchema.parse(request.params);
      const result = await claimTask(fastify.db, params.id, request.authUser.userId);

      if (result.kind === 'not_found') {
        throw fastify.httpErrors.notFound('Task not found.');
      }

      if (result.kind === 'self_claim_forbidden') {
        throw fastify.httpErrors.forbidden('You cannot claim a task you created.');
      }

      if (result.kind === 'not_claimable') {
        if (result.reason === 'claimed') {
          throw fastify.httpErrors.conflict('Task has already been claimed.');
        }

        throw fastify.httpErrors.conflict('Task is not open for claiming.');
      }

      if (result.kind === 'claim_conflict') {
        throw fastify.httpErrors.conflict('Task was claimed by someone else just now.');
      }

      return reply.send({
        task: result.task,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid route params.');
      }

      throw error;
    }
  });
};

export default claimRoutes;
