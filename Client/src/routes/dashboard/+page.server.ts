import type { PageServerLoad } from './$types';
import { createBackendClient } from '$lib/server/backendApi';
import { requireSession } from '$lib/server/requireSession';

export const load: PageServerLoad = async (event) => {
	const session = requireSession(event);
	const api = createBackendClient({ fetch: event.fetch, session });

	const ownedTasksPromise = api.listTasks({ clientId: session.user.id });
	const assignedTasksPromise =
		session.user.role === 'worker'
			? api.listTasks({ workerId: session.user.id })
			: Promise.resolve({ tasks: [] });
	const openTasksPromise = api.listTasks({ status: 'OPEN' });

	const [ownedTasks, assignedTasks, openTasks] = await Promise.all([
		ownedTasksPromise,
		assignedTasksPromise,
		openTasksPromise
	]);

	return {
		session: session.user,
		ownedTasks: ownedTasks.tasks,
		assignedTasks: assignedTasks.tasks,
		openTasks: openTasks.tasks
	};
};
