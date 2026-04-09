import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { BackendApiError, createBackendClient } from '$lib/server/backendApi';
import { requireSession } from '$lib/server/requireSession';

const NATIVE_ASSET_CODE = 'XLM';

function parseKeywords(rawValue: string) {
	return rawValue
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean);
}

export const load: PageServerLoad = async (event) => {
	const session = requireSession(event);

	return {
		session: session.user
	};
};

export const actions: Actions = {
	default: async (event) => {
		const session = requireSession(event);
		const formData = await event.request.formData();

		const values = {
			title: String(formData.get('title') ?? '').trim(),
			brief: String(formData.get('brief') ?? '').trim(),
			description: String(formData.get('description') ?? '').trim(),
			requiredKeywords: String(formData.get('requiredKeywords') ?? '').trim(),
			targetAudience: String(formData.get('targetAudience') ?? '').trim(),
			tone: String(formData.get('tone') ?? '').trim(),
			minWordCount: Number(formData.get('minWordCount') ?? 0),
			payoutAmount: String(formData.get('payoutAmount') ?? '').trim(),
			currencyAsset: String(formData.get('currencyAsset') ?? NATIVE_ASSET_CODE)
				.trim()
				.toUpperCase(),
			reviewWindowHours: Number(formData.get('reviewWindowHours') ?? 0),
			allowedClaimantType: String(formData.get('allowedClaimantType') ?? '').trim()
		};

		if (
			!values.title ||
			!values.brief ||
			!values.description ||
			!values.targetAudience ||
			!values.tone ||
			!values.payoutAmount ||
			values.currencyAsset !== NATIVE_ASSET_CODE ||
			values.minWordCount < 0 ||
			values.reviewWindowHours <= 0 ||
			!['human', 'agent', 'both'].includes(values.allowedClaimantType)
		) {
			return fail(400, {
				error:
					values.currencyAsset !== NATIVE_ASSET_CODE
						? 'Task creation currently supports native XLM funding only.'
						: 'All required task fields must be completed before creating a task.',
				values: {
					...values,
					currencyAsset: NATIVE_ASSET_CODE
				}
			});
		}

		try {
			const api = createBackendClient({ fetch: event.fetch, session });
			const result = await api.createTask({
				title: values.title,
				brief: values.brief,
				description: values.description,
				requiredKeywords: parseKeywords(values.requiredKeywords),
				targetAudience: values.targetAudience,
				tone: values.tone,
				minWordCount: values.minWordCount,
				payoutAmount: values.payoutAmount,
				currencyAsset: NATIVE_ASSET_CODE,
				reviewWindowHours: values.reviewWindowHours,
				allowedClaimantType: values.allowedClaimantType as 'human' | 'agent' | 'both'
			});

			throw redirect(303, `/task/${result.task.id}`);
		} catch (error) {
			if (error instanceof BackendApiError) {
				return fail(error.status, {
					error: error.message,
					values: {
						...values,
						currencyAsset: NATIVE_ASSET_CODE
					}
				});
			}

			throw error;
		}
	}
};
