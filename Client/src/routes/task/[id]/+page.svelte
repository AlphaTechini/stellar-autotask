<script lang="ts">
	import { enhance } from '$app/forms';
	import { getNetworkDetails, requestAccess, signTransaction } from '@stellar/freighter-api';
	import { Asset, BASE_FEE, Horizon, Operation, TransactionBuilder } from '@stellar/stellar-sdk';

	let { data, form } = $props();
	let fundingForm: HTMLFormElement | null = $state(null);
	let claiming = $state(false);
	let fundingPending = $state(false);
	let fundingWalletAddress = $state('');
	let fundingTxHash = $state('');
	let fundingNotice = $state('');
	let fundingError = $state('');
	let fundingStage = $state<
		'idle' | 'connecting' | 'building' | 'signing' | 'submitting' | 'confirming'
	>('idle');

	$effect(() => {
		fundingTxHash = form?.values?.txHash ?? fundingTxHash;
		fundingWalletAddress = fundingWalletAddress || data.session?.walletAddress || '';
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

	function formatWallet(value: string | null) {
		if (!value) {
			return 'Not available';
		}

		return `${value.slice(0, 6)}...${value.slice(-6)}`;
	}

	function freighterErrorMessage(error: unknown) {
		if (typeof error === 'string') {
			return error;
		}

		if (error && typeof error === 'object') {
			if ('message' in error && typeof error.message === 'string') {
				return error.message;
			}

			if (
				'response' in error &&
				error.response &&
				typeof error.response === 'object' &&
				'data' in error.response &&
				error.response.data &&
				typeof error.response.data === 'object'
			) {
				const extras = 'extras' in error.response.data ? error.response.data.extras : null;

				if (
					extras &&
					typeof extras === 'object' &&
					'result_codes' in extras &&
					extras.result_codes &&
					typeof extras.result_codes === 'object'
				) {
					const transactionCode =
						'transaction' in extras.result_codes &&
						typeof extras.result_codes.transaction === 'string'
							? extras.result_codes.transaction
							: null;
					const operationCodes =
						'operations' in extras.result_codes && Array.isArray(extras.result_codes.operations)
							? extras.result_codes.operations.filter((value): value is string => typeof value === 'string')
							: [];

					if (transactionCode || operationCodes.length > 0) {
						return [transactionCode, ...operationCodes].filter(Boolean).join(', ');
					}
				}
			}
		}

		return 'The wallet funding request could not be completed.';
	}

	function isOwnerClient() {
		return data.session?.role === 'client' && data.session.id === data.task.clientId;
	}

	function isAssignedWorker() {
		return data.session?.role === 'worker' && data.session.id === data.task.workerId;
	}

	function canFundTask() {
		return (
			data.task.status === 'DRAFT' &&
			isOwnerClient() &&
			Boolean(data.platformFundingWallet) &&
			Boolean(data.stellarHorizonUrl) &&
			Boolean(data.stellarNetworkPassphrase) &&
			data.task.currencyAsset === 'XLM' &&
			!data.payoutStatus.hasConfirmedFunding
		);
	}

	function isFundingBlockedByConfig() {
		return (
			data.task.status === 'DRAFT' &&
			isOwnerClient() &&
			(!data.platformFundingWallet || !data.stellarHorizonUrl || !data.stellarNetworkPassphrase)
		);
	}

	function isLegacyFundingAsset() {
		return data.task.status === 'DRAFT' && isOwnerClient() && data.task.currencyAsset !== 'XLM';
	}

	function canClaimTask() {
		return (
			data.task.status === 'OPEN' &&
			data.session?.role === 'worker' &&
			data.session.id !== data.task.clientId
		);
	}

	function canSubmitTask() {
		return data.task.status === 'CLAIMED' && isAssignedWorker();
	}

	function canOpenReport() {
		return ['SUBMITTED', 'PENDING_REVIEW', 'APPROVED', 'AUTO_APPROVED', 'REJECTED', 'PAID'].includes(
			data.task.status
		);
	}

	function canOpenReview() {
		return (
			data.task.status === 'PENDING_REVIEW' &&
			data.session?.role === 'client' &&
			data.session.id === data.task.clientId
		);
	}

	function canOpenReceipt() {
		return (
			Boolean(data.payoutStatus.payout) ||
			['APPROVED', 'AUTO_APPROVED', 'PAID'].includes(data.task.status)
		);
	}

	function fundingStateLabel() {
		if (data.payoutStatus.hasConfirmedFunding) {
			return 'Funding confirmed';
		}

		if (data.task.status === 'DRAFT') {
			return 'Awaiting funding';
		}

		return 'Funding unavailable';
	}

	function fundingButtonLabel() {
		if (fundingStage === 'connecting') {
			return 'Connecting wallet...';
		}

		if (fundingStage === 'building') {
			return 'Building transaction...';
		}

		if (fundingStage === 'signing') {
			return 'Waiting for signature...';
		}

		if (fundingStage === 'submitting') {
			return 'Submitting to Testnet...';
		}

		if (fundingStage === 'confirming') {
			return 'Confirming funding...';
		}

		return 'Fund with Freighter';
	}

	function hasPendingFundingConfirmation() {
		return Boolean(fundingTxHash) && form?.intent === 'fund' && Boolean(form?.error);
	}

	function assignmentLabel() {
		if (isAssignedWorker()) {
			return 'Assigned to you';
		}

		if (data.task.workerId) {
			return 'Worker assigned';
		}

		if (data.task.status === 'OPEN') {
			return 'Ready to claim';
		}

		return 'No worker yet';
	}

	function workflowIndex() {
		if (data.task.status === 'DRAFT') {
			return 0;
		}

		if (data.task.status === 'OPEN') {
			return 1;
		}

		if (data.task.status === 'CLAIMED') {
			return 2;
		}

		if (['SUBMITTED', 'PENDING_REVIEW', 'REJECTED'].includes(data.task.status)) {
			return 3;
		}

		return 4;
	}

	function workflowTone(index: number) {
		const currentIndex = workflowIndex();

		if (index < currentIndex) {
			return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100';
		}

		if (index === currentIndex) {
			return 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100';
		}

		return 'border-slate-800 bg-slate-950/65 text-slate-300';
	}

	function workflowBadge(index: number) {
		const currentIndex = workflowIndex();

		if (index < currentIndex) {
			return 'Done';
		}

		if (index === currentIndex) {
			return 'Current';
		}

		return 'Later';
	}

	function workflowSteps() {
		return [
			{
				label: 'Fund',
				detail: 'Client confirms the Stellar Testnet deposit and opens the task for claims.'
			},
			{
				label: 'Claim',
				detail: 'A worker picks up the funded brief and becomes the assigned writer.'
			},
			{
				label: 'Submit',
				detail: 'The assigned worker delivers writing content, notes, and an optional document URL.'
			},
			{
				label: 'Report',
				detail: 'Verification output and review state stay task-scoped instead of living on a flat route.'
			},
			{
				label: 'Receipt',
				detail: 'Payout visibility and the final transaction trail stay grounded in backend state.'
			}
		];
	}

	function introCopy() {
		if (!data.session) {
			return 'Sign in with a Stellar wallet to fund, claim, submit, review, or inspect payout progress from the workflow routes that match your role.';
		}

		if (canFundTask()) {
			return 'This task is still a draft. Confirm the Stellar Testnet funding transaction here to unlock worker claims without leaving the task workflow.';
		}

		if (isFundingBlockedByConfig()) {
			return 'This task is ready for funding, but the frontend environment is missing the wallet or network configuration needed for the Freighter payment flow.';
		}

		if (isLegacyFundingAsset()) {
			return 'This draft predates the current launch path. Funding is now limited to native XLM on Stellar Testnet, so this task cannot use the one-click wallet flow.';
		}

		if (data.task.status === 'DRAFT') {
			return 'The brief is saved, but worker actions stay blocked until the client confirms funding on Stellar Testnet.';
		}

		if (canClaimTask()) {
			return 'Funding is already confirmed, so this route can hand you straight into the claim and submission flow.';
		}

		if (data.task.status === 'OPEN') {
			return 'The task is funded and waiting for a worker claim. Once someone claims it, the workflow continues into submission.';
		}

		if (canSubmitTask()) {
			return 'You already own this writing task. Continue into the submission route to deliver the draft and trigger verification.';
		}

		if (data.task.status === 'CLAIMED') {
			return 'A worker has claimed this task. The next live step is the writing submission handoff.';
		}

		if (canOpenReview()) {
			return 'The submission is ready for client review. Open the review route to approve for payout or reject with a saved reason.';
		}

		if (canOpenReceipt()) {
			return 'This task has already reached payout visibility. Use the receipt route for the latest Stellar transaction state.';
		}

		if (canOpenReport()) {
			return 'This task is already inside the report and review portion of the workflow. Use the linked routes below to inspect evidence and decisions.';
		}

		return 'This route stays aligned to the backend task state so each role sees the next valid action instead of placeholder workflow chrome.';
	}

	async function startFundingFlow() {
		if (fundingStage !== 'idle') {
			return;
		}

		if (
			!data.session ||
			!data.platformFundingWallet ||
			!data.stellarHorizonUrl ||
			!data.stellarNetworkPassphrase
		) {
			fundingError =
				'The frontend is missing the wallet or network configuration required to submit funding.';
			return;
		}

		if (data.task.currencyAsset !== 'XLM') {
			fundingError =
				'Automatic wallet funding is currently limited to native XLM tasks in this frontend.';
			return;
		}

		fundingError = '';
		fundingNotice = '';
		fundingTxHash = '';

		try {
			fundingStage = 'connecting';
			const accessResult = await requestAccess();

			if (accessResult.error || !accessResult.address) {
				throw new Error(
					accessResult.error
						? freighterErrorMessage(accessResult.error)
						: 'Freighter did not return a wallet address.'
				);
			}

			const connectedWallet = accessResult.address.trim().toUpperCase();
			fundingWalletAddress = connectedWallet;

			if (connectedWallet !== data.session.walletAddress.trim().toUpperCase()) {
				throw new Error(
					'Freighter is connected to a different wallet than the signed-in client session.'
				);
			}

			fundingNotice = 'Wallet connected. Checking the Stellar network before building the payment.';
			fundingStage = 'building';

			const networkDetails = await getNetworkDetails();

			if (networkDetails.error) {
				throw new Error(freighterErrorMessage(networkDetails.error));
			}

			if (networkDetails.networkPassphrase !== data.stellarNetworkPassphrase) {
				throw new Error(
					`Freighter is connected to a different Stellar network. Expected the configured passphrase for this app.`
				);
			}

			const horizonServer = new Horizon.Server(data.stellarHorizonUrl);
			const sourceAccount = await horizonServer.loadAccount(connectedWallet);
			const transaction = new TransactionBuilder(sourceAccount, {
				fee: BASE_FEE,
				networkPassphrase: data.stellarNetworkPassphrase
			})
				.addOperation(
					Operation.payment({
						destination: data.platformFundingWallet,
						asset: Asset.native(),
						amount: data.task.payoutAmount
					})
				)
				.setTimeout(30)
				.build();

			fundingNotice = 'Transaction ready. Waiting for your Freighter signature.';
			fundingStage = 'signing';

			const signedResult = await signTransaction(transaction.toXDR(), {
				networkPassphrase: data.stellarNetworkPassphrase,
				address: connectedWallet
			});

			if (signedResult.error || !signedResult.signedTxXdr) {
				throw new Error(
					signedResult.error
						? freighterErrorMessage(signedResult.error)
						: 'Freighter did not return a signed payment transaction.'
				);
			}

			fundingNotice = 'Signature captured. Submitting the XLM payment to Stellar Testnet.';
			fundingStage = 'submitting';

			const signedTransaction = TransactionBuilder.fromXDR(
				signedResult.signedTxXdr,
				data.stellarNetworkPassphrase
			);
			const submissionResult = await horizonServer.submitTransaction(signedTransaction);

			fundingTxHash = submissionResult.hash;
			fundingNotice =
				'Transaction submitted. Recording the funding hash through the backend task state.';
			fundingStage = 'confirming';
			fundingForm?.requestSubmit();
		} catch (error) {
			fundingError = freighterErrorMessage(error);
			fundingStage = 'idle';
		}
	}
</script>

<svelte:head>
	<title>{data.task.title} | Stellar Autotask</title>
</svelte:head>

<main class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#08111f_42%,#020617_100%)] px-6 py-12 text-slate-100">
	<div class="mx-auto max-w-7xl space-y-8">
		<header class="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-8 shadow-[0_30px_90px_rgba(8,145,178,0.16)] backdrop-blur-xl">
			<div class="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
				<div class="max-w-4xl">
					<div class="flex flex-wrap items-center gap-3">
						<span class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
							{data.task.status}
						</span>
						<span class="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
							{fundingStateLabel()}
						</span>
					</div>
					<h1 class="mt-5 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white md:text-5xl">
						{data.task.title}
					</h1>
					<p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{data.task.brief}</p>
					<p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{introCopy()}</p>
				</div>

				<div class="grid w-full gap-4 sm:grid-cols-2 xl:max-w-xl">
					<div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-5">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Payout target</div>
						<div class="mt-3 font-['Space_Grotesk'] text-3xl font-bold text-white">
							{data.task.payoutAmount}
						</div>
						<div class="mt-2 text-sm text-cyan-200">{data.task.currencyAsset} on Stellar Testnet</div>
					</div>
					<div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-5">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Assignment</div>
						<div class="mt-3 font-['Space_Grotesk'] text-2xl font-bold text-white">
							{assignmentLabel()}
						</div>
						<div class="mt-2 text-sm text-slate-300">
							Review window {data.task.reviewWindowHours}h
						</div>
					</div>
					<div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-5">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Created</div>
						<div class="mt-3 text-sm leading-6 text-white">{formatDate(data.task.createdAt)}</div>
						<div class="mt-2 text-sm text-slate-400">Updated {formatDate(data.task.updatedAt)}</div>
					</div>
					<div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-5">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Review deadline</div>
						<div class="mt-3 text-sm leading-6 text-white">{formatDate(data.task.reviewDeadline)}</div>
						<div class="mt-2 text-sm text-slate-400">
							Worker wallet {formatWallet(data.payoutStatus.workerWalletAddress)}
						</div>
					</div>
				</div>
			</div>
		</header>

		<section class="grid gap-4 xl:grid-cols-5">
			{#each workflowSteps() as step, index}
				<article class="rounded-[1.5rem] border p-5 {workflowTone(index)}">
					<div class="flex items-center justify-between gap-4">
						<div class="text-xs uppercase tracking-[0.22em] opacity-80">{step.label}</div>
						<div class="rounded-full border border-current/20 bg-slate-950/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
							{workflowBadge(index)}
						</div>
					</div>
					<p class="mt-4 text-sm leading-6">{step.detail}</p>
				</article>
			{/each}
		</section>

		<section class="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
			<div class="space-y-6">
				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8">
					<div class="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
						<div>
							<p class="text-xs uppercase tracking-[0.22em] text-slate-500">Workflow hub</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">
								Next move
							</h2>
						</div>
						<div class="flex flex-wrap gap-3">
							{#if canOpenReport()}
								<a
									class="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/30 hover:text-white"
									href={`/task/${data.task.id}/report`}
								>
									Open report
								</a>
							{/if}
							{#if canOpenReview()}
								<a
									class="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:text-white"
									href={`/task/${data.task.id}/review`}
								>
									Open review
								</a>
							{/if}
							{#if canOpenReceipt()}
								<a
									class="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:text-white"
									href={`/task/${data.task.id}/receipt`}
								>
									Open receipt
								</a>
							{/if}
						</div>
					</div>

					{#if !data.session}
						<div class="mt-6 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-6">
							<h3 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Sign in to act on this task
							</h3>
							<p class="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
								Wallet authentication decides whether you can fund the task as the client, claim
								it as a worker, or continue into review and payout visibility.
							</p>
							<a
								class="mt-6 inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
								href="/auth"
							>
								Open wallet auth
							</a>
						</div>
					{:else if canFundTask()}
						<form
							class="mt-6 rounded-[1.75rem] border border-cyan-400/20 bg-[linear-gradient(160deg,rgba(8,47,73,0.55),rgba(15,23,42,0.92))] p-6"
							method="POST"
							action="?/fund"
							bind:this={fundingForm}
							use:enhance={() => {
								fundingPending = true;
								return async ({ update }) => {
									await update();
									fundingPending = false;
									fundingStage = 'idle';
								};
							}}
						>
							<input type="hidden" name="amount" value={data.task.payoutAmount} />
							<input type="hidden" name="assetCode" value={data.task.currencyAsset} />
							<input type="hidden" name="txHash" value={fundingTxHash} />

							<div class="flex flex-col gap-4 border-b border-cyan-400/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
								<div>
									<p class="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
										Client action
									</p>
									<h3 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">
										Confirm Stellar funding
									</h3>
									<p class="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
										Launch a native XLM payment through Freighter, submit it to Stellar Testnet,
										then let the backend open the task for claims with the returned transaction
										hash.
									</p>
								</div>
								<div class="rounded-[1.25rem] border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200">
									<div>{data.task.payoutAmount} {data.task.currencyAsset}</div>
									<div class="mt-1 text-slate-400">Required match for this task</div>
								</div>
							</div>

							<div class="mt-6 grid gap-5 md:grid-cols-2">
								<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
									<div class="text-xs uppercase tracking-[0.22em] text-slate-500">From wallet</div>
									<div class="mt-3 break-all text-sm leading-7 text-cyan-200">
										{fundingWalletAddress || data.session.walletAddress}
									</div>
								</div>
								<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
									<div class="text-xs uppercase tracking-[0.22em] text-slate-500">To wallet</div>
									<div class="mt-3 break-all text-sm leading-7 text-cyan-200">
										{data.platformFundingWallet}
									</div>
								</div>
							</div>

							<div class="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
								<div class="flex items-center justify-between gap-4">
									<div>
										<div class="text-xs uppercase tracking-[0.22em] text-slate-500">
											Funding stage
										</div>
										<div class="mt-3 text-sm font-semibold text-white">{fundingStage}</div>
									</div>
									<div>
										<div class="text-xs uppercase tracking-[0.22em] text-slate-500">
											Transaction hash
										</div>
										<div class="mt-3 break-all text-right text-sm leading-6 text-cyan-300">
											{fundingTxHash || 'Not submitted yet'}
										</div>
									</div>
								</div>
								<p class="mt-4 text-sm leading-6 text-slate-300">
									The backend still validates the amount, asset, and wallet after the on-chain
									payment succeeds. If backend confirmation fails after submission, retrying uses
									the same recorded transaction hash instead of sending funds twice.
								</p>
							</div>

							{#if fundingNotice}
								<p class="mt-4 rounded-[1.25rem] border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
									{fundingNotice}
								</p>
							{/if}

							{#if fundingError}
								<p class="mt-4 rounded-[1.25rem] border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
									{fundingError}
								</p>
							{/if}

							{#if form?.error && form.intent === 'fund'}
								<p class="mt-4 rounded-[1.25rem] border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
									{form.error}
								</p>
							{/if}

							<div class="mt-6 space-y-4">
								{#if !hasPendingFundingConfirmation()}
									<button
										class="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
										type="button"
										onclick={startFundingFlow}
										disabled={fundingStage !== 'idle' || fundingPending}
									>
										{fundingButtonLabel()}
									</button>
								{/if}

								{#if hasPendingFundingConfirmation()}
									<button
										class="inline-flex w-full items-center justify-center rounded-2xl border border-slate-700 px-5 py-4 font-semibold text-slate-100 transition hover:border-cyan-400/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
										type="submit"
										disabled={fundingPending || fundingStage !== 'idle'}
									>
										{fundingPending ? 'Retrying confirmation...' : 'Retry backend confirmation'}
									</button>
								{/if}
							</div>
						</form>
					{:else if isFundingBlockedByConfig()}
						<div class="mt-6 rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 p-6">
							<h3 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Funding wallet is not configured
							</h3>
							<p class="mt-4 text-sm leading-7 text-slate-200">
								This task is still waiting on Stellar funding, but the frontend environment is
								missing one of the required values for the wallet send flow. Add
								`PUBLIC_PLATFORM_FUNDING_WALLET`, `PUBLIC_STELLAR_HORIZON_URL`, and
								`PUBLIC_STELLAR_NETWORK_PASSPHRASE` before using this action surface.
							</p>
						</div>
					{:else if isLegacyFundingAsset()}
						<div class="mt-6 rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 p-6">
							<h3 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Outside the current funding path
							</h3>
							<p class="mt-4 text-sm leading-7 text-slate-200">
								This draft uses `{data.task.currencyAsset}`, but the launch funding flow is now
								locked to native XLM on Stellar Testnet. The hub keeps the payment action disabled
								instead of suggesting a wallet path that the product no longer supports.
							</p>
						</div>
					{:else if canClaimTask()}
						<div class="mt-6 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-6">
							<h3 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Claim and continue into submission
							</h3>
							<p class="mt-4 text-sm leading-7 text-slate-200">
								Funding is already confirmed. Claiming here assigns the task to your worker
								profile and sends you straight into the writing submission route.
							</p>

							{#if form?.error && form.intent !== 'fund'}
								<p class="mt-4 rounded-[1.25rem] border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
									{form.error}
								</p>
							{/if}

							<form
								class="mt-6"
								method="POST"
								action="?/claim"
								use:enhance={() => {
									claiming = true;
									return async ({ update }) => {
										await update();
										claiming = false;
									};
								}}
							>
								<button
									class="w-full rounded-2xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
									type="submit"
									disabled={claiming}
								>
									{claiming ? 'Claiming task...' : 'Claim task'}
								</button>
							</form>
						</div>
					{:else if canSubmitTask()}
						<div class="mt-6 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-6">
							<h3 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Submit the writing draft
							</h3>
							<p class="mt-4 text-sm leading-7 text-slate-200">
								You are the assigned worker for this task. Continue into the submission route to
								deliver the draft, notes, and any external document URL.
							</p>
							<a
								class="mt-6 inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
								href={`/task/${data.task.id}/submit`}
							>
								Continue to submit
							</a>
						</div>
					{:else if canOpenReview()}
						<div class="mt-6 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-6">
							<h3 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Review the submission
							</h3>
							<p class="mt-4 text-sm leading-7 text-slate-200">
								The writing and verification output are ready. Use the review route to approve for
								payout or reject with a saved reason.
							</p>
							<a
								class="mt-6 inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
								href={`/task/${data.task.id}/review`}
							>
								Open review
							</a>
						</div>
					{:else if canOpenReceipt()}
						<div class="mt-6 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-6">
							<h3 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Check payout visibility
							</h3>
							<p class="mt-4 text-sm leading-7 text-slate-200">
								This task already has payout state to inspect. The receipt route shows the real
								Stellar transaction outcome instead of a hardcoded success screen.
							</p>
							<a
								class="mt-6 inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
								href={`/task/${data.task.id}/receipt`}
							>
								Open receipt
							</a>
						</div>
					{:else if canOpenReport()}
						<div class="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
							<h3 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Inspect the report state
							</h3>
							<p class="mt-4 text-sm leading-7 text-slate-300">
								The task is already in its report-aware workflow stage. Open the task report to
								see the submission snapshot, verification output, review decision, and payout
								visibility together.
							</p>
							<a
								class="mt-6 inline-flex items-center justify-center rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:border-cyan-400/30 hover:text-white"
								href={`/task/${data.task.id}/report`}
							>
								Open report
							</a>
						</div>
					{:else}
						<div class="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
							<h3 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">
								Waiting on the workflow
							</h3>
							<p class="mt-4 text-sm leading-7 text-slate-300">
								This task is not blocked by missing UI controls. It is waiting on the backend
								state machine or on another actor to complete the next valid step.
							</p>
						</div>
					{/if}
				</article>

				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8">
					<div class="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
						<div>
							<p class="text-xs uppercase tracking-[0.22em] text-slate-500">Task brief</p>
							<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">
								Writing requirements
							</h2>
						</div>
						<div class="text-sm text-slate-400">Task ID {data.task.id}</div>
					</div>

					<div class="mt-6 grid gap-5 md:grid-cols-2">
						<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 md:col-span-2">
							<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Description</div>
							<div class="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">
								{data.task.description}
							</div>
						</div>
						<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
							<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Target audience</div>
							<div class="mt-4 text-sm leading-7 text-white">{data.task.targetAudience}</div>
						</div>
						<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
							<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Tone</div>
							<div class="mt-4 text-sm leading-7 text-white">{data.task.tone}</div>
						</div>
						<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
							<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Minimum words</div>
							<div class="mt-4 text-sm leading-7 text-white">{data.task.minWordCount}</div>
						</div>
						<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
							<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Allowed claimant type</div>
							<div class="mt-4 text-sm leading-7 text-white">{data.task.allowedClaimantType}</div>
						</div>
					</div>

					<div class="mt-6">
						<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Required keywords</div>
						{#if data.task.requiredKeywords.length === 0}
							<p class="mt-4 text-sm leading-7 text-slate-300">
								No required keywords were added to this brief.
							</p>
						{:else}
							<div class="mt-4 flex flex-wrap gap-2">
								{#each data.task.requiredKeywords as keyword}
									<span class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
										{keyword}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</article>

				{#if data.report}
					<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8">
						<div class="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
							<div>
								<p class="text-xs uppercase tracking-[0.22em] text-slate-500">Workflow evidence</p>
								<h2 class="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">
									Report snapshot
								</h2>
							</div>
							<a
								class="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
								href={`/task/${data.task.id}/report`}
							>
								Open full report
							</a>
						</div>

						<div class="mt-6 grid gap-5 md:grid-cols-3">
							<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
								<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Submitted</div>
								<div class="mt-4 text-sm leading-7 text-white">
									{formatDate(data.report.submission?.submittedAt ?? null)}
								</div>
							</div>
							<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
								<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Verification score</div>
								<div class="mt-4 font-['Space_Grotesk'] text-3xl font-bold text-cyan-200">
									{data.report.verificationReport?.score ?? 'N/A'}
								</div>
							</div>
							<div class="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
								<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Latest decision</div>
								<div class="mt-4 text-sm leading-7 text-white">
									{data.report.latestReviewDecision?.decision ?? 'No review saved yet'}
								</div>
							</div>
						</div>

						{#if data.report.verificationReport}
							<div class="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
								<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Summary</div>
								<p class="mt-4 text-sm leading-7 text-slate-200">
									{data.report.verificationReport.summary}
								</p>
							</div>
						{/if}
					</article>
				{/if}
			</div>

			<aside class="space-y-6">
				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Funding and payout</h2>
					<div class="mt-6 space-y-4 text-sm text-slate-300">
						<div class="flex items-center justify-between gap-4">
							<span>Funding confirmed</span>
							<span class="text-right text-white">
								{data.payoutStatus.hasConfirmedFunding ? 'Yes' : 'No'}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Payout eligible</span>
							<span class="text-right text-white">
								{data.payoutStatus.isPayoutEligible ? 'Yes' : 'No'}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Payout status</span>
							<span class="text-right text-white">
								{data.payoutStatus.payout?.status ?? 'No payout record'}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span>Worker wallet</span>
							<span class="text-right text-white">
								{formatWallet(data.payoutStatus.workerWalletAddress)}
							</span>
						</div>
					</div>

					{#if data.platformFundingWallet}
						<div class="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
							<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Platform funding wallet</div>
							<div class="mt-3 break-all text-sm leading-7 text-cyan-300">
								{data.platformFundingWallet}
							</div>
						</div>
					{/if}

					{#if data.payoutStatus.payout?.txHash}
						<div class="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
							<div class="text-xs uppercase tracking-[0.22em] text-slate-500">Recorded payout tx</div>
							<div class="mt-3 break-all text-sm leading-7 text-cyan-300">
								{data.payoutStatus.payout.txHash}
							</div>
						</div>
					{/if}
				</article>

				<article class="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
					<h2 class="font-['Space_Grotesk'] text-2xl font-semibold text-white">Route map</h2>
					<div class="mt-6 space-y-4">
						<a
							class="block rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 transition hover:border-cyan-400/30"
							href={`/task/${data.task.id}`}
						>
							<div class="text-sm font-semibold text-white">Task hub</div>
							<div class="mt-2 text-sm leading-6 text-slate-300">
								Track the current workflow state and the next valid action.
							</div>
						</a>
						<a
							class="block rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 transition hover:border-cyan-400/30 {canOpenReport() ? '' : 'pointer-events-none opacity-50'}"
							href={canOpenReport() ? `/task/${data.task.id}/report` : `/task/${data.task.id}`}
						>
							<div class="text-sm font-semibold text-white">Report</div>
							<div class="mt-2 text-sm leading-6 text-slate-300">
								Read the submission snapshot, verification output, review history, and payout visibility.
							</div>
						</a>
						<a
							class="block rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 transition hover:border-cyan-400/30 {canSubmitTask() ? '' : 'pointer-events-none opacity-50'}"
							href={canSubmitTask() ? `/task/${data.task.id}/submit` : `/task/${data.task.id}`}
						>
							<div class="text-sm font-semibold text-white">Submit</div>
							<div class="mt-2 text-sm leading-6 text-slate-300">
								Available only to the assigned worker while the task is in the claimed state.
							</div>
						</a>
						<a
							class="block rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 transition hover:border-cyan-400/30 {canOpenReview() ? '' : 'pointer-events-none opacity-50'}"
							href={canOpenReview() ? `/task/${data.task.id}/review` : `/task/${data.task.id}`}
						>
							<div class="text-sm font-semibold text-white">Review</div>
							<div class="mt-2 text-sm leading-6 text-slate-300">
								Available to the task owner when the writing is waiting on client review.
							</div>
						</a>
						<a
							class="block rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 transition hover:border-cyan-400/30 {canOpenReceipt() ? '' : 'pointer-events-none opacity-50'}"
							href={canOpenReceipt() ? `/task/${data.task.id}/receipt` : `/task/${data.task.id}`}
						>
							<div class="text-sm font-semibold text-white">Receipt</div>
							<div class="mt-2 text-sm leading-6 text-slate-300">
								Shows pending, confirmed, or failed payout state once the task reaches payout visibility.
							</div>
						</a>
					</div>
				</article>
			</aside>
		</section>
	</div>
</main>
