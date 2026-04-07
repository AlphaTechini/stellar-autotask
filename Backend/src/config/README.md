# Backend Config

I use this folder for runtime configuration and constants.

## Architectural Decisions And Tradeoffs

- I validate environment variables at startup so the backend fails fast instead of failing later in request handlers.
- I keep configuration separate from server boot code so future modules can depend on typed config rather than raw `process.env`.

## File Navigation

To find environment loading logic visit [env.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/config/env.ts).
To find database URL and pooler resolution logic visit [database.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/config/database.ts).

The backend configuration can be found in [env.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/config/env.ts).
The wallet auth environment settings can be found in [env.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/config/env.ts).
The Supabase-friendly database connection builder can be found in [database.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/config/database.ts).

