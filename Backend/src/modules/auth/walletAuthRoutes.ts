import type { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import { createWalletChallenge } from './createWalletChallenge.js';
import { issueAuthToken } from './issueAuthToken.js';
import { verifyWalletChallenge } from './verifyWalletChallenge.js';
import { walletChallengeRequestSchema, walletVerifyRequestSchema } from './walletAuthSchemas.js';
import { upsertWalletHumanUser } from '../users/userWriteRepository.js';

const walletAuthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/challenge', async (request, reply) => {
    try {
      const input = walletChallengeRequestSchema.parse(request.body);
      const challenge = createWalletChallenge(input.walletAddress, fastify.env);

      return reply.send(challenge);
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid request body.');
      }

      throw fastify.httpErrors.badRequest(
        error instanceof Error ? error.message : 'Unable to create wallet challenge.',
      );
    }
  });

  fastify.post('/verify', async (request, reply) => {
    try {
      const input = walletVerifyRequestSchema.parse(request.body);
      const verifiedChallenge = verifyWalletChallenge(input.transactionXdr, fastify.env);
      const userWriteResult = await upsertWalletHumanUser(fastify.db, {
        walletAddress: verifiedChallenge.walletAddress,
        username: input.username,
        role: input.role,
      });

      if (userWriteResult.kind === 'missing_username') {
        throw fastify.httpErrors.badRequest(
          'Username is required the first time this wallet signs in.',
        );
      }

      if (userWriteResult.kind === 'missing_role') {
        throw fastify.httpErrors.badRequest(
          'Role is required the first time this wallet signs in.',
        );
      }

      if (userWriteResult.kind === 'auth_type_conflict') {
        throw fastify.httpErrors.conflict(
          'This wallet is already bound to a different authentication type.',
        );
      }

      const token = issueAuthToken(
        {
          sub: userWriteResult.user.id,
          username: userWriteResult.user.username,
          walletAddress: userWriteResult.user.stellarWalletAddress,
          role: userWriteResult.user.role,
          authType: userWriteResult.user.authType,
        },
        fastify.env,
      );

      return reply.send({
        token,
        user: {
          id: userWriteResult.user.id,
          username: userWriteResult.user.username,
          role: userWriteResult.user.role,
          walletAddress: userWriteResult.user.stellarWalletAddress,
          authType: userWriteResult.user.authType,
          createdAt: userWriteResult.user.createdAt,
          updatedAt: userWriteResult.user.updatedAt,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid request body.');
      }

      if (
        typeof error === 'object' &&
        error !== null &&
        'statusCode' in error &&
        typeof error.statusCode === 'number'
      ) {
        throw error;
      }

      throw fastify.httpErrors.unauthorized(
        error instanceof Error ? error.message : 'Wallet challenge verification failed.',
      );
    }
  });
};

export default walletAuthRoutes;
