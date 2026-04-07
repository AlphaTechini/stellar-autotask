# Backend Plugins

I use this folder for Fastify plugins that attach shared runtime capabilities.

## Architectural Decisions And Tradeoffs

- I expose shared concerns like database access through Fastify plugins so routes do not construct infrastructure ad hoc.
- I keep plugin scope small so each plugin owns one capability.

## File Navigation

To find database plugin logic visit [database.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/plugins/database.ts).
To find auth context parsing logic visit [authContext.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/plugins/authContext.ts).

