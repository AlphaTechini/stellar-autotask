import type { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import { submitTask } from './submitTask.js';
import { submitTaskParamsSchema, submitTaskRequestSchema } from './submissionSchemas.js';

const submissionRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/:id/submit', async (request, reply) => {
    if (!request.authUser) {
      throw fastify.httpErrors.unauthorized('Authentication is required to submit task work.');
    }

    try {
      const params = submitTaskParamsSchema.parse(request.params);
      const input = submitTaskRequestSchema.parse(request.body);
      const result = await submitTask(fastify.db, params.id, request.authUser.userId, input);

      if (result.kind === 'not_found') {
        throw fastify.httpErrors.notFound('Task not found.');
      }

      if (result.kind === 'forbidden') {
        throw fastify.httpErrors.forbidden(
          'Only the assigned worker can submit work for this task.',
        );
      }

      if (result.kind === 'not_submittable') {
        throw fastify.httpErrors.conflict('Task is not ready for submission.');
      }

      if (result.kind === 'submission_conflict') {
        throw fastify.httpErrors.conflict(
          'Task submission state changed while this request was being processed.',
        );
      }

      return reply.send({
        task: result.task,
        submission: result.submission,
        verificationReport: result.verificationReport,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid request.');
      }

      throw error;
    }
  });
};

export default submissionRoutes;

