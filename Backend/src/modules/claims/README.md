# Claims Module

I use this folder for task claiming. This module owns the `OPEN -> CLAIMED` write path and blocks self-claims so a creator cannot take their own task.

## Architectural Decisions And Tradeoffs

- I keep claiming separate from task creation so each write path owns one transition.
- I read first for clear business errors, then use a guarded update so concurrent claim attempts cannot silently overwrite each other.
- I update `workerId`, `status`, and `updatedAt` together so claim state stays internally consistent.

## File Navigation

To find claim route wiring visit [claimRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/claims/claimRoutes.ts).
To find claim orchestration logic visit [claimTask.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/claims/claimTask.ts).
To find claim persistence logic visit [claimTaskRepository.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/claims/claimTaskRepository.ts).

The claim route module can be found in [claimRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/claims/claimRoutes.ts).
The task transition helper can be found in [../../lib/taskStateMachine.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/lib/taskStateMachine.ts).

