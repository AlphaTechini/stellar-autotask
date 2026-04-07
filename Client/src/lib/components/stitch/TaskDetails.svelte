<script lang="ts">
import NavBar from '../common/NavBar.svelte';

import Footer from '../common/Footer.svelte';

</script>

<!-- Top Navigation Bar -->
<NavBar />
<!-- Sidebar -->
<aside class="h-screen w-64 fixed left-0 top-0 pt-24 bg-slate-900 flex flex-col h-full border-r border-slate-800/50 hidden lg:flex">
<div class="px-6 mb-8">
<div class="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50">
<div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
<span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">verified</span>
</div>
<div>
<p class="font-headline text-sm font-bold text-on-surface">Freelancer Portal</p>
<p class="text-[10px] uppercase tracking-widest text-primary-dim font-bold">AI-Verified Status</p>
</div>
</div>
</div>
<nav class="flex-1 px-4 space-y-2 font-['Manrope'] text-sm">
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg group transition-all" href="#">
<span class="material-symbols-outlined">assignment_turned_in</span>
<span>My Tasks</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 bg-cyan-400/10 text-cyan-400 border-r-4 border-cyan-400 rounded-l-lg transition-all" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">payments</span>
<span>My Earnings</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg group transition-all" href="#">
<span class="material-symbols-outlined">analytics</span>
<span>Reports</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg group transition-all" href="#">
<span class="material-symbols-outlined">settings</span>
<span>Settings</span>
</a>
</nav>
<div class="p-4 mt-auto mb-6">
<button class="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-lg text-sm shadow-lg shadow-primary/20">
                Upgrade to Pro
            </button>
<div class="mt-6 space-y-2 font-['Manrope'] text-sm">
<a class="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined text-sm">help</span>
<span>Support</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined text-sm">api</span>
<span>API Status</span>
</a>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="lg:ml-64 pt-28 pb-12 px-6 md:px-12 max-w-7xl">
<!-- Header & Top Actions -->
<header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
<div>
<div class="flex items-center gap-3 mb-2">
<span class="px-3 py-1 bg-secondary-container/30 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-full border border-secondary/20">Task ID: #SYN-8842</span>
<span class="flex items-center gap-1 text-tertiary-dim text-xs font-medium">
<span class="w-2 h-2 rounded-full bg-tertiary-dim shadow-[0_0_8px_rgba(88,231,171,0.6)]"></span>
                        Active Journey
                    </span>
</div>
<h1 class="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-surface">Neural Mesh Optimization</h1>
</div>
<div class="flex gap-4">
<button class="px-6 py-3 rounded-lg font-bold border border-outline-variant hover:bg-surface-bright transition-colors">
                    Save Draft
                </button>
<button class="px-8 py-3 rounded-lg font-bold bg-gradient-to-r from-primary to-secondary text-on-primary-fixed shadow-lg shadow-primary/20 active:scale-95 transition-all">
                    Submit Work
                </button>
</div>
</header>
<!-- Task Lifecycle Timeline -->
<section class="mb-12 relative">
<div class="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant/30 -translate-y-1/2 z-0 hidden md:block"></div>
<div class="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
<!-- Step 1: Open -->
<div class="flex md:flex-col items-center gap-4 md:text-center">
<div class="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_15px_rgba(0,238,252,0.4)]">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<div>
<p class="font-bold text-on-surface">Open</p>
<p class="text-xs text-on-surface-variant">Available</p>
</div>
</div>
<!-- Step 2: Claimed -->
<div class="flex md:flex-col items-center gap-4 md:text-center">
<div class="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_15px_rgba(0,238,252,0.4)]">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">person</span>
</div>
<div>
<p class="font-bold text-on-surface">Claimed</p>
<p class="text-xs text-on-surface-variant">Assigned to you</p>
</div>
</div>
<!-- Step 3: Submitted -->
<div class="flex md:flex-col items-center gap-4 md:text-center opacity-40">
<div class="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center border border-outline-variant">
<span class="material-symbols-outlined">upload_file</span>
</div>
<div>
<p class="font-bold text-on-surface">Submitted</p>
<p class="text-xs text-on-surface-variant">Awaiting action</p>
</div>
</div>
<!-- Step 4: Pending Review -->
<div class="flex md:flex-col items-center gap-4 md:text-center opacity-40">
<div class="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center border border-outline-variant">
<span class="material-symbols-outlined">visibility</span>
</div>
<div>
<p class="font-bold text-on-surface">Reviewing</p>
<p class="text-xs text-on-surface-variant">AI &amp; Human Peer</p>
</div>
</div>
<!-- Step 5: Paid -->
<div class="flex md:flex-col items-center gap-4 md:text-center opacity-40">
<div class="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center border border-outline-variant">
<span class="material-symbols-outlined">currency_exchange</span>
</div>
<div>
<p class="font-bold text-on-surface">Paid</p>
<p class="text-xs text-on-surface-variant">Wallet Credit</p>
</div>
</div>
</div>
</section>
<!-- Main Bento Grid -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
<!-- Left Column: Details & Requirements -->
<div class="lg:col-span-2 space-y-8">
<!-- Task Description Card -->
<div class="bg-surface-container-low p-8 rounded-xl border-l-4 border-primary">
<h2 class="text-xl font-headline font-bold mb-4 text-primary">Task Description</h2>
<p class="text-on-surface-variant leading-relaxed mb-6">
                        Perform a comprehensive audit and optimization of the current Neural Mesh weights for the "Vortex-7" model. The goal is to reduce inference latency by 15% while maintaining a precision threshold of 99.2%. You will need to identify redundant node connections and propose a pruning strategy that preserves core semantic relationships.
                    </p>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="bg-surface-container p-4 rounded-lg">
