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

	function formatWallet(value: string | null) {
		if (!value) {
			return 'Wallet pending';
		}

		return `${value.slice(0, 8)}...${value.slice(-8)}`;
	}

	function payoutTone(status: 'pending' | 'confirmed' | 'failed' | null) {
		if (status === 'confirmed') {
			return 'border-yellow-500 bg-yellow-100 text-yellow-800';
		}

		if (status === 'failed') {
			return 'border-black/30 bg-yellow-100 text-black';
		}

		return 'border-amber-400/25 bg-yellow-100 text-amber-200';
	}

	function payoutHeadline() {
		const status = data.payoutStatus.payout?.status ?? null;

		if (status === 'confirmed' || data.task.status === 'PAID') {
			return 'Payout confirmed';
		}

		if (status === 'failed') {
			return 'Payout needs attention';
		}

		if (data.task.status === 'PENDING_REVIEW') {
			return 'Waiting for client review';
		}

		if (data.task.status === 'REJECTED') {
			return 'Task was rejected';
		}

		if (data.task.status === 'SUBMITTED') {
			return 'Verification still in motion';
		}

		return data.payoutStatus.payout ? 'Payout is processing' : 'Receipt not issued yet';
	}

	function payoutMessage() {
		const status = data.payoutStatus.payout?.status ?? null;

		if (status === 'confirmed' || data.task.status === 'PAID') {
			return 'The backend has recorded a completed Stellar Testnet payout for this task.';
		}

		if (status === 'failed') {
			return 'A payout attempt exists, but the backend marked it as failed. This screen stays accurate instead of showing a fake success state.';
		}

		if (data.task.status === 'PENDING_REVIEW') {
			return 'No payout should exist yet because the task is still waiting for a client decision.';
		}

		if (data.task.status === 'REJECTED') {
			return 'Rejected work does not produce a payout receipt. Review history remains available from the report route.';
		}

		if (data.task.status === 'SUBMITTED') {
			return 'The task has been submitted, but the backend has not yet moved it into a payout-eligible state.';
		}

		if (!data.payoutStatus.payout) {
			return 'The task is in a payout-aware state, but no payout record has been created yet.';
		}

		return 'The payout record exists, but it has not reached a confirmed on-chain state yet.';
	}

	const payoutStatusLabel = $derived(data.payoutStatus.payout?.status ?? 'not_started');
	const reviewDecision = $derived(data.report.latestReviewDecision?.decision ?? null);
</script>

<svelte:head>
	<title>Receipt | {data.task.title}</title>
</svelte:head>

