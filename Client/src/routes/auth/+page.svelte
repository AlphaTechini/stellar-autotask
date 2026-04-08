<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let submitting = $state(false);

	function getValue(field: 'username' | 'walletAddress') {
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
				Wallet-first access
			</p>
			<h1 class="max-w-2xl font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
				Sign in with your Stellar wallet details to continue into the task flow.
			</h1>
			<p class="mt-4 max-w-2xl text-base leading-7 text-slate-300">
				This product is built around wallet-backed task ownership and payout visibility.
				Username and wallet address stay in the flow because they match the current V1
				direction and the backend session model.
			</p>

			<div class="mt-10 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
				<h2 class="font-['Space_Grotesk'] text-lg font-semibold text-white">
					What belongs here next
				</h2>
				<ul class="mt-4 space-y-3 text-sm text-slate-300">
					<li>Wallet challenge request and signature verification.</li>
					<li>Protected route redirects that feel like product behavior.</li>
					<li>First-sign-in username onboarding for new wallet users.</li>
					<li>Session recovery through the SvelteKit server boundary.</li>
				</ul>
			</div>
		</section>

		<section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
			<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Sign in</h2>
			<p class="mt-3 text-sm leading-6 text-slate-300">
				The current fallback keeps the frontend usable until the full wallet challenge flow
				is wired.
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

					{#if form?.error}
						<p class="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
							{form.error}
						</p>
					{/if}

					<div class="grid gap-3 sm:grid-cols-2">
						<button
							class="rounded-2xl border border-slate-700 px-4 py-3 font-semibold text-slate-100 transition hover:border-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-60"
							type="submit"
							name="role"
							value="client"
							disabled={submitting}
						>
							Continue as client
						</button>
						<button
							class="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
							type="submit"
							name="role"
							value="worker"
							disabled={submitting}
						>
							Continue as worker
						</button>
					</div>
				</form>
			{:else}
				<p class="mt-8 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 text-sm text-slate-300">
					This environment does not expose the temporary sign-in fallback. The next cleanup
					step here is the real wallet challenge flow.
				</p>
			{/if}
		</section>
	</div>
</main>
