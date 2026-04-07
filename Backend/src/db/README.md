# Backend DB

I use this folder for database-facing backend code.

## Architectural Decisions And Tradeoffs

- I keep schema definitions separate from future repository logic because the schema is the contract the rest of the backend must obey.
- I use Drizzle with PostgreSQL because explicit SQL-friendly modeling fits task state and payout safety better than loose persistence.

## File Navigation

To find schema logic visit [schema/index.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/index.ts).
To find runtime database client logic visit [client.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/client.ts).

The database schema can be found in [schema/index.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/schema/index.ts).
The Drizzle postgres client setup can be found in [client.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/db/client.ts).

