# Task Payout Contract Source

I use this folder for the Soroban payout contract source files.

## Architectural Decisions And Tradeoffs

- I split storage, events, and types away from the entrypoint so the contract stays readable and the payout path is easy to review.
- I keep the source layout small because this contract only needs one immutable admin path and one XLM payout action in V1.

## File Navigation

To find contract entrypoints visit [lib.rs](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/src/lib.rs).
To find storage logic visit [storage.rs](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/src/storage.rs).
To find contract data types visit [types.rs](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/src/types.rs).
To find event publishing logic visit [events.rs](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/src/events.rs).

The payout entrypoint can be found in [lib.rs](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/src/lib.rs).

