# Payouts Module

I use this folder for the backend-owned payout path that both manual approval and the scheduler reuse. This module is where Soroban execution, backend idempotency, and reconciliation meet.

## Architectural Decisions And Tradeoffs

- I keep Soroban execution behind one shared service so manual approval and auto-approval cannot drift into separate payout behaviors.
- I check backend state first, then contract state, before I submit `pay_task` so a retry does not blindly send money when the backend missed a previous success.
- I derive the contract `task_id` from `sha256(task.id)` because it is deterministic, stable across retries, and produces the `BytesN<32>` shape the contract expects.
- I keep payout-status reads separate from payout execution so the frontend can inspect payout visibility without accidentally triggering money movement.

## File Navigation

To find XLM-to-stroops conversion logic visit [stellarAmount.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/stellarAmount.ts).
To find deterministic contract task key mapping visit [taskIdToContractKey.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/taskIdToContractKey.ts).
To find payout read and write persistence logic visit [payoutRepository.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/payoutRepository.ts).
To find payout status reads visit [getTaskPayoutStatus.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/getTaskPayoutStatus.ts).
To find Soroban payout orchestration logic visit [stellarPayoutService.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/stellarPayoutService.ts).

To find payout execution logic visit [stellarPayoutService.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/stellarPayoutService.ts).
The contract reconciliation path can be found in [stellarPayoutService.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/stellarPayoutService.ts).
The payout persistence path can be found in [payoutRepository.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/payoutRepository.ts).
The payout status surface can be found in [getTaskPayoutStatus.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/getTaskPayoutStatus.ts).
