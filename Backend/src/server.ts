import 'dotenv/config';
import { buildServer } from './app/buildServer.js';
import { loadEnv } from './config/env.js';

async function start() {
  const env = loadEnv();
  const server = await buildServer(env);

  try {
    await server.listen({
      host: env.HOST,
      port: env.PORT,
    });
  } catch (error) {
    server.log.error(error);
    process.exitCode = 1;
  }
}

void start();
