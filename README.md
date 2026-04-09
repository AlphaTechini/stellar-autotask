# Stellar Autotask

I use this repo as the working app for the writing-only Stellar Testnet workflow: create task, fund it, claim it, submit writing, review it, and pay out through the backend-owned state machine.

## Architectural Decisions And Tradeoffs

- I keep the backend as the source of truth for auth, task state, funding confirmation, review decisions, and payout visibility.
- I use the SvelteKit frontend as a task-scoped workflow surface instead of letting the stitched UI stay as disconnected shell pages.
- I use wallet-first human auth and Freighter-backed native XLM funding so the demo stays aligned with Stellar Testnet instead of mixing in placeholder payment models.

## Included Modules

- [Backend/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/README.md)
- [Client/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/README.md)
- [Contracts/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Contracts/README.md)

## File Navigation

To find the API and workflow backend visit [Backend/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/README.md).
To find the SvelteKit frontend and route-level integration points visit [Client/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/README.md).
To find the Soroban payout contract docs visit [Contracts/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Contracts/README.md).

The backend can be found in [Backend/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/README.md).
The frontend can be found in [Client/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/README.md).
The payout contract can be found in [Contracts/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Contracts/README.md).
