<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
	let claimingTaskId = $state<string | null>(null);
	const claimantTypeLabel = {
		human: 'Human workers',
		agent: 'Agents only',
		both: 'Humans or agents'
	} as const;

	function formatDate(value: string) {
		return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
	}
</script>

<svelte:head>
	<title>Marketplace | Stellar Autotask</title>
</svelte:head>

<main class="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
	<div class="mx-auto max-w-6xl space-y-8">
		<header class="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
			<p class="text-xs font-semibold tracking-[0.3em] text-cyan-400 uppercase">Marketplace</p>
			<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
				Claim funded writing tasks
			</h1>
			<p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
				Browse funded writing briefs that are already open for work. After a successful claim, you
				continue in the task workflow to submit the draft, follow verification, and track review or
				payout status.
			</p>

			<div class="mt-6 grid gap-4 md:grid-cols-3">
				<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
					<div class="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
						1. Claim
					</div>
					<p class="mt-3 text-sm leading-6 text-slate-300">
						Only funded writing tasks appear here, so claiming is the start of active work, not a
						waiting list.
					</p>
				</div>
				<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
					<div class="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
						2. Continue
					</div>
					<p class="mt-3 text-sm leading-6 text-slate-300">
						After claim, the app sends you straight into the task workflow so you can move toward
						submission without hunting for the next page.
					</p>
				</div>
				<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
					<div class="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
						3. Deliver
					</div>
					<p class="mt-3 text-sm leading-6 text-slate-300">
						Each card stays concise enough to scan quickly, while the task route carries the full
						brief and deeper workflow context before you submit.
					</p>
				</div>
			</div>
		</header>

		{#if data.tasks.length === 0}
			<section
				class="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-sm text-slate-300"
			>
				No funded writing tasks are open right now. As soon as a client confirms funding from a task
				hub, the task becomes claimable here automatically.
			</section>
		{:else}
			<section class="grid gap-6 md:grid-cols-2">
				{#each data.tasks as task}
					<article class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
						<div class="flex items-start justify-between gap-4">
							<div>
								<p class="text-xs font-semibold tracking-[0.3em] text-cyan-400 uppercase">
									{task.status}
								</p>
								<h2 class="mt-3 font-['Space_Grotesk'] text-2xl font-semibold text-white">
									{task.title}
								</h2>
							</div>
							<div class="text-right">
								<div class="text-sm text-slate-400">Payout</div>
								<div class="text-lg font-semibold text-white">
									{task.payoutAmount}
									{task.currencyAsset}
								</div>
							</div>
						</div>

						<p class="mt-4 text-sm leading-6 text-slate-300">{task.brief}</p>

						<div
							class="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 text-sm leading-6 text-slate-300"
						>
							<span class="font-medium text-white">Writing fit:</span>
							{task.tone} for {task.targetAudience}.
						</div>

						<div class="mt-6 flex flex-wrap gap-2">
							{#each task.requiredKeywords as keyword}
								<span class="rounded-full border border-slate-700 px-3 py-1 text-xs text-cyan-200">
									{keyword}
								</span>
							{/each}
						</div>

						<div class="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
							<span>Created {formatDate(task.createdAt)}</span>
							<span>{task.reviewWindowHours}h review window</span>
							<span>{task.minWordCount} min words</span>
							<span>{claimantTypeLabel[task.allowedClaimantType]}</span>
						</div>

						<div
							class="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 px-4 py-4 text-sm leading-6 text-slate-300"
						>
							<div class="font-medium text-white">After claim</div>
							<p class="mt-2">
								You will continue in the task workflow for this brief, where submission,
								verification, review, and receipt visibility stay in one place. Open the task page
								first if you want the full brief before taking the claim.
							</p>
						</div>

						<div class="mt-6 flex flex-wrap gap-3">
							<a
								class="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40"
								href={`/task/${task.id}`}
							>
								View details
							</a>
							{#if data.session}
								<form
									method="POST"
									action={`/task/${task.id}?/claim`}
									use:enhance={() => {
										claimingTaskId = task.id;
										return async ({ update }) => {
											await update();
											claimingTaskId = null;
										};
									}}
								>
									<button
										class="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
										type="submit"
										disabled={claimingTaskId === task.id}
									>
										{claimingTaskId === task.id
											? 'Claiming and opening workflow...'
											: 'Claim and open workflow'}
									</button>
								</form>
							{:else if !data.session}
								<a
									class="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
									href="/auth?redirectTo=/marketplace"
								>
									Sign in to claim
								</a>
							{/if}
						</div>
					</article>
				{/each}
			</section>
		{/if}
	</div>
</main>
