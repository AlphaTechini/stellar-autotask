# Backend Schema

I use this folder for Drizzle schema definitions.

## Architectural Decisions And Tradeoffs

- I split the schema by domain area so users, tasks, submissions, and payouts stay readable.
- I keep enums centralized because state values should not drift across files.
- I use constraints where they directly protect money and workflow correctness.

## File Navigation

To find enum logic visit [enums.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/enums.ts).
To find user logic visit [users.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/users.ts).
To find task logic visit [tasks.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/tasks.ts).
To find submission logic visit [submissions.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/submissions.ts).
To find payout logic visit [payouts.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/payouts.ts).
To find schema exports visit [index.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/index.ts).

The schema enums can be found in [enums.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/enums.ts).
The user schema can be found in [users.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/users.ts).
The task schema can be found in [tasks.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/tasks.ts).
The submission schema can be found in [submissions.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/submissions.ts).
The payout schema can be found in [payouts.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/payouts.ts).
The schema export surface can be found in [index.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/index.ts).

