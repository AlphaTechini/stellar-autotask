import type { PageServerLoad } from './$types';
import { createBackendClient } from '$lib/server/backendApi';
import { requireSession } from '$lib/server/requireSession';
import type { ClaimedTaskStatus, TaskClaimedSnapshot } from '$lib/contracts/api';

const CLAIMED_TAB_STATUSES: ClaimedTaskStatus[] = [
	'CLAIMED',
	'SUBMITTED',
	'PENDING_REVIEW',
	'APPROVED'
];

type SnapshotGroup = {
	status: ClaimedTaskStatus;
	tasks: TaskClaimedSnapshot[];
};

function groupSnapshots(tasks: TaskClaimedSnapshot[]): SnapshotGroup[] {
	const grouped = new Map<ClaimedTaskStatus, TaskClaimedSnapshot[]>();

	for (const status of CLAIMED_TAB_STATUSES) {
		grouped.set(status, []);
	}

	for (const snapshot of tasks) {
		const status = snapshot.task.status as ClaimedTaskStatus;
		const bucket = grouped.get(status);
		if (bucket) {
			bucket.push(snapshot);
		}
	}

	return CLAIMED_TAB_STATUSES.map((status) => ({
		status,
		tasks: grouped.get(status) ?? []
	}));
}

export const load: PageServerLoad = async (event) => {
	const session = requireSession(event);
	const api = createBackendClient({ fetch: event.fetch, session });
	const { tasks } = await api.listClaimedTasks();

	return {
		session: session.user,
		groups: groupSnapshots(tasks)
	};
};
