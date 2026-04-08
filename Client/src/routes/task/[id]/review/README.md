# Review Route

I keep the task-scoped review route here because manual client review needs the task id, the authenticated client session, and the backend review snapshot in one place.

## Architectural Decisions And Tradeoffs

- I make `/task/[id]/review` client-only because approval and rejection are creator-owned actions in the backend and the route should reflect that policy directly.
- I use `GET /tasks/:id/report` as the review read surface because it already contains the submission, verification report, latest review decision, and payout visibility needed for a real review screen.
- I redirect approval into `/task/[id]/receipt` and rejection into `/task/[id]/report` so each route stays focused on one workflow phase instead of blending decision, report, and payout states into one monolith.

## File Navigation

To find task review loading and action handling visit [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.server.ts).
To find task review rendering visit [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.svelte).

The client review server boundary can be found in [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.server.ts).
