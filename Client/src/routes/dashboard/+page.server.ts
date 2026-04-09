import type { PageServerLoad } from './$types';
import { createBackendClient } from '$lib/server/backendApi';
import { requireSession } from '$lib/server/requireSession';
import type { TaskRecord, TaskStatus } from '$lib/contracts/api';

type DashboardActionGroup = {
	id: string;
	title: string;
	description: string;
	emptyState: string;
	ctaLabel: string;
	tasks: TaskRecord[];
};

const CLIENT_RECEIPT_STATUSES: TaskStatus[] = ['APPROVED', 'AUTO_APPROVED', 'PAID'];
const WORKER_RECEIPT_STATUSES: TaskStatus[] = ['APPROVED', 'AUTO_APPROVED', 'PAID'];

function byMostRecentUpdate(left: TaskRecord, right: TaskRecord) {
	return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

function pickTasks(tasks: TaskRecord[], statuses: TaskStatus[]) {
	return tasks.filter((task) => statuses.includes(task.status)).sort(byMostRecentUpdate);
}

function createGroup(
	id: string,
	title: string,
	description: string,
	emptyState: string,
	ctaLabel: string,
	tasks: TaskRecord[]
): DashboardActionGroup {
	return {
		id,
		title,
		description,
		emptyState,
		ctaLabel,
		tasks
	};
}

function createClientGroups(tasks: TaskRecord[]) {
	return [
		createGroup(
			'fund-next',
			'Fund next',
			'Draft tasks stay here until you push them into the marketplace with confirmed XLM funding.',
			'No draft tasks are waiting for funding right now.',
			'Open funding flow',
			pickTasks(tasks, ['DRAFT'])
		),
		createGroup(
			'review-next',
			'Review next',
			'These submissions are waiting for your decision so payout or revision can move forward.',
			'No tasks are waiting on your review right now.',
			'Open review',
			pickTasks(tasks, ['PENDING_REVIEW'])
		),
		createGroup(
			'receipt-next',
			'Receipt and payout',
			'Approved work lands here so you can confirm payout visibility without hunting through older tasks.',
			'No approved or paid tasks need receipt follow-up right now.',
			'Open receipt',
			pickTasks(tasks, CLIENT_RECEIPT_STATUSES)
		)
	];
}

function createWorkerGroups(tasks: TaskRecord[]) {
	return [
		createGroup(
			'submit-next',
			'Submit next',
			'Claimed tasks stay here until you hand in the writing and move them into verification.',
			'No claimed writing tasks are waiting on your submission right now.',
			'Continue submission',
			pickTasks(tasks, ['CLAIMED'])
		),
		createGroup(
			'report-next',
			'Report and feedback',
			'Submitted and reviewed work stays here while you track verification, review outcomes, and payout readiness.',
			'No submitted tasks need a report follow-up right now.',
			'Open report',
			pickTasks(tasks, ['SUBMITTED', 'PENDING_REVIEW', 'REJECTED'])
		),
		createGroup(
			'receipt-next',
			'Receipt and payout',
			'Approved and paid work stays here so you can jump straight to payout visibility.',
			'No approved or paid tasks need a receipt check right now.',
			'Open receipt',
			pickTasks(tasks, WORKER_RECEIPT_STATUSES)
		)
	];
}

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
		openTasks: openTasks.tasks,
		clientGroups: createClientGroups(ownedTasks.tasks),
		workerGroups: createWorkerGroups(assignedTasks.tasks)
	};
};
