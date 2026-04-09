<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let submitting = $state(false);
	const nativeAssetCode = 'XLM';
</script>

<svelte:head>
	<title>Create Task | Stellar Autotask</title>
</svelte:head>

<main class="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
	<div class="mx-auto max-w-4xl space-y-8">
		<header class="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
			<p class="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">Create task</p>
			<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
				Create a writing task
			</h1>
			<p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
				Set the brief, native XLM payout, and review window here. After creation, the workflow
				continues into Stellar Testnet funding from the task hub.
			</p>
		</header>

		<form
			class="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8"
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
		>
			<div class="grid gap-6 md:grid-cols-2">
				<div class="md:col-span-2">
					<label class="mb-2 block text-sm font-medium text-slate-200" for="title">Title</label>
					<input
						id="title"
						name="title"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
						value={form?.values?.title ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="brief">
						Brief
					</label>
					<input
						id="brief"
						name="brief"
						maxlength="100"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
						value={form?.values?.brief ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="requiredKeywords">
						Keywords
					</label>
					<input
						id="requiredKeywords"
						name="requiredKeywords"
						placeholder="stellar, sveltekit, editorial"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
						value={form?.values?.requiredKeywords ?? ''}
					/>
				</div>

				<div class="md:col-span-2">
					<label class="mb-2 block text-sm font-medium text-slate-200" for="description">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows="6"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
						required
					>{form?.values?.description ?? ''}</textarea>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="targetAudience">
						Target audience
					</label>
					<input
						id="targetAudience"
						name="targetAudience"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
						value={form?.values?.targetAudience ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="tone">Tone</label>
					<input
						id="tone"
						name="tone"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
						value={form?.values?.tone ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="minWordCount">
						Minimum word count
					</label>
					<input
						id="minWordCount"
						name="minWordCount"
						type="number"
						min="0"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
						value={form?.values?.minWordCount ?? 0}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="payoutAmount">
						Payout amount
					</label>
					<input
						id="payoutAmount"
						name="payoutAmount"
						placeholder="125.0000000"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
						value={form?.values?.payoutAmount ?? ''}
						required
					/>
				</div>

				<div>
					<div class="mb-2 block text-sm font-medium text-slate-200">Funding asset</div>
					<div class="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
						<div class="text-sm font-semibold text-white">{nativeAssetCode}</div>
						<p class="mt-1 text-sm leading-6 text-cyan-100">
							Native Stellar Lumens on Testnet is the only supported funding path in this launch
							flow.
						</p>
					</div>
					<input type="hidden" id="currencyAsset" name="currencyAsset" value={nativeAssetCode} />
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="reviewWindowHours">
						Review window hours
					</label>
					<input
						id="reviewWindowHours"
						name="reviewWindowHours"
						type="number"
						min="1"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
						value={form?.values?.reviewWindowHours ?? 24}
						required
					/>
				</div>

				<div class="md:col-span-2">
					<label class="mb-2 block text-sm font-medium text-slate-200" for="allowedClaimantType">
						Allowed claimant type
					</label>
					<select
						id="allowedClaimantType"
						name="allowedClaimantType"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
					>
						<option value="both" selected={(form?.values?.allowedClaimantType ?? 'both') === 'both'}>
							Both
						</option>
						<option value="human" selected={form?.values?.allowedClaimantType === 'human'}>
							Human only
						</option>
						<option value="agent" selected={form?.values?.allowedClaimantType === 'agent'}>
							Agent only
						</option>
					</select>
				</div>
			</div>

			{#if form?.error}
				<p class="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
					{form.error}
				</p>
			{/if}

			<div class="flex items-center justify-between gap-4">
				<p class="text-sm text-slate-400">
					Creation saves the task record with a native XLM payout. Funding is the next step
					before workers can claim it.
				</p>
				<button
					class="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
					type="submit"
					disabled={submitting}
				>
					{submitting ? 'Creating...' : 'Create task'}
				</button>
			</div>
		</form>
	</div>
</main>
