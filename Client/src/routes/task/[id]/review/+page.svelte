<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let approvePending = $state(false);
	let rejectPending = $state(false);
	let rejectionReason = $state('');

	$effect(() => {
		rejectionReason = form?.values?.reason ?? '';
	});

	function formatDate(value: string | null) {
		if (!value) {
			return 'Not available';
		}

		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
	}

	function formatWallet(value: string | null) {
		if (!value) {
			return 'Wallet pending';
		}

		return `${value.slice(0, 6)}...${value.slice(-6)}`;
	}

	function recommendationTone(value: 'approve' | 'reject' | 'manual_review') {
		if (value === 'approve') {
			return 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200';
		}

		if (value === 'reject') {
			return 'border-rose-400/25 bg-rose-400/10 text-rose-200';
		}

		return 'border-amber-400/25 bg-amber-400/10 text-amber-200';
	}

	function hoursUntilDeadline(value: string | null) {
		if (!value) {
			return null;
		}

		const diff = new Date(value).getTime() - Date.now();

		if (diff <= 0) {
			return 0;
		}

		return Math.ceil(diff / (1000 * 60 * 60));
	}

	const hoursRemaining = $derived(hoursUntilDeadline(data.report.task.reviewDeadline));
	const submissionWordCount = $derived(
		data.report.submission?.contentText.trim()
			? data.report.submission.contentText.trim().split(/\s+/).length
			: 0
	);
</script>

<svelte:head>
	<title>Review | {data.report.task.title}</title>
</svelte:head>

<main
	class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#08111f_42%,#020617_100%)] px-6 py-12 text-slate-100"
