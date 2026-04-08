<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let submitting = $state(false);

	function getValue(field: 'username' | 'walletAddress' | 'role') {
		if (!form || !('values' in form)) {
			return '';
		}

		const values = form.values as Record<string, string | undefined>;
		return values[field] ?? '';
	}
</script>

<svelte:head>
	<title>Authentication | Stellar Autotask</title>
</svelte:head>

<main class="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
	<div class="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
		<section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-2xl shadow-cyan-950/20">
			<p class="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
				Phase 1 integration
			</p>
			<h1 class="max-w-2xl font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
				The frontend now restores real sessions and talks to the backend through
				SvelteKit actions.
			</h1>
			<p class="mt-4 max-w-2xl text-base leading-7 text-slate-300">
				I have not wired the Stellar wallet challenge flow yet. For this first task, I
				am using the backend's development login route when it is explicitly enabled so
				we can validate real state, redirects, and cookie-backed session recovery.
			</p>

			<div class="mt-10 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
				<h2 class="font-['Space_Grotesk'] text-lg font-semibold text-white">
					What this page proves right now
				</h2>
				<ul class="mt-4 space-y-3 text-sm text-slate-300">
					<li>Backend base URL is environment-driven rather than hardcoded.</li>
					<li>Successful sign-in writes an httpOnly session and user snapshot cookie.</li>
					<li>Refreshing protected routes restores the session on the server.</li>
					<li>Failed mutations return real backend error messages.</li>
				</ul>
			</div>
		</section>

		<section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
			<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
				Development sign-in
			</h2>
			<p class="mt-3 text-sm leading-6 text-slate-300">
				This form is available only when `PUBLIC_ENABLE_DEV_AUTH=true`.
			</p>

			{#if data.isDevAuthEnabled}
				<form
					class="mt-8 space-y-5"
					method="POST"
					action="?/devLogin"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update();
							submitting = false;
						};
					}}
				>
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-200" for="username">
							Username
						</label>
						<input
							id="username"
							name="username"
							class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
							value={getValue('username')}
							required
						/>
					</div>

					<div>
						<label class="mb-2 block text-sm font-medium text-slate-200" for="walletAddress">
							Stellar wallet address
						</label>
						<textarea
							id="walletAddress"
							name="walletAddress"
							rows="3"
							class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
							required
						>{getValue('walletAddress')}</textarea>
					</div>

					<div>
						<label class="mb-2 block text-sm font-medium text-slate-200" for="role">Role</label>
						<select
							id="role"
							name="role"
							class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
						>
							<option value="client" selected={(getValue('role') || 'client') === 'client'}>
								Client
							</option>
							<option value="worker" selected={getValue('role') === 'worker'}>
								Worker
							</option>
						</select>
					</div>

					{#if form?.error}
						<p class="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
							{form.error}
						</p>
					{/if}

					<button
						class="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
						type="submit"
						disabled={submitting}
					>
						{submitting ? 'Signing in...' : 'Sign in'}
					</button>
				</form>
			{:else}
				<div class="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
					Development auth is disabled. Turn on `PUBLIC_ENABLE_DEV_AUTH` or move to the
					next wallet-auth task before using protected routes.
				</div>
			{/if}
		</section>
	</div>
</main>
