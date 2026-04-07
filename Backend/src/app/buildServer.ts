import Fastify from 'fastify';
import { registerPlugins } from './registerPlugins.js';
import { registerRoutes } from './registerRoutes.js';
import type { AppEnv } from '../config/env.js';

export async function buildServer(env: AppEnv) {
  const fastify = Fastify({
    logger: {
      level: env.LOG_LEVEL,
    },
  });

  await registerPlugins(fastify, env);
  await registerRoutes(fastify);

  return fastify;
}
