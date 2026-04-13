<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let submitting = $state(false);
	const nativeAssetCode = 'XLM';
</script>

<svelte:head>
	<title>Create Task | Stellar Autotask</title>
</svelte:head>

<main class="min-h-screen bg-[#f7f4ea] px-6 py-12 text-black">
	<div class="mx-auto max-w-4xl space-y-8">
		<header class="rounded-3xl border border-black/10 bg-white p-8">
			<p class="text-xs font-semibold tracking-[0.3em] text-yellow-700 uppercase">Create task</p>
			<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-black">
				Create a writing task
			</h1>
			<p class="mt-3 max-w-2xl text-sm leading-6 text-neutral-700">
				Set the writing brief, native XLM payout, and review window here. After creation, I send you
				straight into the task hub so funding is the immediate next step.
			</p>

			<div class="mt-6 grid gap-4 md:grid-cols-3">
				<div class="rounded-2xl border border-black/10 bg-white p-4">
					<div class="text-xs font-semibold tracking-[0.24em] text-yellow-700 uppercase">
						1. Brief
					</div>
					<p class="mt-3 text-sm leading-6 text-neutral-700">
						Give the writer a clear outcome, a concrete audience, and a tone they can follow without
						guessing.
					</p>
				</div>
				<div class="rounded-2xl border border-black/10 bg-white p-4">
					<div class="text-xs font-semibold tracking-[0.24em] text-yellow-700 uppercase">2. Pay</div>
					<p class="mt-3 text-sm leading-6 text-neutral-700">
						Set the native XLM payout that should unlock the brief once you confirm funding on
						Stellar Testnet.
					</p>
				</div>
				<div class="rounded-2xl border border-black/10 bg-white p-4">
					<div class="text-xs font-semibold tracking-[0.24em] text-yellow-700 uppercase">3. Fund</div>
					<p class="mt-3 text-sm leading-6 text-neutral-700">
						Creation only saves the draft. The worker-facing flow starts after you fund from the
						task hub.
					</p>
				</div>
			</div>
		</header>

		<form
			class="space-y-6 rounded-3xl border border-black/10 bg-white p-8"
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
					<label class="mb-2 block text-sm font-medium text-neutral-800" for="title">Title</label>
					<p class="mb-3 text-sm leading-6 text-neutral-600">
						Name the deliverable the way you want it to appear in the workflow. Good titles make the
						task easy to scan later in the dashboard and marketplace.
					</p>
					<input
						id="title"
						name="title"
						placeholder={data.createdFromExamples.title}
						class="w-full rounded-2xl border border-black/20 bg-[#f7f4ea] px-4 py-3 text-black transition outline-none focus:border-yellow-500"
						value={form?.values?.title ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-neutral-800" for="brief"> Brief </label>
					<p class="mb-3 text-sm leading-6 text-neutral-600">
						Keep this to the one-line assignment summary. It should read well in cards before
						someone opens the full brief.
					</p>
					<input
						id="brief"
						name="brief"
						maxlength="100"
						placeholder={data.createdFromExamples.brief}
						class="w-full rounded-2xl border border-black/20 bg-[#f7f4ea] px-4 py-3 text-black transition outline-none focus:border-yellow-500"
						value={form?.values?.brief ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-neutral-800" for="requiredKeywords">
						Keywords
					</label>
					<p class="mb-3 text-sm leading-6 text-neutral-600">
						Add only the phrases that truly must appear or be covered. Use commas to separate them.
					</p>
					<input
						id="requiredKeywords"
						name="requiredKeywords"
						placeholder={data.createdFromExamples.requiredKeywords}
						class="w-full rounded-2xl border border-black/20 bg-[#f7f4ea] px-4 py-3 text-black transition outline-none focus:border-yellow-500"
						value={form?.values?.requiredKeywords ?? ''}
					/>
				</div>

				<div class="md:col-span-2">
					<label class="mb-2 block text-sm font-medium text-neutral-800" for="description">
						Description
					</label>
					<p class="mb-3 text-sm leading-6 text-neutral-600">
						Spell out the structure, must-cover points, exclusions, and any context the writer needs
						before they start drafting.
					</p>
					<textarea
						id="description"
						name="description"
						rows="6"
						placeholder="Explain the deliverable, the core points to cover, anything the writer should avoid, and how success will be judged."
						class="w-full rounded-2xl border border-black/20 bg-[#f7f4ea] px-4 py-3 text-black transition outline-none focus:border-yellow-500"
						required>{form?.values?.description ?? ''}</textarea
					>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-neutral-800" for="targetAudience">
						Target audience
					</label>
					<p class="mb-3 text-sm leading-6 text-neutral-600">
						Be specific about who should understand this piece when it is finished.
					</p>
					<input
						id="targetAudience"
						name="targetAudience"
						placeholder={data.createdFromExamples.targetAudience}
						class="w-full rounded-2xl border border-black/20 bg-[#f7f4ea] px-4 py-3 text-black transition outline-none focus:border-yellow-500"
						value={form?.values?.targetAudience ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-neutral-800" for="tone">Tone</label>
					<p class="mb-3 text-sm leading-6 text-neutral-600">
						Describe how the writing should feel, not just the topic it should cover.
					</p>
					<input
						id="tone"
						name="tone"
						placeholder={data.createdFromExamples.tone}
						class="w-full rounded-2xl border border-black/20 bg-[#f7f4ea] px-4 py-3 text-black transition outline-none focus:border-yellow-500"
						value={form?.values?.tone ?? ''}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-neutral-800" for="minWordCount">
						Minimum word count
					</label>
					<p class="mb-3 text-sm leading-6 text-neutral-600">
						Set the floor for the first acceptable draft, not the ideal maximum length.
					</p>
					<input
						id="minWordCount"
						name="minWordCount"
						type="number"
						min="0"
						class="w-full rounded-2xl border border-black/20 bg-[#f7f4ea] px-4 py-3 text-black transition outline-none focus:border-yellow-500"
						value={form?.values?.minWordCount ?? 0}
						required
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-neutral-800" for="payoutAmount">
						Payout amount
					</label>
					<p class="mb-3 text-sm leading-6 text-neutral-600">
						This exact XLM amount is what the funding step will ask you to confirm on Testnet, so
						set it to match the real effort of the brief.
					</p>
					<input
						id="payoutAmount"
						name="payoutAmount"
						placeholder="125.0000000"
						class="w-full rounded-2xl border border-black/20 bg-[#f7f4ea] px-4 py-3 text-black transition outline-none focus:border-yellow-500"
						value={form?.values?.payoutAmount ?? ''}
						required
					/>
					<p class="mt-3 text-sm leading-6 text-neutral-600">
						Calibrate against the minimum word count, research depth, and how opinionated the brief
						is. If the amount feels too low here, it will still feel too low when you fund it.
					</p>
				</div>

				<div>
					<div class="mb-2 block text-sm font-medium text-neutral-800">Funding asset</div>
					<div class="rounded-2xl border border-yellow-500/80 bg-yellow-100 px-4 py-3">
						<div class="text-sm font-semibold text-black">{nativeAssetCode}</div>
						<p class="mt-1 text-sm leading-6 text-black">
							Native Stellar Lumens on Testnet is the only supported funding path in this launch
							flow, so the next screen will take you into XLM funding directly.
						</p>
					</div>
					<input type="hidden" id="currencyAsset" name="currencyAsset" value={nativeAssetCode} />
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-neutral-800" for="reviewWindowHours">
						Review window hours
					</label>
					<p class="mb-3 text-sm leading-6 text-neutral-600">
						Set how long the client review window should stay open after submission lands.
					</p>
					<input
						id="reviewWindowHours"
						name="reviewWindowHours"
						type="number"
						min="1"
						class="w-full rounded-2xl border border-black/20 bg-[#f7f4ea] px-4 py-3 text-black transition outline-none focus:border-yellow-500"
						value={form?.values?.reviewWindowHours ?? 24}
						required
					/>
				</div>

				<div class="md:col-span-2">
					<label class="mb-2 block text-sm font-medium text-neutral-800" for="allowedClaimantType">
						Allowed claimant type
					</label>
					<p class="mb-3 text-sm leading-6 text-neutral-600">
						Choose whether this brief is open to human workers, agents, or both before the task goes
						live.
					</p>
					<select
						id="allowedClaimantType"
						name="allowedClaimantType"
						class="w-full rounded-2xl border border-black/20 bg-[#f7f4ea] px-4 py-3 text-black transition outline-none focus:border-yellow-500"
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
					class="rounded-2xl border border-black/30 bg-yellow-100 px-4 py-3 text-sm text-black"
				>
					{form.error}
				</p>
			{/if}

			<div
				class="rounded-2xl border border-yellow-500/80 bg-yellow-100 px-5 py-4 text-sm leading-6 text-black"
			>
				<div class="font-semibold text-black">What happens next</div>
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
				<p class="text-sm text-neutral-600">
					Creation saves the brief as a draft first. Funding is the next move before workers can
					claim it.
				</p>
				<button
					class="rounded-2xl bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
					type="submit"
					disabled={submitting}
				>
					{submitting ? 'Creating draft...' : 'Create task and continue to funding'}
				</button>
			</div>
		</form>
	</div>
</main>
