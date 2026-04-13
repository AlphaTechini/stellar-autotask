# Review Module

I use this folder for review-state transitions and the frontend-facing review snapshot that sits between verification and payout.

## Architectural Decisions And Tradeoffs

- I keep approval and rejection separate from payout execution so review policy stays explicit while the money movement still flows through one shared payout engine.
- I write the task status transition and the review decision row together so audit history cannot drift from the current review state.
- I expose a unified review snapshot for the frontend so one fetch can return the active submission, verification report, latest review decision, and payout visibility without bloating the base task detail route.
- I only allow the task creator to approve or reject, and I block approvals if the creator is also the assigned worker.

## File Navigation

To find review route wiring visit [reviewRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/review/reviewRoutes.ts).
To find review param and rejection validation visit [reviewSchemas.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/review/reviewSchemas.ts).
To find manual approval orchestration visit [approveTask.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/review/approveTask.ts).
To find manual rejection orchestration visit [rejectTask.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/review/rejectTask.ts).
To find unified review snapshot reads visit [getTaskReviewSnapshot.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/review/getTaskReviewSnapshot.ts).

The shared payout handoff can be found in [../payouts/stellarPayoutService.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/stellarPayoutService.ts).
