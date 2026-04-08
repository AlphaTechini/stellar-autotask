# Routes

I keep route-level server loads and actions here so each page owns its own data boundary and redirect behavior.

## Architectural Decisions And Tradeoffs

- I move the first integration pass into route files because SvelteKit server loads and actions are the cleanest place to restore sessions and handle mutations.
- I keep pages intentionally focused on one backend task each so the route layer does not become another monolith.

## File Navigation

To find the shared session layout load visit [+layout.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/+layout.server.ts).
To find development login handling visit [auth/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/+page.server.ts).
To find dashboard data loading visit [dashboard/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/dashboard/+page.server.ts).
To find marketplace data loading visit [marketplace/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/marketplace/+page.server.ts).
To find task creation handling visit [create-task/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/+page.server.ts).
To find task detail and claim handling visit [task/[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).
To find task-scoped review handling visit [task/[id]/review/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.server.ts).
To find task-scoped receipt loading visit [task/[id]/receipt/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.server.ts).

The layout session surface can be found in [+layout.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/+layout.server.ts).
The authenticated task creation flow can be found in [create-task/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/+page.server.ts).
The task review server boundary can be found in [task/[id]/review/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.server.ts).
The payout receipt server boundary can be found in [task/[id]/receipt/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.server.ts).
