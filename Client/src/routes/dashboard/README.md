# Dashboard Route

I keep the dashboard route here because it is the fastest place to surface what the signed-in user should do next without making them inspect every task manually.

## Architectural Decisions And Tradeoffs

- I group tasks by next action instead of only by raw ownership because funding, review, submission, and receipt checks are the decisions that move the workflow forward.
- I keep the grouping logic on the server boundary so the page stays focused on rendering and direct navigation instead of rebuilding workflow buckets in the browser.
- I still keep the full created-task and assigned-task lists below the priority lanes because the dashboard needs both quick action and broader task history.

## File Navigation

To find dashboard grouping and data loading visit [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/dashboard/+page.server.ts).
To find dashboard workflow rendering visit [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/dashboard/+page.svelte).

The dashboard workflow buckets can be found in [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/dashboard/+page.server.ts).
The dashboard action-first UI can be found in [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/dashboard/+page.svelte).
