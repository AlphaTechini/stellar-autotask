<script lang="ts">
import NavBar from '../common/NavBar.svelte';

import Footer from '../common/Footer.svelte';

</script>

<!-- TopNavBar -->
<NavBar />
<!-- Sidebar (Desktop) -->
<aside class="hidden lg:flex h-screen w-64 fixed left-0 top-0 pt-24 bg-slate-900 flex-col border-r border-slate-800/50 font-['Manrope'] text-sm z-40">
<div class="px-6 mb-8">
<div class="flex items-center gap-3 mb-2">
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
<span class="material-symbols-outlined text-cyan-400" data-icon="verified">verified</span>
</div>
<div>
<div class="font-bold text-on-surface">Freelancer Portal</div>
<div class="text-[10px] uppercase tracking-wider text-cyan-400">AI-Verified Status</div>
</div>
</div>
</div>
<nav class="flex-1 px-4 space-y-1">
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="assignment_turned_in">assignment_turned_in</span>
<span>My Tasks</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="payments">payments</span>
<span>My Earnings</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span>Reports</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
</nav>
<div class="p-4 mt-auto">
<button class="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold active:scale-95 transition-all">
                Upgrade to Pro
            </button>
<div class="mt-6 flex flex-col gap-2 px-2">
<a class="flex items-center gap-3 text-slate-400 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined text-sm" data-icon="help">help</span>
<span class="text-xs">Support</span>
</a>
<a class="flex items-center gap-3 text-slate-400 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined text-sm" data-icon="api">api</span>
<span class="text-xs">API Status</span>
</a>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="flex-1 lg:pl-64 pt-20">
<div class="max-w-7xl mx-auto px-6 py-10">
<!-- Marketplace Header Section -->
<header class="mb-12 relative overflow-hidden rounded-full p-8 hero-glow">
<h1 class="text-4xl md:text-5xl font-headline font-bold tracking-tighter mb-4 text-on-surface">
                    Open <span class="text-gradient">Marketplace</span>
</h1>
<p class="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                    Access elite AI-verified opportunities. Filter by complexity and claim high-yield tasks instantly.
                </p>
</header>
<!-- Search & Filters -->
<section class="mb-12">
<div class="flex flex-col xl:flex-row gap-6">
<!-- Search Bar -->
<div class="flex-1 group">
<div class="relative">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" data-icon="search">search</span>
<input class="w-full bg-surface-container-low border-none rounded-lg pl-12 pr-4 py-4 focus:ring-0 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 transition-all border-b-2 border-transparent focus:border-primary-dim shadow-inner" placeholder="Search tasks by keyword, stack, or requirement..." type="text"/>
</div>
</div>
<!-- Filter Cluster -->
<div class="flex flex-wrap items-center gap-4">
<div class="flex flex-col gap-1">
<label class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">Payout</label>
<select class="bg-surface-container-low text-on-surface border-none rounded-lg px-4 py-2 focus:ring-0 cursor-pointer min-w-[140px]">
<option>Any Payout</option>
<option>$50+</option>
<option>$100+</option>
<option>$500+</option>
</select>
</div>
<div class="flex flex-col gap-1">
<label class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">Type</label>
<select class="bg-surface-container-low text-on-surface border-none rounded-lg px-4 py-2 focus:ring-0 cursor-pointer min-w-[140px]">
<option>All Categories</option>
<option>Writing</option>
<option>Development</option>
<option>AI Training</option>
<option>Design</option>
</select>
</div>
<div class="flex flex-col gap-1">
<label class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">Complexity</label>
<select class="bg-surface-container-low text-on-surface border-none rounded-lg px-4 py-2 focus:ring-0 cursor-pointer min-w-[140px]">
<option>Any Level</option>
<option>Entry Level</option>
<option>Intermediate</option>
<option>Expert</option>
</select>
</div>
<button class="mt-5 h-[42px] px-6 rounded-lg border border-outline-variant/30 hover:bg-surface-bright text-on-surface transition-all flex items-center gap-2">
<span class="material-symbols-outlined text-sm" data-icon="tune">tune</span>
<span>More Filters</span>
</button>
</div>
</div>
</section>
<!-- Task Grid (Bento Style) -->
<section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
<!-- Task Card 1 -->
<article class="bg-surface-container rounded-lg p-6 flex flex-col hover:bg-surface-container-high transition-all duration-300 group border border-transparent hover:border-primary/20">
<div class="flex justify-between items-start mb-6">
<span class="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-1 rounded font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(85,22,190,0.2)]">Writing</span>
<div class="text-primary text-2xl font-headline font-bold">$120.00</div>
</div>
<h3 class="text-xl font-bold mb-3 text-on-surface group-hover:text-primary transition-colors">Technical Blog: LLM Optimization</h3>
<p class="text-on-surface-variant text-sm mb-6 line-clamp-3">
                        Draft a 1,200-word comprehensive technical article focusing on RAG techniques and prompt caching for enterprise-level deployments.
                    </p>
