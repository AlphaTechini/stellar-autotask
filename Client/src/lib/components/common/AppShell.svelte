<script lang="ts">
	import { page } from '$app/state';
	import type { SessionUser } from '$lib/contracts/api';
	import logo from '$lib/assets/favicon.svg';
	import ThemeToggle from './ThemeToggle.svelte';

	type NavItem = {
		href: string;
		label: string;
		match: (pathname: string) => boolean;
	};

	let { children, session } = $props<{
		children: import('svelte').Snippet;
		session: SessionUser | null;
	}>();

	function shellTitle(pathname: string) {
		if (pathname === '/dashboard') {
			return 'Dashboard';
		}

		if (pathname === '/marketplace') {
			return 'Marketplace';
		}

		if (pathname === '/create-task') {
			return 'Create Task';
		}

		if (pathname.startsWith('/task/')) {
			return 'Task Workflow';
		}

		if (pathname.startsWith('/auth')) {
			return 'Authentication';
		}

		return 'Stellar Autotask';
	}

	function shellIntro(pathname: string) {
		if (!session) {
			return 'Browse the workflow, then connect a wallet when you are ready to act.';
		}

		if (pathname === '/dashboard') {
			return 'Track the tasks you created, the work assigned to you, and the next action that moves each task forward.';
		}

		if (pathname === '/marketplace') {
			return 'Browse funded writing work and claim the next task that matches your flow.';
		}

		if (pathname === '/create-task') {
			return 'Set up a writing brief, keep the payout path honest, and move into funding next.';
		}

		if (pathname.startsWith('/task/')) {
			return 'Stay inside the task-scoped workflow for funding, claim, submission, review, and receipt state.';
		}

		if (pathname.startsWith('/auth')) {
			return 'Connect a wallet and let the app restore the right route once the session is live.';
		}

		return 'Create, claim, review, and track every task from a shared app shell.';
	}

	function navItems(currentSession: SessionUser | null): NavItem[] {
		const items: NavItem[] = [
			{
				href: '/marketplace',
				label: 'Marketplace',
				match: (pathname) => pathname === '/marketplace'
			},
			{
				href: '/create-task',
				label: 'Create Task',
				match: (pathname) => pathname === '/create-task'
			}
		];

		if (currentSession) {
			items.unshift({
				href: '/dashboard',
				label: 'Dashboard',
				match: (pathname) => pathname === '/dashboard'
			});
		}

		return items;
	}

	function primaryAction(currentSession: SessionUser | null) {
		if (!currentSession) {
			return {
				href: '/auth',
				label: 'Connect Wallet'
			};
		}

		return {
			href: '/create-task',
			label: 'Create Task'
		};
	}

	function formatWallet(value: string) {
		return `${value.slice(0, 6)}...${value.slice(-6)}`;
	}

	function showShell(pathname: string) {
		return pathname !== '/' && pathname !== '/mcp-guide';
	}
</script>

{#if showShell(page.url.pathname)}
	<div class="min-h-screen bg-[#f7f4ea] text-black">
		<header
			class="fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-white backdrop-blur-xl"
		>
			<div class="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6">
				<div class="flex min-w-0 items-center gap-10">
					<a
						href="/"
						aria-label="AutoTask home"
						class="shrink-0 flex items-center"
					>
						<img src={logo} alt="AutoTask" class="h-12 w-12" />
						<span class="sr-only">AutoTask</span>
					</a>

					<nav class="hidden items-center gap-7 lg:flex">
						{#each navItems(session) as item}
							<a
								href={item.href}
								class:text-yellow-700={item.match(page.url.pathname)}
								class:text-neutral-600={!item.match(page.url.pathname)}
								class="font-['Space_Grotesk'] text-sm font-medium tracking-tight transition-colors hover:text-black"
							>
								{item.label}
							</a>
						{/each}
					</nav>
				</div>

				<div class="flex items-center gap-3">
					<ThemeToggle />

					<a
						href={primaryAction(session).href}
						class="hidden rounded-full border border-yellow-500 px-4 py-2 text-sm font-semibold text-yellow-800 transition hover:border-yellow-500 hover:text-black md:inline-flex"
					>
						{primaryAction(session).label}
					</a>

					{#if session}
						<div
							class="hidden rounded-2xl border border-black/10 bg-white px-4 py-2 md:block"
						>
							<div class="text-sm font-semibold text-black">{session.username}</div>
							<div class="mt-1 text-xs text-neutral-600">
								<span class="font-mono text-[11px] text-yellow-700">
									{formatWallet(session.walletAddress)}
								</span>
							</div>
						</div>

						<form method="POST" action="/auth/signout">
							<button
								class="rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-black/40 hover:text-black"
								type="submit"
							>
								Sign Out
							</button>
						</form>
					{:else}
						<a
							href="/auth"
							class="rounded-full border border-yellow-500 px-4 py-2 text-sm font-medium text-yellow-800 transition hover:border-yellow-500 hover:text-black"
						>
							Sign In
						</a>
					{/if}
				</div>
			</div>
		</header>

		<div class="mx-auto max-w-7xl px-6 pt-28 pb-6">
			<section class="mb-6 rounded-[1.75rem] border border-black/10 bg-white px-6 py-5">
				<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p class="text-xs font-semibold tracking-[0.28em] text-yellow-700 uppercase">
							Shared app shell
						</p>
						<h1 class="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-black">
							{shellTitle(page.url.pathname)}
						</h1>
						<p class="mt-3 max-w-3xl text-sm leading-6 text-neutral-700">
							{shellIntro(page.url.pathname)}
						</p>
					</div>

					<div class="flex flex-wrap gap-3">
						<a
							href="/marketplace"
							class="rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-yellow-500 hover:text-black"
						>
							Marketplace
						</a>
						<a
							href="/create-task"
							class="rounded-full border border-yellow-500 bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800 transition hover:border-yellow-500 hover:text-black"
						>
							Create Task
						</a>
						{#if session}
							<a
								href="/dashboard"
								class="rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-yellow-500 hover:text-black"
							>
								Dashboard
							</a>
						{/if}
					</div>
				</div>
			</section>

			{@render children()}
		</div>

		<footer class="border-t border-black/10 bg-white/95">
			<div
				class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between"
			>
				<div>
					<div class="font-['Space_Grotesk'] font-semibold text-black">Stellar Autotask</div>
					<div class="mt-1">
						Task creation, funding, claims, review, and payout visibility in one shell.
					</div>
				</div>

				<div class="flex flex-wrap gap-5">
					<a class="transition hover:text-black" href="/marketplace">Marketplace</a>
					<a class="transition hover:text-black" href="/create-task">Create Task</a>
					<a class="transition hover:text-black" href="/mcp-guide">Agent Guide</a>
					{#if session}
						<a class="transition hover:text-black" href="/dashboard">Dashboard</a>
					{:else}
						<a class="transition hover:text-black" href="/auth">Connect Wallet</a>
					{/if}
				</div>
			</div>
		</footer>
	</div>
{:else}
	{@render children()}
{/if}
