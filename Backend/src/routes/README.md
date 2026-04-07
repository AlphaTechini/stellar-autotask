# Backend Routes

I use this folder for HTTP route modules.

## Architectural Decisions And Tradeoffs

- I keep routes thin and let them depend on typed request and reply shapes.
- I start with health and root status routes so the app can prove it boots before feature routes are added.

## File Navigation

To find health route logic visit [healthRoutes.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/routes/healthRoutes.ts).

