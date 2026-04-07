import type { FastifyInstance } from 'fastify';
import claimRoutes from '../modules/claims/claimRoutes.js';
import devAuthRoutes from '../modules/dev/devAuthRoutes.js';
import fundingRoutes from '../modules/funding/fundingRoutes.js';
import reviewRoutes from '../modules/review/reviewRoutes.js';
import submissionRoutes from '../modules/submissions/submissionRoutes.js';
import taskRoutes from '../modules/tasks/taskRoutes.js';
import healthRoutes from '../routes/healthRoutes.js';
import walletAuthRoutes from '../modules/auth/walletAuthRoutes.js';

export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(healthRoutes);
  await fastify.register(walletAuthRoutes, { prefix: '/auth/wallet' });
  if (fastify.env.NODE_ENV === 'development') {
    await fastify.register(devAuthRoutes, { prefix: '/dev/auth' });
  }
  await fastify.register(taskRoutes, { prefix: '/tasks' });
  await fastify.register(fundingRoutes, { prefix: '/tasks' });
  await fastify.register(claimRoutes, { prefix: '/tasks' });
  await fastify.register(submissionRoutes, { prefix: '/tasks' });
  await fastify.register(reviewRoutes, { prefix: '/tasks' });
}
