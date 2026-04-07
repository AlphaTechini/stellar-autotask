import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import type { FastifyInstance } from 'fastify';
import databasePlugin from '../plugins/database.js';
import authContextPlugin from '../plugins/authContext.js';
import schedulerPlugin from '../plugins/scheduler.js';
import type { AppEnv } from '../config/env.js';

export async function registerPlugins(fastify: FastifyInstance, env: AppEnv) {
  await fastify.register(sensible);
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });
  await fastify.register(databasePlugin, { env });
  await fastify.register(authContextPlugin, { env });
  await fastify.register(schedulerPlugin, { env });
}
