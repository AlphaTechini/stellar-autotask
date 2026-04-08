import { getBackendBaseUrl } from './backendConfig';
import type {
	AuthSuccess,
	CreateTaskInput,
	TaskFilters,
	TaskRecord,
	TaskReportSnapshot
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
		listTasks(filters: TaskFilters = {}) {
			return apiRequest<{ tasks: TaskRecord[] }>(
				context,
				`/tasks${createQueryString(filters)}`
			);
		},
		getTask(id: string) {
			return apiRequest<{ task: TaskRecord }>(context, `/tasks/${id}`);
		},
		getTaskReport(id: string) {
			return apiRequest<TaskReportSnapshot>(context, `/tasks/${id}/report`);
		},
		createTask(input: CreateTaskInput) {
			return apiRequest<{ task: TaskRecord }>(context, '/tasks', {
				method: 'POST',
				body: input
			});
		},
		claimTask(id: string) {
			return apiRequest<{ task: TaskRecord }>(context, `/tasks/${id}/claim`, {
				method: 'POST'
			});
		}
	};
}
