<script lang="ts">
import NavBar from '../common/NavBar.svelte';

import Footer from '../common/Footer.svelte';

</script>

<svelte:head>
  <title>Create Task | Luminal Freelance</title>
</svelte:head>

<!-- TopNavBar -->
<NavBar />
<!-- SideNavBar (Hidden on desktop for this specific focused view, but kept for structural intent as per instructions) -->
<aside class="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 pt-24 bg-slate-900 border-r border-slate-800/50 font-['Manrope'] text-sm z-40">
<div class="px-6 mb-8">
<div class="flex items-center gap-3 p-3 bg-slate-950 rounded-lg">
<div class="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary-fixed">
<span class="material-symbols-outlined text-sm" data-icon="auto_awesome">auto_awesome</span>
</div>
<div>
<p class="font-bold text-on-surface">Freelancer Portal</p>
<p class="text-[10px] text-cyan-400 uppercase tracking-widest">AI-Verified Status</p>
</div>
</div>
</div>
<nav class="flex-1 space-y-1 px-4">
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined" data-icon="assignment_turned_in">assignment_turned_in</span>
<span>My Tasks</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined" data-icon="payments">payments</span>
<span>My Earnings</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span>Reports</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
</nav>
<div class="p-4 mt-auto border-t border-slate-800/50 space-y-4">
<button class="w-full py-2 bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded font-medium hover:bg-cyan-400/20 transition-all">Upgrade to Pro</button>
<div class="flex flex-col gap-2">
<a class="flex items-center gap-2 text-slate-500 hover:text-cyan-400 text-xs" href="#">
<span class="material-symbols-outlined text-sm" data-icon="help">help</span> Support
                </a>
<a class="flex items-center gap-2 text-slate-500 hover:text-cyan-400 text-xs" href="#">
<span class="material-symbols-outlined text-sm" data-icon="api">api</span> API Status
                </a>
</div>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="flex-1 pt-24 lg:pl-64 pb-12 px-8 bg-surface">
<div class="max-w-6xl mx-auto">
<!-- Header Section -->
<header class="mb-12">
<h1 class="text-4xl font-headline font-bold tracking-tight text-on-surface mb-2">Architect a New Task</h1>
<p class="text-on-surface-variant font-body max-w-2xl">Define your parameters with precision. Our AI agent will match the ideal specialist based on your requirements.</p>
</header>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
<!-- Creation Form -->
<section class="lg:col-span-7 space-y-10">
<div class="space-y-6">
<!-- Task Title -->
<div class="group">
<label class="block text-sm font-label text-on-surface-variant mb-2">Task Title</label>
<input class="w-full bg-surface-container-low border-none focus:ring-0 text-on-surface p-4 rounded-lg placeholder:text-outline/50 border-b-2 border-transparent focus:border-primary-dim transition-all" placeholder="e.g. Neural Network Optimization for Edge Devices" type="text"/>
</div>
<!-- Description -->
<div>
<label class="block text-sm font-label text-on-surface-variant mb-2">Description / Brief</label>
<textarea class="w-full bg-surface-container-low border-none focus:ring-0 text-on-surface p-4 rounded-lg placeholder:text-outline/50 border-b-2 border-transparent focus:border-primary-dim transition-all resize-none" placeholder="Detail the scope, technical stack, and expected deliverables..." rows="6"></textarea>
</div>
<!-- Required Keywords -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label class="block text-sm font-label text-on-surface-variant mb-2">Required Keywords</label>
<div class="flex bg-surface-container-low rounded-lg items-center px-4 py-1">
<input class="flex-1 bg-transparent border-none focus:ring-0 text-on-surface py-3" placeholder="Add tech tags..." type="text"/>
<button class="text-primary hover:text-primary-dim transition-colors">
<span class="material-symbols-outlined" data-icon="add_circle">add_circle</span>
</button>
</div>
<div class="flex flex-wrap gap-2 mt-3">
<span class="px-3 py-1 bg-surface-container-high text-primary-dim text-xs rounded-full flex items-center gap-1 border border-primary-dim/20">PyTorch <span class="material-symbols-outlined text-[14px] cursor-pointer" data-icon="close">close</span></span>
<span class="px-3 py-1 bg-surface-container-high text-primary-dim text-xs rounded-full flex items-center gap-1 border border-primary-dim/20">CUDA <span class="material-symbols-outlined text-[14px] cursor-pointer" data-icon="close">close</span></span>
</div>
</div>
<div>
<label class="block text-sm font-label text-on-surface-variant mb-2">Tone &amp; Audience</label>
<select class="w-full bg-surface-container-low border-none focus:ring-0 text-on-surface p-4 rounded-lg appearance-none">
<option>Technical / Engineering</option>
<option>Commercial / Business</option>
<option>Creative / Narrative</option>
<option>Academic / Research</option>
</select>
</div>
</div>
<!-- Financials & Timeline -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
<div class="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
<label class="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-4">Payout Amount</label>
<div class="flex items-baseline gap-2">
<span class="text-primary font-headline text-3xl font-bold">$</span>
<input class="bg-transparent border-none focus:ring-0 text-4xl font-headline font-bold text-on-surface p-0 w-full" type="number" value="1250"/>
</div>
<p class="text-[10px] text-on-surface-variant mt-2">Paid via Escrow &amp; AI Verification</p>
</div>
<div class="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
<label class="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-4">Review Window</label>
<div class="flex items-center gap-4">
<button class="flex-1 py-2 bg-surface-container-highest text-on-surface rounded-lg font-medium border border-primary/20">24h</button>
<button class="flex-1 py-2 bg-surface-container text-on-surface-variant rounded-lg font-medium border border-transparent hover:border-outline-variant/30">48h</button>
<button class="flex-1 py-2 bg-surface-container text-on-surface-variant rounded-lg font-medium border border-transparent hover:border-outline-variant/30">72h</button>
</div>
<p class="text-[10px] text-on-surface-variant mt-2 text-center">Auto-approval after window expires</p>
</div>
</div>
</div>
<!-- Primary Action -->
<div class="pt-8 flex flex-col items-center">
<button class="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-headline font-bold text-lg rounded-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 group flex items-center justify-center gap-3">
                            Fund &amp; Create Task
                            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="rocket_launch">rocket_launch</span>
