import type { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import { issueAuthToken } from '../auth/issueAuthToken.js';
import { devLoginRequestSchema } from './devAuthSchemas.js';
import { upsertDevAuthUser } from './upsertDevAuthUser.js';

const devAuthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/login', async (request, reply) => {
    if (fastify.env.NODE_ENV !== 'development') {
      throw fastify.httpErrors.notFound();
    }

    try {
      const input = devLoginRequestSchema.parse(request.body);
      const userWriteResult = await upsertDevAuthUser(fastify.db, input);

      if (userWriteResult.kind === 'username_taken') {
        throw fastify.httpErrors.conflict('That username is already bound to a different wallet.');
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

      throw error;
    }
  });
};

export default devAuthRoutes;

