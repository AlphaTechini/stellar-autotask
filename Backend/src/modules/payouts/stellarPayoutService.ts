import {
  Address,
  BASE_FEE,
  Contract,
  Keypair,
  StrKey,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
} from '@stellar/stellar-sdk';
import type { AppEnv } from '../../config/env.js';
import type { DatabaseClient } from '../../db/client.js';
import { isTaskPayable } from '../../lib/taskStateMachine.js';
import { findPayoutExecutionContext, recordConfirmedPayout } from './payoutRepository.js';
import { convertDisplayAmountToStroops } from './stellarAmount.js';
import { taskIdToContractKey } from './taskIdToContractKey.js';

type ContractPaymentRecord = {
  amount: bigint;
  recipient: string;
  paidAtLedger: bigint | null;
};

type ExecuteTaskPayoutInput = {
  taskId: string;
  triggeredBy: 'client' | 'system' | 'agent';
  actorUserId?: string | null;
};

type PayoutContext = NonNullable<Awaited<ReturnType<typeof findPayoutExecutionContext>>>;

type ExecuteTaskPayoutFailure =
  | { kind: 'not_found' }
  | { kind: 'not_payable'; status: string }
  | { kind: 'missing_funding' }
  | { kind: 'missing_worker_wallet' }
  | { kind: 'already_paid'; task: PayoutContext['task']; payout: NonNullable<PayoutContext['payout']> }
  | { kind: 'on_chain_mismatch'; message: string; task: PayoutContext['task'] }
  | { kind: 'payout_failed'; message: string; task: PayoutContext['task'] };

type ExecuteTaskPayoutSuccess = {
  kind: 'paid' | 'reconciled_on_chain';
  task: Awaited<ReturnType<typeof recordConfirmedPayout>>['task'];
  payout: Awaited<ReturnType<typeof recordConfirmedPayout>>['payout'];
  txHash: string | null;
};

export type ExecuteTaskPayoutResult = ExecuteTaskPayoutSuccess | ExecuteTaskPayoutFailure;

export async function executeTaskPayout(
  db: DatabaseClient['db'],
  env: AppEnv,
  input: ExecuteTaskPayoutInput,
): Promise<ExecuteTaskPayoutResult> {
  const context = await findPayoutExecutionContext(db, input.taskId);

  if (!context) {
    return { kind: 'not_found' };
  }

  if (!isTaskPayable(context.task.status)) {
    if (context.payout?.status === 'confirmed') {
      return {
        kind: 'already_paid',
        task: context.task,
        payout: context.payout,
      };
    }

    return {
      kind: 'not_payable',
      status: context.task.status,
    };
  }

  if (!context.confirmedFunding) {
    return { kind: 'missing_funding' };
  }

  if (context.payout?.status === 'confirmed') {
    return {
      kind: 'already_paid',
      task: context.task,
      payout: context.payout,
    };
  }

  const workerWalletAddress = normalizeWorkerWalletAddress(
    context.worker?.stellarWalletAddress,
  );

  if (!workerWalletAddress) {
    return { kind: 'missing_worker_wallet' };
  }

  const expectedAmount = context.task.payoutAmount;
  const expectedStroops = convertDisplayAmountToStroops(expectedAmount);
  const existingContractPayment = await getContractPayment(env, input.taskId);

  if (existingContractPayment) {
    const mismatchMessage = getContractPaymentMismatchMessage(
      existingContractPayment,
      workerWalletAddress,
      expectedStroops,
    );

    if (mismatchMessage) {
      return {
        kind: 'on_chain_mismatch',
        message: mismatchMessage,
        task: context.task,
      };
    }

    const payoutRecord = await recordConfirmedPayout(db, {
      taskId: context.task.id,
      amount: expectedAmount,
      assetCode: context.task.currencyAsset,
      workerWalletAddress,
      txHash: null,
      triggeredBy: input.triggeredBy,
      actorUserId: input.actorUserId,
      reconciledFromContract: true,
    });

    return {
      kind: 'reconciled_on_chain',
      task: payoutRecord.task,
      payout: payoutRecord.payout,
      txHash: payoutRecord.payout.txHash,
    };
  }

  let txHash: string | null = null;

  try {
    txHash = await submitPayoutTransaction(env, input.taskId, workerWalletAddress, expectedStroops);
  } catch (error) {
    const recoveredContractPayment = await getContractPayment(env, input.taskId).catch(() => null);

    if (recoveredContractPayment) {
      const mismatchMessage = getContractPaymentMismatchMessage(
        recoveredContractPayment,
        workerWalletAddress,
        expectedStroops,
      );

      if (mismatchMessage) {
        return {
          kind: 'on_chain_mismatch',
          message: mismatchMessage,
          task: context.task,
        };
      }

      const payoutRecord = await recordConfirmedPayout(db, {
        taskId: context.task.id,
        amount: expectedAmount,
        assetCode: context.task.currencyAsset,
        workerWalletAddress,
        txHash,
        triggeredBy: input.triggeredBy,
        actorUserId: input.actorUserId,
        reconciledFromContract: true,
      });

      return {
        kind: 'reconciled_on_chain',
        task: payoutRecord.task,
        payout: payoutRecord.payout,
        txHash: payoutRecord.payout.txHash,
      };
    }

    return {
      kind: 'payout_failed',
      message: error instanceof Error ? error.message : 'Payout submission failed.',
      task: context.task,
    };
  }

  const confirmedContractPayment = await getContractPayment(env, input.taskId);

  if (!confirmedContractPayment) {
    return {
      kind: 'payout_failed',
      message: 'Payout transaction finished without a readable on-chain payment record.',
      task: context.task,
    };
  }

  const mismatchMessage = getContractPaymentMismatchMessage(
    confirmedContractPayment,
    workerWalletAddress,
    expectedStroops,
  );

  if (mismatchMessage) {
    return {
      kind: 'on_chain_mismatch',
      message: mismatchMessage,
      task: context.task,
    };
  }

  const payoutRecord = await recordConfirmedPayout(db, {
    taskId: context.task.id,
    amount: expectedAmount,
    assetCode: context.task.currencyAsset,
    workerWalletAddress,
    txHash,
    triggeredBy: input.triggeredBy,
    actorUserId: input.actorUserId,
    reconciledFromContract: false,
  });

  return {
    kind: 'paid',
    task: payoutRecord.task,
    payout: payoutRecord.payout,
    txHash,
  };
}

