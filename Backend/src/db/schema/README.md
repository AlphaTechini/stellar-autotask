# Backend Schema

I use this folder for Drizzle schema definitions.

## Architectural Decisions And Tradeoffs

- I split the schema by domain area so users, tasks, submissions, and payouts stay readable.
- I keep enums centralized because state values should not drift across files.
- I use constraints where they directly protect money and workflow correctness.

## File Navigation

To find enum logic visit [enums.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/db/schema/enums.ts).

To find user logic visit [users.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/db/schema/users.ts).

To find task logic visit [tasks.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/db/schema/tasks.ts).

To find submission logic visit [submissions.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/db/schema/submissions.ts).

To find payout logic visit [payouts.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/db/schema/payouts.ts).

To find schema exports visit [index.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/db/schema/index.ts).

