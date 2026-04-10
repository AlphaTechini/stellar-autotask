export function isAgentAuthType(authType: string) {
  return authType === 'wallet_agent';
}

export function matchesAllowedClaimantType(
  allowedClaimantType: 'human' | 'agent' | 'both',
  authType: string,
) {
  if (allowedClaimantType === 'both') {
    return true;
  }

  if (allowedClaimantType === 'agent') {
    return isAgentAuthType(authType);
  }

  return !isAgentAuthType(authType);
}

export function getAllowedClaimantTypesForAuthType(authType: string) {
  return isAgentAuthType(authType)
    ? (['agent', 'both'] as const)
    : (['human', 'both'] as const);
}