>
	<div class="mx-auto max-w-7xl space-y-8">
		<header
			class="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-8 shadow-[0_30px_90px_rgba(8,145,178,0.18)] backdrop-blur-xl"
		>
			<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-semibold tracking-[0.28em] text-cyan-300 uppercase">
						Client review
					</p>
					<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
						{data.report.task.title}
					</h1>
					<p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
						Approve or reject the assigned writing submission from the real backend review state.
						This route is the decision surface between verification and Stellar payout handling.
					</p>
				</div>

				<div class="flex flex-wrap gap-3">
					<span
						class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-cyan-200 uppercase"
					>
						{data.report.task.status}
					</span>
					<a
						class="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/30 hover:text-white"
						href={`/task/${data.report.task.id}/report`}
					>
						Open report
					</a>
				</div>
			</div>
		</header>

		<section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
			<aside class="space-y-6">
				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
					<div class="flex items-start justify-between gap-4">
						<div>
							<p class="text-xs tracking-[0.22em] text-slate-500 uppercase">Review window</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Decision timing
							</h2>
						</div>
						<div class="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-right">
							<div class="text-[11px] tracking-[0.22em] text-cyan-200 uppercase">Time left</div>
							<div class="mt-2 font-['Space_Grotesk'] text-3xl font-bold text-white">
								{hoursRemaining === null
									? 'N/A'
									: hoursRemaining === 0
										? 'Closed'
										: `${hoursRemaining}h`}
							</div>
						</div>
					</div>

					<div class="mt-6 space-y-4 text-sm text-slate-300">
						<div class="flex items-center justify-between gap-4">
							<span>Deadline</span>
							<span class="text-right text-white">
								{formatDate(data.report.task.reviewDeadline)}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Submitted</span>
							<span class="text-right text-white">
								{formatDate(data.report.submission?.submittedAt ?? null)}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Word count</span>
							<span class="text-right text-white">{submissionWordCount}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Minimum target</span>
							<span class="text-right text-white">{data.report.task.minWordCount}</span>
						</div>
					</div>
				</article>

				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
					<div class="flex flex-col gap-4 border-b border-slate-800 pb-5">
						<div>
							<p class="text-xs tracking-[0.22em] text-slate-500 uppercase">Verification</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Backend signal
							</h2>
						</div>
						{#if data.report.verificationReport}
							<div class="flex items-center justify-between gap-4">
								<div class="text-sm text-slate-400">Recommendation</div>
								<span
									class="rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.22em] uppercase {recommendationTone(
										data.report.verificationReport.recommendation
									)}"
								>
									{data.report.verificationReport.recommendation}
								</span>
							</div>
						{/if}
					</div>

					{#if data.report.verificationReport}
						<div class="mt-6 space-y-5">
							<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
								<div class="flex items-center justify-between gap-4">
									<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">Score</div>
									<div class="font-['Space_Grotesk'] text-3xl font-bold text-cyan-200">
										{data.report.verificationReport.score}
									</div>
								</div>
								<p class="mt-4 text-sm leading-7 text-slate-200">
									{data.report.verificationReport.summary}
								</p>
							</div>

							<div class="grid gap-5">
								<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
									<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">
										Keyword coverage
									</div>
									{#if data.report.verificationReport.keywordCoverage.length > 0}
										<div class="mt-4 flex flex-wrap gap-2">
											{#each data.report.verificationReport.keywordCoverage as keyword}
												<span
													class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200"
												>
													{keyword}
												</span>
											{/each}
										</div>
									{:else}
										<p class="mt-4 text-sm leading-7 text-slate-300">
											No covered keywords were reported yet.
										</p>
									{/if}
								</div>

								<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
									<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">
										Missing requirements
									</div>
									{#if data.report.verificationReport.missingRequirements.length > 0}
										<ul class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
											{#each data.report.verificationReport.missingRequirements as requirement}
												<li>{requirement}</li>
											{/each}
										</ul>
									{:else}
										<p class="mt-4 text-sm leading-7 text-slate-300">
											No missing requirements were flagged by the backend checks.
										</p>
									{/if}
								</div>
							</div>
						</div>
					{:else}
						<p class="mt-6 text-sm leading-7 text-slate-300">
							No verification report is available yet, so review should wait for the backend report
							surface to populate.
						</p>
					{/if}
				</article>

				<article
					class="rounded-[2rem] border border-slate-800 bg-[linear-gradient(160deg,rgba(8,47,73,0.55),rgba(15,23,42,0.92))] p-6"
				>
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Payout handoff</h2>
					<div class="mt-5 space-y-4 text-sm text-slate-200">
						<div class="flex items-center justify-between gap-4">
							<span>Funding confirmed</span>
							<span>
								{data.report.payoutStatus.hasConfirmedFunding ? 'Yes' : 'No'}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Worker wallet</span>
							<span>{formatWallet(data.report.payoutStatus.workerWalletAddress)}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Current payout record</span>
							<span>{data.report.payoutStatus.payout?.status ?? 'No payout record'}</span>
						</div>
					</div>
					<p class="mt-5 text-sm leading-7 text-slate-300">
						Approval triggers the backend payout flow, but this route does not promise a success
						state in advance. If payout execution fails, the backend error is surfaced directly.
					</p>
				</article>
			</aside>

			<div class="space-y-6">
				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8">
					<div
						class="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between"
					>
						<div>
							<p class="text-xs tracking-[0.22em] text-slate-500 uppercase">Submission</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">
								Writing delivery
							</h2>
						</div>
						<div class="text-sm text-slate-400">
							Task ID {data.report.task.id}
						</div>
					</div>

					{#if data.report.submission}
						<div class="mt-6 space-y-5">
							<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
								<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">Content text</div>
								<div class="mt-4 text-sm leading-7 whitespace-pre-wrap text-slate-100">
									{data.report.submission.contentText}
								</div>
							</div>

							<div class="grid gap-5 md:grid-cols-2">
								<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
									<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">Worker notes</div>
									<div class="mt-4 text-sm leading-7 whitespace-pre-wrap text-slate-300">
										{data.report.submission.notes ?? 'No notes were provided.'}
									</div>
								</div>

								<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
									<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">Document URL</div>
									{#if data.report.submission.documentUrl}
										<a
											class="mt-4 block text-sm leading-7 break-all text-cyan-300 hover:text-cyan-200"
											href={data.report.submission.documentUrl}
											target="_blank"
											rel="noreferrer"
										>
											{data.report.submission.documentUrl}
										</a>
									{:else}
										<div class="mt-4 text-sm leading-7 text-slate-300">
											No external document was attached.
										</div>
									{/if}
								</div>
							</div>
						</div>
					{:else}
						<p class="mt-6 text-sm leading-7 text-slate-300">
							The backend does not currently expose an active submission for this review.
						</p>
					{/if}
				</article>

				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8">
					<div
						class="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between"
					>
						<div>
							<p class="text-xs tracking-[0.22em] text-slate-500 uppercase">Decision</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">
								Approve or reject
							</h2>
						</div>
						<a
							class="text-sm font-medium text-slate-300 transition hover:text-white"
							href={`/task/${data.report.task.id}`}
						>
							Back to task detail
						</a>
					</div>

					<div class="mt-6 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
						<form
							class="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/5 p-6"
							method="POST"
							action="?/approve"
							use:enhance={() => {
								approvePending = true;
								return async ({ update }) => {
									await update();
									approvePending = false;
								};
							}}
						>
							<p class="text-xs font-semibold tracking-[0.22em] text-emerald-200 uppercase">
								Approve
							</p>
							<h3 class="mt-4 font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Release to payout flow
							</h3>
							<p class="mt-4 text-sm leading-7 text-slate-300">
								Use approval when the writing satisfies the task requirements and you want the
								backend to execute the Stellar payout path.
							</p>

							{#if form?.error && form.intent === 'approve'}
								<p
									class="mt-6 rounded-[1.25rem] border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
								>
									{form.error}
								</p>
							{/if}

							<button
								class="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-300 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
								type="submit"
								disabled={approvePending || rejectPending}
							>
								{approvePending ? 'Approving...' : 'Approve task'}
							</button>
						</form>

						<form
							class="rounded-[1.5rem] border border-rose-400/20 bg-slate-950/50 p-6"
							method="POST"
							action="?/reject"
							use:enhance={() => {
								rejectPending = true;
								return async ({ update }) => {
									await update();
									rejectPending = false;
								};
							}}
						>
							<p class="text-xs font-semibold tracking-[0.22em] text-rose-200 uppercase">Reject</p>
							<h3 class="mt-4 font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Send back with a reason
							</h3>
							<p class="mt-4 text-sm leading-7 text-slate-300">
								Use rejection when the backend report or your manual review shows the writing is not
								ready for payout. A reason is required and will be saved in review history.
							</p>

							<label class="mt-6 block text-sm font-medium text-slate-200" for="reason">
								Rejection reason
							</label>
							<textarea
								id="reason"
								name="reason"
								rows="6"
								class="mt-3 w-full rounded-[1.5rem] border border-slate-800 bg-slate-950/80 px-5 py-4 text-white transition outline-none focus:border-rose-400"
								bind:value={rejectionReason}
								placeholder="Explain what needs to change before this writing can be approved."
								required
							></textarea>

							{#if form?.error && form.intent === 'reject'}
								<p
									class="mt-4 rounded-[1.25rem] border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
								>
									{form.error}
								</p>
							{/if}

							<button
								class="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-rose-300/40 bg-rose-400/10 px-5 py-4 text-sm font-semibold text-rose-100 transition hover:border-rose-300 hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-60"
								type="submit"
								disabled={approvePending || rejectPending}
							>
								{rejectPending ? 'Rejecting...' : 'Reject task'}
							</button>
						</form>
					</div>
				</article>
			</div>
		</section>
	</div>
</main>
