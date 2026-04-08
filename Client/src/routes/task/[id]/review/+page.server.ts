import { fail, redirect, error as kitError } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { BackendApiError, createBackendClient } from '$lib/server/backendApi';

const RECEIPT_STATUSES = new Set(['APPROVED', 'AUTO_APPROVED', 'PAID']);

export const load: PageServerLoad = async ({ params, fetch, locals, url }) => {
	if (!locals.session) {
		const redirectTo = encodeURIComponent(url.pathname);
		throw redirect(303, `/auth?redirectTo=${redirectTo}`);
	}

	try {
		const api = createBackendClient({ fetch, session: locals.session });
		const report = await api.getTaskReport(params.id);

		if (locals.session.user.role !== 'client') {
			throw kitError(403, 'Only clients can open the review flow.');
		}

		if (report.task.clientId !== locals.session.user.id) {
			throw kitError(403, 'Only the task creator can review this task.');
		}

		if (RECEIPT_STATUSES.has(report.task.status)) {
			throw redirect(303, `/task/${params.id}/receipt`);
		}

		if (report.task.status === 'REJECTED') {
			throw redirect(303, `/task/${params.id}/report`);
		}

		if (report.task.status !== 'PENDING_REVIEW') {
			throw redirect(303, `/task/${params.id}`);
		}

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

export const actions: Actions = {
	approve: async ({ params, fetch, locals }) => {
		if (!locals.session) {
			throw redirect(303, '/auth');
		}

		try {
			const api = createBackendClient({ fetch, session: locals.session });
			await api.approveTask(params.id);
			throw redirect(303, `/task/${params.id}/receipt`);
		} catch (error) {
			if (error instanceof BackendApiError) {
				return fail(error.status, {
					intent: 'approve',
					error: error.message
				});
			}

			throw error;
		}
	},
	reject: async ({ request, params, fetch, locals }) => {
		if (!locals.session) {
			throw redirect(303, '/auth');
		}

		const formData = await request.formData();
		const reason = String(formData.get('reason') ?? '').trim();

		if (!reason) {
			return fail(400, {
				intent: 'reject',
				error: 'A rejection reason is required before the task can be sent back.',
				values: {
					reason
				}
			});
		}

		try {
			const api = createBackendClient({ fetch, session: locals.session });
			await api.rejectTask(params.id, { reason });
			throw redirect(303, `/task/${params.id}/report`);
		} catch (error) {
			if (error instanceof BackendApiError) {
				return fail(error.status, {
					intent: 'reject',
					error: error.message,
					values: {
						reason
					}
				});
			}

			throw error;
		}
	}
};
