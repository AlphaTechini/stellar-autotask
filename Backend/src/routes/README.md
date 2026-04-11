# Backend Routes

I use this folder for HTTP route modules.

## Architectural Decisions And Tradeoffs

- I keep routes thin and let them depend on typed request and reply shapes.
- I start with health and root status routes so the app can prove it boots before feature routes are added.
- I keep `/healthz` dependency-free so container health checks prove the Fastify process is responsive without coupling liveness to Postgres, Stellar RPC, or an AI provider.

## File Navigation

To find health and liveness route logic visit [healthRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/routes/healthRoutes.ts).

The health route can be found in [healthRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/routes/healthRoutes.ts).
The container liveness route can be found in [healthRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/routes/healthRoutes.ts).

