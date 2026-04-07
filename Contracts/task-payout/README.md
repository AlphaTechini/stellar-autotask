# Task Payout Contract

I use this contract to execute worker payouts in native Testnet XLM after the backend has already decided that a submission should be paid.

## Architectural Decisions And Tradeoffs

- I use native XLM only, so there are no trustlines and no configurable token input in the contract interface.
- I lock the admin at initialization time and do not provide any admin rotation function in this version. That keeps deployment as the trust boundary and prevents a later admin takeover through contract calls.
- I keep payout policy off-chain. The backend decides whether a submission is approved or auto-approved, and the contract only performs the authorized XLM transfer and emits an event.
- I store paid task ids on-chain so the contract itself prevents double payout even if the backend retries.

## Testnet Deployment

- Network: `Test SDF Network ; September 2015`
- Contract ID: `CAEHJH6O6IZWUK25KUM522T4KDBPZBZC4PV4ZQGMSDIO5PEY6HGF66UL`
- Locked admin: `GBAJUQW22O2JMSI3TMU6UCQJLVZGKHUSRJA4VUSRALTF6YLALVSVZERB`
- Native XLM SAC: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`
- Test alias used during deployment: `task-payout-testnet`

## Amount Convention

- All on-chain amounts use stroops.
- `10000000` = `1 XLM`
- `7000000` = `0.7 XLM`

This matters for backend integration because the payout service must convert display XLM values into stroops before invoking `pay_task`.

## Contract Interface

- `init(admin, native_asset)`
  I use this once after deployment to set the backend-controlled admin address and the native XLM SAC address. The contract rejects any later attempt to initialize again.
- `pay_task(task_id, recipient, amount)`
  I use this for both manual approval payout and scheduler-driven auto payout. Only the stored admin can call it.
- `has_payment(task_id)`
  I use this to check whether a task has already been paid.
- `get_payment(task_id)`
  I use this to read the stored payout record.
- `get_admin()`
  I use this to inspect the locked admin address.

## Two Payout Paths

- Manual payout:
  The task creator approves a valid submission in the backend. The backend then calls `pay_task`.
- Auto payout:
  The backend scheduler finds submissions that passed the review deadline and satisfy the auto-approval rule. It then calls the same `pay_task` function.

That keeps the payout path reusable and modular because both triggers call the same backend payout service and the same on-chain function.

## File Navigation

To find contract entrypoints visit [src/lib.rs](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/src/lib.rs).
To find storage keys visit [src/storage.rs](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/src/storage.rs).
To find types and records visit [src/types.rs](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/src/types.rs).
To find event publishing logic visit [src/events.rs](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/src/events.rs).
To find source folder notes visit [src/README.md](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/src/README.md).

The payout execution logic can be found in [src/lib.rs](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/src/lib.rs).

## Verified Behavior

- `init` succeeded and locked the admin address shown above.
- The contract was funded with native Testnet XLM through the native asset contract.
- A payout test sent `7000000` stroops to a worker test account.
- `get_payment` returned the stored record for the funded `task_id`.
- A second payout attempt using the same `task_id` failed, confirming double-payout protection.

