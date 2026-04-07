# Tasks Module

I use this folder for task creation and task reads. This module stores task requirements early, but the backend only makes a task claimable after the funding module confirms payment.

## Architectural Decisions And Tradeoffs

- I keep task creation separate from funding so task details can be saved before a payment is confirmed.
- I rely on the funding module to move tasks into `OPEN`, which keeps claimability tied to explicit money state.
- I keep list and detail reads narrow for V1 so the API reflects the real workflow instead of growing into generic search too early.

## File Navigation

To find task route wiring visit [taskRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/tasks/taskRoutes.ts).
To find task creation logic visit [createTask.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/tasks/createTask.ts).
To find task read logic visit [listTasks.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/tasks/listTasks.ts).
To find single-task lookup logic visit [getTaskById.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/tasks/getTaskById.ts).
To find task write persistence logic visit [taskWriteRepository.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/tasks/taskWriteRepository.ts).
To find task read persistence logic visit [taskReadRepository.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/tasks/taskReadRepository.ts).

The task creation module can be found in [createTask.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/tasks/createTask.ts).
The task state helper can be found in [../../lib/taskStateMachine.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/lib/taskStateMachine.ts).

