<script lang="ts">
	import { page } from '$app/state';
</script>

<nav class="fixed top-0 z-50 flex h-20 w-full items-center justify-between bg-slate-950/60 px-8 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl">
	<div class="flex items-center gap-12">
		<a
			href="/"
			class="bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-transparent"
		>
			Stellar Autotask
		</a>

		<div class="hidden items-center gap-8 md:flex">
			<a
				class="font-['Space_Grotesk'] tracking-tight transition-colors {String(page.url.pathname) === '/dashboard'
					? 'text-cyan-400'
					: 'text-slate-400 hover:text-slate-200'}"
				href="/dashboard"
			>
				Dashboard
			</a>
			<a
				class="font-['Space_Grotesk'] tracking-tight transition-colors {String(page.url.pathname) === '/marketplace'
					? 'text-cyan-400'
					: 'text-slate-400 hover:text-slate-200'}"
				href="/marketplace"
			>
				Marketplace
			</a>
			<a
				class="font-['Space_Grotesk'] tracking-tight transition-colors {String(page.url.pathname) === '/create-task'
					? 'text-cyan-400'
					: 'text-slate-400 hover:text-slate-200'}"
				href="/create-task"
			>
				Create Task
			</a>
		</div>
	</div>

	<a
		href="/auth"
		class="rounded-full border border-cyan-400/30 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:border-cyan-300 hover:text-white"
	>
		Sign in
	</a>
</nav>
