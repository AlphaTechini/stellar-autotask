import {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Operation,
  TransactionBuilder,
} from '@stellar/stellar-sdk';

type SendNativePaymentInput = {
  sourceWalletSecretKey: string;
  destinationWallet: string;
  amount: string;
  horizonUrl: string;
  networkPassphrase: string;
};

export async function sendNativePayment(input: SendNativePaymentInput) {
  const sourceKeypair = Keypair.fromSecret(input.sourceWalletSecretKey);
  const horizonServer = new Horizon.Server(input.horizonUrl);
  const sourceAccount = await horizonServer.loadAccount(sourceKeypair.publicKey());
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: input.networkPassphrase,
  })
    .addOperation(
      Operation.payment({
        destination: input.destinationWallet,
        asset: Asset.native(),
        amount: input.amount,
      }),
    )
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);

  const submissionResult = await horizonServer.submitTransaction(transaction);

  return {
    txHash: submissionResult.hash,
    fromWalletAddress: sourceKeypair.publicKey(),
    toWalletAddress: input.destinationWallet,
    amount: input.amount,
    assetCode: 'XLM' as const,
  };
}
