# Agent Module

I use this folder for machine-facing agent access. This layer authenticates wallet-backed agents, issues revocable agent credentials, and exposes thin `/agent/*` routes that reuse the existing task workflow services instead of forking the business logic.

## Architectural Decisions And Tradeoffs

- I keep agent access separate from the human UI routes so machine clients can get stable, structured response shapes without changing the browser workflow.
- I use hashed agent credentials in the database so long-lived machine access does not depend on browser JWT sessions.
- I keep agent wallet verification on the same Stellar challenge flow as human wallet auth so machine identity still stays wallet-backed.
- I allow creator agents to approve or reject submissions for tasks they created, as long as they are not the assigned worker.

## File Navigation

To find agent route wiring visit [agentRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/agentRoutes.ts).
To find agent auth request validation visit [agentAuthSchemas.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/agentAuthSchemas.ts).
To find wallet-backed agent user upsert logic visit [upsertWalletAgentUser.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/upsertWalletAgentUser.ts).
To find agent credential creation visit [createAgentCredential.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/createAgentCredential.ts).
To find agent credential authentication visit [authenticateAgentCredential.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/authenticateAgentCredential.ts).
To find agent task status shaping visit [getAgentTaskStatus.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/getAgentTaskStatus.ts).
To find open task filtering for agents visit [listOpenAgentTasks.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/listOpenAgentTasks.ts).
To find platform config exposure for machine clients visit [getAgentPlatformInfo.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/getAgentPlatformInfo.ts).
To find agent review approvals and rejections visit [agentRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/agentRoutes.ts).

The agent route module can be found in [agentRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/agentRoutes.ts).
The agent credential store integration can be found in [createAgentCredential.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/createAgentCredential.ts).
The machine auth lookup can be found in [authenticateAgentCredential.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/agents/authenticateAgentCredential.ts).
