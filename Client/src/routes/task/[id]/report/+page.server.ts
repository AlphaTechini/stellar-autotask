import { redirect, error as kitError } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BackendApiError, createBackendClient } from '$lib/server/backendApi';

const REPORTABLE_STATUSES = new Set([
	'SUBMITTED',
	'PENDING_REVIEW',
	'APPROVED',
	'AUTO_APPROVED',
	'REJECTED',
	'PAID'
]);

export const load: PageServerLoad = async ({ params, fetch, locals, url }) => {
	if (!locals.session) {
		const redirectTo = encodeURIComponent(url.pathname);
		throw redirect(303, `/auth?redirectTo=${redirectTo}`);
	}

	try {
		const api = createBackendClient({ fetch, session: locals.session });
		const { task } = await api.getTask(params.id);

		if (!REPORTABLE_STATUSES.has(task.status)) {
			throw redirect(303, `/task/${params.id}`);
		}

		const report = await api.getTaskReport(params.id);

		return {
			report,
			session: locals.session.user
		};
	} catch (error) {
		if (error instanceof BackendApiError) {
			throw kitError(error.status, error.message);
		}

		throw error;
	}
};
