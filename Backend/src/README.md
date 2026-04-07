# Backend Src

I use this folder for runtime backend source files.

## Architectural Decisions And Tradeoffs

- I keep source code split by concern so schema, config, services, and routes do not collapse into one place.
- I start with the schema layer because task state and money correctness depend on the data model being explicit.

## File Navigation

To find database schema logic visit [db/schema/index.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/index.ts).
To find wallet authentication logic visit [modules/auth/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/auth/README.md).
To find claim module logic visit [modules/claims/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/claims/README.md).
To find funding module logic visit [modules/funding/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/funding/README.md).
To find payout module logic visit [modules/payouts/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/README.md).
To find review module logic visit [modules/review/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/review/README.md).
To find task module logic visit [modules/tasks/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/tasks/README.md).

The database schema can be found in [db/schema/index.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/index.ts).
The wallet authentication module can be found in [modules/auth/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/auth/README.md).
The claim module can be found in [modules/claims/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/claims/README.md).
The funding module can be found in [modules/funding/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/funding/README.md).
The payout module can be found in [modules/payouts/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/README.md).
The review module can be found in [modules/review/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/review/README.md).
The task module can be found in [modules/tasks/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/tasks/README.md).

