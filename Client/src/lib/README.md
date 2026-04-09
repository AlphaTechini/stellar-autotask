# Lib

I use this folder for shared frontend primitives. The goal is to keep route files thin while the reusable contracts and server helpers stay in one predictable place.

## Architectural Decisions And Tradeoffs

- I split server-only helpers from shared contracts so browser-facing code never imports cookie or environment logic by accident.
- I keep the current integration layer intentionally small because this task is about replacing static output with real state, not building a large frontend framework.

## File Navigation

To find the typed API contracts visit [contracts/api.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/contracts/api.ts).
To find backend and session server utilities visit [server/backendApi.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/backendApi.ts).
To find shared shell components visit [components/common/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/components/common/README.md).

The shared contract layer can be found in [contracts/api.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/contracts/api.ts).
The backend server integration layer can be found in [server/backendApi.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/server/backendApi.ts).
The shared shell component layer can be found in [components/common/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/components/common/README.md).
