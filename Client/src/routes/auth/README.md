# Auth Route

I keep the auth route here because wallet challenge verification needs a browser wallet step on the page and a server-side session write after backend verification succeeds.

## Architectural Decisions And Tradeoffs

- I use Freighter in the browser for challenge signing because the backend already speaks Stellar transaction challenges and the frontend needs a real wallet signer instead of another mock login form.
- I proxy challenge creation through a same-origin SvelteKit route, but I keep verify inside the page server action so the JWT can be written straight into the httpOnly session cookie.
- I keep `username` and the human role choice on the page because the backend requires them for first-time wallet-human profile creation, even though repeat sign-ins can omit username and keep their existing role.

## File Navigation

To find auth page loading and verification handling visit [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/+page.server.ts).
To find auth page rendering and Freighter signing flow visit [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/+page.svelte).
To find the wallet challenge proxy visit [challenge/+server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/challenge/+server.ts).

The wallet verify session boundary can be found in [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/+page.server.ts).
