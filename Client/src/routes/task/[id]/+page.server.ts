import { fail, redirect, error as kitError } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { BackendApiError, createBackendClient } from '$lib/server/backendApi';

const REPORTABLE_STATUSES = new Set([
	'SUBMITTED',
	'PENDING_REVIEW',
	'APPROVED',
	'AUTO_APPROVED',
	'REJECTED',
	'PAID'
]);

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
	const api = createBackendClient({ fetch, session: locals.session });

	try {
		const { task } = await api.getTask(params.id);
		const report =
			REPORTABLE_STATUSES.has(task.status) ? await api.getTaskReport(params.id) : null;

		return {
			task,
			report,
			session: locals.session?.user ?? null
		};
	} catch (error) {
		if (error instanceof BackendApiError) {
			throw kitError(error.status, error.message);
		}

		throw error;
	}
};

export const actions: Actions = {
	claim: async ({ params, fetch, locals }) => {
		if (!locals.session) {
			throw redirect(303, '/auth');
		}

		try {
			const api = createBackendClient({ fetch, session: locals.session });
			await api.claimTask(params.id);
			throw redirect(303, `/task/${params.id}`);
		} catch (error) {
			if (error instanceof BackendApiError) {
				return fail(error.status, {
					error: error.message
				});
			}

			throw error;
		}
	}
};
