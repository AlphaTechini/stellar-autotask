<script lang="ts">
	import type { ClaimedTaskStatus, TaskClaimedSnapshot } from '$lib/contracts/api';

	let { data } = $props();

	const statusLabels: Record<ClaimedTaskStatus, string> = {
		CLAIMED: 'Claimed',
		SUBMITTED: 'Submitted',
		PENDING_REVIEW: 'Pending Review',
		APPROVED: 'Approved'
	};

	const statusTone: Record<ClaimedTaskStatus, string> = {
		CLAIMED: 'text-yellow-800 border-yellow-500 bg-yellow-100',
		SUBMITTED: 'text-yellow-800 border-yellow-500 bg-yellow-100',
		PENDING_REVIEW: 'text-yellow-800 border-yellow-500 bg-yellow-100',
		APPROVED: 'text-emerald-800 border-emerald-500 bg-emerald-100'
	};

	let activeStatus = $state<ClaimedTaskStatus>('CLAIMED');

	function formatDate(value: string | null) {
		if (!value) {
			return '—';
		}

		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
	}

	function formatValue(value: unknown) {
		if (value === null || value === undefined) {
			return { text: '—', isCode: false };
		}

		if (typeof value === 'object') {
			return { text: JSON.stringify(value, null, 2), isCode: true };
		}

		const stringValue = String(value);
		return {
			text: stringValue,
			isCode: stringValue.length > 80
		};
	}

	function toRows(record: Record<string, unknown> | null) {
		if (!record) {
			return [];
		}

		return Object.entries(record).map(([key, value]) => ({
			key,
			...formatValue(value)
		}));
	}

	function activeGroup() {
		return data.groups.find((group) => group.status === activeStatus);
	}

	function snapshotKey(snapshot: TaskClaimedSnapshot) {
		return snapshot.task.id;
	}
</script>

<svelte:head>
	<title>Claimed Tasks | Stellar Autotask</title>
</svelte:head>

