# Routes

I keep route-level server loads and actions here so each page owns its own data boundary and redirect behavior.

## Architectural Decisions And Tradeoffs

- I move the first integration pass into route files because SvelteKit server loads and actions are the cleanest place to restore sessions and handle mutations.
- I keep pages intentionally focused on one backend task each so the route layer does not become another monolith.
- I let the task hub own Freighter-backed funding, claim routing, and role-aware next-step guidance so later task-scoped routes can stay focused on submission, review, report, and receipt behavior.
- I keep task creation and funding product-facing by locking the launch flow to native XLM instead of exposing unsupported asset choices in the browser.
- I keep the shared app shell at the layout boundary so navigation, sign-out, and role-aware shortcuts stay consistent across integrated routes.

## File Navigation

To find the shared session layout load visit [+layout.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/+layout.server.ts).
To find wallet auth handling visit [auth/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/+page.server.ts).
To find wallet challenge proxy handling visit [auth/challenge/+server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/challenge/+server.ts).
To find dashboard data loading visit [dashboard/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/dashboard/+page.server.ts).
To find dashboard route documentation visit [dashboard/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/dashboard/README.md).
To find marketplace data loading visit [marketplace/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/marketplace/+page.server.ts).
To find marketplace route documentation visit [marketplace/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/marketplace/README.md).
To find task creation handling visit [create-task/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/+page.server.ts).
To find task creation route documentation visit [create-task/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/README.md).
To find shared layout session handling visit [+layout.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/+layout.server.ts).
To find shared shell sign-out handling visit [auth/signout/+server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/signout/+server.ts).
To find task hub loading plus funding and claim handling visit [task/[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).
To find task-scoped submission handling visit [task/[id]/submit/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/submit/+page.server.ts).
To find task-scoped report loading visit [task/[id]/report/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/report/+page.server.ts).
To find task-scoped review handling visit [task/[id]/review/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.server.ts).
To find task-scoped receipt loading visit [task/[id]/receipt/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.server.ts).

The layout session surface can be found in [+layout.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/+layout.server.ts).
The shared sign-out endpoint can be found in [auth/signout/+server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/signout/+server.ts).
The dashboard route notes can be found in [dashboard/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/dashboard/README.md).
The marketplace route notes can be found in [marketplace/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/marketplace/README.md).
The authenticated task creation flow can be found in [create-task/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/+page.server.ts).
The task creation route notes can be found in [create-task/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/README.md).
The task workflow hub can be found in [task/[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).
The worker submission server boundary can be found in [task/[id]/submit/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/submit/+page.server.ts).
The task report server boundary can be found in [task/[id]/report/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/report/+page.server.ts).
The task review server boundary can be found in [task/[id]/review/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/review/+page.server.ts).
The payout receipt server boundary can be found in [task/[id]/receipt/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/receipt/+page.server.ts).
The wallet challenge proxy can be found in [auth/challenge/+server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/challenge/+server.ts).
