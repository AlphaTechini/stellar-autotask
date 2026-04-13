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
			return 'text-yellow-800 border-yellow-500/80 bg-yellow-100';
		}

		if (value === 'reject') {
			return 'text-black border-black/20 bg-yellow-100';
		}

		return 'text-yellow-800 border-amber-400/20 bg-yellow-100';
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
	class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.28),transparent_28%),linear-gradient(180deg,#fffdf2_0%,#f7f4ea_55%,#ffffff_100%)] px-6 py-12 text-black"
>
	<div class="mx-auto max-w-7xl space-y-8">
		<header
			class="rounded-[2rem] border border-yellow-500/80 bg-white p-8 shadow-[0_30px_90px_rgba(250,204,21,0.20)] backdrop-blur-xl"
		>
			<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-semibold tracking-[0.28em] text-yellow-700 uppercase">Task report</p>
					<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-black">
						{data.report.task.title}
					</h1>
					<p class="mt-4 max-w-3xl text-sm leading-7 text-neutral-700">
						This route shows the real submission snapshot, verification output, latest review
						decision, and payout visibility for the task.
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
						href={`/task/${data.report.task.id}`}
					>
						Back to task
					</a>
					{#if isClientReviewer()}
						<a
							class="rounded-full border border-yellow-500 bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800 transition hover:border-yellow-500 hover:text-black"
							href={`/task/${data.report.task.id}/review`}
						>
							Open review
						</a>
					{:else if hasReceiptState()}
						<a
							class="rounded-full border border-yellow-500 bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800 transition hover:border-yellow-500 hover:text-black"
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
				<article class="rounded-[2rem] border border-black/10 bg-white p-8">
					<div
						class="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between"
					>
						<div>
							<p class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Submission snapshot</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-black">
								Writing delivery
							</h2>
						</div>
						<div class="text-sm text-neutral-600">
							Submitted {formatDate(data.report.submission?.submittedAt ?? null)}
						</div>
					</div>

					{#if data.report.submission}
						<div class="mt-6 space-y-5">
							<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
								<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Content</div>
								<div class="mt-4 text-sm leading-7 whitespace-pre-wrap text-black">
									{data.report.submission.contentText}
								</div>
							</div>

							<div class="grid gap-5 md:grid-cols-2">
								<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
									<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Notes</div>
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
							The backend does not currently expose a submission snapshot for this task.
						</p>
					{/if}
				</article>

				<article class="rounded-[2rem] border border-black/10 bg-white p-8">
					<div
						class="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between"
					>
						<div>
							<p class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Verification</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-black">
								Backend report output
							</h2>
						</div>
						{#if data.report.verificationReport}
							<div class="text-right">
								<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Score</div>
								<div class="mt-2 font-['Space_Grotesk'] text-3xl font-bold text-yellow-800">
									{data.report.verificationReport.score}
								</div>
							</div>
						{/if}
					</div>

					{#if data.report.verificationReport}
						<div class="mt-6 space-y-6">
							<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
								<div class="flex flex-wrap items-center justify-between gap-4">
									<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">
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
								<p class="mt-4 text-sm leading-7 text-neutral-800">
									{data.report.verificationReport.summary}
								</p>
							</div>

							<div class="grid gap-5 md:grid-cols-2">
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
											No keywords were marked as covered.
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
											No missing requirements were reported.
										</p>
									{/if}
								</div>
							</div>
						</div>
					{:else}
						<p class="mt-6 text-sm leading-7 text-neutral-700">
							No verification report is available yet.
						</p>
					{/if}
				</article>
			</div>

			<aside class="space-y-6">
				<article class="rounded-[2rem] border border-black/10 bg-white p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">Task context</h2>
					<div class="mt-6 space-y-4 text-sm text-neutral-700">
						<div class="flex items-center justify-between gap-4">
							<span>Payout</span>
							<span class="text-right text-black">
								{data.report.task.payoutAmount}
								{data.report.task.currencyAsset}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Review deadline</span>
							<span class="text-right text-black"
								>{formatDate(data.report.task.reviewDeadline)}</span
							>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Target audience</span>
							<span class="text-right text-black">{data.report.task.targetAudience}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Tone</span>
							<span class="text-right text-black">{data.report.task.tone}</span>
						</div>
					</div>
				</article>

				<article class="rounded-[2rem] border border-black/10 bg-white p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">Review state</h2>
					{#if data.report.latestReviewDecision}
						<div class="mt-6 space-y-4 text-sm text-neutral-700">
							<div class="flex items-center justify-between gap-4">
								<span>Decision</span>
								<span class="text-right text-black">
									{data.report.latestReviewDecision.decision}
								</span>
							</div>
							<div class="flex items-center justify-between gap-4">
								<span>Reviewed at</span>
								<span class="text-right text-black">
									{formatDate(data.report.latestReviewDecision.createdAt)}
								</span>
							</div>
							<div class="rounded-[1.5rem] border border-black/10 bg-white p-4">
								<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Reason</div>
								<div class="mt-3 text-sm leading-6 whitespace-pre-wrap text-neutral-800">
									{data.report.latestReviewDecision.reason ?? 'No reason was recorded.'}
								</div>
							</div>
						</div>
					{:else}
						<p class="mt-6 text-sm leading-7 text-neutral-700">
							No manual review decision has been recorded yet.
						</p>
					{/if}
				</article>

				<article class="rounded-[2rem] border border-black/10 bg-white p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">
						Payout visibility
					</h2>
					<div class="mt-6 space-y-4 text-sm text-neutral-700">
						<div class="flex items-center justify-between gap-4">
							<span>Eligible</span>
							<span class="text-right text-black">
								{data.report.payoutStatus.isPayoutEligible ? 'Yes' : 'No'}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Funding confirmed</span>
							<span class="text-right text-black">
								{data.report.payoutStatus.hasConfirmedFunding ? 'Yes' : 'No'}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Payout status</span>
							<span class="text-right text-black">
								{data.report.payoutStatus.payout?.status ?? 'No payout record'}
							</span>
						</div>
						{#if data.report.payoutStatus.payout?.txHash}
							<div class="rounded-[1.5rem] border border-black/10 bg-white p-4">
								<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">
									Transaction hash
								</div>
								<div class="mt-3 text-sm leading-6 break-all text-yellow-700">
									{data.report.payoutStatus.payout.txHash}
								</div>
							</div>
						{/if}
					</div>
				</article>

				<article
					class="rounded-[2rem] border border-black/10 bg-[linear-gradient(160deg,#fff7bf,#ffffff)] p-6"
				>
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">Next step</h2>
					{#if isClientReviewer()}
						<p class="mt-4 text-sm leading-7 text-neutral-800">
							This task is waiting for the client review action. Continue into the task-scoped
							review route to approve or reject from the real backend review state.
						</p>
					{:else if hasReceiptState()}
						<p class="mt-4 text-sm leading-7 text-neutral-800">
							This task already has payout visibility. Continue into the task-scoped receipt route
							for the real Stellar payout state instead of a stitched success screen.
						</p>
					{:else}
						<p class="mt-4 text-sm leading-7 text-neutral-800">
							This report remains the main read surface when the task has not yet moved into review
							decision or payout handling.
						</p>
					{/if}

					<div class="mt-6 flex flex-wrap gap-3">
						<a
							class="inline-flex items-center gap-3 rounded-2xl border border-yellow-500 bg-yellow-100 px-5 py-3 text-sm font-semibold text-yellow-800 transition hover:border-yellow-500 hover:text-black"
							href={`/task/${data.report.task.id}`}
						>
							Return to task detail
						</a>
						{#if isClientReviewer()}
							<a
								class="inline-flex items-center gap-3 rounded-2xl border border-black/20 px-5 py-3 text-sm font-semibold text-black transition hover:border-yellow-500 hover:text-black"
								href={`/task/${data.report.task.id}/review`}
							>
								Continue to review
							</a>
						{:else if hasReceiptState()}
							<a
								class="inline-flex items-center gap-3 rounded-2xl border border-black/20 px-5 py-3 text-sm font-semibold text-black transition hover:border-yellow-500 hover:text-black"
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
