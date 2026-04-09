import { fail, redirect, error as kitError } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { BackendApiError, createBackendClient } from '$lib/server/backendApi';

export const load: PageServerLoad = async ({ params, fetch, locals, url }) => {
	if (!locals.session) {
		const redirectTo = encodeURIComponent(url.pathname);
		throw redirect(303, `/auth?redirectTo=${redirectTo}`);
	}

	try {
		const api = createBackendClient({ fetch, session: locals.session });
		const { task } = await api.getTask(params.id);

		if (task.workerId !== locals.session.user.id) {
			throw kitError(403, 'Only the assigned worker can submit work for this task.');
		}

		if (
			task.status === 'SUBMITTED' ||
			task.status === 'PENDING_REVIEW' ||
			task.status === 'APPROVED' ||
			task.status === 'AUTO_APPROVED' ||
			task.status === 'REJECTED' ||
			task.status === 'PAID'
		) {
			throw redirect(303, `/task/${params.id}/report`);
		}

		if (task.status !== 'CLAIMED') {
			throw redirect(303, `/task/${params.id}`);
		}

		return {
			task,
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
	default: async ({ request, params, fetch, locals }) => {
		if (!locals.session) {
			throw redirect(303, '/auth');
		}

		const formData = await request.formData();
		const contentText = String(formData.get('contentText') ?? '').trim();
		const notes = String(formData.get('notes') ?? '').trim();
		const documentUrl = String(formData.get('documentUrl') ?? '').trim();

		if (!contentText) {
			return fail(400, {
				error: 'Submission content is required.',
				values: {
					contentText,
					notes,
					documentUrl
				}
			});
		}

		try {
			const api = createBackendClient({ fetch, session: locals.session });
			await api.submitTask(params.id, {
				contentText,
				...(notes ? { notes } : {}),
				...(documentUrl ? { documentUrl } : {})
			});

			throw redirect(303, `/task/${params.id}/report`);
		} catch (error) {
			if (error instanceof BackendApiError) {
				return fail(error.status, {
					error: error.message,
					values: {
						contentText,
						notes,
						documentUrl
					}
				});
			}

			throw error;
		}
	}
};
