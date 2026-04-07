import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { AppEnv } from '../config/env.js';

type AuthUser = {
  userId: string;
  username: string;
  walletAddress: string;
  role: string;
  authType: string;
};

declare module 'fastify' {
  interface FastifyRequest {
    authUser: AuthUser | null;
  }
}

const authContextPlugin: FastifyPluginAsync<{ env: AppEnv }> = async (fastify, options) => {
  fastify.decorateRequest('authUser', null);

  fastify.addHook('onRequest', async (request) => {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      return;
    }

    const token = authorizationHeader.slice('Bearer '.length).trim();

    if (!token) {
      return;
    }

    try {
      const payload = jwt.verify(token, options.env.AUTH_JWT_SECRET, {
        issuer: options.env.AUTH_JWT_ISSUER,
      }) as JwtPayload;

      if (
        typeof payload.sub !== 'string' ||
        typeof payload.username !== 'string' ||
        typeof payload.walletAddress !== 'string' ||
        typeof payload.role !== 'string' ||
        typeof payload.authType !== 'string'
      ) {
        return;
      }

      request.authUser = {
        userId: payload.sub,
        username: payload.username,
        walletAddress: payload.walletAddress,
        role: payload.role,
        authType: payload.authType,
      };
    } catch {
      request.authUser = null;
    }
  });
};

export default fp(authContextPlugin, {
  name: 'auth-context-plugin',
});
