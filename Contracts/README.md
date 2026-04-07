# Contracts

I use this folder for Soroban smart contracts that sit at the money boundary of the app.

## Architectural Decisions And Tradeoffs

- I keep contracts narrow and backend-driven so the backend remains the policy engine for verification, approval, and payout eligibility.
- I avoid upgrade-style admin mutation flows in this version because I want deployment to lock the payout authority instead of allowing later control changes.

## File Navigation

To find the native XLM payout contract visit [task-payout/README.md](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/README.md).

The payout contract can be found in [task-payout/README.md](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/README.md).
The deployed testnet payout contract can be found in [task-payout/README.md](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/README.md).
The deployed testnet payout contract can be found in [task-payout/README.md](C:/Hackathons/Stellar%201/stellar-platform/Contracts/task-payout/README.md).

