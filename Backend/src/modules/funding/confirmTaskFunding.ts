import type { DatabaseClient } from '../../db/client.js';
import { isTaskFundable } from '../../lib/taskStateMachine.js';
import { findTaskRecordById } from '../tasks/taskReadRepository.js';
import { confirmFundingForTask } from './fundingWriteRepository.js';

type FundingInput = {
  amount: string;
  assetCode: 'XLM';
  txHash: string;
  fromWalletAddress: string;
  toWalletAddress: string;
};

type FundingSuccess = {
  kind: 'funded';
  task: NonNullable<Awaited<ReturnType<typeof findTaskRecordById>>>;
  funding: {
    id: string;
    taskId: string;
    funderUserId: string | null;
    fromWalletAddress: string;
    toWalletAddress: string;
    amount: string;
    assetCode: string;
    txHash: string;
    status: 'pending' | 'confirmed' | 'failed';
    fundedAt: Date | null;
    createdAt: Date;
  };
};

type FundingFailure =
  | { kind: 'not_found' }
  | { kind: 'forbidden' }
  | { kind: 'already_funded' }
  | { kind: 'not_fundable' }
  | { kind: 'wallet_mismatch' }
  | { kind: 'amount_mismatch' }
  | { kind: 'asset_mismatch' }
  | { kind: 'unsupported_asset' }
  | { kind: 'funding_conflict' };

export type ConfirmTaskFundingResult = FundingSuccess | FundingFailure;

export async function confirmTaskFunding(
  db: DatabaseClient['db'],
  taskId: string,
  actorUserId: string,
  actorWalletAddress: string,
  input: FundingInput,
): Promise<ConfirmTaskFundingResult> {
  const existingTask = await findTaskRecordById(db, taskId);

  if (!existingTask) {
    return { kind: 'not_found' };
  }

  if (existingTask.clientId !== actorUserId) {
    return { kind: 'forbidden' };
  }

  if (!isTaskFundable(existingTask.status)) {
    if (existingTask.status === 'OPEN' || existingTask.status === 'CLAIMED') {
      return { kind: 'already_funded' };
    }

    return { kind: 'not_fundable' };
  }

  if (input.fromWalletAddress !== actorWalletAddress) {
    return { kind: 'wallet_mismatch' };
  }

  if (input.amount !== existingTask.payoutAmount) {
    return { kind: 'amount_mismatch' };
  }

  if (existingTask.currencyAsset !== 'XLM') {
    return { kind: 'unsupported_asset' };
  }

  if (input.assetCode !== existingTask.currencyAsset) {
    return { kind: 'asset_mismatch' };
  }

  const fundedTask = await confirmFundingForTask(db, {
    taskId,
    funderUserId: actorUserId,
    fromWalletAddress: input.fromWalletAddress,
    toWalletAddress: input.toWalletAddress,
    amount: input.amount,
    assetCode: input.assetCode,
    txHash: input.txHash,
  });

  if (!fundedTask) {
    return { kind: 'funding_conflict' };
  }

  return {
    kind: 'funded',
    task: fundedTask.task,
    funding: fundedTask.funding,
  };
}
