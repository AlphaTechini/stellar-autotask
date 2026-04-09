# Client

I use this SvelteKit app as the frontend shell for the Stellar writing-task workflow. The current focus is replacing stitched static pages with server-driven state, cookie-backed sessions, and typed backend integration.

## Architectural Decisions And Tradeoffs

- I keep backend calls inside SvelteKit server loads and actions so the JWT stays in httpOnly cookies instead of browser-managed storage.
- I use a narrow typed contract layer instead of adding another runtime schema package because the first integration pass needs reliability without extra dependency churn.
- I keep wallet challenge signing in the browser but finish verification in SvelteKit server actions so the JWT still lands in an httpOnly session cookie.
- I treat the browser auth route as human-only onboarding, while agent access stays outside the UI through MCP or API-style flows.
- I keep task creation and funding locked to native XLM on Stellar Testnet so the product never implies broader asset support than the current launch flow can honor.

## Environment

- I load the backend base URL from `PUBLIC_BACKEND_BASE_URL` or `BACKEND_BASE_URL`.
- I load the platform funding destination from `PUBLIC_PLATFORM_FUNDING_WALLET`, with optional server-side fallbacks when the deployment environment already exposes the Stellar payout public key.
- I load the browser-side Stellar payment target from `PUBLIC_STELLAR_HORIZON_URL` and `PUBLIC_STELLAR_NETWORK_PASSPHRASE` so the Freighter funding flow can build and submit native XLM payments on the expected network.
- I keep `.env` out of source control through the existing `.gitignore`.
- I can still gate temporary development auth with `PUBLIC_ENABLE_DEV_AUTH=true` when needed, but the active route direction is the real wallet challenge flow.

## File Navigation

To find the frontend server integration boundary visit [src/lib/server/backendApi.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/backendApi.ts).
To find cookie-backed session persistence visit [src/lib/server/session.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/session.ts).
To find the authenticated dashboard load visit [src/routes/dashboard/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/dashboard/+page.server.ts).
To find wallet auth verification handling visit [src/routes/auth/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/+page.server.ts).
To find the wallet challenge proxy visit [src/routes/auth/challenge/+server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/challenge/+server.ts).
To find task creation and redirect handling visit [src/routes/create-task/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/+page.server.ts).
To find task creation route documentation visit [src/routes/create-task/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/README.md).
To find task hub loading plus funding and claim mutations visit [src/routes/task/[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).

The backend connection can be found in [src/lib/server/backendApi.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/backendApi.ts).
The session restoration path can be found in [src/hooks.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/hooks.server.ts).
The wallet auth session write path can be found in [src/routes/auth/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/+page.server.ts).
The task creation route can be found in [src/routes/create-task/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/README.md).
The task workflow hub can be found in [src/routes/task/[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).
