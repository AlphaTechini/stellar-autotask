import jwt from 'jsonwebtoken';
import type { AppEnv } from '../../config/env.js';

export type AuthTokenPayload = {
  sub: string;
  username: string;
  walletAddress: string;
  role: string;
  authType: string;
};

export function issueAuthToken(payload: AuthTokenPayload, env: AppEnv) {
  return jwt.sign(payload, env.AUTH_JWT_SECRET, {
    issuer: env.AUTH_JWT_ISSUER,
    expiresIn: env.AUTH_SESSION_TTL_SECONDS,
  });
}
