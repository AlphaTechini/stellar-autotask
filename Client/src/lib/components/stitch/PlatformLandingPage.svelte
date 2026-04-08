<script lang="ts">
	import NavBar from '../common/NavBar.svelte';
	import Footer from '../common/Footer.svelte';

	const workflowSteps = [
		{
			kicker: 'Client setup',
			title: 'Create the brief',
			body: 'Define the writing scope, payout amount, required keywords, target audience, and review window.'
		},
		{
			kicker: 'Funding',
			title: 'Fund on Stellar Testnet',
			body: 'Funding is a distinct step after task creation, so the product stays honest about state and payout readiness.'
		},
		{
			kicker: 'Worker action',
			title: 'Claim and submit',
			body: 'Workers claim funded writing tasks, submit content, and attach notes or a document URL when needed.'
		},
		{
			kicker: 'Verification',
			title: 'Review from backend state',
			body: 'Verification reports, review decisions, and payout visibility come from the backend instead of stitched placeholders.'
		}
	];
</script>

<NavBar />

<main class="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#020617_0%,#08111f_40%,#020617_100%)] pt-20 text-slate-100">
	<section class="relative px-6 pb-24 pt-16">
		<div class="absolute inset-0 overflow-hidden">
			<div class="absolute left-[8%] top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-[110px]"></div>
			<div class="absolute right-[10%] top-12 h-72 w-72 rounded-full bg-sky-500/10 blur-[130px]"></div>
			<div class="absolute bottom-0 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-teal-300/5 blur-[140px]"></div>
		</div>

		<div class="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
			<div>
				<div class="flex flex-wrap gap-3">
					<span class="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">
						Writing-only V1
					</span>
					<span class="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">
						Stellar Testnet
					</span>
					<span class="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">
						XLM payout flow
					</span>
				</div>

				<h1 class="mt-8 max-w-5xl font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl">
					Turn a writing brief into a funded task, verified submission, and payout trail.
				</h1>

				<p class="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
					This frontend is being shaped around the real backend loop: create task, fund task,
					claim work, submit writing, verify, review, and release payout. No generic freelance
					economy theater. No fake escrow story. Just the V1 product we actually chose.
				</p>

				<div class="mt-10 flex flex-wrap gap-4">
					<a
						class="group inline-flex items-center gap-3 rounded-2xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300"
						href="/create-task"
					>
						Start a client task
						<span class="material-symbols-outlined text-lg transition group-hover:translate-x-1">arrow_forward</span>
					</a>
					<a
						class="inline-flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-6 py-4 font-semibold text-white transition hover:border-cyan-400/40 hover:bg-slate-900"
						href="/marketplace"
					>
						Find funded work
					</a>
					<a
						class="inline-flex items-center gap-3 rounded-2xl border border-slate-700 bg-transparent px-6 py-4 font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
						href="/auth"
					>
						Connect wallet
					</a>
				</div>

				<div class="mt-12 grid gap-4 sm:grid-cols-3">
					<div class="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 backdrop-blur">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-400">Auth model</div>
						<div class="mt-2 font-['Space_Grotesk'] text-2xl font-semibold text-white">Wallet-first</div>
					</div>
					<div class="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 backdrop-blur">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-400">Task type</div>
						<div class="mt-2 font-['Space_Grotesk'] text-2xl font-semibold text-white">Content writing</div>
					</div>
					<div class="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 backdrop-blur">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-400">State source</div>
						<div class="mt-2 font-['Space_Grotesk'] text-2xl font-semibold text-white">Backend-owned</div>
					</div>
				</div>
			</div>

			<div class="relative">
				<div class="absolute -left-6 top-10 h-48 w-48 rounded-full bg-cyan-300/10 blur-[120px]"></div>
				<div class="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/75 p-6 shadow-[0_30px_120px_rgba(8,145,178,0.18)] backdrop-blur-xl">
					<div class="flex items-center justify-between border-b border-slate-800 pb-4">
						<div>
							<p class="text-xs uppercase tracking-[0.24em] text-cyan-300">Live product direction</p>
							<h2 class="mt-2 font-['Space_Grotesk'] text-2xl font-semibold text-white">
								V1 workflow map
							</h2>
						</div>
						<div class="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
							No fake states
						</div>
					</div>

					<div class="mt-6 space-y-4">
						{#each workflowSteps as step, index}
							<div class="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
								<div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 font-['Space_Grotesk'] text-lg font-bold text-cyan-300">
									0{index + 1}
								</div>
								<div>
									<p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">{step.kicker}</p>
									<h3 class="mt-1 font-['Space_Grotesk'] text-xl font-semibold text-white">
										{step.title}
									</h3>
									<p class="mt-2 text-sm leading-6 text-slate-300">{step.body}</p>
								</div>
							</div>
						{/each}
					</div>

					<div class="mt-6 grid gap-4 rounded-[1.5rem] border border-slate-800 bg-[linear-gradient(135deg,rgba(8,47,73,0.65),rgba(15,23,42,0.95))] p-5 md:grid-cols-2">
						<div>
							<p class="text-xs uppercase tracking-[0.22em] text-cyan-200">Client path</p>
							<p class="mt-2 text-sm leading-6 text-slate-200">
								Create task, move to funding, track report, then approve or let the review
								window complete.
							</p>
						</div>
						<div>
							<p class="text-xs uppercase tracking-[0.22em] text-cyan-200">Worker path</p>
							<p class="mt-2 text-sm leading-6 text-slate-200">
								Claim funded writing work from the marketplace and continue through
								task-scoped submission and report views.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="border-y border-slate-800/80 bg-slate-950/55 px-6 py-20">
		<div class="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
			<div class="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-8">
				<p class="text-xs uppercase tracking-[0.24em] text-cyan-300">What changed in direction</p>
				<h2 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
					The backend decides the truth.
				</h2>
				<p class="mt-4 text-base leading-7 text-slate-300">
					The frontend should feel premium, but it should stop inventing unsupported product
					states. Funding, review, verification, and payout visibility need to match the real
					backend surface.
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-3">
				<div class="rounded-[2rem] border border-slate-800 bg-slate-900/55 p-6">
					<p class="text-xs uppercase tracking-[0.22em] text-slate-500">Task shape</p>
					<h3 class="mt-4 font-['Space_Grotesk'] text-2xl font-semibold text-white">
						Writing-specific fields
					</h3>
					<p class="mt-3 text-sm leading-6 text-slate-300">
						Title, brief, description, keywords, audience, tone, minimum word count, payout,
						and review window are the core surface now.
					</p>
				</div>

				<div class="rounded-[2rem] border border-slate-800 bg-slate-900/55 p-6">
					<p class="text-xs uppercase tracking-[0.22em] text-slate-500">Route shape</p>
					<h3 class="mt-4 font-['Space_Grotesk'] text-2xl font-semibold text-white">
						Task-scoped workflow
					</h3>
					<p class="mt-3 text-sm leading-6 text-slate-300">
						Flat `/submit`, `/review`, `/report`, and `/receipt` screens should give way to
						`/task/[id]/...` routes backed by actual task state.
					</p>
				</div>

				<div class="rounded-[2rem] border border-slate-800 bg-slate-900/55 p-6">
					<p class="text-xs uppercase tracking-[0.22em] text-slate-500">Payment language</p>
					<h3 class="mt-4 font-['Space_Grotesk'] text-2xl font-semibold text-white">
						Stellar, not generic web3 copy
					</h3>
					<p class="mt-3 text-sm leading-6 text-slate-300">
						XLM, Stellar wallet identity, and Testnet funding language matter because the
						product is showing a real payout path instead of an abstract crypto brand story.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="px-6 py-24">
		<div class="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
			<a
				href="/create-task"
				class="group overflow-hidden rounded-[2rem] border border-slate-800 bg-[linear-gradient(160deg,rgba(34,211,238,0.12),rgba(15,23,42,0.95))] p-8 transition hover:border-cyan-400/30"
			>
				<p class="text-xs uppercase tracking-[0.24em] text-cyan-200">For clients</p>
				<h2 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
					Create the brief, then fund it properly.
				</h2>
				<p class="mt-4 max-w-xl text-sm leading-7 text-slate-300">
					The client path is not “post and pray.” It is task creation followed by a real funding
					step and review-aware payout flow.
				</p>
				<div class="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-cyan-200">
					Open create-task flow
					<span class="material-symbols-outlined transition group-hover:translate-x-1">arrow_forward</span>
				</div>
			</a>

			<a
				href="/marketplace"
				class="group overflow-hidden rounded-[2rem] border border-slate-800 bg-[linear-gradient(160deg,rgba(16,185,129,0.08),rgba(15,23,42,0.95))] p-8 transition hover:border-emerald-400/30"
			>
				<p class="text-xs uppercase tracking-[0.24em] text-emerald-200">For workers</p>
				<h2 class="mt-4 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
					Claim funded writing tasks, not vague opportunity cards.
				</h2>
				<p class="mt-4 max-w-xl text-sm leading-7 text-slate-300">
					The marketplace should surface open writing work that is actually ready to be claimed,
					with payout amount, review window, and task detail routing.
				</p>
				<div class="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-emerald-200">
					Browse marketplace
					<span class="material-symbols-outlined transition group-hover:translate-x-1">arrow_forward</span>
				</div>
			</a>
		</div>
	</section>
</main>

<Footer />
