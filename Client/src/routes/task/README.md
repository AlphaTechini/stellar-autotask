# Task Routes

I keep task-scoped route logic here because task creation, viewing, and claiming need the task id in the URL and in the server boundary.

## Architectural Decisions And Tradeoffs

- I use the task detail route as the workflow hub because it needs to connect draft funding, worker claims, and role-aware routing before the deeper task-scoped routes take over.
- I keep final funding confirmation on the server boundary so the frontend can launch the Freighter payment flow in the browser, then let the backend validate the recorded hash and final task state.
- I keep a legacy-task fallback message in the hub so older non-XLM drafts are clearly constrained without suggesting that the launch flow still supports them.
- I keep only a compact report preview in the hub because the page should stay action-first while the dedicated report route holds the fuller verification and review detail.

## File Navigation

To find task hub loading plus funding and claim handling visit [[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).
To find task hub rendering visit [[id]/+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.svelte).
To find task-scoped submission handling visit [[id]/submit/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/submit/+page.server.ts).
To find task-scoped submission rendering visit [[id]/submit/+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/submit/+page.svelte).
To find task-scoped review handling visit [[id]/review/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.server.ts).
To find task-scoped review rendering visit [[id]/review/+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.svelte).
To find task-scoped report loading visit [[id]/report/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/report/+page.server.ts).
To find task-scoped report rendering visit [[id]/report/+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/report/+page.svelte).
To find task-scoped receipt loading visit [[id]/receipt/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.server.ts).
To find task-scoped receipt rendering visit [[id]/receipt/+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.svelte).

The task workflow hub can be found in [[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).
The worker submission flow can be found in [[id]/submit/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/submit/+page.server.ts).
The client review flow can be found in [[id]/review/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.server.ts).
The unified task report flow can be found in [[id]/report/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/report/+page.server.ts).
The payout receipt flow can be found in [[id]/receipt/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.server.ts).
