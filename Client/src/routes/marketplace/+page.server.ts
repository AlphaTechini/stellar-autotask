import type { PageServerLoad } from './$types';
import { createBackendClient } from '$lib/server/backendApi';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const api = createBackendClient({ fetch, session: locals.session });
	const { tasks } = await api.listTasks({ status: 'OPEN' });

	return {
		tasks,
		session: locals.session?.user ?? null
	};
};
