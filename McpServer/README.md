# MCP Server

I use this package for the repo-scoped MCP server that lets an authenticated agent bootstrap a wallet, top it up with native XLM, create tasks, fund them on-chain, claim work, submit writing, and inspect verification state through the backend's machine routes.

## Architectural Decisions And Tradeoffs

- I keep the MCP server in a separate package so the backend stays focused on HTTP workflow logic while agent runtime concerns live in their own deployable unit.
- I let the MCP server sign wallet challenges and funding payments locally from an agent secret key instead of inventing a fake funding shortcut.
- I keep wallet bootstrap optional through the sponsored-agent-account flow because some agents will already have Stellar wallets and some will not.
- I keep wallet top-up explicit through a configured funding wallet in MCP env so the backend does not need an admin-only wallet top-up route.
- I support stdio for local OpenClaw subprocess usage and Streamable HTTP for Cloud Run or any remote MCP-capable agent.
- I make the Docker image start in HTTP mode by default so judges and external agents can reach `/mcp` without depending on localhost.
- I do not seed agent wallet credentials or tokens from env in any transport mode, so each MCP session must bootstrap or provide its own wallet and agent token.

## File Navigation

To find MCP package scripts and pinned dependencies visit [package.json](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/package.json).
To find MCP runtime source navigation visit [src/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/README.md).
To find the environment contract visit [.env.example](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/.env.example).
To find the container entrypoint visit [Dockerfile](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/Dockerfile).
To find Docker build-context exclusions visit [.dockerignore](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/.dockerignore).
To find HTTP and stdio transport selection visit [src/index.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/index.ts).

The MCP runtime package can be found in [src/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/README.md).
