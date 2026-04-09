# Create Task Route

I use this route for authenticated task creation before the workflow moves into task-scoped funding.

## Architectural Decisions And Tradeoffs

- I lock creation to native XLM so the form only offers the funding path the product actually supports on Stellar Testnet.
- I keep the route action defensive against tampered form posts so unsupported assets are rejected even when someone bypasses the rendered UI.
- I make the field guidance writing-specific because the brief needs to teach the worker what to produce before the task ever reaches the marketplace.
- I redirect straight into the task hub after creation because saving the draft is only half the job and funding should feel like the immediate continuation.
- I leave final task persistence and deeper validation to the backend because payout correctness should not depend on browser behavior.

## File Navigation

To find task creation form rendering visit [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/+page.svelte).
To find task creation server handling visit [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/+page.server.ts).

The native XLM task creation form can be found in [+page.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/+page.svelte).
The task creation server boundary can be found in [+page.server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/create-task/+page.server.ts).
