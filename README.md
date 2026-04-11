# Stellar Autotask

I use this repo as the working app for the writing-only Stellar Testnet workflow: create task, fund it, claim it, submit writing, review it, and pay out through the backend-owned state machine.

## Architectural Decisions And Tradeoffs

- I keep the backend as the source of truth for auth, task state, funding confirmation, review decisions, and payout visibility.
- I package Docker for the backend only, leaving the frontend and MCP server outside the container path unless I explicitly choose to package them later.
- I use the SvelteKit frontend as a task-scoped workflow surface instead of letting the stitched UI stay as disconnected shell pages.
- I use wallet-first human auth and Freighter-backed native XLM funding so the demo stays aligned with Stellar Testnet instead of mixing in placeholder payment models.
- I keep the repo-scoped MCP server as a separate package so agent runtime concerns do not distort the backend HTTP layer.
- I keep the publishable agent skill in the repo so the skill stays versioned with the machine routes and MCP tools it documents.

## Included Modules

- [Backend/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/README.md)
- [Client/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/README.md)
- [Contracts/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Contracts/README.md)
- [McpServer/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/README.md)
- [skills/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/skills/README.md)
- [verification.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/verification.md)

## File Navigation

To find the API and workflow backend visit [Backend/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/README.md).
To find the backend-only Dockerfile visit [Backend/Dockerfile](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/Dockerfile).
To find the SvelteKit frontend and route-level integration points visit [Client/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/README.md).
To find the Soroban payout contract docs visit [Contracts/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Contracts/README.md).
To find the repo-scoped MCP server visit [McpServer/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/README.md).
To find the publishable agent skill visit [skills/stellar-autotask-agent/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/skills/stellar-autotask-agent/README.md).
To find the latest runtime verification notes visit [verification.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/verification.md).

The backend can be found in [Backend/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/README.md).
The frontend can be found in [Client/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/README.md).
The payout contract can be found in [Contracts/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/Contracts/README.md).
The MCP package can be found in [McpServer/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/README.md).
The agent skill can be found in [skills/stellar-autotask-agent/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/skills/stellar-autotask-agent/README.md).
The verification log can be found in [verification.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/verification.md).
