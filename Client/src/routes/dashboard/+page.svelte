<script lang="ts">
	let { data } = $props();

	const statusTone = {
		DRAFT: 'text-yellow-800 border-yellow-500 bg-yellow-100',
		OPEN: 'text-yellow-700 border-yellow-500 bg-yellow-100',
		CLAIMED: 'text-yellow-800 border-yellow-500 bg-yellow-100',
		SUBMITTED: 'text-yellow-700 border-yellow-500 bg-yellow-100',
		PENDING_REVIEW: 'text-yellow-800 border-yellow-500 bg-yellow-100',
		APPROVED: 'text-yellow-800 border-yellow-500 bg-yellow-100',
		AUTO_APPROVED: 'text-yellow-800 border-yellow-500 bg-yellow-100',
		REJECTED: 'text-black border-black/30 bg-yellow-100',
		PAID: 'text-yellow-800 border-yellow-500 bg-yellow-100'
	} as const;

	function formatDate(value: string) {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
	}

	function dashboardIntro() {
		return 'Start with the tasks that need funding, submission, or review, then use the lower sections as your broader task history instead of one long mixed list.';
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
		return data.actionGroups;
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
		return 'Your workflow queue';
	}
</script>

<svelte:head>
	<title>Dashboard | Stellar Autotask</title>
</svelte:head>

