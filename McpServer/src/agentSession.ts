import { Keypair } from '@stellar/stellar-sdk';
import type { McpEnv } from './env.js';

export function createAgentSession(env: McpEnv) {
  let walletSecretKey = env.AGENT_WALLET_SECRET_KEY ?? null;
  let agentToken = env.AGENT_TOKEN ?? null;
  let agentUsername = env.AGENT_USERNAME ?? null;
  let agentCredentialLabel = env.AGENT_CREDENTIAL_LABEL;

  function getWalletAddress() {
    if (!walletSecretKey) {
      return null;
    }

    return Keypair.fromSecret(walletSecretKey).publicKey();
  }

  return {
    getWalletSecretKey() {
      return walletSecretKey;
    },
    setWalletSecretKey(value: string | null) {
      walletSecretKey = value?.trim() ? value.trim() : null;
    },
    getAgentToken() {
      return agentToken;
    },
    setAgentToken(value: string | null) {
      agentToken = value?.trim() ? value.trim() : null;
    },
    getAgentUsername() {
      return agentUsername;
    },
    setAgentUsername(value: string | null) {
      agentUsername = value?.trim() ? value.trim() : null;
    },
    getAgentCredentialLabel() {
      return agentCredentialLabel;
    },
    setAgentCredentialLabel(value: string) {
      agentCredentialLabel = value.trim();
    },
    getWalletAddress,
    summary() {
      return {
        walletAddress: getWalletAddress(),
        hasWalletSecretKey: walletSecretKey !== null,
        hasAgentToken: agentToken !== null,
        agentUsername,
        agentCredentialLabel,
      };
    },
  };
}

export type AgentSession = ReturnType<typeof createAgentSession>;
