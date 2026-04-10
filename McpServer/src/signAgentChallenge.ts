import { Keypair, TransactionBuilder } from '@stellar/stellar-sdk';

export function signAgentChallenge(input: {
  transactionXdr: string;
  networkPassphrase: string;
  walletSecretKey: string;
}) {
  const transaction = TransactionBuilder.fromXDR(
    input.transactionXdr,
    input.networkPassphrase,
  );
  const keypair = Keypair.fromSecret(input.walletSecretKey);

  transaction.sign(keypair);

  return {
    signedTransactionXdr: transaction.toXDR(),
    walletAddress: keypair.publicKey(),
  };
}
