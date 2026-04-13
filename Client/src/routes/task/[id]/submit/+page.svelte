<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let submitting = $state(false);
	let contentText = $state('');
	let notes = $state('');
	let documentUrl = $state('');

	$effect(() => {
		contentText = form?.values?.contentText ?? '';
		notes = form?.values?.notes ?? '';
		documentUrl = form?.values?.documentUrl ?? '';
	});

	function countWords(value: string) {
		const trimmed = value.trim();
		return trimmed ? trimmed.split(/\s+/).length : 0;
	}

	function getWordProgressClass(currentCount: number) {
		if (currentCount >= data.task.minWordCount) {
			return 'text-yellow-800';
		}

		if (currentCount >= Math.max(1, Math.floor(data.task.minWordCount * 0.65))) {
			return 'text-yellow-800';
		}

		return 'text-black';
	}

	const currentWordCount = $derived(countWords(contentText));
	const remainingWords = $derived(Math.max(data.task.minWordCount - currentWordCount, 0));
</script>

<svelte:head>
	<title>Submit Work | {data.task.title}</title>
</svelte:head>

<main
	class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.28),transparent_28%),linear-gradient(180deg,#fffdf2_0%,#f7f4ea_55%,#ffffff_100%)] px-6 py-12 text-black"
>
	<div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
		<aside class="space-y-6">
			<section
				class="overflow-hidden rounded-[2rem] border border-yellow-500/80 bg-white p-8 shadow-[0_30px_90px_rgba(250,204,21,0.22)] backdrop-blur-xl"
			>
				<p class="text-xs font-semibold tracking-[0.28em] text-yellow-700 uppercase">
					Task-scoped submission
				</p>
				<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-black">
					{data.task.title}
				</h1>
				<p class="mt-4 text-sm leading-7 text-neutral-700">{data.task.brief}</p>

				<div class="mt-8 grid gap-4 sm:grid-cols-2">
					<div class="rounded-2xl border border-black/10 bg-white p-4">
						<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Status</div>
						<div class="mt-2 text-sm font-semibold text-yellow-700">{data.task.status}</div>
					</div>
					<div class="rounded-2xl border border-black/10 bg-white p-4">
						<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Payout</div>
						<div class="mt-2 text-sm font-semibold text-black">
							{data.task.payoutAmount}
							{data.task.currencyAsset}
						</div>
					</div>
					<div class="rounded-2xl border border-black/10 bg-white p-4">
						<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Target audience</div>
						<div class="mt-2 text-sm text-black">{data.task.targetAudience}</div>
					</div>
					<div class="rounded-2xl border border-black/10 bg-white p-4">
						<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Tone</div>
						<div class="mt-2 text-sm text-black">{data.task.tone}</div>
					</div>
				</div>

				<div
					class="mt-8 rounded-[1.5rem] border border-black/10 bg-[linear-gradient(160deg,#fff7bf,#ffffff)] p-5"
				>
					<div class="flex items-end justify-between gap-4">
						<div>
							<p class="text-xs tracking-[0.22em] text-neutral-600 uppercase">Word target</p>
							<p class="mt-2 font-['Space_Grotesk'] text-4xl font-bold text-black">
								{currentWordCount}
							</p>
						</div>
						<div class="text-right">
							<p class="text-xs tracking-[0.22em] text-neutral-600 uppercase">Minimum</p>
							<p class="mt-2 text-lg font-semibold text-yellow-800">{data.task.minWordCount}</p>
						</div>
					</div>

					<p class="mt-4 text-sm {getWordProgressClass(currentWordCount)}">
						{#if remainingWords === 0}
							Submission meets the minimum word count requirement.
						{:else}
							{remainingWords} more words will satisfy the minimum target.
						{/if}
					</p>
				</div>
			</section>

			<section class="rounded-[2rem] border border-black/10 bg-white p-6">
				<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">Required keywords</h2>
				{#if data.task.requiredKeywords.length === 0}
					<p class="mt-4 text-sm leading-6 text-neutral-700">
						This writing task has no required keywords.
					</p>
				{:else}
					<div class="mt-5 flex flex-wrap gap-2">
						{#each data.task.requiredKeywords as keyword}
							<span
								class="rounded-full border border-yellow-500/80 bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
							>
								{keyword}
							</span>
						{/each}
					</div>
				{/if}

				<div class="mt-6 border-t border-black/10 pt-6">
					<h3 class="font-['Space_Grotesk'] text-lg font-semibold text-black">Before you send</h3>
					<ul class="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
						<li>Submit the actual writing body in `contentText`.</li>
						<li>Use notes only for context the reviewer should see.</li>
						<li>Add a document URL only when the task needs an external draft or asset link.</li>
					</ul>
				</div>
			</section>
		</aside>

		<section class="rounded-[2rem] border border-black/10 bg-white p-8 backdrop-blur">
			<div
				class="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between"
			>
				<div>
					<p class="text-xs font-semibold tracking-[0.28em] text-yellow-700 uppercase">
						Assigned worker flow
					</p>
					<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-black">
						Submit your writing
					</h2>
				</div>
				<a
					class="text-sm font-medium text-neutral-700 transition hover:text-black"
					href={`/task/${data.task.id}`}
				>
					Back to task details
				</a>
			</div>

			<form
				class="mt-8 space-y-6"
				method="POST"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
					};
				}}
			>
				<div>
					<label class="mb-3 block text-sm font-medium text-neutral-800" for="contentText">
						Content text
					</label>
					<textarea
						id="contentText"
						name="contentText"
						rows="18"
						class="w-full rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-black transition outline-none focus:border-yellow-500"
						bind:value={contentText}
						required
					></textarea>
					<p class="mt-3 text-sm leading-6 text-neutral-600">
						Paste the full writing submission here. The backend uses this content for deterministic
						checks and verification.
					</p>
				</div>

				<div class="grid gap-6 lg:grid-cols-2">
					<div>
						<label class="mb-3 block text-sm font-medium text-neutral-800" for="notes">
							Worker notes
						</label>
						<textarea
							id="notes"
							name="notes"
							rows="6"
							class="w-full rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-black transition outline-none focus:border-yellow-500"
							bind:value={notes}
						></textarea>
						<p class="mt-3 text-sm leading-6 text-neutral-600">
							Optional context for the client or reviewer.
						</p>
					</div>

					<div>
						<label class="mb-3 block text-sm font-medium text-neutral-800" for="documentUrl">
							Document URL
						</label>
						<input
							id="documentUrl"
							name="documentUrl"
							type="url"
							class="w-full rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-black transition outline-none focus:border-yellow-500"
							placeholder="https://..."
							bind:value={documentUrl}
						/>
						<p class="mt-3 text-sm leading-6 text-neutral-600">
							Optional external draft or supporting document link.
						</p>
					</div>
				</div>

				{#if form?.error}
					<p
						class="rounded-[1.5rem] border border-black/30 bg-yellow-100 px-4 py-3 text-sm text-black"
					>
						{form.error}
					</p>
				{/if}

				<div
					class="flex flex-col gap-4 border-t border-black/10 pt-6 md:flex-row md:items-center md:justify-between"
				>
					<p class="max-w-2xl text-sm leading-6 text-neutral-600">
						Submitting moves the task into the verification and review flow. After success, you will
						continue into the task report.
					</p>
					<button
						class="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
						type="submit"
						disabled={submitting}
					>
						{submitting ? 'Submitting...' : 'Submit work'}
					</button>
				</div>
			</form>
		</section>
	</div>
</main>
