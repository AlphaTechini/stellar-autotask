export const TASK_INITIAL_STATUS = 'DRAFT' as const;
export const TASK_FUNDABLE_STATUS = 'DRAFT' as const;
export const TASK_CLAIMABLE_STATUS = 'OPEN' as const;
export const TASK_CLAIMED_STATUS = 'CLAIMED' as const;

export function getInitialTaskStatus() {
  return TASK_INITIAL_STATUS;
}

export function isTaskFundable(status: string) {
  return status === TASK_FUNDABLE_STATUS;
}

export function isTaskClaimable(status: string) {
  return status === TASK_CLAIMABLE_STATUS;
}
