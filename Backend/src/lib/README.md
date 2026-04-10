# Backend Lib

I use this folder for small shared domain helpers that multiple backend modules depend on.

## Architectural Decisions And Tradeoffs

- I keep only narrow shared logic here so cross-module helpers stay easy to reason about.
- I avoid turning this folder into a generic utility dump because task state and money rules should stay explicit.

## File Navigation

To find claimant-type matching logic visit [claimantType.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/lib/claimantType.ts).
To find task state-machine logic visit [taskStateMachine.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/lib/taskStateMachine.ts).

The claimant-type helper can be found in [claimantType.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/lib/claimantType.ts).
The task state machine can be found in [taskStateMachine.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/lib/taskStateMachine.ts).
