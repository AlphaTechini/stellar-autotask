import crypto from 'node:crypto';

export function hashAgentToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
