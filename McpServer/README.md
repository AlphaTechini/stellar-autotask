# MCP Server

I use this package for the repo-scoped MCP server that lets an authenticated agent bootstrap a wallet, top it up with native XLM, create tasks, fund them on-chain, claim work, submit writing, and inspect verification state through the backend's machine routes.

## Architectural Decisions And Tradeoffs

- I keep the MCP server in a separate package so the backend stays focused on HTTP workflow logic while agent runtime concerns live in their own deployable unit.
- I let the MCP server sign wallet challenges and funding payments locally from an agent secret key instead of inventing a fake funding shortcut.
- I keep wallet bootstrap optional through the sponsored-agent-account flow because some agents will already have Stellar wallets and some will not.
- I keep wallet top-up explicit through a configured funding wallet in MCP env so the backend does not need an admin-only wallet top-up route.

## File Navigation

To find MCP package scripts and pinned dependencies visit [package.json](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/package.json).
To find MCP runtime source navigation visit [src/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/README.md).
To find the environment contract visit [.env.example](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/.env.example).
To find the container entrypoint visit [Dockerfile](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/Dockerfile).

The MCP runtime package can be found in [src/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/src/README.md).