<main
	class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.28),transparent_28%),linear-gradient(180deg,#fffdf2_0%,#f7f4ea_55%,#ffffff_100%)] px-6 py-12 text-black"
>
	<div class="mx-auto max-w-6xl space-y-8">
		<header
			class="rounded-[2rem] border border-yellow-500/80 bg-white p-8 shadow-[0_30px_90px_rgba(250,204,21,0.22)] backdrop-blur-xl"
		>
			<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-semibold tracking-[0.28em] text-yellow-700 uppercase">
						Payout receipt
					</p>
					<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-black">
						{payoutHeadline()}
					</h1>
					<p class="mt-4 max-w-3xl text-sm leading-7 text-neutral-700">{payoutMessage()}</p>
				</div>

				<div class="flex flex-wrap gap-3">
					<span
						class="rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.22em] uppercase {payoutTone(
							data.payoutStatus.payout?.status ?? null
						)}"
					>
						{payoutStatusLabel === 'not_started' ? 'no payout' : payoutStatusLabel}
					</span>
					<a
						class="rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-yellow-500 hover:text-black"
						href={`/task/${data.task.id}/report`}
					>
						Open report
					</a>
				</div>
			</div>
		</header>

		<section class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
			<div class="space-y-6">
				<article class="rounded-[2rem] border border-black/10 bg-white p-8">
					<div
						class="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between"
					>
						<div>
							<p class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Ledger state</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-black">
								Receipt detail
							</h2>
						</div>
						<div class="text-sm text-neutral-600">Task ID {data.task.id}</div>
					</div>

					<div class="mt-6 space-y-5">
						<div
							class="rounded-[1.5rem] border border-black/10 bg-[linear-gradient(160deg,#fff7bf,#ffffff)] p-6"
						>
							<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
								<div>
									<div class="text-xs tracking-[0.22em] text-neutral-600 uppercase">Amount</div>
									<div class="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-black">
										{data.task.payoutAmount}
										{data.task.currencyAsset}
									</div>
								</div>
								<div class="text-right">
									<div class="text-xs tracking-[0.22em] text-neutral-600 uppercase">Triggered by</div>
									<div class="mt-3 text-sm font-semibold tracking-[0.16em] text-yellow-800 uppercase">
										{data.payoutStatus.payout?.triggeredBy ?? 'Not triggered'}
									</div>
								</div>
							</div>
						</div>

						<div class="grid gap-5 md:grid-cols-2">
							<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
								<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Task status</div>
								<div class="mt-4 text-lg font-semibold text-black">{data.task.status}</div>
							</div>

							<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
								<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">
									Funding confirmed
								</div>
								<div class="mt-4 text-lg font-semibold text-black">
									{data.payoutStatus.hasConfirmedFunding ? 'Yes' : 'No'}
								</div>
							</div>

							<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
								<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Worker wallet</div>
								<div class="mt-4 text-sm leading-7 break-all text-yellow-700">
									{data.payoutStatus.payout?.workerWalletAddress ??
										data.payoutStatus.workerWalletAddress ??
										'Not available'}
								</div>
							</div>

							<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
								<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Paid at</div>
								<div class="mt-4 text-sm leading-7 text-neutral-800">
									{formatDate(data.payoutStatus.payout?.paidAt ?? null)}
								</div>
							</div>
						</div>

						<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
							<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Transaction hash</div>
							<div class="mt-4 text-sm leading-7 break-all text-yellow-700">
								{data.payoutStatus.payout?.txHash ?? 'Not available yet'}
							</div>
						</div>
					</div>
				</article>

				<article class="rounded-[2rem] border border-black/10 bg-white p-8">
					<div
						class="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between"
					>
						<div>
							<p class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Task context</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-black">
								Workflow trace
							</h2>
						</div>
						<a
							class="text-sm font-medium text-neutral-700 transition hover:text-black"
							href={`/task/${data.task.id}`}
						>
							Back to task detail
						</a>
					</div>

					<div class="mt-6 grid gap-5 md:grid-cols-2">
						<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
							<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Review decision</div>
							<div class="mt-4 text-lg font-semibold text-black">
								{reviewDecision ?? 'No manual decision'}
							</div>
						</div>

						<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
							<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Review deadline</div>
							<div class="mt-4 text-sm leading-7 text-neutral-800">
								{formatDate(data.task.reviewDeadline)}
							</div>
						</div>

						<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
							<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Submission</div>
							<div class="mt-4 text-sm leading-7 text-neutral-800">
								{formatDate(data.report.submission?.submittedAt ?? null)}
							</div>
						</div>

						<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
							<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Recipient</div>
							<div class="mt-4 text-sm leading-7 text-neutral-800">
								{formatWallet(
									data.payoutStatus.payout?.workerWalletAddress ??
										data.payoutStatus.workerWalletAddress
								)}
							</div>
						</div>
					</div>

					{#if data.report.latestReviewDecision?.reason}
						<div class="mt-5 rounded-[1.5rem] border border-black/10 bg-white p-5">
							<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Review note</div>
							<div class="mt-4 text-sm leading-7 whitespace-pre-wrap text-neutral-800">
								{data.report.latestReviewDecision.reason}
							</div>
						</div>
					{/if}
				</article>
			</div>

			<aside class="space-y-6">
				<article class="rounded-[2rem] border border-black/10 bg-white p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">State guidance</h2>
					<p class="mt-5 text-sm leading-7 text-neutral-700">{payoutMessage()}</p>
					<div class="mt-6 space-y-4 text-sm text-neutral-700">
						<div class="flex items-center justify-between gap-4">
							<span>Payout eligible</span>
							<span class="text-black">
								{data.payoutStatus.isPayoutEligible ? 'Yes' : 'No'}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Receipt visible</span>
							<span class="text-black">
								{data.payoutStatus.payout || data.task.status === 'PAID' ? 'Yes' : 'Preview only'}
							</span>
						</div>
					</div>
				</article>

				<article class="rounded-[2rem] border border-black/10 bg-white p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">
						Verification snapshot
					</h2>
					{#if data.report.verificationReport}
						<div class="mt-6 space-y-4">
							<div class="rounded-[1.5rem] border border-black/10 bg-white p-4">
								<div class="flex items-center justify-between gap-4">
									<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Score</div>
									<div class="text-lg font-semibold text-yellow-800">
										{data.report.verificationReport.score}
									</div>
								</div>
								<p class="mt-3 text-sm leading-6 text-neutral-800">
									{data.report.verificationReport.summary}
								</p>
							</div>

							<div class="rounded-[1.5rem] border border-black/10 bg-white p-4">
								<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Recommendation</div>
								<div class="mt-3 text-sm font-semibold tracking-[0.18em] text-black uppercase">
									{data.report.verificationReport.recommendation}
								</div>
							</div>
						</div>
					{:else}
						<p class="mt-6 text-sm leading-7 text-neutral-700">
							Verification output is not available yet.
						</p>
					{/if}
				</article>

				<div class="flex flex-wrap gap-3">
					{#if data.task.status === 'PENDING_REVIEW' && data.session.id === data.task.clientId}
						<a
							class="inline-flex items-center gap-3 rounded-2xl border border-yellow-500 bg-yellow-100 px-5 py-3 text-sm font-semibold text-yellow-800 transition hover:border-yellow-500 hover:text-black"
							href={`/task/${data.task.id}/review`}
						>
							Continue to review
						</a>
					{/if}
					<a
						class="inline-flex items-center gap-3 rounded-2xl border border-black/20 px-5 py-3 text-sm font-semibold text-black transition hover:border-yellow-500 hover:text-black"
						href={`/task/${data.task.id}/report`}
					>
						Return to report
					</a>
				</div>
			</aside>
		</section>
	</div>
</main>
