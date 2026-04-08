<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let claiming = $state(false);

	function formatDate(value: string | null) {
		if (!value) {
			return 'Not available';
		}

		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
	}

	function canClaimTask() {
		return (
			data.task.status === 'OPEN' &&
			data.session?.role === 'worker' &&
			data.session.id !== data.task.clientId
		);
	}
</script>

<svelte:head>
	<title>{data.task.title} | Stellar Autotask</title>
</svelte:head>

<main class="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
	<div class="mx-auto max-w-6xl space-y-8">
		<header class="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
			<div class="flex flex-wrap items-center gap-3">
				<span class="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
					{data.task.status}
				</span>
				<span class="text-xs text-slate-400">Task ID {data.task.id}</span>
			</div>
			<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
				{data.task.title}
			</h1>
			<p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{data.task.description}</p>
		</header>

		<section class="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
			<div class="space-y-6">
				<article class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Task details</h2>
					<div class="mt-6 grid gap-4 md:grid-cols-2">
						<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
							<div class="text-sm text-slate-400">Brief</div>
							<div class="mt-2 text-white">{data.task.brief}</div>
						</div>
						<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
							<div class="text-sm text-slate-400">Payout</div>
							<div class="mt-2 text-white">
								{data.task.payoutAmount} {data.task.currencyAsset}
							</div>
						</div>
						<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
							<div class="text-sm text-slate-400">Target audience</div>
							<div class="mt-2 text-white">{data.task.targetAudience}</div>
						</div>
						<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
							<div class="text-sm text-slate-400">Tone</div>
							<div class="mt-2 text-white">{data.task.tone}</div>
						</div>
						<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
							<div class="text-sm text-slate-400">Minimum word count</div>
							<div class="mt-2 text-white">{data.task.minWordCount}</div>
						</div>
						<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
							<div class="text-sm text-slate-400">Review window</div>
							<div class="mt-2 text-white">{data.task.reviewWindowHours} hours</div>
						</div>
					</div>

					<div class="mt-6">
						<div class="text-sm text-slate-400">Required keywords</div>
						{#if data.task.requiredKeywords.length === 0}
							<p class="mt-2 text-sm text-slate-300">No keywords were defined for this task.</p>
						{:else}
							<div class="mt-3 flex flex-wrap gap-2">
								{#each data.task.requiredKeywords as keyword}
									<span class="rounded-full border border-slate-700 px-3 py-1 text-xs text-cyan-200">
										{keyword}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</article>

				{#if data.report}
					<article class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
						<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
							Report snapshot
						</h2>
						{#if data.report.submission}
							<div class="mt-6 space-y-4">
								<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
									<div class="text-sm text-slate-400">Submitted at</div>
									<div class="mt-2 text-white">
										{formatDate(data.report.submission.submittedAt)}
									</div>
								</div>
								<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
									<div class="text-sm text-slate-400">Submission notes</div>
									<div class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200">
										{data.report.submission.notes ?? 'No notes were provided.'}
									</div>
								</div>
								{#if data.report.verificationReport}
									<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
										<div class="flex items-center justify-between gap-4">
											<div class="text-sm text-slate-400">Verification summary</div>
											<div class="text-sm font-semibold text-cyan-300">
												Score {data.report.verificationReport.score}
											</div>
										</div>
										<p class="mt-3 text-sm leading-6 text-slate-200">
											{data.report.verificationReport.summary}
										</p>
									</div>
								{/if}
							</div>
						{:else}
							<p class="mt-6 text-sm text-slate-300">
								This task status says a report is possible, but the backend has no active
								submission snapshot yet.
							</p>
						{/if}
					</article>
				{/if}
			</div>

			<aside class="space-y-6">
				<article class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">State</h2>
					<div class="mt-6 space-y-4 text-sm text-slate-300">
						<div class="flex items-center justify-between gap-4">
							<span>Created</span>
							<span class="text-right text-white">{formatDate(data.task.createdAt)}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Updated</span>
							<span class="text-right text-white">{formatDate(data.task.updatedAt)}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Worker assigned</span>
							<span class="text-right text-white">{data.task.workerId ?? 'Not yet'}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Review deadline</span>
							<span class="text-right text-white">{formatDate(data.task.reviewDeadline)}</span>
						</div>
					</div>

					{#if form?.error}
						<p class="mt-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
							{form.error}
						</p>
					{/if}

					{#if canClaimTask()}
						<form
							class="mt-6"
							method="POST"
							action="?/claim"
							use:enhance={() => {
								claiming = true;
								return async ({ update }) => {
									await update();
									claiming = false;
								};
							}}
						>
							<button
								class="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
								type="submit"
								disabled={claiming}
							>
								{claiming ? 'Claiming...' : 'Claim task'}
							</button>
						</form>
					{:else if !data.session}
						<a
							class="mt-6 block rounded-2xl bg-cyan-400 px-4 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-300"
							href="/auth"
						>
							Sign in to take action
						</a>
					{:else}
						<p class="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 text-sm text-slate-300">
							No mutation is available from this page for your current role and the task's
							current state.
						</p>
					{/if}
				</article>

				{#if data.report}
					<article class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
						<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
							Payout visibility
						</h2>
						<div class="mt-6 space-y-4 text-sm text-slate-300">
							<div class="flex items-center justify-between gap-4">
								<span>Eligible</span>
								<span class="text-white">
									{data.report.payoutStatus.isPayoutEligible ? 'Yes' : 'No'}
								</span>
							</div>
							<div class="flex items-center justify-between gap-4">
								<span>Funding confirmed</span>
								<span class="text-white">
									{data.report.payoutStatus.hasConfirmedFunding ? 'Yes' : 'No'}
								</span>
							</div>
							<div class="flex items-center justify-between gap-4">
								<span>Payout status</span>
								<span class="text-white">
									{data.report.payoutStatus.payout?.status ?? 'No payout record'}
								</span>
							</div>
						</div>
					</article>
				{/if}
			</aside>
		</section>
	</div>
</main>
