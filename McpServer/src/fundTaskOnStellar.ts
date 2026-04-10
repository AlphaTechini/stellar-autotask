import {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Operation,
  TransactionBuilder,
} from '@stellar/stellar-sdk';

type FundTaskOnStellarInput = {
  walletSecretKey: string;
  amount: string;
  destinationWallet: string;
  horizonUrl: string;
  networkPassphrase: string;
};

export async function fundTaskOnStellar(input: FundTaskOnStellarInput) {
  const keypair = Keypair.fromSecret(input.walletSecretKey);
  const horizonServer = new Horizon.Server(input.horizonUrl);
  const sourceAccount = await horizonServer.loadAccount(keypair.publicKey());
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

  transaction.sign(keypair);

  const submissionResult = await horizonServer.submitTransaction(transaction);

  return {
    txHash: submissionResult.hash,
    fromWalletAddress: keypair.publicKey(),
    toWalletAddress: input.destinationWallet,
    amount: input.amount,
    assetCode: 'XLM' as const,
  };
}
