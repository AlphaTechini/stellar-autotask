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
			return 'text-emerald-300';
		}

		if (currentCount >= Math.max(1, Math.floor(data.task.minWordCount * 0.65))) {
			return 'text-amber-300';
		}

		return 'text-rose-300';
	}

	const currentWordCount = $derived(countWords(contentText));
	const remainingWords = $derived(Math.max(data.task.minWordCount - currentWordCount, 0));
</script>

<svelte:head>
	<title>Submit Work | {data.task.title}</title>
</svelte:head>

<main class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_24%),linear-gradient(180deg,#020617_0%,#08111f_40%,#020617_100%)] px-6 py-12 text-slate-100">
	<div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
		<aside class="space-y-6">
			<section class="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/75 p-8 shadow-[0_30px_90px_rgba(8,145,178,0.16)] backdrop-blur-xl">
				<p class="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
					Task-scoped submission
				</p>
				<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
					{data.task.title}
				</h1>
				<p class="mt-4 text-sm leading-7 text-slate-300">{data.task.brief}</p>

				<div class="mt-8 grid gap-4 sm:grid-cols-2">
					<div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Status</div>
						<div class="mt-2 text-sm font-semibold text-cyan-300">{data.task.status}</div>
					</div>
					<div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Payout</div>
						<div class="mt-2 text-sm font-semibold text-white">
							{data.task.payoutAmount} {data.task.currencyAsset}
						</div>
					</div>
					<div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Target audience</div>
						<div class="mt-2 text-sm text-white">{data.task.targetAudience}</div>
					</div>
					<div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Tone</div>
						<div class="mt-2 text-sm text-white">{data.task.tone}</div>
					</div>
				</div>

				<div class="mt-8 rounded-[1.5rem] border border-slate-800 bg-[linear-gradient(160deg,rgba(8,47,73,0.55),rgba(15,23,42,0.92))] p-5">
					<div class="flex items-end justify-between gap-4">
						<div>
							<p class="text-xs uppercase tracking-[0.22em] text-slate-400">Word target</p>
							<p class="mt-2 font-['Space_Grotesk'] text-4xl font-bold text-white">
								{currentWordCount}
							</p>
						</div>
						<div class="text-right">
							<p class="text-xs uppercase tracking-[0.22em] text-slate-400">Minimum</p>
							<p class="mt-2 text-lg font-semibold text-cyan-200">{data.task.minWordCount}</p>
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

			<section class="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-6">
				<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Required keywords</h2>
				{#if data.task.requiredKeywords.length === 0}
					<p class="mt-4 text-sm leading-6 text-slate-300">
						This writing task has no required keywords.
					</p>
				{:else}
					<div class="mt-5 flex flex-wrap gap-2">
						{#each data.task.requiredKeywords as keyword}
							<span class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
								{keyword}
							</span>
						{/each}
					</div>
				{/if}

				<div class="mt-6 border-t border-slate-800 pt-6">
					<h3 class="font-['Space_Grotesk'] text-lg font-semibold text-white">Before you send</h3>
					<ul class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
						<li>Submit the actual writing body in `contentText`.</li>
						<li>Use notes only for context the reviewer should see.</li>
						<li>Add a document URL only when the task needs an external draft or asset link.</li>
					</ul>
				</div>
			</section>
		</aside>

		<section class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 backdrop-blur">
			<div class="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
						Assigned worker flow
					</p>
					<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-white">
						Submit your writing
					</h2>
				</div>
				<a
					class="text-sm font-medium text-slate-300 transition hover:text-white"
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
					<label class="mb-3 block text-sm font-medium text-slate-200" for="contentText">
						Content text
					</label>
					<textarea
						id="contentText"
						name="contentText"
						rows="18"
						class="w-full rounded-[1.5rem] border border-slate-800 bg-slate-950/80 px-5 py-4 text-white outline-none transition focus:border-cyan-400"
						bind:value={contentText}
						required
					></textarea>
					<p class="mt-3 text-sm leading-6 text-slate-400">
						Paste the full writing submission here. The backend uses this content for
						deterministic checks and verification.
					</p>
				</div>

				<div class="grid gap-6 lg:grid-cols-2">
					<div>
						<label class="mb-3 block text-sm font-medium text-slate-200" for="notes">
							Worker notes
						</label>
						<textarea
							id="notes"
							name="notes"
							rows="6"
							class="w-full rounded-[1.5rem] border border-slate-800 bg-slate-950/80 px-5 py-4 text-white outline-none transition focus:border-cyan-400"
							bind:value={notes}
						></textarea>
						<p class="mt-3 text-sm leading-6 text-slate-400">
							Optional context for the client or reviewer.
						</p>
					</div>

					<div>
						<label class="mb-3 block text-sm font-medium text-slate-200" for="documentUrl">
							Document URL
						</label>
						<input
							id="documentUrl"
							name="documentUrl"
							type="url"
							class="w-full rounded-[1.5rem] border border-slate-800 bg-slate-950/80 px-5 py-4 text-white outline-none transition focus:border-cyan-400"
							placeholder="https://..."
							bind:value={documentUrl}
						/>
						<p class="mt-3 text-sm leading-6 text-slate-400">
							Optional external draft or supporting document link.
						</p>
					</div>
				</div>

				{#if form?.error}
					<p class="rounded-[1.5rem] border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
						{form.error}
					</p>
				{/if}

				<div class="flex flex-col gap-4 border-t border-slate-800 pt-6 md:flex-row md:items-center md:justify-between">
					<p class="max-w-2xl text-sm leading-6 text-slate-400">
						Submitting moves the task into the verification and review flow. After success, you
						will continue into the task report.
					</p>
					<button
						class="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
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
