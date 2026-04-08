# Task Routes

I keep task-scoped route logic here because task creation, viewing, and claiming need the task id in the URL and in the server boundary.

## Architectural Decisions And Tradeoffs

- I start the stateful workflow with the task detail page because it is the smallest useful surface for real backend data before the deeper workflow routes are added.

## File Navigation

To find task detail loading and claim handling visit [[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).
To find task detail rendering visit [[id]/+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.svelte).

The task detail server boundary can be found in [[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).
