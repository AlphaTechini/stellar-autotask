<script lang="ts">
	import { tick } from 'svelte';
	import { enhance } from '$app/forms';
	import type { WalletChallenge } from '$lib/contracts/api';
	import {
		connectFreighterWallet,
		freighterErrorMessage,
		signWithFreighter
	} from '$lib/freighter';

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
			walletStage = 'connecting';
			walletAddress = await connectFreighterWallet();
			walletNotice = 'Wallet connected. Requesting a short-lived Stellar challenge.';

			walletStage = 'requesting';
			const challenge = await requestChallenge(walletAddress);
			challengeExpiresAt = challenge.expiresAt;

			walletNotice = 'Challenge ready. Waiting for your Freighter signature.';
			walletStage = 'signing';

			const signedResult = await signWithFreighter(challenge.transactionXdr, {
				networkPassphrase: challenge.networkPassphrase,
				address: walletAddress
			});

			transactionXdr = signedResult.signedTxXdr;
			walletNotice = 'Signature captured. Finalizing sign-in through the server session boundary.';
			walletStage = 'verifying';
			await tick();
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
	class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.28),transparent_28%),linear-gradient(180deg,#fffdf2_0%,#f7f4ea_55%,#ffffff_100%)] px-6 py-20 text-black"
>
	<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
		<section
			class="rounded-[2rem] border border-yellow-500/80 bg-white p-10 shadow-[0_30px_90px_rgba(250,204,21,0.22)] backdrop-blur-xl"
		>
			<p class="mb-4 text-xs font-semibold tracking-[0.3em] text-yellow-700 uppercase">
				Wallet-first access
			</p>
			<h1 class="max-w-3xl font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-black">
				Authenticate with a Stellar wallet and let the backend own the session.
			</h1>
			<p class="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
				This flow now uses the real backend challenge and verify routes. Freighter signs the
				short-lived Stellar challenge, then SvelteKit stores the returned JWT in the server-side
				session cookie instead of leaving auth state in browser storage.
			</p>

			<div class="mt-10 grid gap-4 md:grid-cols-2">
				<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
					<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Flow</div>
					<div class="mt-3 text-sm leading-7 text-neutral-800">
						Connect wallet, request challenge, sign in Freighter, then verify on the backend.
					</div>
				</div>
				<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
					<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Redirect target</div>
					<div class="mt-3 text-sm leading-7 break-all text-yellow-800">
						{data.redirectTo}
					</div>
				</div>
			</div>

			<div class="mt-8 rounded-[1.5rem] border border-black/10 bg-white p-6">
				<h2 class="font-['Space_Grotesk'] text-xl font-semibold text-black">
					What this auth step does
				</h2>
				<ul class="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
					<li>Confirms wallet control through a short-lived Stellar challenge.</li>
					<li>Creates the first wallet-backed human profile when a username is supplied.</li>
					<li>Restores protected route redirects after successful verification.</li>
					<li>Keeps the app token inside the httpOnly SvelteKit session cookie.</li>
				</ul>
			</div>
		</section>

		<section class="rounded-[2rem] border border-black/10 bg-white p-8">
			<div class="border-b border-black/10 pb-6">
				<h2 class="font-['Space_Grotesk'] text-3xl font-semibold text-black">
					Sign in with Freighter
				</h2>
				<p class="mt-3 text-sm leading-6 text-neutral-700">
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
					<label class="mb-2 block text-sm font-medium text-neutral-800" for="username">
						Username
					</label>
					<input
						id="username"
						name="username"
						class="w-full rounded-[1.25rem] border border-black/20 bg-[#f7f4ea] px-4 py-3 text-black transition outline-none focus:border-yellow-500"
						bind:value={username}
						placeholder="writername"
					/>
					<p class="mt-3 text-sm leading-6 text-neutral-600">
						The backend requires this only when the wallet is signing in for the first time.
					</p>
				</div>

				<div class="rounded-[1.5rem] border border-black/10 bg-white p-5">
					<div class="flex items-center justify-between gap-4">
						<div>
							<div class="text-xs tracking-[0.22em] text-neutral-500 uppercase">Connected wallet</div>
							<div class="mt-3 text-sm leading-7 break-all text-yellow-700">
								{walletAddress || 'No wallet connected yet'}
							</div>
						</div>
						<div
							class="rounded-full border border-yellow-500/80 bg-yellow-100 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-yellow-800 uppercase"
						>
							{walletStage}
						</div>
					</div>

					<div class="mt-5 space-y-3 text-sm text-neutral-700">
						<div class="flex items-center justify-between gap-4">
							<span>Challenge expiry</span>
							<span class="text-right text-black">{formatDate(challengeExpiresAt)}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Signed challenge</span>
							<span class="text-right text-black">{transactionXdr ? 'Ready' : 'Not yet'}</span>
						</div>
					</div>
				</div>

				{#if walletNotice}
					<p
						class="rounded-[1.25rem] border border-yellow-500 bg-yellow-100 px-4 py-3 text-sm text-black"
					>
						{walletNotice}
					</p>
				{/if}

				{#if walletError}
					<p
						class="rounded-[1.25rem] border border-black/30 bg-yellow-100 px-4 py-3 text-sm text-black"
					>
						{walletError}
					</p>
				{/if}

				{#if form?.error}
					<p
						class="rounded-[1.25rem] border border-black/30 bg-yellow-100 px-4 py-3 text-sm text-black"
					>
						{form.error}
					</p>
				{/if}

				<div class="space-y-4 border-t border-black/10 pt-6">
					<button
						class="inline-flex w-full items-center justify-center rounded-2xl bg-yellow-400 px-5 py-4 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
						type="button"
						onclick={startWalletSignIn}
						disabled={walletStage !== 'idle'}
					>
						{buttonLabel()}
					</button>

					<p class="text-sm leading-6 text-neutral-600">
						Freighter must be installed and unlocked in this browser. The signed challenge never
						replaces the backend verify step. Agent access is intentionally outside this UI flow.
					</p>
				</div>
			</form>
		</section>
	</div>
</main>
