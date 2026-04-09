<script lang="ts">
	let { data } = $props();

	const statusTone = {
		DRAFT: 'text-amber-300 border-amber-400/30 bg-amber-400/10',
		OPEN: 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10',
		CLAIMED: 'text-sky-300 border-sky-400/30 bg-sky-400/10',
		SUBMITTED: 'text-violet-300 border-violet-400/30 bg-violet-400/10',
		PENDING_REVIEW: 'text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-400/10',
		APPROVED: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
		AUTO_APPROVED: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
		REJECTED: 'text-rose-300 border-rose-400/30 bg-rose-400/10',
		PAID: 'text-lime-300 border-lime-400/30 bg-lime-400/10'
	} as const;

	function formatDate(value: string) {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
	}

	function dashboardIntro() {
		if (data.session.role === 'client') {
			return 'Start with the tasks that need funding, jump straight into reviews waiting on you, and keep payout receipts close once work is approved.';
		}

		return 'See the writing tasks that need submission first, keep report follow-up close, and treat the lower sections as broader history rather than the immediate queue.';
	}

	function actionHref(task: { id: string; status: string }, groupId: string) {
		if (groupId === 'fund-next') {
			return `/task/${task.id}`;
		}

		if (groupId === 'review-next') {
			return `/task/${task.id}/review`;
		}

		if (groupId === 'submit-next') {
			return `/task/${task.id}/submit`;
		}

		if (groupId === 'report-next') {
			return `/task/${task.id}/report`;
		}

		if (groupId === 'receipt-next') {
			return `/task/${task.id}/receipt`;
		}

		return `/task/${task.id}`;
	}

	function actionLabel(task: { status: string }, groupId: string, fallbackLabel: string) {
		if (groupId === 'fund-next') {
			return task.status === 'DRAFT' ? 'Fund task' : fallbackLabel;
		}

		if (groupId === 'review-next') {
			return task.status === 'PENDING_REVIEW' ? 'Review submission' : fallbackLabel;
		}

		if (groupId === 'submit-next') {
			return task.status === 'CLAIMED' ? 'Submit work' : fallbackLabel;
		}

		if (groupId === 'report-next') {
			return task.status === 'REJECTED' ? 'View feedback' : 'Open report';
		}

		if (groupId === 'receipt-next') {
			return task.status === 'PAID' ? 'View receipt' : 'Check payout';
		}

		return fallbackLabel;
	}

	function activeGroups() {
		return data.session.role === 'client' ? data.clientGroups : data.workerGroups;
	}

	function primaryGroupId() {
		const firstNonEmptyGroup = activeGroups().find(
			(group: { id: string; tasks: unknown[] }) => group.tasks.length > 0
		);

		return firstNonEmptyGroup?.id ?? activeGroups()[0]?.id ?? null;
	}

	function totalActionableTasks() {
		return activeGroups().reduce(
			(total: number, group: { tasks: unknown[] }) => total + group.tasks.length,
			0
		);
	}

	function priorityLabel() {
		if (data.session.role === 'client') {
			return 'Client workflow queue';
		}

		return 'Worker workflow queue';
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
						{dashboardIntro()}
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
				<p class="text-sm text-slate-400">{priorityLabel()}</p>
				<p class="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
					{totalActionableTasks()}
				</p>
				<p class="mt-3 text-sm leading-6 text-slate-300">
					Tasks grouped below by the next action you can take right now.
				</p>
			</article>
			<article class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
				<p class="text-sm text-slate-400">
					{data.session.role === 'client' ? 'Created by you' : 'Worker history'}
				</p>
				<p class="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
					{data.session.role === 'client' ? data.ownedTasks.length : data.assignedTasks.length}
				</p>
				<p class="mt-3 text-sm leading-6 text-slate-300">
					{data.session.role === 'client'
						? 'Your broader client-side task history stays below the action queues.'
						: 'Your broader worker history stays below the action queues.'}
				</p>
			</article>
			<article class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
				<p class="text-sm text-slate-400">
					{data.session.role === 'worker' ? 'Assigned to you' : 'Open marketplace tasks'}
				</p>
				<p class="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
					{data.session.role === 'worker' ? data.assignedTasks.length : data.openTasks.length}
				</p>
			</article>
		</section>

		<section class="space-y-6">
			<div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">Next actions</p>
					<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">
						Move the workflow from the dashboard
					</h2>
				</div>
				<div class="flex flex-wrap gap-3">
					{#if data.session.role === 'client'}
						<a
							class="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
							href="/create-task"
						>
							Create task
						</a>
					{:else}
						<a
							class="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
							href="/marketplace"
						>
							Browse marketplace
						</a>
					{/if}
				</div>
			</div>

			<div class="grid gap-6 xl:grid-cols-3">
				{#each activeGroups() as group}
					<article
						class={`rounded-3xl border bg-slate-900/70 p-6 ${
							group.id === primaryGroupId()
								? 'border-cyan-400/30 shadow-[0_18px_60px_rgba(34,211,238,0.08)]'
								: 'border-slate-800'
						}`}
					>
						<div class="flex items-start justify-between gap-4">
							<div>
								{#if group.id === primaryGroupId()}
									<p class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
										Priority queue
									</p>
								{/if}
								<h3 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
									{group.title}
								</h3>
								<p class="mt-3 text-sm leading-6 text-slate-300">{group.description}</p>
							</div>
							<span class="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-300">
								{group.tasks.length}
							</span>
						</div>

						{#if group.tasks.length === 0}
							<p class="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-5 text-sm text-slate-300">
								{group.emptyState}
							</p>
						{:else}
							<div class="mt-6 space-y-4">
								{#each group.tasks.slice(0, 3) as task}
									<a
										class="block rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-cyan-400/40"
										href={actionHref(task, group.id)}
									>
										<div class="flex items-start justify-between gap-4">
											<div>
												<h4 class="font-semibold text-white">{task.title}</h4>
												<p class="mt-1 text-sm text-slate-400">{task.brief}</p>
											</div>
											<span
												class={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide ${statusTone[task.status]}`}
											>
												{task.status}
											</span>
										</div>
										<div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
											<div class="flex flex-wrap gap-4">
												<span>{task.payoutAmount} {task.currencyAsset}</span>
												<span>{formatDate(task.updatedAt)}</span>
											</div>
											<span class="font-medium text-cyan-300">
												{actionLabel(task, group.id, group.ctaLabel)} ->
											</span>
										</div>
									</a>
								{/each}
							</div>

							{#if group.tasks.length > 3}
								<p class="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">
									+ {group.tasks.length - 3} more in this queue
								</p>
							{/if}
						{/if}
					</article>
				{/each}
			</div>
		</section>

		<section class="space-y-6">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">History and backlog</p>
				<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">
					Broader task context
				</h2>
				<p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
					I am keeping the sections below as history views so the action queues stay focused on the
					next move instead of becoming one long mixed list.
				</p>
			</div>

			<section class="grid gap-6 lg:grid-cols-2">
				<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
					<div class="flex items-center justify-between gap-4">
						<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
							{data.session.role === 'client' ? 'Client history' : 'Created tasks'}
						</h2>
						<a class="text-sm font-medium text-cyan-300 hover:text-cyan-200" href="/create-task">
							Create another
						</a>
					</div>

					{#if data.ownedTasks.length === 0}
						<p class="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-5 text-sm text-slate-300">
							You have not created any writing tasks yet. Start with the brief here, then continue
							into funding from the task hub.
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
						<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Assigned history</h2>
						<a class="text-sm font-medium text-cyan-300 hover:text-cyan-200" href="/marketplace">
							Browse marketplace
						</a>
					</div>

					{#if data.assignedTasks.length === 0}
						<p class="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-5 text-sm text-slate-300">
							No writing tasks are assigned to you yet. Funded work will start here after you claim
							it from the marketplace.
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
		</section>

		<section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
			<div class="flex items-center justify-between gap-4">
				<div>
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Marketplace shortcut</h2>
					<p class="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
						Use the marketplace when you want to pick up another funded writing task, then return
						here to continue through submission, review, and receipt visibility.
					</p>
				</div>
				<a class="text-sm font-medium text-cyan-300 hover:text-cyan-200" href="/marketplace">
					Open marketplace
				</a>
			</div>
		</section>
	</div>
</main>
