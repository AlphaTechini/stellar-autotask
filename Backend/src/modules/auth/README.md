# Auth Module

I use this folder for wallet authentication. This is the first real backend write path because successful wallet verification can create the user profile that later task, funding, and payout flows depend on.

## Architectural Decisions And Tradeoffs

- I use a short-lived Stellar transaction challenge so the backend verifies wallet control before issuing an app token.
- I keep challenge verification stateless for now because it is fast to ship and safe enough when paired with a short expiry and backend signature checks.
- I route all user creation and profile mutation through the user repository so `updatedAt` stays consistent across write paths.

## File Navigation

To find wallet auth route wiring visit [walletAuthRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/auth/walletAuthRoutes.ts).
To find challenge creation logic visit [createWalletChallenge.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/auth/createWalletChallenge.ts).
To find challenge verification logic visit [verifyWalletChallenge.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/auth/verifyWalletChallenge.ts).
To find token issuance logic visit [issueAuthToken.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/auth/issueAuthToken.ts).

The auth route module can be found in [walletAuthRoutes.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/auth/walletAuthRoutes.ts).
The user creation connection can be found in [../users/userWriteRepository.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/users/userWriteRepository.ts).

