import { Keypair, TransactionBuilder } from '@stellar/stellar-sdk';

type CreateSponsoredWalletInput = {
  serviceUrl: string;
};

export async function bootstrapSponsoredWallet(input: CreateSponsoredWalletInput) {
  const keypair = Keypair.random();
  const createResponse = await fetch(new URL('/create', input.serviceUrl), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      public_key: keypair.publicKey(),
    }),
  });

  if (!createResponse.ok) {
    throw new Error(`Wallet bootstrap create step failed with status ${createResponse.status}.`);
  }

  const createPayload = (await createResponse.json()) as {
    xdr: string;
    network_passphrase: string;
  };

  const transaction = TransactionBuilder.fromXDR(
    createPayload.xdr,
    createPayload.network_passphrase,
  );
  transaction.sign(keypair);

  const submitResponse = await fetch(new URL('/submit', input.serviceUrl), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      xdr: transaction.toXDR(),
    }),
  });

  if (!submitResponse.ok) {
    throw new Error(`Wallet bootstrap submit step failed with status ${submitResponse.status}.`);
  }

  const submitPayload = (await submitResponse.json()) as {
    status: string;
    hash: string;
    ledger: number;
    agent_public_key: string;
    explorer_url?: string;
  };

  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
    transactionHash: submitPayload.hash,
    ledger: submitPayload.ledger,
    explorerUrl: submitPayload.explorer_url ?? null,
  };
}
