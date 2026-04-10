# MCP Source

I use this folder for the MCP server runtime, session state, backend client wrapper, and Stellar signing helpers.

## Architectural Decisions And Tradeoffs

- I keep the backend API wrapper separate from Stellar signing helpers so HTTP concerns and transaction concerns do not collapse into one file.
- I keep mutable session state in memory for the current MCP process because that is enough for interactive agent work without silently writing secrets to disk.

## File Navigation

To find MCP server startup and tool registration visit [index.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/index.ts).
To find environment parsing visit [env.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/env.ts).
To find in-memory wallet and token session state visit [agentSession.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/agentSession.ts).
To find backend machine-route calls visit [backendApi.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/backendApi.ts).
To find wallet challenge signing visit [signAgentChallenge.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/signAgentChallenge.ts).
To find on-chain XLM task funding logic visit [fundTaskOnStellar.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/fundTaskOnStellar.ts).
To find sponsored wallet bootstrap logic visit [bootstrapSponsoredWallet.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/bootstrapSponsoredWallet.ts).

The MCP entrypoint can be found in [index.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/index.ts).
The backend bridge can be found in [backendApi.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/backendApi.ts).
The Stellar funding helper can be found in [fundTaskOnStellar.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/fundTaskOnStellar.ts).
