<script lang="ts">
	let { data } = $props();

	function formatDate(value: string) {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
	}
</script>

<svelte:head>
	<title>Dashboard | Stellar Autotask</title>
</svelte:head>

<main class="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
	<div class="mx-auto max-w-6xl space-y-10">
		<header class="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
			<p class="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">Dashboard</p>
			<div class="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h1 class="font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
						Welcome back, {data.session.username}
					</h1>
					<p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
						Use this dashboard to track the writing tasks you created, claimed, and still
						need to act on.
					</p>
				</div>
				<div class="rounded-2xl border border-slate-800 bg-slate-950/70 px-5 py-4 text-sm text-slate-300">
					<div>Role: <span class="font-semibold text-white">{data.session.role}</span></div>
					<div class="mt-1 break-all">
						Wallet: <span class="font-mono text-xs text-cyan-300">{data.session.walletAddress}</span>
					</div>
				</div>
			</div>
		</header>

		<section class="grid gap-6 lg:grid-cols-3">
			<article class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
				<p class="text-sm text-slate-400">Created by you</p>
				<p class="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
					{data.ownedTasks.length}
				</p>
			</article>
			<article class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
				<p class="text-sm text-slate-400">Assigned to you</p>
				<p class="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
					{data.assignedTasks.length}
				</p>
			</article>
			<article class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
				<p class="text-sm text-slate-400">Open marketplace tasks</p>
				<p class="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
					{data.openTasks.length}
				</p>
			</article>
		</section>

		<section class="grid gap-6 lg:grid-cols-2">
			<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
				<div class="flex items-center justify-between gap-4">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Your created tasks</h2>
					<a class="text-sm font-medium text-cyan-300 hover:text-cyan-200" href="/create-task">
						Create another
					</a>
				</div>

				{#if data.ownedTasks.length === 0}
					<p class="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-5 text-sm text-slate-300">
						You have not created any writing tasks yet.
					</p>
				{:else}
					<div class="mt-6 space-y-4">
						{#each data.ownedTasks as task}
							<a
								class="block rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-cyan-400/40"
								href={`/task/${task.id}`}
							>
								<div class="flex items-start justify-between gap-4">
									<div>
										<h3 class="font-semibold text-white">{task.title}</h3>
										<p class="mt-1 text-sm text-slate-400">{task.brief}</p>
									</div>
									<span class="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wide text-cyan-300">
										{task.status}
									</span>
								</div>
								<div class="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
									<span>{task.payoutAmount} {task.currencyAsset}</span>
									<span>{formatDate(task.createdAt)}</span>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
				<div class="flex items-center justify-between gap-4">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Your assigned tasks</h2>
					<a class="text-sm font-medium text-cyan-300 hover:text-cyan-200" href="/marketplace">
						Browse marketplace
					</a>
				</div>

				{#if data.assignedTasks.length === 0}
					<p class="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-5 text-sm text-slate-300">
						No writing tasks are assigned to you yet.
					</p>
				{:else}
					<div class="mt-6 space-y-4">
						{#each data.assignedTasks as task}
							<a
								class="block rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-cyan-400/40"
								href={`/task/${task.id}`}
							>
								<div class="flex items-start justify-between gap-4">
									<div>
										<h3 class="font-semibold text-white">{task.title}</h3>
										<p class="mt-1 text-sm text-slate-400">{task.brief}</p>
									</div>
									<span class="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wide text-cyan-300">
										{task.status}
									</span>
								</div>
								<div class="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
									<span>{task.payoutAmount} {task.currencyAsset}</span>
									<span>{formatDate(task.updatedAt)}</span>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</section>
	</div>
</main>
