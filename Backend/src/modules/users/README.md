# Users Module

I use this folder for user persistence logic that should stay reusable across auth, tasks, and later audit flows.

## Architectural Decisions And Tradeoffs

- I centralize user writes here so profile updates and future activity-related mutations share the same `updatedAt` behavior.
- I keep the repository narrow instead of creating a generic data-access layer that would hide important write rules.

## File Navigation

To find user upsert logic visit [userWriteRepository.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/users/userWriteRepository.ts).

The user write path can be found in [userWriteRepository.ts](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/users/userWriteRepository.ts).

