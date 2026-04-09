# Marketplace Route

I keep the marketplace route here because it is the handoff point between funded task availability and the deeper task workflow.

## Architectural Decisions And Tradeoffs

- I only show open funded writing tasks here because the marketplace should represent work that is actually ready to be claimed, not mixed draft or unsupported task states.
- I keep post-claim guidance visible on the page because claiming is only the first step and the user should understand that the task workflow continues in the task route.
- I surface writing-specific context like keywords, tone, audience, and review window on each card so workers can evaluate the brief before claiming without drifting into generic marketplace language.

## File Navigation

To find marketplace data loading visit [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/marketplace/+page.server.ts).
To find marketplace rendering and claim guidance visit [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/marketplace/+page.svelte).

The funded task query can be found in [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/marketplace/+page.server.ts).
The claim continuation UI can be found in [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/marketplace/+page.svelte).
