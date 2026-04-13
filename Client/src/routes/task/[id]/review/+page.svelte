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
			return 'border-yellow-500 bg-yellow-100 text-yellow-800';
		}

		if (value === 'reject') {
			return 'border-black/30 bg-yellow-100 text-black';
		}

		return 'border-amber-400/25 bg-yellow-100 text-amber-200';
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
	class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.28),transparent_28%),linear-gradient(180deg,#fffdf2_0%,#f7f4ea_55%,#ffffff_100%)] px-6 py-12 text-black"
>
	<div class="mx-auto max-w-7xl space-y-8">
		<header
			class="overflow-hidden rounded-[2rem] border border-yellow-500/80 bg-white p-8 shadow-[0_30px_90px_rgba(250,204,21,0.20)] backdrop-blur-xl"
		>
			<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-semibold tracking-[0.28em] text-yellow-700 uppercase">
						Client review
					</p>
					<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-black">
						{data.report.task.title}
					</h1>
					<p class="mt-4 max-w-3xl text-sm leading-7 text-neutral-700">
						Approve or reject the assigned writing submission from the real backend review state.
						This route is the decision surface between verification and Stellar payout handling.
					</p>
				</div>

				<div class="flex flex-wrap gap-3">
					<span
						class="rounded-full border border-yellow-500/80 bg-yellow-100 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-yellow-800 uppercase"
					>
						{data.report.task.status}
					</span>
					<a
						class="rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-yellow-500 hover:text-black"
						href={`/task/${data.report.task.id}/report`}
					>
						Open report
					</a>
				</div>
			</div>
		</header>

		<section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
			<aside class="space-y-6">
				<article class="rounded-[2rem] border border-black/10 bg-white p-6">
					<div class="flex items-start justify-between gap-4">
						<div>
							<p class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Review window</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-2xl font-semibold text-black">
								Decision timing
							</h2>
						</div>
						<div class="rounded-2xl border border-yellow-500/80 bg-yellow-100 px-4 py-3 text-right">
							<div class="text-[11px] tracking-[0.22em] text-yellow-800 uppercase">Time left</div>
							<div class="mt-2 font-['Space_Grotesk'] text-3xl font-bold text-black">
								{hoursRemaining === null
									? 'N/A'
									: hoursRemaining === 0
										? 'Closed'
										: `${hoursRemaining}h`}
							</div>
						</div>
					</div>

					<div class="mt-6 space-y-4 text-sm text-neutral-700">
						<div class="flex items-center justify-between gap-4">
							<span>Deadline</span>
							<span class="text-right text-black">
								{formatDate(data.report.task.reviewDeadline)}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Submitted</span>
							<span class="text-right text-black">
								{formatDate(data.report.submission?.submittedAt ?? null)}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Word count</span>
							<span class="text-right text-black">{submissionWordCount}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Minimum target</span>
							<span class="text-right text-black">{data.report.task.minWordCount}</span>
						</div>
					</div>
				</article>

				<article class="rounded-[2rem] border border-black/10 bg-white p-6">
					<div class="flex flex-col gap-4 border-b border-black/10 pb-5">
						<div>
							<p class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Verification</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-2xl font-semibold text-black">
								Backend signal
							</h2>
						</div>
						{#if data.report.verificationReport}
							<div class="flex items-center justify-between gap-4">
								<div class="text-sm text-neutral-600">Recommendation</div>
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
							<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
								<div class="flex items-center justify-between gap-4">
									<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Score</div>
									<div class="font-['Space_Grotesk'] text-3xl font-bold text-yellow-800">
										{data.report.verificationReport.score}
									</div>
								</div>
								<p class="mt-4 text-sm leading-7 text-neutral-800">
									{data.report.verificationReport.summary}
								</p>
							</div>

							<div class="grid gap-5">
								<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
									<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">
										Keyword coverage
									</div>
									{#if data.report.verificationReport.keywordCoverage.length > 0}
										<div class="mt-4 flex flex-wrap gap-2">
											{#each data.report.verificationReport.keywordCoverage as keyword}
												<span
													class="rounded-full border border-yellow-500/80 bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
												>
													{keyword}
												</span>
											{/each}
										</div>
									{:else}
										<p class="mt-4 text-sm leading-7 text-neutral-700">
											No covered keywords were reported yet.
										</p>
									{/if}
								</div>

								<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
									<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">
										Missing requirements
									</div>
									{#if data.report.verificationReport.missingRequirements.length > 0}
										<ul class="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
											{#each data.report.verificationReport.missingRequirements as requirement}
												<li>{requirement}</li>
											{/each}
										</ul>
									{:else}
										<p class="mt-4 text-sm leading-7 text-neutral-700">
											No missing requirements were flagged by the backend checks.
										</p>
									{/if}
								</div>
							</div>
						</div>
					{:else}
						<p class="mt-6 text-sm leading-7 text-neutral-700">
							No verification report is available yet, so review should wait for the backend report
							surface to populate.
						</p>
					{/if}
				</article>

				<article
					class="rounded-[2rem] border border-black/10 bg-[linear-gradient(160deg,#fff7bf,#ffffff)] p-6"
				>
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">Payout handoff</h2>
					<div class="mt-5 space-y-4 text-sm text-neutral-800">
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
					<p class="mt-5 text-sm leading-7 text-neutral-700">
						Approval triggers the backend payout flow, but this route does not promise a success
						state in advance. If payout execution fails, the backend error is surfaced directly.
					</p>
				</article>
			</aside>

			<div class="space-y-6">
				<article class="rounded-[2rem] border border-black/10 bg-white p-8">
					<div
						class="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between"
					>
						<div>
							<p class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Submission</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-black">
								Writing delivery
							</h2>
						</div>
						<div class="text-sm text-neutral-600">
							Task ID {data.report.task.id}
						</div>
					</div>

					{#if data.report.submission}
						<div class="mt-6 space-y-5">
							<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
								<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Content text</div>
								<div class="mt-4 text-sm leading-7 whitespace-pre-wrap text-black">
									{data.report.submission.contentText}
								</div>
							</div>

							<div class="grid gap-5 md:grid-cols-2">
								<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
									<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Worker notes</div>
									<div class="mt-4 text-sm leading-7 whitespace-pre-wrap text-neutral-700">
										{data.report.submission.notes ?? 'No notes were provided.'}
									</div>
								</div>

								<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
									<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Document URL</div>
									{#if data.report.submission.documentUrl}
										<a
											class="mt-4 block text-sm leading-7 break-all text-yellow-700 hover:text-yellow-800"
											href={data.report.submission.documentUrl}
											target="_blank"
											rel="noreferrer"
										>
											{data.report.submission.documentUrl}
										</a>
									{:else}
										<div class="mt-4 text-sm leading-7 text-neutral-700">
											No external document was attached.
										</div>
									{/if}
								</div>
							</div>
						</div>
					{:else}
						<p class="mt-6 text-sm leading-7 text-neutral-700">
							The backend does not currently expose an active submission for this review.
						</p>
					{/if}
				</article>

				<article class="rounded-[2rem] border border-black/10 bg-white p-8">
					<div
						class="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between"
					>
						<div>
							<p class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Decision</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-black">
								Approve or reject
							</h2>
						</div>
						<a
							class="text-sm font-medium text-neutral-700 transition hover:text-black"
							href={`/task/${data.report.task.id}`}
						>
							Back to task detail
						</a>
					</div>

					<div class="mt-6 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
						<form
							class="rounded-[1.5rem] border border-yellow-500/80 bg-yellow-50 p-6"
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
							<p class="text-xs font-semibold tracking-[0.22em] text-yellow-800 uppercase">
								Approve
							</p>
							<h3 class="mt-4 font-['Space_Grotesk'] text-2xl font-semibold text-black">
								Release to payout flow
							</h3>
							<p class="mt-4 text-sm leading-7 text-neutral-700">
								Use approval when the writing satisfies the task requirements and you want the
								backend to execute the Stellar payout path.
							</p>

							{#if form?.error && form.intent === 'approve'}
								<p
									class="mt-6 rounded-[1.25rem] border border-black/30 bg-yellow-100 px-4 py-3 text-sm text-black"
								>
									{form.error}
								</p>
							{/if}

							<button
								class="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
								type="submit"
								disabled={approvePending || rejectPending}
							>
								{approvePending ? 'Approving...' : 'Approve task'}
							</button>
						</form>

						<form
							class="rounded-[1.5rem] border border-black/20 bg-white/90 p-6"
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
							<p class="text-xs font-semibold tracking-[0.22em] text-black uppercase">Reject</p>
							<h3 class="mt-4 font-['Space_Grotesk'] text-2xl font-semibold text-black">
								Send back with a reason
							</h3>
							<p class="mt-4 text-sm leading-7 text-neutral-700">
								Use rejection when the backend report or your manual review shows the writing is not
								ready for payout. A reason is required and will be saved in review history.
							</p>

							<label class="mt-6 block text-sm font-medium text-neutral-800" for="reason">
								Rejection reason
							</label>
							<textarea
								id="reason"
								name="reason"
								rows="6"
								class="mt-3 w-full rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-black transition outline-none focus:border-black"
								bind:value={rejectionReason}
								placeholder="Explain what needs to change before this writing can be approved."
								required
							></textarea>

							{#if form?.error && form.intent === 'reject'}
								<p
									class="mt-4 rounded-[1.25rem] border border-black/30 bg-yellow-100 px-4 py-3 text-sm text-black"
								>
									{form.error}
								</p>
							{/if}

							<button
								class="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-black/30 bg-yellow-100 px-5 py-4 text-sm font-semibold text-black transition hover:border-black hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-60"
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
