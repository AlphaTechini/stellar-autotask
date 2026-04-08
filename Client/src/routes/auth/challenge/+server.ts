import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BackendApiError, createBackendClient } from '$lib/server/backendApi';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const payload = (await request.json().catch(() => null)) as { walletAddress?: string } | null;
	const walletAddress = payload?.walletAddress?.trim().toUpperCase() ?? '';

	if (!walletAddress) {
		return json(
			{
				message: 'A Stellar wallet address is required before requesting a challenge.'
			},
			{ status: 400 }
		);
	}

	try {
		const api = createBackendClient({ fetch, session: null });
		const challenge = await api.requestWalletChallenge({ walletAddress });
		return json(challenge);
	} catch (error) {
		if (error instanceof BackendApiError) {
			return json(
				{
					message: error.message
				},
				{ status: error.status }
			);
		}

		return json(
			{
				message: 'Unable to request a wallet challenge right now.'
			},
			{ status: 500 }
		);
	}
};