<main class="space-y-8">
	<header class="rounded-3xl border border-black/10 bg-white p-8">
		<p class="text-xs font-semibold tracking-[0.3em] text-yellow-700 uppercase">Claimed Tasks</p>
		<h1 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-black">
			Claimed workflow visibility
		</h1>
		<p class="mt-4 max-w-3xl text-sm leading-6 text-neutral-700">
			I keep this view authenticated so the full workflow context stays inside the wallet-backed
			session. Each tab shows all of the task, submission, verification, review, funding, and
			payout fields for that status bucket.
		</p>
	</header>

	<section class="rounded-3xl border border-black/10 bg-white p-6">
		<div class="flex flex-wrap gap-3">
			{#each data.groups as group}
				<button
					type="button"
					on:click={() => (activeStatus = group.status)}
					class={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
						activeStatus === group.status
							? 'border-yellow-500 bg-yellow-100 text-yellow-800'
							: 'border-black/20 text-neutral-700 hover:border-yellow-500'
					}`}
				>
					{statusLabels[group.status]}
					<span class="ml-2 rounded-full bg-black/5 px-2 py-0.5 text-xs text-neutral-700">
						{group.tasks.length}
					</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="space-y-6">
		{#if activeGroup()?.tasks.length === 0}
			<div class="rounded-3xl border border-black/10 bg-white p-6 text-sm text-neutral-700">
				No tasks are in the {statusLabels[activeStatus].toLowerCase()} queue right now.
			</div>
		{:else}
			{#each activeGroup()?.tasks ?? [] as snapshot (snapshotKey(snapshot))}
				<article class="rounded-3xl border border-black/10 bg-white p-6">
					<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div>
							<p class="text-xs font-semibold tracking-[0.3em] text-yellow-700 uppercase">
								{statusLabels[activeStatus]} task
							</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-2xl font-semibold text-black">
								{snapshot.task.title}
							</h2>
							<p class="mt-2 text-sm text-neutral-700">{snapshot.task.brief}</p>
						</div>
						<div class="flex flex-wrap gap-3">
							<span
								class={`rounded-full border px-3 py-1 text-xs tracking-wide uppercase ${statusTone[activeStatus]}`}
							>
								{snapshot.task.status}
							</span>
							<a
								class="rounded-full border border-black/20 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:border-yellow-500"
								href={`/task/${snapshot.task.id}`}
							>
								Open task
							</a>
						</div>
					</div>

					<div class="mt-6 grid gap-6 xl:grid-cols-2">
						<section class="rounded-2xl border border-black/10 bg-white p-4">
							<h3 class="text-sm font-semibold text-black">Task</h3>
							<dl class="mt-3 space-y-2 text-xs text-neutral-700">
								{#each toRows(snapshot.task) as row}
									<div class="flex flex-col gap-1 border-b border-black/5 pb-2 last:border-b-0">
										<dt class="uppercase text-[10px] text-neutral-500">{row.key}</dt>
										<dd class="font-medium text-neutral-800">
											{#if row.isCode}
												<pre class="whitespace-pre-wrap rounded-lg bg-[#f7f4ea] p-2 text-[11px] text-neutral-700">
{row.text}</pre
												>
											{:else}
												{row.text}
											{/if}
										</dd>
									</div>
								{/each}
							</dl>
						</section>

						<section class="rounded-2xl border border-black/10 bg-white p-4">
							<h3 class="text-sm font-semibold text-black">Submission</h3>
							<dl class="mt-3 space-y-2 text-xs text-neutral-700">
								{#if snapshot.submission}
									{#each toRows(snapshot.submission) as row}
										<div class="flex flex-col gap-1 border-b border-black/5 pb-2 last:border-b-0">
											<dt class="uppercase text-[10px] text-neutral-500">{row.key}</dt>
											<dd class="font-medium text-neutral-800">
												{#if row.isCode}
													<pre class="whitespace-pre-wrap rounded-lg bg-[#f7f4ea] p-2 text-[11px] text-neutral-700">
{row.text}</pre
													>
												{:else}
													{row.text}
												{/if}
											</dd>
										</div>
									{/each}
								{:else}
									<p class="rounded-xl border border-black/10 bg-[#f7f4ea] px-3 py-4 text-xs text-neutral-700">
										No submission has been attached yet.
									</p>
								{/if}
							</dl>
						</section>

						<section class="rounded-2xl border border-black/10 bg-white p-4">
							<h3 class="text-sm font-semibold text-black">Verification report</h3>
							<dl class="mt-3 space-y-2 text-xs text-neutral-700">
								{#if snapshot.verificationReport}
									{#each toRows(snapshot.verificationReport) as row}
										<div class="flex flex-col gap-1 border-b border-black/5 pb-2 last:border-b-0">
											<dt class="uppercase text-[10px] text-neutral-500">{row.key}</dt>
											<dd class="font-medium text-neutral-800">
												{#if row.isCode}
													<pre class="whitespace-pre-wrap rounded-lg bg-[#f7f4ea] p-2 text-[11px] text-neutral-700">
{row.text}</pre
													>
												{:else}
													{row.text}
												{/if}
											</dd>
										</div>
									{/each}
								{:else}
									<p class="rounded-xl border border-black/10 bg-[#f7f4ea] px-3 py-4 text-xs text-neutral-700">
										Verification has not run yet.
									</p>
								{/if}
							</dl>
						</section>

						<section class="rounded-2xl border border-black/10 bg-white p-4">
							<h3 class="text-sm font-semibold text-black">Review decision</h3>
							<dl class="mt-3 space-y-2 text-xs text-neutral-700">
								{#if snapshot.latestReviewDecision}
									{#each toRows(snapshot.latestReviewDecision) as row}
										<div class="flex flex-col gap-1 border-b border-black/5 pb-2 last:border-b-0">
											<dt class="uppercase text-[10px] text-neutral-500">{row.key}</dt>
											<dd class="font-medium text-neutral-800">
												{#if row.isCode}
													<pre class="whitespace-pre-wrap rounded-lg bg-[#f7f4ea] p-2 text-[11px] text-neutral-700">
{row.text}</pre
													>
												{:else}
													{row.text}
												{/if}
											</dd>
										</div>
									{/each}
								{:else}
									<p class="rounded-xl border border-black/10 bg-[#f7f4ea] px-3 py-4 text-xs text-neutral-700">
										No review decision yet.
									</p>
								{/if}
							</dl>
						</section>

						<section class="rounded-2xl border border-black/10 bg-white p-4">
							<h3 class="text-sm font-semibold text-black">Funding</h3>
							{#if snapshot.funding}
								<dl class="mt-3 space-y-2 text-xs text-neutral-700">
									{#each toRows(snapshot.funding) as row}
										<div class="flex flex-col gap-1 border-b border-black/5 pb-2 last:border-b-0">
											<dt class="uppercase text-[10px] text-neutral-500">{row.key}</dt>
											<dd class="font-medium text-neutral-800">
												{#if row.isCode}
													<pre class="whitespace-pre-wrap rounded-lg bg-[#f7f4ea] p-2 text-[11px] text-neutral-700">
{row.text}</pre
													>
												{:else}
													{row.text}
												{/if}
											</dd>
										</div>
									{/each}
								</dl>
							{:else}
								<p class="mt-3 rounded-xl border border-black/10 bg-[#f7f4ea] px-3 py-4 text-xs text-neutral-700">
									Funding is not confirmed yet.
								</p>
							{/if}
						</section>

						<section class="rounded-2xl border border-black/10 bg-white p-4">
							<h3 class="text-sm font-semibold text-black">Payout status</h3>
							<dl class="mt-3 space-y-2 text-xs text-neutral-700">
								{#each toRows(snapshot.payoutStatus) as row}
									<div class="flex flex-col gap-1 border-b border-black/5 pb-2 last:border-b-0">
										<dt class="uppercase text-[10px] text-neutral-500">{row.key}</dt>
										<dd class="font-medium text-neutral-800">
											{#if row.isCode}
												<pre class="whitespace-pre-wrap rounded-lg bg-[#f7f4ea] p-2 text-[11px] text-neutral-700">
{row.text}</pre
												>
											{:else}
												{row.text}
											{/if}
										</dd>
									</div>
								{/each}
							</dl>
						</section>
					</div>

					<div class="mt-6 rounded-2xl border border-black/10 bg-[#f7f4ea] p-4 text-xs text-neutral-700">
						<div class="font-semibold text-black">Last update</div>
						<div class="mt-1">{formatDate(snapshot.task.updatedAt)}</div>
					</div>
				</article>
			{/each}
		{/if}
	</section>
</main>
