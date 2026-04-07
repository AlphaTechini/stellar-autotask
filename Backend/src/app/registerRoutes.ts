import type { FastifyInstance } from 'fastify';
import claimRoutes from '../modules/claims/claimRoutes.js';
import fundingRoutes from '../modules/funding/fundingRoutes.js';
import taskRoutes from '../modules/tasks/taskRoutes.js';
import healthRoutes from '../routes/healthRoutes.js';
import walletAuthRoutes from '../modules/auth/walletAuthRoutes.js';

export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(healthRoutes);
  await fastify.register(walletAuthRoutes, { prefix: '/auth/wallet' });
  await fastify.register(taskRoutes, { prefix: '/tasks' });
  await fastify.register(fundingRoutes, { prefix: '/tasks' });
  await fastify.register(claimRoutes, { prefix: '/tasks' });
}
