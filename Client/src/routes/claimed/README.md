# Claimed Tasks Route

I use this route to show authenticated users every claimed, submitted, pending-review, and approved task with the full workflow snapshot in one place.

## Architectural Decisions And Tradeoffs

- I keep this route authenticated because it surfaces full submission, verification, and payout context.
- I group tasks by workflow status so the page can stay readable even when multiple tasks are active at once.
- I render every snapshot field in the UI to avoid hiding details behind deep task routes.

## File Navigation

To find claimed task data loading visit [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/claimed/+page.server.ts).
To find claimed task rendering and tab layout visit [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/claimed/+page.svelte).

The claimed task data connection can be found in [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/claimed/+page.server.ts).
The claimed task UI surface can be found in [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/claimed/+page.svelte).
