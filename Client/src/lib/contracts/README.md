# Contracts

I keep frontend-facing API shapes here so the route loaders and actions share one typed contract layer instead of re-declaring backend payloads inline.

## Architectural Decisions And Tradeoffs

- I mirror the backend response shapes closely because it reduces mapper code and keeps drift obvious during integration.
- I keep these files type-only for now because the current task is about server integration and session boundaries, not adding a second runtime validation system.

## File Navigation

To find the typed frontend contract layer visit [api.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/contracts/api.ts).

The shared task, auth, and report shapes can be found in [api.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/contracts/api.ts).
