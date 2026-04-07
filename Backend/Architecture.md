# Backend Architecture

## Purpose

I am building a Fastify backend for a narrow V1 of an AI-assisted task payment platform on Stellar.

The product promise is simple:

`create task -> fund task -> claim task -> submit work -> verify -> pay`

The backend exists to make that loop reliable. The frontend can be polished later, but the backend has to be correct about state, funding, review, and payout.

## Product Scope

### Supported In V1

- Task type: content writing only
- Actors: client, worker, optional agent, system admin
- Payments: Stellar Testnet funding plus native XLM payout through a Soroban payout contract
- Verification: deterministic checks plus AI review
- Review: manual approve or reject, plus delayed auto-release
- Agent participation: API or MCP-style access that reuses the same domain flow

### Explicit Non-Goals

- GitHub PR verification as the first task type
- Design verification as the first task type
- Multi-agent negotiation
- Full OpenClaw skill layer
- x402 as the core internal payment flow
- Complex dispute handling
- Reputation systems
- Smart-contract escrow for V1
- Multi-chain support
- Tax or compliance layers
- Dynamic marketplace pricing
- Agent-to-agent chat

## Why Fastify

I chose Fastify for this backend because it fits the real constraints better than a heavier framework and gets me to a clean demo faster than Go for this specific build.

### Benefits

- Plugin-based structure makes it easy to keep one feature per file or per small module.
- JSON schema support helps validate requests and responses consistently.
- Good performance without adding complexity that does not help the demo.
- Easy integration with AI SDKs and Stellar JavaScript tooling.

### Tradeoffs

- Go would give me stronger long-term domain rigidity for financial workflows.
- Fastify wins here because the hackathon needs faster implementation velocity while still allowing strong route validation and service separation.

## Architecture Principles

- The backend is the source of truth for task states and payment eligibility.
- No payout can happen unless the task was funded, approved or auto-approved, and no prior payout exists.
- AI is not allowed to replace deterministic checks.
- Agent actions must use the same domain rules as human actions.
- The worker and verifier must stay separate.
- Every money-related action must be logged with `taskId`, timestamp, and transaction metadata.
- Secrets stay in `.env` and never reach the frontend.

## Core Domain Loop

### Happy Path

1. A client creates a writing task.
2. The client funds the task on Stellar.
3. The task becomes claimable.
4. A worker claims the task.
5. The worker submits writing.
6. The system runs deterministic checks.
7. The verifier service runs AI evaluation against the brief.
8. The task moves into review.
9. The client approves.
10. The backend payout service invokes the Soroban payout contract.
11. The contract sends native XLM to the worker wallet and emits `task_paid`.
12. The backend stores the payout transaction hash and contract result.

### Auto-Release Path

1. Submission enters review.
2. The backend computes `reviewDeadline`.
3. A scheduler checks pending review tasks.
4. If the deadline passed, no rejection exists, funding exists, and no payout exists, the payout service runs.

### Reject Path

1. Submission enters review.
2. The client rejects with a reason.
3. The task becomes `REJECTED`.
4. No payout runs.

## Actor Model

### Client

- Creates tasks
- Funds tasks
- Reviews verification results
- Approves or rejects submissions
- Authenticates with a Stellar wallet
- Has a username for display in the product UI

### Worker

- Browses open tasks
- Claims one funded task
- Submits writing work
- Receives payout after approval or auto-release
- Authenticates with a Stellar wallet
- Has a username for display in the product UI

### Agent

- Can create tasks through an authenticated machine interface
- Can fund tasks
- Can browse open tasks
- Can claim tasks
- Can submit work
- Can fetch task status and verification outputs
- Must have a wallet because funding and payout participation are real economic actions

### Verifier

- Evaluates submissions independently from the worker
- Produces structured reports
- Recommends `approve`, `manual_review`, or `reject`

### Platform

- Stores task state
- Tracks funding and payout eligibility
- Schedules delayed release
- Records transaction history

## High-Level Components

### 1. API Layer

This is the Fastify HTTP entry point.

Responsibilities:

