# Backend

I am using this folder for the Fastify backend that drives task creation, funding confirmation, claiming, submission, verification, review, and payout on Stellar.

## Architectural Decisions And Tradeoffs

- I chose Fastify over Go for this implementation because it gives me faster iteration for a hackathon while still preserving modular structure and strong schema validation.
- I am keeping the backend as the authority for task state and payment logic because money correctness matters more than frontend convenience.
- I am using deterministic checks before AI verification because language models should not decide measurable requirements like word count or keyword presence.
- I am exposing agent participation through API and MCP-style actions that reuse the same backend services instead of introducing a separate execution path.

## File Navigation

To find backend architecture logic visit [Architecture.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/Architecture.md).

The backend system design can be found in [Architecture.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/Architecture.md).
The authentication module can be found in [src/modules/auth/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/auth/README.md).
The claim module can be found in [src/modules/claims/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/claims/README.md).
The funding module can be found in [src/modules/funding/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/funding/README.md).
The task module can be found in [src/modules/tasks/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/tasks/README.md).

