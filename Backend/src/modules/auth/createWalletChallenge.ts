import crypto from 'node:crypto';
import {
  Account,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  StrKey,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import type { AppEnv } from '../../config/env.js';

export type WalletChallenge = {
  transactionXdr: string;
  networkPassphrase: string;
  expiresAt: string;
  walletAddress: string;
};

export function createWalletChallenge(walletAddress: string, env: AppEnv): WalletChallenge {
  const normalizedWalletAddress = walletAddress.trim().toUpperCase();

  if (!StrKey.isValidEd25519PublicKey(normalizedWalletAddress)) {
    throw new Error('Invalid Stellar wallet address.');
  }

  const authKeypair = Keypair.fromSecret(env.AUTH_CHALLENGE_SECRET_KEY);
  const authAccount = new Account(authKeypair.publicKey(), '-1');
  const expiresAtSeconds = Math.floor(Date.now() / 1000) + env.AUTH_CHALLENGE_TTL_SECONDS;
  const nonce = crypto.randomBytes(32).toString('base64');

  const transaction = new TransactionBuilder(authAccount, {
    fee: BASE_FEE,
    networkPassphrase: env.STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET,
  })
    .addOperation(
      Operation.manageData({
        name: `${env.AUTH_HOME_DOMAIN} auth`,
        value: nonce,
        source: normalizedWalletAddress,
      }),
    )
    .setTimebounds(0, expiresAtSeconds)
    .build();

  transaction.sign(authKeypair);

  return {
    transactionXdr: transaction.toXDR(),
    networkPassphrase: env.STELLAR_NETWORK_PASSPHRASE,
    expiresAt: new Date(expiresAtSeconds * 1000).toISOString(),
    walletAddress: normalizedWalletAddress,
  };
}
