export const TASK_INITIAL_STATUS = 'DRAFT' as const;
export const TASK_FUNDABLE_STATUS = 'DRAFT' as const;
export const TASK_CLAIMABLE_STATUS = 'OPEN' as const;
export const TASK_CLAIMED_STATUS = 'CLAIMED' as const;
export const TASK_PENDING_REVIEW_STATUS = 'PENDING_REVIEW' as const;
export const TASK_APPROVED_STATUS = 'APPROVED' as const;
export const TASK_AUTO_APPROVED_STATUS = 'AUTO_APPROVED' as const;
export const TASK_PAID_STATUS = 'PAID' as const;
export const PAYABLE_TASK_STATUSES = [
  TASK_APPROVED_STATUS,
  TASK_AUTO_APPROVED_STATUS,
] as const;

export function getInitialTaskStatus() {
  return TASK_INITIAL_STATUS;
}

export function isTaskFundable(status: string) {
  return status === TASK_FUNDABLE_STATUS;
}

export function isTaskClaimable(status: string) {
  return status === TASK_CLAIMABLE_STATUS;
}

export function isTaskPendingReview(status: string) {
  return status === TASK_PENDING_REVIEW_STATUS;
}

export function isTaskPayable(status: string) {
  return PAYABLE_TASK_STATUSES.includes(status as (typeof PAYABLE_TASK_STATUSES)[number]);
}
