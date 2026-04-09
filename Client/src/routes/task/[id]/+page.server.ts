import { fail, redirect, error as kitError } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getPlatformFundingWallet,
	getStellarHorizonUrl,
	getStellarNetworkPassphrase
} from '$lib/server/backendConfig';
import { BackendApiError, createBackendClient } from '$lib/server/backendApi';

const REPORTABLE_STATUSES = new Set([
	'SUBMITTED',
	'PENDING_REVIEW',
	'APPROVED',
	'AUTO_APPROVED',
	'REJECTED',
	'PAID'
]);
const STELLAR_TX_HASH_PATTERN = /^[A-Fa-f0-9]{64}$/;
const NATIVE_ASSET_CODE = 'XLM';

export const load: PageServerLoad = async ({ params, fetch, locals, url }) => {
	const api = createBackendClient({ fetch, session: locals.session });

	try {
		const [{ task }, { payoutStatus }] = await Promise.all([
			api.getTask(params.id),
			api.getTaskPayoutStatus(params.id)
		]);
		const report = REPORTABLE_STATUSES.has(task.status) ? await api.getTaskReport(params.id) : null;

		return {
			task,
			report,
			payoutStatus,
			highlightFundingStep: url.searchParams.get('from') === 'create-task',
			platformFundingWallet: getPlatformFundingWallet(),
			stellarHorizonUrl: getStellarHorizonUrl(),
			stellarNetworkPassphrase: getStellarNetworkPassphrase(),
			session: locals.session?.user ?? null
		};
	} catch (error) {
		if (error instanceof BackendApiError) {
			throw kitError(error.status, error.message);
		}

		throw error;
	}
};

export const actions: Actions = {
	claim: async ({ params, fetch, locals }) => {
		if (!locals.session) {
			throw redirect(303, '/auth');
		}

		try {
			const api = createBackendClient({ fetch, session: locals.session });
			await api.claimTask(params.id);
			throw redirect(303, `/task/${params.id}/submit`);
		} catch (error) {
			if (error instanceof BackendApiError) {
				return fail(error.status, {
					error: error.message
				});
			}

			throw error;
		}
	},
	fund: async (event) => {
		const session = localsSession(event);
		const platformFundingWallet = getPlatformFundingWallet();
		const formData = await event.request.formData();
		const values = {
			amount: String(formData.get('amount') ?? '').trim(),
			assetCode: String(formData.get('assetCode') ?? '')
				.trim()
				.toUpperCase(),
			txHash: String(formData.get('txHash') ?? '').trim()
		};

		if (!platformFundingWallet) {
			return fail(500, {
				intent: 'fund',
				error: 'The platform funding wallet is not configured for this frontend environment yet.',
				values
			});
		}

		if (!values.amount || !values.assetCode || !STELLAR_TX_HASH_PATTERN.test(values.txHash)) {
			return fail(400, {
				intent: 'fund',
				error: 'Amount, asset, and a valid 64-character Stellar transaction hash are required.',
				values
			});
		}

		if (values.assetCode !== NATIVE_ASSET_CODE) {
			return fail(400, {
				intent: 'fund',
				error: 'This frontend currently records native XLM funding only.',
				values: {
					...values,
					assetCode: NATIVE_ASSET_CODE
				}
			});
		}

		try {
			const api = createBackendClient({ fetch: event.fetch, session });
			await api.fundTask(event.params.id, {
				amount: values.amount,
				assetCode: NATIVE_ASSET_CODE,
				txHash: values.txHash,
				fromWalletAddress: session.user.walletAddress,
				toWalletAddress: platformFundingWallet
			});

			throw redirect(303, `/task/${event.params.id}`);
		} catch (error) {
			if (error instanceof BackendApiError) {
				return fail(error.status, {
					intent: 'fund',
					error: error.message,
					values: {
						...values,
						assetCode: NATIVE_ASSET_CODE
					}
				});
			}

			throw error;
		}
	}
};

function localsSession(event: Parameters<Actions['fund']>[0]) {
	if (!event.locals.session) {
		throw redirect(303, '/auth');
	}

	return event.locals.session;
}
