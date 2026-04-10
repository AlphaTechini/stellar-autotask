---
name: stellar-autotask-agent
description: Operate the Stellar Autotask agent workflow through the repo-scoped MCP server. Use when an agent needs to (1) bootstrap or inspect a Stellar wallet, (2) issue a wallet-backed agent credential, (3) create and fund a paid writing task, (4) list and claim open tasks, (5) submit writing work, or (6) inspect verification and payout state.
---

# Stellar Autotask Agent

Use the MCP server in [../../McpServer](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/README.md) as the execution surface. Do not call the backend routes directly unless the MCP server is unavailable.

## Prepare The Environment

1. Run the backend first.
2. Run the MCP server from [../../McpServer/package.json](file:///C:/Hackathons/Stellar%201/stellar-autotask/McpServer/package.json).
3. Set `BACKEND_BASE_URL`.
4. If a wallet already exists, set `AGENT_WALLET_SECRET_KEY`.
5. If a reusable agent token already exists, set `AGENT_TOKEN`.
6. If a wallet does not exist yet, set `SPONSORED_AGENT_ACCOUNT_URL` to a running sponsored wallet service such as [../../../stellar-sponsored-agent-account](file:///C:/Hackathons/Stellar%201/stellar-sponsored-agent-account/README.md).

## Use The Workflow

1. Call `stellar_autotask_wallet_info` to inspect the current wallet, token, and backend config.
2. If no wallet is loaded, call `stellar_autotask_bootstrap_wallet`.
3. Call `stellar_autotask_issue_token` with a readable username.
4. Create funded work with `stellar_autotask_create_task`.
5. Immediately fund the task with `stellar_autotask_fund_task`.
6. Discover claimable work with `stellar_autotask_list_open_tasks`.
7. Claim work with `stellar_autotask_claim_task`.
8. Deliver writing with `stellar_autotask_submit_task_work`.
9. Inspect progress with `stellar_autotask_get_task_status` and `stellar_autotask_get_verification_report`.

## Guardrails

- Keep agent wallets separate from human wallets. The backend binds a wallet to one auth type.
- Expect the backend to append `.agents` to usernames when needed.
- Fund tasks only through `stellar_autotask_fund_task`. That tool sends the on-chain XLM payment and then confirms the same tx hash with the backend.
- If backend confirmation fails after a funding payment is submitted, reuse the same tx hash. Do not send funds twice.
- Claim only tasks that the backend exposes to the current agent type. Human-only tasks are intentionally filtered out.
- Submit only when the task is already assigned to the authenticated agent.

## Fast Recovery

- If the token is missing or expired, call `stellar_autotask_issue_token` again.
- If the wallet bootstrap reservation expires, rerun `stellar_autotask_bootstrap_wallet`.
- If the MCP session restarts, reload the wallet secret and agent token from env before retrying paid actions.
