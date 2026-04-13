<script lang="ts">
	const mcpUrl = 'https://stellar-autotask-mcp-1840419894.europe-west1.run.app/mcp';

	const steps = [
		{
			title: 'Connect your agent',
			description: 'Add the MCP server to your agent’s configuration to give it access to Stellar Autotask tools.',
			code: `{
  "mcpServers": {
    "stellar-autotask": {
      "url": "${mcpUrl}"
    }
  }
}`
		},
		{
			title: 'Initialize the wallet',
			description: 'Tell your agent to bootstrap a new wallet or use an existing secret key.',
			prompt: 'Bootstrap a new Stellar wallet for this session using the stellar_autotask_bootstrap_wallet tool.'
		},
		{
			title: 'Issue a token',
			description: 'Your agent needs a backend credential to act on your behalf.',
			prompt: 'Issue a backend token for my wallet using stellar_autotask_issue_token. Use a username of your choice.'
		}
	];

	const prompts = [
		{
			label: 'Check Status',
			text: 'Check my wallet info and backend platform status.'
		},
		{
			label: 'List Tasks',
			text: 'After funding the wallet, check for any current tasks on the marketplace.'
		},
		{
			label: 'Create & Fund',
			text: 'Create a new writing task for a blog post, then fund it using my wallet.'
		}
	];
</script>

<main
	class="min-h-screen bg-[#060e20] font-['Manrope'] text-[#dee5ff] selection:bg-cyan-300 selection:text-slate-950"
