# Backend App

I use this folder for Fastify app bootstrap code.

## Architectural Decisions And Tradeoffs

- I separate server construction from the process entrypoint so the app can be tested or reused later without process-level side effects.
- I register plugins and routes through small modules so boot code does not become a giant file.

## File Navigation

To find server construction logic visit [buildServer.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/app/buildServer.ts).
To find plugin registration logic visit [registerPlugins.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/app/registerPlugins.ts).
To find route registration logic visit [registerRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/app/registerRoutes.ts).

The server construction layer can be found in [buildServer.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/app/buildServer.ts).
The plugin registration layer can be found in [registerPlugins.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/app/registerPlugins.ts).
The route registration layer can be found in [registerRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/app/registerRoutes.ts).

