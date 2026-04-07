# Review Module

I use this folder for review-state transitions that sit between verification and payout. Right now this module owns manual approval and hands off the money movement to the shared payout service.

## Architectural Decisions And Tradeoffs

- I keep approval separate from payout execution so the review path can stay explicit while still reusing one payout engine.
- I write the `PENDING_REVIEW -> APPROVED` transition and the review decision record together so approval state does not drift from audit history.
- I leave a clean seam for reject and future reviewer workflows without mixing them into the Soroban execution code.

## File Navigation

To find review route wiring visit [reviewRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/review/reviewRoutes.ts).
To find review param validation visit [reviewSchemas.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/review/reviewSchemas.ts).
To find manual approval orchestration visit [approveTask.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/review/approveTask.ts).

To find manual approval logic visit [approveTask.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/review/approveTask.ts).
The shared payout handoff can be found in [../payouts/stellarPayoutService.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/payouts/stellarPayoutService.ts).
