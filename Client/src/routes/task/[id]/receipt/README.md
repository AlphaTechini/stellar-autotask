# Receipt Route

I keep the task-scoped receipt route here because payout visibility needs the task id, participant-aware access, and the backend payout status surface to stay honest.

## Architectural Decisions And Tradeoffs

- I load `GET /tasks/:id/payout-status` for the core receipt state because the backend already treats payout status as the source of truth for whether a receipt actually exists.
- I also load `GET /tasks/:id/report` so the receipt can show review and verification context without inventing a second frontend-only workflow model.
- I let the route render pending, failed, and not-issued-yet states instead of redirecting everything into a success screen, because the product direction explicitly rejects fake payout theater.

## File Navigation

To find task receipt loading visit [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.server.ts).
To find task receipt rendering visit [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.svelte).

The payout-status route boundary can be found in [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.server.ts).
