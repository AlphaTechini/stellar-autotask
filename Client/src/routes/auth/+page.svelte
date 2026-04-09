<script lang="ts">
	import { enhance } from '$app/forms';
	import type { WalletChallenge } from '$lib/contracts/api';

	let { data, form } = $props();

	let walletForm: HTMLFormElement | null = $state(null);
	let username = $state('');
	let walletAddress = $state('');
	let transactionXdr = $state('');
	let challengeExpiresAt = $state<string | null>(null);
	let walletStage = $state<'idle' | 'connecting' | 'requesting' | 'signing' | 'verifying'>('idle');
	let walletError = $state('');
	let walletNotice = $state('');

	$effect(() => {
		username = form?.values?.username ?? username;
	});

	function formatDate(value: string | null) {
		if (!value) {
			return 'Not available';
		}

		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
	}

	function freighterErrorMessage(error: unknown) {
		if (typeof error === 'string') {
			return error;
		}

		if (
			error &&
			typeof error === 'object' &&
			'message' in error &&
			typeof error.message === 'string'
		) {
			return error.message;
		}

		return 'The wallet request could not be completed.';
	}

	async function loadFreighterApi() {
		return import('@stellar/freighter-api');
	}

	async function requestChallenge(address: string) {
		const response = await fetch('/auth/challenge', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				walletAddress: address
			})
		});

		const payload = (await response.json().catch(() => null)) as
			| (WalletChallenge & { message?: string })
			| { message?: string }
			| null;

		if (!response.ok) {
			throw new Error(payload?.message ?? 'Unable to create a wallet challenge.');
		}

		if (!payload || !('transactionXdr' in payload)) {
			throw new Error('The backend challenge response was incomplete.');
		}

		return payload;
	}

	async function startWalletSignIn() {
		if (walletStage !== 'idle') {
			return;
		}

		walletError = '';
		walletNotice = '';
		transactionXdr = '';

		try {
			const { requestAccess, signTransaction } = await loadFreighterApi();
			walletStage = 'connecting';
			const accessResult = await requestAccess();

			if (accessResult.error || !accessResult.address) {
				throw new Error(
					accessResult.error
						? freighterErrorMessage(accessResult.error)
						: 'Freighter did not return a wallet address.'
				);
			}

			walletAddress = accessResult.address.trim().toUpperCase();
			walletNotice = 'Wallet connected. Requesting a short-lived Stellar challenge.';

			walletStage = 'requesting';
			const challenge = await requestChallenge(walletAddress);
			challengeExpiresAt = challenge.expiresAt;

			walletNotice = 'Challenge ready. Waiting for your Freighter signature.';
			walletStage = 'signing';

			const signedResult = await signTransaction(challenge.transactionXdr, {
				networkPassphrase: challenge.networkPassphrase,
				address: walletAddress
			});

			if (signedResult.error || !signedResult.signedTxXdr) {
				throw new Error(
					signedResult.error
						? freighterErrorMessage(signedResult.error)
						: 'Freighter did not return a signed transaction.'
				);
			}

			transactionXdr = signedResult.signedTxXdr;
			walletNotice = 'Signature captured. Finalizing sign-in through the server session boundary.';
			walletStage = 'verifying';
			walletForm?.requestSubmit();
		} catch (error) {
			walletError = freighterErrorMessage(error);
			walletStage = 'idle';
		}
	}

	function buttonLabel() {
		if (walletStage === 'connecting') {
			return 'Connecting wallet...';
		}

		if (walletStage === 'requesting') {
			return 'Requesting challenge...';
		}

		if (walletStage === 'signing') {
			return 'Waiting for signature...';
		}

		if (walletStage === 'verifying') {
			return 'Verifying wallet...';
		}

		return walletAddress ? 'Sign in with Freighter' : 'Connect Freighter';
	}
</script>

<svelte:head>
	<title>Authentication | Stellar Autotask</title>
</svelte:head>

<main
	class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#08111f_40%,#020617_100%)] px-6 py-20 text-slate-100"
