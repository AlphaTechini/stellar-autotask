<script lang="ts">
	let { data } = $props();

	function formatDate(value: string | null) {
		if (!value) {
			return 'Not available';
		}

		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
	}

	function recommendationTone(value: 'approve' | 'reject' | 'manual_review') {
		if (value === 'approve') {
			return 'text-emerald-300 border-emerald-400/20 bg-emerald-400/10';
		}

		if (value === 'reject') {
			return 'text-rose-300 border-rose-400/20 bg-rose-400/10';
		}

		return 'text-amber-300 border-amber-400/20 bg-amber-400/10';
	}

	function isClientReviewer() {
		return (
			data.session.id === data.report.task.clientId && data.report.task.status === 'PENDING_REVIEW'
		);
	}

	function hasReceiptState() {
		return (
			Boolean(data.report.payoutStatus.payout) ||
			['APPROVED', 'AUTO_APPROVED', 'PAID'].includes(data.report.task.status)
		);
	}
</script>

<svelte:head>
	<title>Report | {data.report.task.title}</title>
</svelte:head>

<main
	class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_24%),linear-gradient(180deg,#020617_0%,#08111f_40%,#020617_100%)] px-6 py-12 text-slate-100"
>
	<div class="mx-auto max-w-7xl space-y-8">
		<header
			class="rounded-[2rem] border border-cyan-400/20 bg-slate-950/75 p-8 shadow-[0_30px_90px_rgba(8,145,178,0.14)] backdrop-blur-xl"
		>
			<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-semibold tracking-[0.28em] text-cyan-300 uppercase">Task report</p>
					<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
						{data.report.task.title}
					</h1>
					<p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
						This route shows the real submission snapshot, verification output, latest review
						decision, and payout visibility for the task.
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
						href={`/task/${data.report.task.id}`}
					>
						Back to task
					</a>
					{#if isClientReviewer()}
						<a
							class="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:text-white"
							href={`/task/${data.report.task.id}/review`}
						>
							Open review
						</a>
					{:else if hasReceiptState()}
						<a
							class="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:text-white"
							href={`/task/${data.report.task.id}/receipt`}
						>
							Open receipt
						</a>
					{/if}
				</div>
			</div>
		</header>

		<section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
			<div class="space-y-6">
				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8">
					<div
						class="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between"
					>
						<div>
							<p class="text-xs tracking-[0.22em] text-slate-500 uppercase">Submission snapshot</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">
								Writing delivery
							</h2>
						</div>
						<div class="text-sm text-slate-400">
							Submitted {formatDate(data.report.submission?.submittedAt ?? null)}
						</div>
					</div>

					{#if data.report.submission}
						<div class="mt-6 space-y-5">
							<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
								<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">Content</div>
								<div class="mt-4 text-sm leading-7 whitespace-pre-wrap text-slate-100">
									{data.report.submission.contentText}
								</div>
							</div>

							<div class="grid gap-5 md:grid-cols-2">
								<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
									<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">Notes</div>
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
							The backend does not currently expose a submission snapshot for this task.
						</p>
					{/if}
				</article>

				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8">
					<div
						class="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between"
					>
						<div>
							<p class="text-xs tracking-[0.22em] text-slate-500 uppercase">Verification</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">
								Backend report output
							</h2>
						</div>
						{#if data.report.verificationReport}
							<div class="text-right">
								<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">Score</div>
								<div class="mt-2 font-['Space_Grotesk'] text-3xl font-bold text-cyan-200">
									{data.report.verificationReport.score}
								</div>
							</div>
						{/if}
					</div>

					{#if data.report.verificationReport}
						<div class="mt-6 space-y-6">
							<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
								<div class="flex flex-wrap items-center justify-between gap-4">
									<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">
										Recommendation
									</div>
									<span
										class="rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.22em] uppercase {recommendationTone(
											data.report.verificationReport.recommendation
										)}"
									>
										{data.report.verificationReport.recommendation}
									</span>
								</div>
								<p class="mt-4 text-sm leading-7 text-slate-200">
									{data.report.verificationReport.summary}
								</p>
							</div>

							<div class="grid gap-5 md:grid-cols-2">
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
											No keywords were marked as covered.
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
											No missing requirements were reported.
										</p>
									{/if}
								</div>
							</div>
						</div>
					{:else}
						<p class="mt-6 text-sm leading-7 text-slate-300">
							No verification report is available yet.
						</p>
					{/if}
				</article>
			</div>

			<aside class="space-y-6">
				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Task context</h2>
					<div class="mt-6 space-y-4 text-sm text-slate-300">
						<div class="flex items-center justify-between gap-4">
							<span>Payout</span>
							<span class="text-right text-white">
								{data.report.task.payoutAmount}
								{data.report.task.currencyAsset}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Review deadline</span>
							<span class="text-right text-white"
								>{formatDate(data.report.task.reviewDeadline)}</span
							>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Target audience</span>
							<span class="text-right text-white">{data.report.task.targetAudience}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Tone</span>
							<span class="text-right text-white">{data.report.task.tone}</span>
						</div>
					</div>
				</article>

				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Review state</h2>
					{#if data.report.latestReviewDecision}
						<div class="mt-6 space-y-4 text-sm text-slate-300">
							<div class="flex items-center justify-between gap-4">
								<span>Decision</span>
								<span class="text-right text-white">
									{data.report.latestReviewDecision.decision}
								</span>
							</div>
							<div class="flex items-center justify-between gap-4">
								<span>Reviewed at</span>
								<span class="text-right text-white">
									{formatDate(data.report.latestReviewDecision.createdAt)}
								</span>
							</div>
							<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-4">
								<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">Reason</div>
								<div class="mt-3 text-sm leading-6 whitespace-pre-wrap text-slate-200">
									{data.report.latestReviewDecision.reason ?? 'No reason was recorded.'}
								</div>
							</div>
						</div>
					{:else}
						<p class="mt-6 text-sm leading-7 text-slate-300">
							No manual review decision has been recorded yet.
						</p>
					{/if}
				</article>

				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
						Payout visibility
					</h2>
					<div class="mt-6 space-y-4 text-sm text-slate-300">
						<div class="flex items-center justify-between gap-4">
							<span>Eligible</span>
							<span class="text-right text-white">
								{data.report.payoutStatus.isPayoutEligible ? 'Yes' : 'No'}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Funding confirmed</span>
							<span class="text-right text-white">
								{data.report.payoutStatus.hasConfirmedFunding ? 'Yes' : 'No'}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Payout status</span>
							<span class="text-right text-white">
								{data.report.payoutStatus.payout?.status ?? 'No payout record'}
							</span>
						</div>
						{#if data.report.payoutStatus.payout?.txHash}
							<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-4">
								<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">
									Transaction hash
								</div>
								<div class="mt-3 text-sm leading-6 break-all text-cyan-300">
									{data.report.payoutStatus.payout.txHash}
								</div>
							</div>
						{/if}
					</div>
				</article>

				<article
					class="rounded-[2rem] border border-slate-800 bg-[linear-gradient(160deg,rgba(8,47,73,0.55),rgba(15,23,42,0.92))] p-6"
				>
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Next step</h2>
					{#if isClientReviewer()}
						<p class="mt-4 text-sm leading-7 text-slate-200">
							This task is waiting for the client review action. Continue into the task-scoped
							review route to approve or reject from the real backend review state.
						</p>
					{:else if hasReceiptState()}
						<p class="mt-4 text-sm leading-7 text-slate-200">
							This task already has payout visibility. Continue into the task-scoped receipt route
							for the real Stellar payout state instead of a stitched success screen.
						</p>
					{:else}
						<p class="mt-4 text-sm leading-7 text-slate-200">
							This report remains the main read surface when the task has not yet moved into review
							decision or payout handling.
						</p>
					{/if}

					<div class="mt-6 flex flex-wrap gap-3">
						<a
							class="inline-flex items-center gap-3 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:text-white"
							href={`/task/${data.report.task.id}`}
						>
							Return to task detail
						</a>
						{#if isClientReviewer()}
							<a
								class="inline-flex items-center gap-3 rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/30 hover:text-white"
								href={`/task/${data.report.task.id}/review`}
							>
								Continue to review
							</a>
						{:else if hasReceiptState()}
							<a
								class="inline-flex items-center gap-3 rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/30 hover:text-white"
								href={`/task/${data.report.task.id}/receipt`}
							>
								Open payout receipt
							</a>
						{/if}
					</div>
				</article>
			</aside>
		</section>
	</div>
</main>
