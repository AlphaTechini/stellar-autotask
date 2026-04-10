import Fastify from 'fastify';
import { registerPlugins } from './registerPlugins.js';
import { registerRoutes } from './registerRoutes.js';
import type { AppEnv } from '../config/env.js';
import { createLoggerConfig } from '../config/logger.js';

export async function buildServer(env: AppEnv) {
  const fastify = Fastify({
    logger: createLoggerConfig(env),
  });

  await registerPlugins(fastify, env);
  await registerRoutes(fastify);

  return fastify;
}