>
	<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
		<section
			class="rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-10 shadow-[0_30px_90px_rgba(8,145,178,0.16)] backdrop-blur-xl"
		>
			<p class="mb-4 text-xs font-semibold tracking-[0.3em] text-cyan-300 uppercase">
				Wallet-first access
			</p>
			<h1 class="max-w-3xl font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
				Authenticate with a Stellar wallet and let the backend own the session.
			</h1>
			<p class="mt-4 max-w-3xl text-base leading-7 text-slate-300">
				This flow now uses the real backend challenge and verify routes. Freighter signs the
				short-lived Stellar challenge, then SvelteKit stores the returned JWT in the server-side
				session cookie instead of leaving auth state in browser storage.
			</p>

			<div class="mt-10 grid gap-4 md:grid-cols-2">
				<div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-5">
					<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">Flow</div>
					<div class="mt-3 text-sm leading-7 text-slate-200">
						Connect wallet, request challenge, sign in Freighter, then verify on the backend.
					</div>
				</div>
				<div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-5">
					<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">Redirect target</div>
					<div class="mt-3 text-sm leading-7 break-all text-cyan-200">
						{data.redirectTo}
					</div>
				</div>
			</div>

			<div class="mt-8 rounded-[1.5rem] border border-slate-800 bg-slate-900/60 p-6">
				<h2 class="font-['Space_Grotesk'] text-xl font-semibold text-white">
					What this auth step does
				</h2>
				<ul class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
					<li>Confirms wallet control through a short-lived Stellar challenge.</li>
					<li>Creates the first wallet-backed human profile when a username is supplied.</li>
					<li>Restores protected route redirects after successful verification.</li>
					<li>Keeps the app token inside the httpOnly SvelteKit session cookie.</li>
				</ul>
			</div>
		</section>

		<section class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8">
			<div class="border-b border-slate-800 pb-6">
				<h2 class="font-['Space_Grotesk'] text-3xl font-semibold text-white">
					Sign in with Freighter
				</h2>
				<p class="mt-3 text-sm leading-6 text-slate-300">
					Use a Stellar wallet already connected to Freighter. If this wallet has never signed in
					before, include a username so the backend can create the profile.
				</p>
			</div>

			<form
				class="mt-8 space-y-6"
				method="POST"
				action="?/walletVerify"
				bind:this={walletForm}
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						walletStage = 'idle';
						transactionXdr = '';
					};
				}}
			>
				<input type="hidden" name="transactionXdr" value={transactionXdr} />
				<input type="hidden" name="redirectTo" value={data.redirectTo} />

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-200" for="username">
						Username
					</label>
					<input
						id="username"
						name="username"
						class="w-full rounded-[1.25rem] border border-slate-700 bg-slate-950 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
						bind:value={username}
						placeholder="writername"
					/>
					<p class="mt-3 text-sm leading-6 text-slate-400">
						The backend requires this only when the wallet is signing in for the first time.
					</p>
				</div>

				<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
					<div class="flex items-center justify-between gap-4">
						<div>
							<div class="text-xs tracking-[0.22em] text-slate-500 uppercase">Connected wallet</div>
							<div class="mt-3 text-sm leading-7 break-all text-cyan-300">
								{walletAddress || 'No wallet connected yet'}
							</div>
						</div>
						<div
							class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-cyan-200 uppercase"
						>
							{walletStage}
						</div>
					</div>

					<div class="mt-5 space-y-3 text-sm text-slate-300">
						<div class="flex items-center justify-between gap-4">
							<span>Challenge expiry</span>
							<span class="text-right text-white">{formatDate(challengeExpiresAt)}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Signed challenge</span>
							<span class="text-right text-white">{transactionXdr ? 'Ready' : 'Not yet'}</span>
						</div>
					</div>
				</div>

				{#if walletNotice}
					<p
						class="rounded-[1.25rem] border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100"
					>
						{walletNotice}
					</p>
				{/if}

				{#if walletError}
					<p
						class="rounded-[1.25rem] border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
					>
						{walletError}
					</p>
				{/if}

				{#if form?.error}
					<p
						class="rounded-[1.25rem] border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
					>
						{form.error}
					</p>
				{/if}

				<div class="space-y-4 border-t border-slate-800 pt-6">
					<button
						class="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
						type="button"
						onclick={startWalletSignIn}
						disabled={walletStage !== 'idle'}
					>
						{buttonLabel()}
					</button>

					<p class="text-sm leading-6 text-slate-400">
						Freighter must be installed and unlocked in this browser. The signed challenge never
						replaces the backend verify step. Agent access is intentionally outside this UI flow.
					</p>
				</div>
			</form>
		</section>
	</div>
</main>
