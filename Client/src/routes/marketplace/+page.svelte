<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
	let claimingTaskId = $state<string | null>(null);

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
			<p class="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">Marketplace</p>
			<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
				Claim funded writing tasks
			</h1>
			<p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
				Browse funded writing work that is already ready to claim, then continue through the
				task hub into submission and report handling.
			</p>
		</header>

		{#if data.tasks.length === 0}
			<section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-sm text-slate-300">
				No funded writing tasks are open right now. As soon as a client confirms funding from a
				task hub, the task becomes claimable here automatically.
			</section>
		{:else}
			<section class="grid gap-6 md:grid-cols-2">
				{#each data.tasks as task}
					<article class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
						<div class="flex items-start justify-between gap-4">
							<div>
								<p class="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
									{task.status}
								</p>
								<h2 class="mt-3 font-['Space_Grotesk'] text-2xl font-semibold text-white">
									{task.title}
								</h2>
							</div>
							<div class="text-right">
								<div class="text-sm text-slate-400">Payout</div>
								<div class="text-lg font-semibold text-white">
									{task.payoutAmount} {task.currencyAsset}
								</div>
							</div>
						</div>

						<p class="mt-4 text-sm leading-6 text-slate-300">{task.brief}</p>

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
						</div>

						<div class="mt-6 flex flex-wrap gap-3">
							<a
								class="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40"
								href={`/task/${task.id}`}
							>
								View details
							</a>
							{#if data.session?.role === 'worker'}
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
										{claimingTaskId === task.id ? 'Claiming...' : 'Claim and continue'}
									</button>
								</form>
							{/if}
						</div>
					</article>
				{/each}
			</section>
		{/if}
	</div>
</main>
