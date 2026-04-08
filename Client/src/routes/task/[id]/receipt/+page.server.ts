import { redirect, error as kitError } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BackendApiError, createBackendClient } from '$lib/server/backendApi';

const RECEIPT_VISIBLE_STATUSES = new Set([
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

		const isParticipant =
			task.clientId === locals.session.user.id || task.workerId === locals.session.user.id;

		if (!isParticipant) {
			throw kitError(403, 'Only the task client or assigned worker can open this payout route.');
		}

		if (!RECEIPT_VISIBLE_STATUSES.has(task.status)) {
			throw redirect(303, `/task/${params.id}`);
		}

		const [{ payoutStatus }, report] = await Promise.all([
			api.getTaskPayoutStatus(params.id),
			api.getTaskReport(params.id)
		]);

		return {
			task,
			report,
			payoutStatus,
			session: locals.session.user
		};
	} catch (error) {
		if (error instanceof BackendApiError) {
			throw kitError(error.status, error.message);
		}

		throw error;
	}
};
