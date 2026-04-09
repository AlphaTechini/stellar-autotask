# Signout Route

I use this route for explicit session teardown from the shared app shell.

## Architectural Decisions And Tradeoffs

- I keep sign-out as a dedicated POST endpoint because the shared shell lives at the layout boundary and should not depend on page-only form actions.
- I clear the httpOnly session cookies here and redirect back to the homepage so logout stays predictable from any integrated route.

## File Navigation

To find sign-out session teardown visit [+server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/signout/+server.ts).

The sign-out endpoint can be found in [+server.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/routes/auth/signout/+server.ts).
