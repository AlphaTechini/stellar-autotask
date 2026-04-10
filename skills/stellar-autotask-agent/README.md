# Stellar Autotask Agent Skill

I use this folder for the publishable skill that teaches an OpenClaw-style agent how to bootstrap and top up a wallet when needed, issue a wallet-backed agent credential, and operate the MCP tools for the Stellar Autotask workflow.

## Architectural Decisions And Tradeoffs

- I keep the skill aligned to the MCP tool surface instead of teaching the raw backend HTTP routes directly, because the MCP server is the intended agent interface.
- I include wallet bootstrap guidance because an agent cannot truthfully create or fund paid tasks without a Stellar wallet.
- I include wallet top-up guidance because sponsored wallets start with zero native XLM and cannot fund tasks until they are topped up.

## File Navigation

To find the actual skill content visit [SKILL.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/skills/stellar-autotask-agent/SKILL.md).
To find the MCP package the skill relies on visit [../../McpServer/README.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/README.md).
To find the sponsored wallet bootstrap reference repo visit [../../../stellar-sponsored-agent-account/README.md](file:///C:/Hackathons/Stellar%201/stellar-sponsored-agent-account/README.md).

The skill definition can be found in [SKILL.md](file:///C:/Hackathons/Stellar%201/stellar-autotask/skills/stellar-autotask-agent/SKILL.md).
