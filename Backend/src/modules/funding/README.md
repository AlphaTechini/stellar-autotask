# Funding Module

I use this folder for task funding confirmation. This module owns the write path that records a verified funding transaction and makes a stored task claimable.

## Architectural Decisions And Tradeoffs

- I keep funding separate from task creation so the backend can store task details early without making them claimable too soon.
- I use one transaction for funding confirmation so the funding record and the task `OPEN` transition cannot drift apart.
- I validate the creator wallet, amount, and asset before opening the task so claimability depends on explicit money state.
- I reject unsupported task assets at the funding boundary so the live product path stays honest about its native XLM-only launch scope.

## File Navigation

To find funding route wiring visit [fundingRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/funding/fundingRoutes.ts).
To find funding orchestration logic visit [confirmTaskFunding.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/funding/confirmTaskFunding.ts).
To find funding request validation visit [fundingSchemas.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/funding/fundingSchemas.ts).
To find funding persistence logic visit [fundingWriteRepository.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/funding/fundingWriteRepository.ts).

The funding route module can be found in [fundingRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/funding/fundingRoutes.ts).
The funding request validation can be found in [fundingSchemas.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/funding/fundingSchemas.ts).
The task transition helper can be found in [../../lib/taskStateMachine.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/lib/taskStateMachine.ts).

