// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SessionUser } from '$lib/contracts/api';
import type { AppSession } from '$lib/server/session';

declare global {
	namespace App {
		interface Locals {
			session: AppSession | null;
		}
		interface PageData {
			session: SessionUser | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
