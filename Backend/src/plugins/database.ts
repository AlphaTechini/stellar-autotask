import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { createDatabaseClient } from '../db/client.js';
import type { AppEnv } from '../config/env.js';

declare module 'fastify' {
  interface FastifyInstance {
    env: AppEnv;
    db: ReturnType<typeof createDatabaseClient>['db'];
  }
}

const databasePlugin: FastifyPluginAsync<{ env: AppEnv }> = async (fastify, options) => {
  const databaseClient = createDatabaseClient(options.env);

  fastify.decorate('env', options.env);
  fastify.decorate('db', databaseClient.db);

  fastify.addHook('onClose', async () => {
    await databaseClient.client.end();
  });
};

export default fp(databasePlugin, {
  name: 'database-plugin',
});
