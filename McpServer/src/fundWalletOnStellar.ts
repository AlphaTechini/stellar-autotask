import { sendNativePayment } from './sendNativePayment.js';

type FundWalletOnStellarInput = {
  fundingWalletSecretKey: string;
  destinationWallet: string;
  amount: string;
  horizonUrl: string;
  networkPassphrase: string;
};

export async function fundWalletOnStellar(input: FundWalletOnStellarInput) {
  return sendNativePayment({
    sourceWalletSecretKey: input.fundingWalletSecretKey,
    destinationWallet: input.destinationWallet,
    amount: input.amount,
    horizonUrl: input.horizonUrl,
    networkPassphrase: input.networkPassphrase,
  });
}