<p class="text-xs text-on-surface-variant uppercase tracking-tighter mb-1">Target Platform</p>
<p class="font-bold">Edge-AI Mobile Soc</p>
</div>
<div class="bg-surface-container p-4 rounded-lg">
<p class="text-xs text-on-surface-variant uppercase tracking-tighter mb-1">Architecture</p>
<p class="font-bold">Transformer-L-8</p>
</div>
</div>
</div>
<!-- Requirements Checklist -->
<div class="bg-surface-container-low p-8 rounded-xl">
<h2 class="text-xl font-headline font-bold mb-6">Submission Requirements</h2>
<ul class="space-y-4">
<li class="flex gap-4 items-start">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<div>
<p class="font-bold text-on-surface">Optimized weight.bin file</p>
<p class="text-sm text-on-surface-variant">Must be under 450MB compressed.</p>
</div>
</li>
<li class="flex gap-4 items-start">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<div>
<p class="font-bold text-on-surface">Benchmark JSON Report</p>
<p class="text-sm text-on-surface-variant">Include inference times from at least 3 separate runs.</p>
</div>
</li>
<li class="flex gap-4 items-start">
<span class="material-symbols-outlined text-outline">circle</span>
<div>
<p class="font-bold text-on-surface">Optimization Logic Documentation</p>
<p class="text-sm text-on-surface-variant">Brief summary of pruning decisions (Markdown format).</p>
</div>
</li>
</ul>
</div>
</div>
<!-- Right Column: Status & Stats -->
<div class="space-y-8">
<!-- Status & Payout Card -->
<div class="glass-panel p-8 rounded-2xl border border-outline-variant/10 shadow-2xl overflow-hidden relative">
<div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
<div class="relative z-10">
<p class="text-sm text-on-surface-variant mb-1">Estimated Payout</p>
<div class="flex items-baseline gap-2 mb-6">
<span class="text-5xl font-headline font-bold text-on-surface">$1,240</span>
<span class="text-primary font-bold">USD</span>
</div>
<div class="space-y-4 pt-6 border-t border-outline-variant/20">
<div class="flex justify-between items-center">
<span class="text-on-surface-variant text-sm">Status</span>
<span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md">CLAIMED</span>
</div>
<div class="flex justify-between items-center">
<span class="text-on-surface-variant text-sm">Deadline</span>
<span class="text-on-surface text-sm font-bold">2d 14h 22m</span>
</div>
<div class="flex justify-between items-center">
<span class="text-on-surface-variant text-sm">Complexity</span>
<span class="text-on-surface text-sm font-bold">Tier IV (Expert)</span>
</div>
</div>
<button class="w-full mt-8 py-4 bg-surface-container-highest hover:bg-surface-bright text-on-surface font-bold rounded-lg transition-colors border border-outline-variant/30 active:scale-95">
                            Withdraw from Task
                        </button>
</div>
</div>
<!-- AI Verification Preview -->
<div class="bg-surface-container-low p-6 rounded-xl border border-outline-variant/20">
<div class="flex items-center gap-2 mb-4">
<span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
<h3 class="font-headline font-bold">AI Validator Ready</h3>
</div>
<p class="text-sm text-on-surface-variant mb-6 leading-relaxed">
                        The real-time validator is active. Your draft submission has passed 4/5 automated checks. Final precision check requires manual trigger.
                    </p>
<div class="space-y-3">
<div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-secondary w-4/5 shadow-[0_0_8px_rgba(172,138,255,0.6)]"></div>
</div>
<p class="text-[10px] text-right text-secondary-dim font-bold uppercase tracking-widest">80% Reliability Score</p>
</div>
</div>
</div>
<!-- Full Width: Submission History Section (Placeholder / Future State) -->
<div class="lg:col-span-3">
<div class="bg-surface-container-low rounded-xl overflow-hidden">
<div class="px-8 py-6 border-b border-outline-variant/20 flex justify-between items-center">
<h2 class="text-xl font-headline font-bold">Latest Draft Submission</h2>
<span class="text-xs text-on-surface-variant">Last saved 4 hours ago</span>
</div>
<div class="p-8">
<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
<div class="md:col-span-3 border border-dashed border-outline-variant/50 rounded-xl p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary transition-colors">cloud_upload</span>
<p class="font-bold mb-1">Drag &amp; Drop new version</p>
<p class="text-sm text-on-surface-variant">Optimized weights (v2.1_optimized.bin)</p>
</div>
<div class="bg-surface-container p-6 rounded-xl">
<h3 class="text-xs font-bold text-on-surface-variant uppercase mb-4 tracking-widest">Metadata</h3>
<div class="space-y-4">
<div>
<p class="text-[10px] text-on-surface-variant uppercase">Filename</p>
<p class="text-sm font-mono truncate">mesh_opt_v2.bin</p>
</div>
<div>
<p class="text-[10px] text-on-surface-variant uppercase">Size</p>
<p class="text-sm">412.8 MB</p>
</div>
<div>
<p class="text-[10px] text-on-surface-variant uppercase">Hash</p>
<p class="text-sm font-mono truncate">SHA-256: 8f2b...91c2</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
<!-- Footer -->
<Footer />