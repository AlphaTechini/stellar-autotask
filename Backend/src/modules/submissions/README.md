# Submission Module

I use this folder for worker submissions and the first verification handoff into review. This module sanitizes text input, runs deterministic checks, stores a normalized verification report, and moves the task into `PENDING_REVIEW`.

## Architectural Decisions And Tradeoffs

- I keep submission orchestration separate from approval so the worker write path and the client payout path stay decoupled.
- I run deterministic checks immediately and store a stable verification report even when no model is configured, because that keeps the backend workflow real instead of blocked on AI integration.
- I sanitize submission input before persistence so control characters and malformed free-text input do not leak into the product state.

## File Navigation

To find submission route wiring visit [submissionRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/submissions/submissionRoutes.ts).
To find submission request validation visit [submissionSchemas.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/submissions/submissionSchemas.ts).
To find submission orchestration visit [submitTask.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/submissions/submitTask.ts).
To find transactional submission persistence visit [submissionWriteRepository.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/submissions/submissionWriteRepository.ts).
To find deterministic verification checks visit [deterministicSubmissionChecks.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/submissions/deterministicSubmissionChecks.ts).
To find input sanitization visit [sanitizeSubmissionInput.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/submissions/sanitizeSubmissionInput.ts).

The submission entrypoint can be found in [submitTask.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/submissions/submitTask.ts).

