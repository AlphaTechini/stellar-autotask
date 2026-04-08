import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createBackendClient, BackendApiError } from '$lib/server/backendApi';
import { isDevAuthEnabled } from '$lib/server/backendConfig';
import { writeSession } from '$lib/server/session';

function resolveRedirectTarget(value: string | null) {
	if (!value || !value.startsWith('/')) {
		return '/dashboard';
	}

	return value;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.session) {
		throw redirect(303, '/dashboard');
	}

	return {
		redirectTo: resolveRedirectTarget(url.searchParams.get('redirectTo'))
	};
};

export const actions: Actions = {
	walletVerify: async ({ request, fetch, cookies, locals }) => {
		if (locals.session) {
			throw redirect(303, '/dashboard');
		}

		const formData = await request.formData();
		const username = String(formData.get('username') ?? '').trim();
		const role = String(formData.get('role') ?? '').trim();
		const transactionXdr = String(formData.get('transactionXdr') ?? '').trim();
		const redirectTo = resolveRedirectTarget(String(formData.get('redirectTo') ?? '').trim() || null);

		if (!transactionXdr) {
			return fail(400, {
				error: 'A signed wallet challenge is required before sign-in can continue.',
				values: {
					username,
					role
				}
			});
		}

		try {
			const api = createBackendClient({ fetch, session: null });
			const result = await api.verifyWallet({
				transactionXdr,
				...(username ? { username } : {}),
				...(role === 'client' || role === 'worker' ? { role } : {})
			});

			writeSession(cookies, {
				token: result.token,
				user: {
					id: result.user.id,
					username: result.user.username,
					role: result.user.role,
					walletAddress: result.user.walletAddress,
					authType: result.user.authType
				}
			});

			throw redirect(303, redirectTo);
		} catch (error) {
			if (error instanceof BackendApiError) {
				return fail(error.status, {
					error: error.message,
					values: {
						username,
						role
					}
				});
			}

			throw error;
		}
	},
	devLogin: async ({ request, fetch, cookies, locals }) => {
		if (locals.session) {
			throw redirect(303, '/dashboard');
		}

		if (!isDevAuthEnabled()) {
			return fail(404, {
				error: 'Development login is disabled for this frontend environment.'
			});
		}

		const formData = await request.formData();
		const username = String(formData.get('username') ?? '').trim();
		const walletAddress = String(formData.get('walletAddress') ?? '')
			.trim()
			.toUpperCase();
		const role = String(formData.get('role') ?? '').trim();

		if (!username || !walletAddress || (role !== 'client' && role !== 'worker')) {
			return fail(400, {
				error: 'Username, wallet address, and a supported role are required.',
				values: { username, walletAddress, role }
			});
		}

		try {
			const api = createBackendClient({ fetch, session: null });
			const result = await api.devLogin({ username, walletAddress, role });

			writeSession(cookies, {
				token: result.token,
				user: {
					id: result.user.id,
					username: result.user.username,
					role: result.user.role,
					walletAddress: result.user.walletAddress,
					authType: result.user.authType
				}
			});

			throw redirect(303, '/dashboard');
		} catch (error) {
			if (error instanceof BackendApiError) {
				return fail(error.status, {
					error: error.message,
					values: { username, walletAddress, role }
				});
			}

			throw error;
		}
	}
};