- Route registration
- Request validation
- Authentication hooks
- Response shaping
- Versioned API boundaries

Suggested structure:

```text
Backend/src/routes/
```

### 2. Auth Module

Responsibilities:

- Perform wallet-based sign-in
- Create or load a user profile by wallet address
- Issue session or auth token after wallet proof
- Agent token validation
- Role-aware request context

Notes:

- Wallet-based authentication is the correct fit for V1 because users receive and send value on Stellar Testnet.
- A username should still be collected because the UI needs readable actor identity like who funded, claimed, or approved a task.
- Agent access can use API keys or bearer tokens.
- Wallet ownership proof should not be deferred for human users because wallet identity is part of the actual payment loop.

### 3. Task Module

Responsibilities:

- Create tasks
- List tasks
- Read task details
- Enforce state transitions
- Attach review settings and task requirements

This is the main domain module and should hold the state machine rules in one place.

### 4. Funding Module

Responsibilities:

- Link a Stellar funding transaction to a task
- Mark the task as funded after verification of the deposit event or successful demo action
- Prevent claims on unfunded tasks

Tradeoff:

- For V1 I am using backend-held funded budget tracking instead of on-chain escrow. That is less trustless, but much easier to finish correctly.

### 5. Claiming Module

Responsibilities:

- Allow one worker to claim one open funded task
- Prevent duplicate claims
- Lock the task to the worker in V1

### 6. Submission Module

Responsibilities:

- Accept content text, notes, and optional document URL
- Ensure only the assigned worker can submit
- Store submission data and timestamps
- Trigger verification

### 7. Verification Module

Responsibilities:

- Run deterministic checks first
- Run AI review second
- Persist a structured verification report
- Move the task into `PENDING_REVIEW`

Deterministic checks:

- Word count
- Required keywords
- Required field presence

AI checks:

- Tone fit
- Audience fit
- Brief adherence
- Structure completeness
- CTA presence if required

### 8. Review Module

Responsibilities:

- Allow approve now
- Allow reject with reason
- Set `reviewDeadline`
- Move task into terminal review outcomes

### 9. Payout Module

Responsibilities:

- Check payout eligibility
- Execute Stellar transfer
- Record transaction hash
- Mark payout result
- Prevent double payout with idempotency guards

This module should be the only place allowed to trigger real payout execution.

### 10. Scheduler Module

Responsibilities:

- Poll pending review tasks on a short interval
- Detect expired review windows
- Trigger payout when allowed
- Reuse the same payout path as manual approval

### 11. Agent Access Layer

Responsibilities:

- Expose machine-friendly endpoints or MCP wrappers
- Validate agent credentials
- Reuse existing task, funding, claim, submission, and status services

Important rule:

This layer is an interface adapter, not a second business logic implementation.

## Suggested Fastify Project Shape

```text
Backend/
|-- src/
|   |-- app/
|   |   |-- buildServer.ts
|   |   `-- registerPlugins.ts
|   |-- config/
|   |   |-- env.ts
|   |   `-- constants.ts
|   |-- modules/
|   |   |-- auth/
|   |   |-- tasks/
|   |   |-- funding/
|   |   |-- claims/
|   |   |-- submissions/
|   |   |-- verification/
|   |   |-- review/
|   |   |-- payouts/
|   |   `-- agents/
|   |-- plugins/
|   |   |-- authContext.ts
|   |   |-- database.ts
|   |   `-- scheduler.ts
|   |-- services/
|   |   |-- stellar/
|   |   `-- ai/
|   |-- lib/
|   |   |-- stateMachine.ts
|   |   |-- idempotency.ts
|   |   `-- errors.ts
|   |-- db/
|   |   |-- schema/
|   |   `-- repositories/
|   |-- types/
|   |   `-- domain.ts
|   `-- server.ts
|-- Dockerfile
|-- package.json
|-- pnpm-lock.yaml
|-- tsconfig.json
|-- .env.example
|-- README.md
`-- Architecture.md
```

## State Machine

### Primary States