<div class="flex items-center gap-4 mb-8 text-xs text-on-surface-variant">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm" data-icon="timer">timer</span>
<span>48h Left</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-tertiary" data-icon="signal_cellular_alt">signal_cellular_alt</span>
<span>Expert</span>
</div>
</div>
<button class="mt-auto w-full py-4 bg-surface-bright rounded-lg border border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-on-primary-fixed hover:border-transparent font-bold transition-all duration-300">
                        Claim Task
                    </button>
</article>
<!-- Task Card 2 (Featured with Glassmorphism) -->
<article class="glass-panel rounded-lg p-8 flex flex-col md:col-span-2 xl:col-span-1 border border-outline-variant/10 shadow-2xl relative overflow-hidden group">
<div class="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 blur-3xl rounded-full"></div>
<div class="flex justify-between items-start mb-6">
<span class="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-1 rounded font-bold tracking-widest uppercase flex items-center gap-1">
<span class="material-symbols-outlined text-[12px]" data-icon="bolt">bolt</span> High Priority
                        </span>
<div class="text-gradient text-3xl font-headline font-bold">$450.00</div>
</div>
<h3 class="text-2xl font-bold mb-4 text-on-surface group-hover:text-primary transition-colors leading-tight">Neural Network Dataset Curation</h3>
<p class="text-on-surface-variant text-base mb-8 leading-relaxed">
                        Validation and high-fidelity labeling of 5,000 synthetic medical imaging assets. Requires prior experience with DICOM standards and medical anatomy.
                    </p>
<div class="flex flex-wrap gap-2 mb-8">
<span class="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-bold">PYTHON</span>
<span class="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-bold">HEALTH-TECH</span>
<span class="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-bold">ML-QA</span>
</div>
<button class="mt-auto w-full py-4 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-extrabold tracking-tight rounded-lg hover:shadow-[0_0_20px_rgba(143,245,255,0.4)] transition-all">
                        Claim &amp; Initialize
                    </button>
</article>
<!-- Task Card 3 -->
<article class="bg-surface-container rounded-lg p-6 flex flex-col hover:bg-surface-container-high transition-all duration-300 group border border-transparent hover:border-primary/20">
<div class="flex justify-between items-start mb-6">
<span class="bg-surface-container-highest text-on-surface-variant text-[10px] px-2 py-1 rounded font-bold tracking-widest uppercase">Design</span>
<div class="text-primary text-2xl font-headline font-bold">$85.00</div>
</div>
<h3 class="text-xl font-bold mb-3 text-on-surface group-hover:text-primary transition-colors">Micro-Interaction Prototype</h3>
<p class="text-on-surface-variant text-sm mb-6 line-clamp-3">
                        Design 3 unique Lottie animations for a neomorphic dashboard navigation system. Export for React Native.
                    </p>
<div class="flex items-center gap-4 mb-8 text-xs text-on-surface-variant">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm" data-icon="schedule">schedule</span>
<span>Fast Track</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-primary" data-icon="signal_cellular_alt_2_bar">signal_cellular_alt_2_bar</span>
<span>Intermediate</span>
</div>
</div>
<button class="mt-auto w-full py-4 bg-surface-bright rounded-lg border border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-on-primary-fixed hover:border-transparent font-bold transition-all duration-300">
                        Claim Task
                    </button>
