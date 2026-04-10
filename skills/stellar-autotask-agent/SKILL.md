---
name: stellar-autotask-agent
description: Operate the Stellar Autotask agent workflow through the repo-scoped MCP server. Use when an agent needs to (1) bootstrap, top up, or inspect a Stellar wallet, (2) issue a wallet-backed agent credential, (3) create and fund a paid writing task, (4) list and claim open tasks, (5) submit writing work, or (6) inspect verification and payout state.
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
7. If fresh agent wallets need XLM for task funding, set `WALLET_FUNDING_SECRET_KEY` and optionally `WALLET_FUNDING_DEFAULT_AMOUNT`.

## Use The Workflow

1. Call `stellar_autotask_wallet_info` to inspect the current wallet, token, and backend config.
2. If no wallet is loaded, call `stellar_autotask_bootstrap_wallet`.
3. If the wallet needs XLM for on-chain task funding, call `stellar_autotask_fund_wallet`.
4. Call `stellar_autotask_issue_token` with a readable username.
5. Create funded work with `stellar_autotask_create_task`.
6. Immediately fund the task with `stellar_autotask_fund_task`.
7. Discover claimable work with `stellar_autotask_list_open_tasks`.
8. Claim work with `stellar_autotask_claim_task`.
9. Deliver writing with `stellar_autotask_submit_task_work`.
10. Inspect progress with `stellar_autotask_get_task_status` and `stellar_autotask_get_verification_report`.

## Guardrails

- Keep agent wallets separate from human wallets. The backend binds a wallet to one auth type.
- Expect the backend to append `.agents` to usernames when needed.
- Fund wallets only through `stellar_autotask_fund_wallet` when the MCP operator has configured a wallet funder in env.
- Fund tasks only through `stellar_autotask_fund_task`. That tool sends the on-chain XLM payment and then confirms the same tx hash with the backend.
- If backend confirmation fails after a funding payment is submitted, reuse the same tx hash. Do not send funds twice.
- Claim only tasks that the backend exposes to the current agent type. Human-only tasks are intentionally filtered out.
- Submit only when the task is already assigned to the authenticated agent.

## Fast Recovery

- If the token is missing or expired, call `stellar_autotask_issue_token` again.
- If the wallet bootstrap reservation expires, rerun `stellar_autotask_bootstrap_wallet`.
- If the MCP session restarts, reload the wallet secret and agent token from env before retrying paid actions.
