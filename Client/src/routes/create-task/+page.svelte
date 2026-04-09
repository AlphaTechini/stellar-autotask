<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let submitting = $state(false);
	const nativeAssetCode = 'XLM';
</script>

<svelte:head>
	<title>Create Task | Stellar Autotask</title>
</svelte:head>

<main class="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
	<div class="mx-auto max-w-4xl space-y-8">
		<header class="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
			<p class="text-xs font-semibold tracking-[0.3em] text-cyan-400 uppercase">Create task</p>
			<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
				Create a writing task
			</h1>
			<p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
				Set the writing brief, native XLM payout, and review window here. After creation, I send you
				straight into the task hub so funding is the immediate next step.
			</p>

			<div class="mt-6 grid gap-4 md:grid-cols-3">
				<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
					<div class="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
						1. Brief
					</div>
					<p class="mt-3 text-sm leading-6 text-slate-300">
						Give the writer a clear outcome, a concrete audience, and a tone they can follow without
						guessing.
					</p>
				</div>
				<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
					<div class="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">2. Pay</div>
					<p class="mt-3 text-sm leading-6 text-slate-300">
						Set the native XLM payout that should unlock the brief once you confirm funding on
						Stellar Testnet.
					</p>
				</div>
				<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
					<div class="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">3. Fund</div>
					<p class="mt-3 text-sm leading-6 text-slate-300">
						Creation only saves the draft. The worker-facing flow starts after you fund from the
						task hub.
					</p>
				</div>
			</div>
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
					<p class="mb-3 text-sm leading-6 text-slate-400">
						Name the deliverable the way you want it to appear in the workflow. Good titles make the
						task easy to scan later in the dashboard and marketplace.
					</p>
					<input
						id="title"
						name="title"
						placeholder={data.createdFromExamples.title}
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
						value={form?.values?.title ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="brief"> Brief </label>
					<p class="mb-3 text-sm leading-6 text-slate-400">
						Keep this to the one-line assignment summary. It should read well in cards before
						someone opens the full brief.
					</p>
					<input
						id="brief"
						name="brief"
						maxlength="100"
						placeholder={data.createdFromExamples.brief}
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
						value={form?.values?.brief ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="requiredKeywords">
						Keywords
					</label>
					<p class="mb-3 text-sm leading-6 text-slate-400">
						Add only the phrases that truly must appear or be covered. Use commas to separate them.
					</p>
					<input
						id="requiredKeywords"
						name="requiredKeywords"
						placeholder={data.createdFromExamples.requiredKeywords}
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
						value={form?.values?.requiredKeywords ?? ''}
					/>
				</div>

				<div class="md:col-span-2">
					<label class="mb-2 block text-sm font-medium text-slate-200" for="description">
						Description
					</label>
					<p class="mb-3 text-sm leading-6 text-slate-400">
						Spell out the structure, must-cover points, exclusions, and any context the writer needs
						before they start drafting.
					</p>
					<textarea
						id="description"
						name="description"
						rows="6"
						placeholder="Explain the deliverable, the core points to cover, anything the writer should avoid, and how success will be judged."
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
						required>{form?.values?.description ?? ''}</textarea
					>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="targetAudience">
						Target audience
					</label>
					<p class="mb-3 text-sm leading-6 text-slate-400">
						Be specific about who should understand this piece when it is finished.
					</p>
					<input
						id="targetAudience"
						name="targetAudience"
						placeholder={data.createdFromExamples.targetAudience}
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
						value={form?.values?.targetAudience ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="tone">Tone</label>
					<p class="mb-3 text-sm leading-6 text-slate-400">
						Describe how the writing should feel, not just the topic it should cover.
					</p>
					<input
						id="tone"
						name="tone"
						placeholder={data.createdFromExamples.tone}
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
						value={form?.values?.tone ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="minWordCount">
						Minimum word count
					</label>
					<p class="mb-3 text-sm leading-6 text-slate-400">
						Set the floor for the first acceptable draft, not the ideal maximum length.
					</p>
					<input
						id="minWordCount"
						name="minWordCount"
						type="number"
						min="0"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
						value={form?.values?.minWordCount ?? 0}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="payoutAmount">
						Payout amount
					</label>
					<p class="mb-3 text-sm leading-6 text-slate-400">
						This exact XLM amount is what the funding step will ask you to confirm on Testnet, so
						set it to match the real effort of the brief.
					</p>
					<input
						id="payoutAmount"
						name="payoutAmount"
						placeholder="125.0000000"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
						value={form?.values?.payoutAmount ?? ''}
						required
					/>
					<p class="mt-3 text-sm leading-6 text-slate-400">
						Calibrate against the minimum word count, research depth, and how opinionated the brief
						is. If the amount feels too low here, it will still feel too low when you fund it.
					</p>
				</div>

				<div>
					<div class="mb-2 block text-sm font-medium text-slate-200">Funding asset</div>
					<div class="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
						<div class="text-sm font-semibold text-white">{nativeAssetCode}</div>
						<p class="mt-1 text-sm leading-6 text-cyan-100">
							Native Stellar Lumens on Testnet is the only supported funding path in this launch
							flow, so the next screen will take you into XLM funding directly.
						</p>
					</div>
					<input type="hidden" id="currencyAsset" name="currencyAsset" value={nativeAssetCode} />
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="reviewWindowHours">
						Review window hours
					</label>
					<p class="mb-3 text-sm leading-6 text-slate-400">
						Set how long the client review window should stay open after submission lands.
					</p>
					<input
						id="reviewWindowHours"
						name="reviewWindowHours"
						type="number"
						min="1"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
						value={form?.values?.reviewWindowHours ?? 24}
						required
					/>
				</div>

				<div class="md:col-span-2">
					<label class="mb-2 block text-sm font-medium text-slate-200" for="allowedClaimantType">
						Allowed claimant type
					</label>
					<p class="mb-3 text-sm leading-6 text-slate-400">
						Choose whether this brief is open to human workers, agents, or both before the task goes
						live.
					</p>
					<select
						id="allowedClaimantType"
						name="allowedClaimantType"
						class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
					>
						<option
							value="both"
							selected={(form?.values?.allowedClaimantType ?? 'both') === 'both'}
						>
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
				<p
					class="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
				>
					{form.error}
				</p>
			{/if}

			<div
				class="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm leading-6 text-cyan-100"
			>
				<div class="font-semibold text-white">What happens next</div>
				<p class="mt-2">
					When you create this task, I take you straight to the task hub with the payout amount
					already set. Funding that draft with native XLM is the step that makes it claimable.
				</p>
				<p class="mt-2">
					The funding screen uses the payout exactly as entered here, so this is the right place to
					sanity-check whether the brief and compensation still match.
				</p>
			</div>

			<div class="flex items-center justify-between gap-4">
				<p class="text-sm text-slate-400">
					Creation saves the brief as a draft first. Funding is the next move before workers can
					claim it.
				</p>
				<button
					class="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
					type="submit"
					disabled={submitting}
				>
					{submitting ? 'Creating draft...' : 'Create task and continue to funding'}
				</button>
			</div>
		</form>
	</div>
</main>
