import {
  Keypair,
  Operation,
  StrKey,
  Transaction,
  xdr,
} from '@stellar/stellar-sdk';
import type { AppEnv } from '../../config/env.js';

function hasSignature(transaction: Transaction, publicKey: string) {
  const keypair = Keypair.fromPublicKey(publicKey);
  const signatureBase = transaction.hash();

  return transaction.signatures.some((decoratedSignature) => {
    const signature = decoratedSignature.signature();

    return keypair.verify(signatureBase, signature);
  });
}

export function verifyWalletChallenge(transactionXdr: string, env: AppEnv) {
  const authKeypair = Keypair.fromSecret(env.AUTH_CHALLENGE_SECRET_KEY);
  const transaction = new Transaction(transactionXdr, env.STELLAR_NETWORK_PASSPHRASE);

  if (transaction.source !== authKeypair.publicKey()) {
    throw new Error('Challenge source account does not match the auth signer.');
  }

  if (transaction.sequence !== '-1') {
    throw new Error('Challenge sequence number is invalid.');
  }

  const maxTime = Number(transaction.timeBounds?.maxTime ?? '0');

  if (!maxTime || maxTime * 1000 <= Date.now()) {
    throw new Error('Challenge has expired.');
  }

  if (transaction.operations.length !== 1) {
    throw new Error('Challenge operation count is invalid.');
  }

  const [operation] = transaction.operations;

  if (operation.type !== 'manageData') {
    throw new Error('Challenge operation type is invalid.');
  }

  if (operation.source == null || !StrKey.isValidEd25519PublicKey(operation.source)) {
    throw new Error('Challenge wallet address is invalid.');
  }

  if (operation.name !== `${env.AUTH_HOME_DOMAIN} auth`) {
    throw new Error('Challenge domain marker is invalid.');
  }

  if (!operation.value) {
    throw new Error('Challenge nonce is missing.');
  }

  if (!hasSignature(transaction, authKeypair.publicKey())) {
    throw new Error('Challenge is missing the auth signature.');
  }

  if (!hasSignature(transaction, operation.source)) {
    throw new Error('Challenge is missing the wallet signature.');
  }

  return {
    walletAddress: operation.source,
    transaction,
  };
}
