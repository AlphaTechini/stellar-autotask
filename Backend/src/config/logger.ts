import type { FastifyServerOptions } from 'fastify';
import type { AppEnv } from './env.js';

export function createLoggerConfig(env: AppEnv): FastifyServerOptions['logger'] {
  const baseConfig: Exclude<FastifyServerOptions['logger'], boolean> = {
    level: env.LOG_LEVEL,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers["x-api-key"]',
        'res.headers["set-cookie"]'
      ],
      censor: '[redacted]'
    }
  };

  if (env.NODE_ENV === 'development') {
    return {
      ...baseConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:standard',
          singleLine: false
        }
      }
    };
  }

  return baseConfig;
}
