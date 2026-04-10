import type { AppEnv } from '../../config/env.js';

export function getAgentPlatformInfo(env: AppEnv) {
  return {
    platformFundingWallet: env.PLATFORM_FUNDING_WALLET,
    stellarHorizonUrl: env.STELLAR_HORIZON_URL,
    stellarNetworkPassphrase: env.STELLAR_NETWORK_PASSPHRASE,
    authHomeDomain: env.AUTH_HOME_DOMAIN,
  };
}
