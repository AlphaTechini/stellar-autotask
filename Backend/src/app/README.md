# Backend App

I use this folder for Fastify app bootstrap code.

## Architectural Decisions And Tradeoffs

- I separate server construction from the process entrypoint so the app can be tested or reused later without process-level side effects.
- I register plugins and routes through small modules so boot code does not become a giant file.

## File Navigation

To find server construction logic visit [buildServer.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/app/buildServer.ts).

To find plugin registration logic visit [registerPlugins.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/app/registerPlugins.ts).

To find route registration logic visit [registerRoutes.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/app/registerRoutes.ts).