function normalizeWorkerWalletAddress(walletAddress: string | null | undefined) {
  if (!walletAddress) {
    return null;
  }

  const normalizedWalletAddress = walletAddress.trim().toUpperCase();

  if (!StrKey.isValidEd25519PublicKey(normalizedWalletAddress)) {
    return null;
  }

  return normalizedWalletAddress;
}

function getRpcServer(env: AppEnv) {
  return new rpc.Server(env.STELLAR_RPC_URL);
}

function getPayoutContract(env: AppEnv) {
  return new Contract(env.STELLAR_PAYOUT_CONTRACT_ID);
}

async function getContractPayment(env: AppEnv, taskId: string): Promise<ContractPaymentRecord | null> {
  const contractKey = taskIdToContractKey(taskId);
  const hasPaymentResult = await simulateReadOnlyContractCall(
    env,
    getPayoutContract(env).call('has_payment', nativeToScVal(contractKey, { type: 'bytes' })),
  );

  if (!hasPaymentResult) {
    return null;
  }

  const paymentResult = await simulateReadOnlyContractCall(
    env,
    getPayoutContract(env).call('get_payment', nativeToScVal(contractKey, { type: 'bytes' })),
  );

  if (!paymentResult || typeof paymentResult !== 'object') {
    return null;
  }

  const payment = paymentResult as {
    amount?: bigint;
    recipient?: string;
    paid_at_ledger?: bigint | null;
  };

  if (typeof payment.recipient !== 'string' || typeof payment.amount !== 'bigint') {
    throw new Error('Contract payment record could not be parsed.');
  }

  return {
    amount: payment.amount,
    recipient: payment.recipient.trim().toUpperCase(),
    paidAtLedger:
      typeof payment.paid_at_ledger === 'bigint' ? payment.paid_at_ledger : null,
  };
}

async function simulateReadOnlyContractCall(env: AppEnv, operation: ReturnType<Contract['call']>) {
  const server = getRpcServer(env);
  const sourceAccount = await server.getAccount(env.STELLAR_PAYOUT_ADMIN_PUBLIC_KEY);
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: env.STELLAR_NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(env.STELLAR_TRANSACTION_TIMEOUT_SECONDS)
    .build();

  const simulation = await server.simulateTransaction(transaction);

  if (rpc.Api.isSimulationError(simulation)) {
    throw new Error(simulation.error);
  }

  return simulation.result ? scValToNative(simulation.result.retval) : null;
}

async function submitPayoutTransaction(
  env: AppEnv,
  taskId: string,
  workerWalletAddress: string,
  amountInStroops: bigint,
) {
  const server = getRpcServer(env);
  const contract = getPayoutContract(env);
  const adminKeypair = Keypair.fromSecret(env.STELLAR_PAYOUT_ADMIN_SECRET_KEY);
  const sourceAccount = await server.getAccount(adminKeypair.publicKey());
  const contractKey = taskIdToContractKey(taskId);

  Address.fromString(workerWalletAddress);

  const rawTransaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: env.STELLAR_NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'pay_task',
        nativeToScVal(contractKey, { type: 'bytes' }),
        nativeToScVal(workerWalletAddress, { type: 'address' }),
        nativeToScVal(amountInStroops.toString(), { type: 'i128' }),
      ),
    )
    .setTimeout(env.STELLAR_TRANSACTION_TIMEOUT_SECONDS)
    .build();

  const preparedTransaction = await server.prepareTransaction(rawTransaction);
  preparedTransaction.sign(adminKeypair);

  const submission = await server.sendTransaction(preparedTransaction);
  const txHash = submission.hash;

  if (submission.status === 'ERROR') {
    throw new Error(`Soroban payout submission failed for transaction ${txHash}.`);
  }

  const attempts = Math.max(
    1,
    Math.ceil(
      env.STELLAR_TRANSACTION_POLL_TIMEOUT_MS / env.STELLAR_TRANSACTION_POLL_INTERVAL_MS,
    ),
  );
  const finalResult = await server.pollTransaction(txHash, {
    attempts,
    sleepStrategy: () => env.STELLAR_TRANSACTION_POLL_INTERVAL_MS,
  });

  if (finalResult.status === rpc.Api.GetTransactionStatus.SUCCESS) {
    return txHash;
  }

  if (finalResult.status === rpc.Api.GetTransactionStatus.FAILED) {
    throw new Error(`Soroban payout transaction ${txHash} failed on-chain.`);
  }

  throw new Error(`Soroban payout transaction ${txHash} did not finalize before polling timed out.`);
}

function getContractPaymentMismatchMessage(
  contractPayment: ContractPaymentRecord,
  expectedRecipient: string,
  expectedAmount: bigint,
) {
  if (contractPayment.recipient !== expectedRecipient) {
    return 'The contract already has a payment record for this task, but the recipient does not match the assigned worker wallet.';
  }

  if (contractPayment.amount !== expectedAmount) {
    return 'The contract already has a payment record for this task, but the amount does not match the backend payout amount.';
  }

  return null;
}
