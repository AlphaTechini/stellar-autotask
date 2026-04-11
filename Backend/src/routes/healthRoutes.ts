import type { FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/healthz', async (_request, reply) => {
    reply.header('Cache-Control', 'no-store');

    return {
      status: 'ok',
    };
  });

  fastify.get('/health', async () => {
    return {
      status: 'ok',
      environment: fastify.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };
  });

  fastify.get('/', async () => {
    return {
      service: 'stellar-1-backend',
      status: 'booted',
      docs: {
        architecture: '/Backend/Architecture.md',
      },
    };
  });
};

export default healthRoutes;
