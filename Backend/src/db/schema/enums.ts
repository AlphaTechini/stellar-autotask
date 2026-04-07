import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['client', 'worker', 'agent', 'admin']);

export const authTypeEnum = pgEnum('auth_type', ['wallet_human', 'wallet_agent']);

export const taskStatusEnum = pgEnum('task_status', [
  'DRAFT',
  'FUNDED',
  'OPEN',
  'CLAIMED',
  'SUBMITTED',
  'PENDING_REVIEW',
  'APPROVED',
  'AUTO_APPROVED',
  'REJECTED',
  'PAID',
]);

export const fundingStatusEnum = pgEnum('funding_status', ['pending', 'confirmed', 'failed']);

export const verificationRecommendationEnum = pgEnum('verification_recommendation', [
  'approve',
  'manual_review',
  'reject',
]);

export const reviewDecisionEnum = pgEnum('review_decision', ['approve', 'reject']);

export const allowedClaimantTypeEnum = pgEnum('allowed_claimant_type', ['human', 'agent', 'both']);

export const payoutTriggeredByEnum = pgEnum('payout_triggered_by', ['client', 'system', 'agent']);

export const payoutStatusEnum = pgEnum('payout_status', ['pending', 'confirmed', 'failed']);