</article>
<!-- Task Card 4 -->
<article class="bg-surface-container rounded-lg p-6 flex flex-col hover:bg-surface-container-high transition-all duration-300 group border border-transparent hover:border-primary/20">
<div class="flex justify-between items-start mb-6">
<span class="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-1 rounded font-bold tracking-widest uppercase">Translation</span>
<div class="text-primary text-2xl font-headline font-bold">$60.00</div>
</div>
<h3 class="text-xl font-bold mb-3 text-on-surface group-hover:text-primary transition-colors">UI Copy: EN to FR-CA</h3>
<p class="text-on-surface-variant text-sm mb-6 line-clamp-3">
                        Localize the main landing page and settings module for a Canadian Fintech application. Approximately 800 strings.
                    </p>
<div class="flex items-center gap-4 mb-8 text-xs text-on-surface-variant">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm" data-icon="translate">translate</span>
<span>French</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-tertiary-dim" data-icon="signal_cellular_alt_1_bar">signal_cellular_alt_1_bar</span>
<span>Entry</span>
</div>
</div>
<button class="mt-auto w-full py-4 bg-surface-bright rounded-lg border border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-on-primary-fixed hover:border-transparent font-bold transition-all duration-300">
                        Claim Task
                    </button>
</article>
<!-- Task Card 5 -->
<article class="bg-surface-container rounded-lg p-6 flex flex-col hover:bg-surface-container-high transition-all duration-300 group border border-transparent hover:border-primary/20">
<div class="flex justify-between items-start mb-6">
<span class="bg-primary-container text-on-primary-container text-[10px] px-2 py-1 rounded font-bold tracking-widest uppercase">DevOps</span>
<div class="text-primary text-2xl font-headline font-bold">$210.00</div>
</div>
<h3 class="text-xl font-bold mb-3 text-on-surface group-hover:text-primary transition-colors">GitHub Actions Workflow Audit</h3>
<p class="text-on-surface-variant text-sm mb-6 line-clamp-3">
                        Review and optimize CI/CD pipelines for a mono-repo. Implement security scanning and parallel job execution.
                    </p>
<div class="flex items-center gap-4 mb-8 text-xs text-on-surface-variant">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm" data-icon="verified_user">verified_user</span>
<span>Verified Dev</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-tertiary" data-icon="signal_cellular_alt">signal_cellular_alt</span>
<span>Expert</span>
</div>
</div>
<button class="mt-auto w-full py-4 bg-surface-bright rounded-lg border border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-on-primary-fixed hover:border-transparent font-bold transition-all duration-300">
                        Claim Task
                    </button>
</article>
<!-- Task Card 6 -->
<article class="bg-surface-container rounded-lg p-6 flex flex-col hover:bg-surface-container-high transition-all duration-300 group border border-transparent hover:border-primary/20">
<div class="flex justify-between items-start mb-6">
<span class="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-1 rounded font-bold tracking-widest uppercase">Marketing</span>
<div class="text-primary text-2xl font-headline font-bold">$150.00</div>
</div>
<h3 class="text-xl font-bold mb-3 text-on-surface group-hover:text-primary transition-colors">Social Strategy: Crypto SaaS</h3>
<p class="text-on-surface-variant text-sm mb-6 line-clamp-3">
                        Develop a 30-day multi-channel content calendar for a decentralized storage platform. Focus on developer advocacy.
                    </p>
<div class="flex items-center gap-4 mb-8 text-xs text-on-surface-variant">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm" data-icon="campaign">campaign</span>
<span>Active</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-primary" data-icon="signal_cellular_alt_2_bar">signal_cellular_alt_2_bar</span>
<span>Intermediate</span>
</div>
</div>
<button class="mt-auto w-full py-4 bg-surface-bright rounded-lg border border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-on-primary-fixed hover:border-transparent font-bold transition-all duration-300">
                        Claim Task
                    </button>
</article>
</section>
<!-- Pagination -->
<div class="mt-16 flex items-center justify-center gap-4">
<button class="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high transition-all text-on-surface disabled:opacity-30" disabled>
<span class="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<div class="flex items-center gap-2">
<button class="w-12 h-12 flex items-center justify-center rounded-lg bg-primary text-on-primary-fixed font-bold">1</button>
<button class="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-all font-bold">2</button>
<button class="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-all font-bold">3</button>
<span class="text-on-surface-variant">...</span>
<button class="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-all font-bold">12</button>
</div>
<button class="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high transition-all text-on-surface">
<span class="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</main>
<!-- Footer -->
<Footer />