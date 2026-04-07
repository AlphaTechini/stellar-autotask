import type { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import { confirmTaskFunding } from './confirmTaskFunding.js';
import { fundTaskParamsSchema, fundTaskRequestSchema } from './fundingSchemas.js';

const fundingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/:id/fund', async (request, reply) => {
    if (!request.authUser) {
      throw fastify.httpErrors.unauthorized('Authentication is required to fund a task.');
    }

    try {
      const params = fundTaskParamsSchema.parse(request.params);
      const input = fundTaskRequestSchema.parse(request.body);
      const result = await confirmTaskFunding(
        fastify.db,
        params.id,
        request.authUser.userId,
        request.authUser.walletAddress,
        {
          amount: input.amount.trim(),
          assetCode: input.assetCode.trim(),
          txHash: input.txHash.trim(),
          fromWalletAddress: input.fromWalletAddress.trim().toUpperCase(),
          toWalletAddress: input.toWalletAddress.trim().toUpperCase(),
        },
      );

      if (result.kind === 'not_found') {
        throw fastify.httpErrors.notFound('Task not found.');
      }

      if (result.kind === 'forbidden') {
        throw fastify.httpErrors.forbidden('Only the task creator can fund this task.');
      }

      if (result.kind === 'already_funded') {
        throw fastify.httpErrors.conflict('Task is already funded and claimable.');
      }

      if (result.kind === 'not_fundable') {
        throw fastify.httpErrors.conflict('Task is not in a fundable state.');
      }

      if (result.kind === 'wallet_mismatch') {
        throw fastify.httpErrors.badRequest(
          'Funding wallet must match the authenticated wallet.',
        );
      }

      if (result.kind === 'amount_mismatch') {
        throw fastify.httpErrors.badRequest(
          'Funding amount must match the task payout amount.',
        );
      }

      if (result.kind === 'asset_mismatch') {
        throw fastify.httpErrors.badRequest(
          'Funding asset must match the task currency asset.',
        );
      }

      if (result.kind === 'funding_conflict') {
        throw fastify.httpErrors.conflict(
          'Task funding changed while this request was being processed.',
        );
      }

      return reply.send({
        task: result.task,
        funding: result.funding,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid request.');
      }

      throw error;
    }
  });
};

export default fundingRoutes;