<main class="min-h-screen bg-[#f7f4ea] px-6 py-12 text-black">
	<div class="mx-auto max-w-6xl space-y-10">
		<header class="rounded-3xl border border-black/10 bg-white p-8">
			<p class="text-xs font-semibold tracking-[0.3em] text-yellow-700 uppercase">Dashboard</p>
			<div class="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h1 class="font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-black">
						Welcome back, {data.session.username}
					</h1>
					<p class="mt-3 max-w-2xl text-sm leading-6 text-neutral-700">
						{dashboardIntro()}
					</p>
				</div>
				<div
					class="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm text-neutral-700"
				>
					<div class="font-semibold text-black">Connected wallet</div>
					<div class="mt-1 break-all">
						Wallet: <span class="font-mono text-xs text-yellow-700">{data.session.walletAddress}</span
						>
					</div>
				</div>
			</div>
		</header>

		<section class="grid gap-6 lg:grid-cols-3">
			<article class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="text-sm text-neutral-600">{priorityLabel()}</p>
				<p class="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-black">
					{totalActionableTasks()}
				</p>
				<p class="mt-3 text-sm leading-6 text-neutral-700">
					Tasks grouped below by the next action you can take right now.
				</p>
			</article>
			<article class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="text-sm text-neutral-600">Created by you</p>
				<p class="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-black">
					{data.ownedTasks.length}
				</p>
				<p class="mt-3 text-sm leading-6 text-neutral-700">
					Your created-task history stays below the action queues.
				</p>
			</article>
			<article class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="text-sm text-neutral-600">Assigned to you</p>
				<p class="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-black">
					{data.assignedTasks.length}
				</p>
			</article>
			<article class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="text-sm text-neutral-600">Open marketplace tasks</p>
				<p class="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-black">
					{data.openTasks.length}
				</p>
			</article>
		</section>

		<section class="space-y-6">
			<div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-semibold tracking-[0.3em] text-yellow-700 uppercase">Next actions</p>
					<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-black">
						Move the workflow from the dashboard
					</h2>
				</div>
				<div class="flex flex-wrap gap-3">
					<a
						class="rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
						href="/create-task"
					>
						Create task
					</a>
					<a
						class="rounded-2xl border border-black/20 px-5 py-3 text-sm font-semibold text-black transition hover:border-yellow-500 hover:text-black"
						href="/marketplace"
					>
						Browse marketplace
					</a>
				</div>
			</div>

			<div class="grid gap-6 xl:grid-cols-3">
				{#each activeGroups() as group}
					<article
						class={`rounded-3xl border bg-white p-6 ${
							group.id === primaryGroupId()
								? 'border-yellow-500 shadow-[0_18px_60px_rgba(250,204,21,0.20)]'
								: 'border-black/10'
						}`}
					>
						<div class="flex items-start justify-between gap-4">
							<div>
								{#if group.id === primaryGroupId()}
									<p class="text-xs font-semibold tracking-[0.24em] text-yellow-700 uppercase">
										Priority queue
									</p>
								{/if}
								<h3 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">
									{group.title}
								</h3>
								<p class="mt-3 text-sm leading-6 text-neutral-700">{group.description}</p>
							</div>
							<span
								class="rounded-full border border-black/20 px-3 py-1 text-xs tracking-[0.24em] text-yellow-700 uppercase"
							>
								{group.tasks.length}
							</span>
						</div>

						{#if group.tasks.length === 0}
							<p
								class="mt-6 rounded-2xl border border-black/10 bg-white px-4 py-5 text-sm text-neutral-700"
							>
								{group.emptyState}
							</p>
						{:else}
							<div class="mt-6 space-y-4">
								{#each group.tasks.slice(0, 3) as task}
									<a
										class="block rounded-2xl border border-black/10 bg-white p-4 transition hover:border-yellow-500"
										href={actionHref(task, group.id)}
									>
										<div class="flex items-start justify-between gap-4">
											<div>
												<h4 class="font-semibold text-black">{task.title}</h4>
												<p class="mt-1 text-sm text-neutral-600">{task.brief}</p>
											</div>
											<span
												class={`rounded-full border px-3 py-1 text-xs tracking-wide uppercase ${statusTone[task.status]}`}
											>
												{task.status}
											</span>
										</div>
										<div
											class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600"
										>
											<div class="flex flex-wrap gap-4">
												<span>{task.payoutAmount} {task.currencyAsset}</span>
												<span>{formatDate(task.updatedAt)}</span>
											</div>
											<span class="font-medium text-yellow-700">
												{actionLabel(task, group.id, group.ctaLabel)} ->
											</span>
										</div>
									</a>
								{/each}
							</div>

							{#if group.tasks.length > 3}
								<p class="mt-4 text-xs tracking-[0.24em] text-neutral-500 uppercase">
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
				<p class="text-xs font-semibold tracking-[0.3em] text-neutral-500 uppercase">
					History and backlog
				</p>
				<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-black">
					Broader task context
				</h2>
				<p class="mt-3 max-w-2xl text-sm leading-6 text-neutral-700">
					I am keeping the sections below as history views so the action queues stay focused on the
					next move instead of becoming one long mixed list.
				</p>
			</div>

			<section class="grid gap-6 lg:grid-cols-2">
				<div class="rounded-3xl border border-black/10 bg-white p-6">
					<div class="flex items-center justify-between gap-4">
						<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">Created tasks</h2>
						<a class="text-sm font-medium text-yellow-700 hover:text-yellow-800" href="/create-task">
							Create another
						</a>
					</div>

					{#if data.ownedTasks.length === 0}
						<p
							class="mt-6 rounded-2xl border border-black/10 bg-white px-4 py-5 text-sm text-neutral-700"
						>
							You have not created any writing tasks yet. Start with the brief here, then continue
							into funding from the task hub.
						</p>
					{:else}
						<div class="mt-6 space-y-4">
							{#each data.ownedTasks as task}
								<a
									class="block rounded-2xl border border-black/10 bg-white p-4 transition hover:border-yellow-500"
									href={`/task/${task.id}`}
								>
									<div class="flex items-start justify-between gap-4">
										<div>
											<h3 class="font-semibold text-black">{task.title}</h3>
											<p class="mt-1 text-sm text-neutral-600">{task.brief}</p>
										</div>
										<span
											class="rounded-full border border-black/20 px-3 py-1 text-xs tracking-wide text-yellow-700 uppercase"
										>
											{task.status}
										</span>
									</div>
									<div class="mt-4 flex flex-wrap gap-4 text-xs text-neutral-600">
										<span>{task.payoutAmount} {task.currencyAsset}</span>
										<span>{formatDate(task.createdAt)}</span>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>

				<div class="rounded-3xl border border-black/10 bg-white p-6">
					<div class="flex items-center justify-between gap-4">
						<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">
							Assigned history
						</h2>
						<a class="text-sm font-medium text-yellow-700 hover:text-yellow-800" href="/marketplace">
							Browse marketplace
						</a>
					</div>

					{#if data.assignedTasks.length === 0}
						<p
							class="mt-6 rounded-2xl border border-black/10 bg-white px-4 py-5 text-sm text-neutral-700"
						>
							No writing tasks are assigned to you yet. Funded work will start here after you claim
							it from the marketplace.
						</p>
					{:else}
						<div class="mt-6 space-y-4">
							{#each data.assignedTasks as task}
								<a
									class="block rounded-2xl border border-black/10 bg-white p-4 transition hover:border-yellow-500"
									href={`/task/${task.id}`}
								>
									<div class="flex items-start justify-between gap-4">
										<div>
											<h3 class="font-semibold text-black">{task.title}</h3>
											<p class="mt-1 text-sm text-neutral-600">{task.brief}</p>
										</div>
										<span
											class="rounded-full border border-black/20 px-3 py-1 text-xs tracking-wide text-yellow-700 uppercase"
										>
											{task.status}
										</span>
									</div>
									<div class="mt-4 flex flex-wrap gap-4 text-xs text-neutral-600">
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

		<section class="rounded-3xl border border-black/10 bg-white p-6">
			<div class="flex items-center justify-between gap-4">
				<div>
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-black">
						Marketplace shortcut
					</h2>
					<p class="mt-2 max-w-2xl text-sm leading-6 text-neutral-700">
						Use the marketplace when you want to pick up another funded writing task, then return
						here to continue through submission, review, and receipt visibility.
					</p>
				</div>
				<a class="text-sm font-medium text-yellow-700 hover:text-yellow-800" href="/marketplace">
					Open marketplace
				</a>
			</div>
		</section>
	</div>
</main>
