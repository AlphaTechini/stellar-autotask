# Report Route

I keep the task-scoped report route here because the backend already exposes a unified snapshot for submission, verification, review, and payout visibility.

## Architectural Decisions And Tradeoffs

- I use `GET /tasks/:id/report` as the main read surface because it already gives me the most product-accurate snapshot for the task lifecycle.
- I keep the next-step block honest for now instead of linking into fake review or receipt screens before those task-scoped routes are refactored.

## File Navigation

To find task report loading visit [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/report/+page.server.ts).
To find task report rendering visit [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/report/+page.svelte).

The unified report server boundary can be found in [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/report/+page.server.ts).
