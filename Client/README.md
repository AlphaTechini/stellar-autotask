# Client

I use this SvelteKit app as the frontend shell for the Stellar writing-task workflow. The current focus is replacing stitched static pages with server-driven state, cookie-backed sessions, and typed backend integration.

## Architectural Decisions And Tradeoffs

- I keep backend calls inside SvelteKit server loads and actions so the JWT stays in httpOnly cookies instead of browser-managed storage.
- I use a narrow typed contract layer instead of adding another runtime schema package because the first integration pass needs reliability without extra dependency churn.
- I keep development login behind an explicit frontend env flag because wallet challenge signing belongs to the next auth task, not this infrastructure pass.

## Environment

- I load the backend base URL from `PUBLIC_BACKEND_BASE_URL` or `BACKEND_BASE_URL`.
- I keep `.env` out of source control through the existing `.gitignore`.
- I gate temporary development auth with `PUBLIC_ENABLE_DEV_AUTH=true`.

## File Navigation

To find the frontend server integration boundary visit [src/lib/server/backendApi.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/backendApi.ts).
To find cookie-backed session persistence visit [src/lib/server/session.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/session.ts).
To find the authenticated dashboard load visit [src/routes/dashboard/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/dashboard/+page.server.ts).
To find task creation and redirect handling visit [src/routes/create-task/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/+page.server.ts).
To find task detail loading and claim mutation handling visit [src/routes/task/[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).

The backend connection can be found in [src/lib/server/backendApi.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/backendApi.ts).
The session restoration path can be found in [src/hooks.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/hooks.server.ts).
The task detail connection can be found in [src/routes/task/[id]/+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/task/%5Bid%5D/+page.server.ts).