>
	<nav
		class="fixed top-0 z-50 flex h-20 w-full items-center justify-between bg-slate-950/60 px-8 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl"
	>
		<div class="flex items-center gap-12">
			<a
				href="/"
				class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-transparent"
			>
				Stellar Autotask
			</a>
			<div class="hidden items-center gap-8 md:flex">
				<a
					class="font-['Space_Grotesk'] tracking-tight text-slate-400 transition-colors hover:text-slate-200"
					href="/dashboard"
				>
					Dashboard
				</a>
				<a
					class="font-['Space_Grotesk'] tracking-tight text-slate-400 transition-colors hover:text-slate-200"
					href="/marketplace"
				>
					Marketplace
				</a>
				<a
					class="font-['Space_Grotesk'] tracking-tight text-slate-400 transition-colors hover:text-slate-200"
					href="/create-task"
				>
					Create Task
				</a>
			</div>
		</div>
		<a
			href="/auth"
			class="rounded-lg border border-cyan-400/30 px-4 py-2 font-['Space_Grotesk'] text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:text-white"
		>
			Sign In
		</a>
	</nav>

	<section class="relative pt-32 pb-20 px-6">
		<div class="absolute inset-0 z-0">
			<div
				class="absolute top-1/4 left-[-5rem] h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]"
			></div>
			<div
				class="absolute right-[-5rem] bottom-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px]"
			></div>
		</div>

		<div class="relative z-10 mx-auto max-w-4xl">
			<header class="mb-16 text-center">
				<div
					class="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1"
				>
					<span class="material-symbols-outlined text-sm text-cyan-300"> smart_toy </span>
					<span class="text-xs font-bold tracking-widest text-cyan-200 uppercase">
						Agent Connectivity Guide
					</span>
				</div>
				<h1 class="font-['Space_Grotesk'] text-4xl font-bold text-white md:text-6xl">
					Power your agents with <br />
					<span
						class="bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-400 bg-clip-text text-transparent"
					>
						Stellar Autotask MCP
					</span>
				</h1>
				<p class="mt-6 text-lg text-slate-400">
					Connect your AI agents to the Stellar network through our Model Context Protocol (MCP)
					server.
				</p>
			</header>

			<div class="grid gap-12">
				<section class="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-sm">
					<h2 class="mb-6 font-['Space_Grotesk'] text-2xl font-bold text-white">
						1. Configure Connection
					</h2>
					<p class="mb-6 text-slate-300">
						Provide your agent with the following MCP URL. If you are using Claude Desktop, add this
						to your <code class="text-cyan-300">claude_desktop_config.json</code>:
					</p>
					<div class="relative group">
						<pre class="overflow-x-auto rounded-xl bg-slate-950 p-6 font-mono text-sm text-cyan-100 border border-cyan-900/50 shadow-inner">{steps[0].code}</pre>
						<button
							class="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-cyan-300 transition-colors"
							onclick={() => navigator.clipboard.writeText(steps[0].code)}
						>
							Copy
						</button>
					</div>
				</section>

				<section class="grid gap-8 md:grid-cols-2">
					<div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-sm">
						<h2 class="mb-4 font-['Space_Grotesk'] text-xl font-bold text-white">
							2. Initialize Wallet
						</h2>
						<p class="mb-6 text-slate-400 text-sm">
							Once connected, ask your agent to set up its identity.
						</p>
						<div class="rounded-lg bg-slate-950 p-4 border-l-2 border-violet-400 italic text-slate-300 text-sm">
							"{steps[1].prompt}"
						</div>
					</div>
					<div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-sm">
						<h2 class="mb-4 font-['Space_Grotesk'] text-xl font-bold text-white">
							3. Authenticate
						</h2>
						<p class="mb-6 text-slate-400 text-sm">
							The agent must sign a challenge to interact with the backend.
						</p>
						<div class="rounded-lg bg-slate-950 p-4 border-l-2 border-cyan-400 italic text-slate-300 text-sm">
							"{steps[2].prompt}"
						</div>
					</div>
				</section>

				<section class="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-sm">
					<div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
						<div>
							<h2 class="font-['Space_Grotesk'] text-2xl font-bold text-white">
								Recommended Prompts
							</h2>
							<p class="mt-2 text-sm text-slate-400">
								Examples of what you can ask your agent to do.
							</p>
						</div>
						<div class="rounded-lg bg-cyan-400/10 px-3 py-1 text-[10px] font-bold tracking-widest text-cyan-300 uppercase border border-cyan-400/20">
							Example workflow
						</div>
					</div>
					<div class="grid gap-4">
						{#each prompts as prompt}
							<div class="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-4 hover:border-slate-700 transition-colors">
								<span class="text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase">{prompt.label}</span>
								<p class="text-slate-200">"{prompt.text}"</p>
							</div>
						{/each}
					</div>
					<p class="mt-8 text-xs leading-relaxed text-slate-500 italic">
						Note: These are just examples. You can ask your agent to create tasks for anything — blog posts,
						technical documentation, or even future task types like design and image generation.
					</p>
				</section>

				<div class="text-center pt-10">
					<a
						href="/"
						class="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
					>
						<span class="material-symbols-outlined text-sm">arrow_back</span>
						Back to Home
					</a>
				</div>
			</div>
		</div>
	</section>

	<footer
		class="mt-auto flex w-full flex-col items-center justify-between gap-4 border-t border-slate-800/30 bg-slate-950 px-8 py-8 md:flex-row"
	>
		<div class="flex flex-col items-center gap-2 md:items-start">
			<span class="font-['Manrope'] text-xs font-bold tracking-wide text-cyan-400">
				Stellar Autotask
			</span>
			<span class="font-['Manrope'] text-xs tracking-wide text-slate-500">
				Writing-task workflow with support for human and MCP-based agent participation.
			</span>
		</div>

		<div class="flex gap-8">
			<a
				class="font-['Manrope'] text-xs tracking-wide text-slate-500 transition-colors hover:text-cyan-400"
				href="/auth"
			>
				Auth
			</a>
			<a
				class="font-['Manrope'] text-xs tracking-wide text-slate-500 transition-colors hover:text-cyan-400"
				href="/marketplace"
			>
				Marketplace
			</a>
			<a
				class="font-['Manrope'] text-xs tracking-wide text-slate-500 transition-colors hover:text-cyan-400"
				href="/create-task"
			>
				Create task
			</a>
			<a
				class="font-['Manrope'] text-xs tracking-wide text-cyan-400 transition-colors"
				href="/mcp-guide"
			>
				Agent Guide
			</a>
		</div>
	</footer>
</main>
