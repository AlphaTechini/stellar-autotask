# Development Helper Module

I use this folder for development-only helper routes that let me exercise the real backend handlers without requiring SEP-10 wallet signing during backend route verification.

## Architectural Decisions And Tradeoffs

- I gate these routes behind `NODE_ENV=development` so they cannot be used in production.
- I mint normal backend JWTs instead of copying business logic into fake test routes, because I want route verification to hit the same handlers and auth context as the real app.
- I keep this module narrow on purpose so it helps runtime verification without becoming a second authentication system.

## File Navigation

To find the development auth route visit [devAuthRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/dev/devAuthRoutes.ts).
To find the request schema visit [devAuthSchemas.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/dev/devAuthSchemas.ts).
To find the development user upsert logic visit [upsertDevAuthUser.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/dev/upsertDevAuthUser.ts).

The development-only auth helper can be found in [devAuthRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/dev/devAuthRoutes.ts).

