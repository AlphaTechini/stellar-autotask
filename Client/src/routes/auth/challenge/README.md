# Auth Challenge Route

I keep this small auth challenge proxy here so the browser can request a Stellar wallet challenge without exposing frontend session logic or depending on a public backend base URL.

## Architectural Decisions And Tradeoffs

- I proxy `POST /auth/wallet/challenge` through SvelteKit so the page can stay same-origin while the backend remains the only source of truth for challenge generation.
- I keep this route read-thin and stateless because challenge signing happens in the browser wallet, not in the server boundary.

## File Navigation

To find wallet challenge proxy handling visit [+server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/challenge/+server.ts).

The wallet challenge proxy can be found in [+server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/challenge/+server.ts).
