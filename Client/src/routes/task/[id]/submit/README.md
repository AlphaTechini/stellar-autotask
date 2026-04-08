# Submit Route

I keep the task-scoped submission route here because writing submission depends on both the task id and the authenticated worker session.

## Architectural Decisions And Tradeoffs

- I make `/task/[id]/submit` worker-only because the backend already enforces assigned-worker submission, and the route should mirror that clearly.
- I keep the UI visually focused instead of reusing the old placeholder chrome so the screen stays strong without inheriting fake sidebar destinations or unsupported drafting features.

## File Navigation

To find task submission loading and mutation handling visit [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/submit/+page.server.ts).
To find task submission rendering visit [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/submit/+page.svelte).

The worker submission server boundary can be found in [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/submit/+page.server.ts).
