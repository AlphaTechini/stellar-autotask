# Server

I keep the frontend server boundary here. This folder owns backend URL resolution, cookie-backed session persistence, and the typed request layer used by SvelteKit loads and actions.

## Architectural Decisions And Tradeoffs

- I keep backend calls on the SvelteKit server so JWTs stay in httpOnly cookies instead of leaking into browser-managed state.
- I centralize backend request handling because it gives me one place to normalize auth headers and backend error messages.
- I keep the session payload minimal and derive UI state from server loads because it restores cleanly on refresh without adding localStorage coupling.

## File Navigation

To find backend base URL resolution visit [backendConfig.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/backendConfig.ts).
To find the typed server-side API layer visit [backendApi.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/backendApi.ts).
To find cookie-backed session storage visit [session.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/session.ts).
To find protected-route enforcement visit [requireSession.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/requireSession.ts).

The backend connection boundary can be found in [backendApi.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/backendApi.ts).
The session cookie logic can be found in [session.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/session.ts).