</button>
<p class="mt-4 text-xs text-on-surface-variant flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]" data-icon="lock">lock</span>
                            Secured by Kinetic Luminescence Blockchain Protocol
                        </p>
</div>
</section>
<!-- Summary Preview Sidebar -->
<aside class="lg:col-span-5 sticky top-28 space-y-6">
<div class="glass-panel p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden">
<!-- AI Aura background effect -->
<div class="absolute -top-24 -right-24 w-64 h-64 bg-secondary-container opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
<div class="flex items-center justify-between mb-8">
<span class="text-xs font-label font-bold text-secondary uppercase tracking-widest px-2 py-1 bg-secondary/10 rounded">Live Preview</span>
<span class="material-symbols-outlined text-on-surface-variant" data-icon="visibility">visibility</span>
</div>
<div class="space-y-6">
<div>
<h3 class="font-headline text-2xl font-bold text-on-surface leading-tight mb-2">Neural Network Optimization for Edge Devices</h3>
<div class="flex gap-2">
<span class="text-[10px] bg-tertiary-container/10 text-tertiary-fixed px-2 py-0.5 rounded border border-tertiary/20">HIGH PRIORITY</span>
<span class="text-[10px] bg-primary/10 text-primary-fixed px-2 py-0.5 rounded border border-primary/20">AI-VERIFIED</span>
</div>
</div>
<div class="space-y-3">
<p class="text-sm text-on-surface-variant font-body leading-relaxed line-clamp-4">
                                    Detail the scope, technical stack, and expected deliverables. Looking for an expert in CUDA and PyTorch to optimize inference times on ARM-based hardware...
                                </p>
</div>
<div class="grid grid-cols-2 gap-4 py-6 border-y border-outline-variant/10">
<div>
<p class="text-[10px] text-on-surface-variant uppercase mb-1">Estimated Payout</p>
<p class="font-headline text-xl font-bold text-primary">$1,250.00</p>
</div>
<div>
<p class="text-[10px] text-on-surface-variant uppercase mb-1">Contract Type</p>
<p class="font-headline text-xl font-bold text-on-surface">Fixed-Price</p>
</div>
</div>
<div class="space-y-4">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-secondary" data-icon="bolt">bolt</span>
<span class="text-sm text-on-surface-variant">Instant matching with Top 5% experts</span>
</div>
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-secondary" data-icon="verified_user">verified_user</span>
<span class="text-sm text-on-surface-variant">Luminal Quality Guarantee included</span>
</div>
</div>
</div>
</div>
<!-- AI Insights Mini-Module -->
<div class="bg-surface-container-lowest/50 p-6 rounded-xl border border-secondary/20 flex gap-4">
<div class="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-secondary" data-icon="psychology">psychology</span>
</div>
<div>
<h4 class="text-sm font-bold text-on-surface mb-1">Luminal AI Suggestion</h4>
<p class="text-xs text-on-surface-variant leading-relaxed">Increasing the Payout by <span class="text-primary font-bold">15%</span> will place this task in the top priority queue, likely reducing match time by 4 hours.</p>
</div>
</div>
</aside>
</div>
</div>
</main>
<!-- Footer -->
<Footer />