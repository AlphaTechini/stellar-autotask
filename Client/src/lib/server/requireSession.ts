import { redirect, type RequestEvent } from '@sveltejs/kit';

export function requireSession(event: RequestEvent) {
	if (!event.locals.session) {
		throw redirect(303, '/auth');
	}

	return event.locals.session;
}