- `DRAFT`
- `FUNDED`
- `OPEN`
- `CLAIMED`
- `SUBMITTED`
- `PENDING_REVIEW`
- `APPROVED`
- `AUTO_APPROVED`
- `REJECTED`
- `PAID`

### Transition Rules

- `DRAFT -> FUNDED`
- `FUNDED -> OPEN`
- `OPEN -> CLAIMED`
- `CLAIMED -> SUBMITTED`
- `SUBMITTED -> PENDING_REVIEW`
- `PENDING_REVIEW -> APPROVED`
- `PENDING_REVIEW -> AUTO_APPROVED`
- `PENDING_REVIEW -> REJECTED`
- `APPROVED -> PAID`
- `AUTO_APPROVED -> PAID`

### Invariants

- Only funded tasks can open.
- Only open tasks can be claimed.
- Only claimed tasks can receive submissions.
- Every submitted task must produce one verification report.
- Only pending review tasks can be approved, rejected, or auto-approved.
- `PAID` is terminal.
- A task can have at most one payout record with a successful terminal outcome.

## Data Model

### User

- `id`
- `username`
- `role`
- `stellarWalletAddress`
- `authType`
- `createdAt`

### Task

- `id`
- `clientId`
- `workerId`
- `title`
- `description`
- `brief`
- `requiredKeywords`
- `targetAudience`
- `tone`
- `minWordCount`
- `payoutAmount`
- `currencyAsset`
- `status`
- `reviewWindowHours`
- `reviewDeadline`
- `allowedClaimantType`
- `createdAt`
- `updatedAt`

### TaskFunding

- `id`
- `taskId`
- `amount`
- `txHash`
- `status`
- `fundedAt`

### Submission

- `id`
- `taskId`
- `workerId`
- `contentText`
- `notes`
- `documentUrl`
- `submittedAt`

### VerificationReport

- `id`
- `taskId`
- `submissionId`
- `summary`
- `score`
- `keywordCoverage`
- `missingRequirements`
- `toneMatch`
- `audienceFit`
- `recommendation`
- `createdAt`

### Payout

- `id`
- `taskId`
- `amount`
- `workerWallet`
- `txHash`
- `status`
- `triggeredBy`
- `paidAt`

### Optional Supporting Tables

- `TaskEvent` for audit trail
- `AgentCredential` for machine access
- `ReviewDecision` for approve or reject history

## API Shape

### Auth

- `POST /auth/wallet/challenge`
- `POST /auth/wallet/verify`
- `POST /auth/logout`

### Tasks

- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks/:id/fund`
- `POST /tasks/:id/claim`
- `POST /tasks/:id/submit`
- `POST /tasks/:id/approve`
- `POST /tasks/:id/reject`

### Verification

- `POST /tasks/:id/verify`
- `GET /tasks/:id/report`

### Payout

- `POST /tasks/:id/payout`
- `GET /tasks/:id/payout-status`

### Agent Endpoints

- `POST /agent/create-task`
- `POST /agent/fund-task`
- `GET /agent/tasks/open`
- `GET /agent/tasks/:id/status`
- `POST /agent/tasks/:id/claim`
- `POST /agent/tasks/:id/submit`

## Verification Design

### Input To The Verifier

- Task brief
- Target audience
- Tone
- Required keywords
- Minimum word count
- Submitted content

### Output Schema

- `summary: string`
- `score: number`
- `keywordCoverage: string[]`
- `missingRequirements: string[]`
- `toneMatch: boolean`
- `audienceFit: boolean`
- `recommendation: "approve" | "manual_review" | "reject"`

### Failure Handling

If the AI verifier returns malformed output:

- Keep deterministic checks
- Mark verification as degraded
- Return a fallback report
- Do not block manual client review

That keeps the demo alive even if the model output is messy.

## Stellar Payment Design

### Funding Flow

- The client funds a platform-controlled demo wallet or monitored backend account.
- The funding event is linked to `taskId`.
- The backend records `txHash`, amount, asset, and timestamp.
- The task is not claimable until funding is confirmed in backend state.

### Payout Flow

- The payout service checks the task state, funding, worker wallet, and prior payout state.
- The backend invokes the Soroban payout contract with the locked admin identity.
- The contract sends native XLM from its balance to the worker wallet.
- The contract emits `task_paid`.
- The backend stores the resulting transaction hash and payout record.
- The task is marked paid only after the payout attempt succeeds.

### Security Notes

- Secret keys must stay backend-only.
- The frontend should only see public addresses, task IDs, and transaction hashes.
- Demo mode uses Stellar Testnet and native XLM for the payout contract, which avoids trustline friction but still requires backend secret handling discipline.
- Human users still need wallet addresses because payout destinations and funding identity are real parts of the demo flow.

## Soroban Payout Contract

### Role In The System

- The contract is a payout executor, not an escrow policy engine.
- The backend remains the source of truth for task approval and payout eligibility.
- The contract only performs the authorized XLM transfer and prevents duplicate payout by `taskId`.

### Contract Interface

- `init(admin, native_asset)`
- `pay_task(task_id, recipient, amount)`
- `has_payment(task_id)`
- `get_payment(task_id)`
- `get_admin()`

### Why This Contract Shape

- It keeps trustlines out of the user flow by using native XLM.
- It keeps payout authorization narrow by locking the admin at initialization.
- It allows both manual approval and auto-approval to reuse the same backend payout service and the same on-chain function.

## Agent And MCP Participation

### Supported V1 Machine Actions

- `create_task`
- `fund_task`
- `list_open_tasks`
- `get_task`
- `claim_task`
- `submit_task_work`
- `get_verification_report`
- `get_task_status`

### Design Rule

Machine actors and human actors should hit different interface endpoints if needed, but they must end up calling the same services underneath.

That keeps behavior consistent and avoids special cases that break the demo.

## Storage And Persistence

I need persistence that survives refresh and restarts. For V1, a relational database is the simplest fit because the state machine and audit records are structured.

Recommended direction:

- PostgreSQL for main storage
- Prisma or Drizzle if I want fast TypeScript schema work

Tradeoff:

- SQLite is faster for local setup, but PostgreSQL is better if I want fewer migration surprises before deployment.

## Validation Strategy

I want validation at three layers:

1. Request schema validation in Fastify routes
2. Domain transition validation in services
3. Database constraints where duplicate payout or invalid references would be dangerous

This layered approach is worth the extra effort because money logic breaks when validation only exists at the HTTP edge.

## Error Handling Strategy

- Return structured API errors with stable error codes.
- Distinguish validation errors from business rule violations.
- Record Stellar and verifier failures with enough metadata for demo recovery.
- Never silently swallow payout failures.

## Deployment Shape

### Local

- Fastify backend
- PostgreSQL
- Testnet Stellar wallet support for the platform and authenticated users
- AI provider key in `.env`

### Hosted

- Single backend deployment
- Managed database
- Cron or scheduled job for auto-release
- Secure environment variables

## Demo Priorities

The product must visibly show:

- Task creation
- Funding
- Claiming
- Submission
- AI verification
- Review state
- Payment execution
- Transaction record tied to task

If time gets tight, I should preserve those eight points before adding any wider marketplace behavior.

## Suggested Build Order

### Phase 1

- Fastify project setup
- Environment config
- Database schema
- Auth basics
- Task CRUD
- State machine foundation

### Phase 2

- Stellar funding flow
- Soroban payout contract deployment
- Backend payout-service integration
- Transaction logging

### Phase 3

- Submission flow
- Deterministic verification
- AI verification endpoint
- Verification report storage

### Phase 4

- Approve and reject flow
- Review deadline handling
- Scheduler-based auto-release
- Idempotent payout guard

### Phase 5

- Receipt and payout status view support
- Seed data
- Agent access endpoints
- Demo script and fallback plan

## Final Direction

This backend should feel boring in the best way:

- explicit states
- narrow task type
- strict payout rules
- visible audit trail
- one believable end-to-end loop

That is the right tradeoff for a hackathon build that still needs to look real.
