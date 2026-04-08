# Task Routes

I keep task-scoped route logic here because task creation, viewing, and claiming need the task id in the URL and in the server boundary.

## Architectural Decisions And Tradeoffs

- I start the stateful workflow with the task detail page because it is the smallest useful surface for real backend data before the deeper workflow routes are added.

## File Navigation

To find task detail loading and claim handling visit [[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).
To find task detail rendering visit [[id]/+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.svelte).
To find task-scoped submission handling visit [[id]/submit/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/submit/+page.server.ts).
To find task-scoped submission rendering visit [[id]/submit/+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/submit/+page.svelte).
To find task-scoped review handling visit [[id]/review/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.server.ts).
To find task-scoped review rendering visit [[id]/review/+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.svelte).
To find task-scoped report loading visit [[id]/report/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/report/+page.server.ts).
To find task-scoped report rendering visit [[id]/report/+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/report/+page.svelte).
To find task-scoped receipt loading visit [[id]/receipt/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.server.ts).
To find task-scoped receipt rendering visit [[id]/receipt/+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.svelte).

The task detail server boundary can be found in [[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).
The worker submission flow can be found in [[id]/submit/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/submit/+page.server.ts).
The client review flow can be found in [[id]/review/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.server.ts).
The unified task report flow can be found in [[id]/report/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/report/+page.server.ts).
The payout receipt flow can be found in [[id]/receipt/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.server.ts).
