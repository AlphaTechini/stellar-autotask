# Backend Modules

I use this folder for feature modules so route wiring, validation, and domain services stay close to the workflow they own.

## Architectural Decisions And Tradeoffs

- I split modules by product capability so auth, tasks, and payouts can evolve without one central file taking over.
- I keep write-path orchestration inside modules and push direct database mutations into small repositories when the write needs to stay consistent.

## File Navigation

To find wallet authentication logic visit [auth/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/auth/README.md).
To find task claim logic visit [claims/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/claims/README.md).
To find task funding logic visit [funding/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/funding/README.md).
To find task creation and task read logic visit [tasks/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/tasks/README.md).
To find user write-path logic visit [users/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/users/README.md).

The wallet authentication module can be found in [auth/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/auth/README.md).
The claim module can be found in [claims/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/claims/README.md).
The funding module can be found in [funding/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/funding/README.md).
The task module can be found in [tasks/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/tasks/README.md).
The user repository module can be found in [users/README.md](C:/Hackathons/Stellar%201/stellar-platform/Backend/src/modules/users/README.md).

