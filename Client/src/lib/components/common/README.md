# Common Components

I use this folder for reusable shell and framing components that should stay consistent across integrated routes.

## Architectural Decisions And Tradeoffs

- I keep shared app framing here so route files can stay focused on backend data and task actions instead of repeating shell markup.
- I let the app shell react to session state because signed-out, client, and worker users should see different navigation and primary actions.
- I keep landing-page-specific framing outside this folder because the homepage follows a distinct marketing-style presentation.

## File Navigation

To find the shared authenticated shell visit [AppShell.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/components/common/AppShell.svelte).

The shared app shell can be found in [AppShell.svelte](file:///C:/Hackathons/Stellar%201/stellar-autotask/Client/src/lib/components/common/AppShell.svelte).
