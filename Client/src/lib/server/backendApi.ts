import { getBackendBaseUrl } from './backendConfig';
import type {
	AuthSuccess,
	CreateTaskInput,
	FundTaskInput,
	FundingRecord,
	SubmitTaskInput,
	TaskPayoutStatus,
	TaskFilters,
	TaskRecord,
	TaskReportSnapshot,
	WalletChallenge
} from '$lib/contracts/api';
import type { AppSession } from './session';

type RequestOptions = {
	method?: 'GET' | 'POST';
	body?: unknown;
};

type BackendClientContext = {
	fetch: typeof globalThis.fetch;
	session: AppSession | null;
};

type DevLoginInput = {
	username: string;
	walletAddress: string;
	role: 'client' | 'worker';
};

export class BackendApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

function createQueryString(filters: TaskFilters) {
	const query = new URLSearchParams();

	for (const [key, value] of Object.entries(filters)) {
		if (value) {
			query.set(key, value);
		}
	}

	const serialized = query.toString();
	return serialized ? `?${serialized}` : '';
}

async function apiRequest<T>(
	context: BackendClientContext,
	path: string,
	options: RequestOptions = {}
) {
	const headers = new Headers();

	if (options.body !== undefined) {
		headers.set('content-type', 'application/json');
	}

	if (context.session?.token) {
		headers.set('authorization', `Bearer ${context.session.token}`);
	}

	const response = await context.fetch(`${getBackendBaseUrl()}${path}`, {
		method: options.method ?? 'GET',
		headers,
		body: options.body !== undefined ? JSON.stringify(options.body) : undefined
	});

	if (!response.ok) {
		let message = `Backend request failed with status ${response.status}.`;

		try {
			const payload = (await response.json()) as { message?: string; error?: string };
			message = payload.message ?? payload.error ?? message;
		} catch {
			// Keep the generic message when the backend returns no JSON body.
		}

		throw new BackendApiError(message, response.status);
	}

	return (await response.json()) as T;
}

export function createBackendClient(context: BackendClientContext) {
	return {
		devLogin(input: DevLoginInput) {
			return apiRequest<AuthSuccess>(context, '/dev/auth/login', {
				method: 'POST',
				body: input
			});
		},
		requestWalletChallenge(input: { walletAddress: string }) {
			return apiRequest<WalletChallenge>(context, '/auth/wallet/challenge', {
				method: 'POST',
				body: input
			});
		},
		verifyWallet(input: { transactionXdr: string; username?: string }) {
			return apiRequest<AuthSuccess>(context, '/auth/wallet/verify', {
				method: 'POST',
				body: input
			});
		},
		listTasks(filters: TaskFilters = {}) {
			return apiRequest<{ tasks: TaskRecord[] }>(context, `/tasks${createQueryString(filters)}`);
		},
		getTask(id: string) {
			return apiRequest<{ task: TaskRecord }>(context, `/tasks/${id}`);
		},
		getTaskReport(id: string) {
			return apiRequest<TaskReportSnapshot>(context, `/tasks/${id}/report`);
		},
		getTaskPayoutStatus(id: string) {
			return apiRequest<{ payoutStatus: TaskPayoutStatus }>(context, `/tasks/${id}/payout-status`);
		},
		createTask(input: CreateTaskInput) {
			return apiRequest<{ task: TaskRecord }>(context, '/tasks', {
				method: 'POST',
				body: input
			});
		},
		fundTask(id: string, input: FundTaskInput) {
			return apiRequest<{ task: TaskRecord; funding: FundingRecord }>(
				context,
				`/tasks/${id}/fund`,
				{
					method: 'POST',
					body: input
				}
			);
		},
		claimTask(id: string) {
			return apiRequest<{ task: TaskRecord }>(context, `/tasks/${id}/claim`, {
				method: 'POST'
			});
		},
		submitTask(id: string, input: SubmitTaskInput) {
			return apiRequest<{
				task: TaskRecord;
				submission: {
					id: string;
					taskId: string;
					workerId: string;
					contentText: string;
					notes: string | null;
					documentUrl: string | null;
					submittedAt: string;
					createdAt: string;
				};
				verificationReport: {
					id: string;
					taskId: string;
					submissionId: string;
					summary: string;
					score: number;
					keywordCoverage: string[];
					missingRequirements: string[];
					toneMatch: boolean;
					audienceFit: boolean;
					recommendation: 'approve' | 'manual_review' | 'reject';
					createdAt: string;
				};
			}>(context, `/tasks/${id}/submit`, {
				method: 'POST',
				body: input
			});
		},
		approveTask(id: string) {
			return apiRequest<{
				task: TaskRecord;
				payout: {
					id: string;
					taskId: string;
					amount: string;
					assetCode: string;
					workerWalletAddress: string;
					txHash: string | null;
					status: 'pending' | 'confirmed' | 'failed';
					triggeredBy: 'client' | 'system' | 'agent';
					paidAt: string | null;
					createdAt: string;
				};
			}>(context, `/tasks/${id}/approve`, {
				method: 'POST'
			});
		},
		rejectTask(id: string, input: { reason: string }) {
			return apiRequest<{
				task: TaskRecord;
				reviewDecision: {
					id: string;
					taskId: string;
					reviewerUserId: string;
					decision: 'approve' | 'reject';
					reason: string | null;
					createdAt: string;
				};
			}>(context, `/tasks/${id}/reject`, {
				method: 'POST',
				body: input
			});
		}
	};
}
