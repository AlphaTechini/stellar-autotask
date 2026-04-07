<script lang="ts">
import NavBar from '../common/NavBar.svelte';

import Footer from '../common/Footer.svelte';

</script>

<svelte:head>
  <title>Verification Report View | Luminal Freelance</title>
</svelte:head>

<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-2xl shadow-cyan-900/10 flex justify-between items-center px-8 h-20 w-full">
<div class="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-headline tracking-tight">
            Luminal Freelance
        </div>
<NavBar />
<div class="flex items-center gap-4">
<button class="text-slate-400 hover:text-cyan-400 transition-all active:scale-95 duration-200">
<span class="material-symbols-outlined">notifications</span>
</button>
<img alt="User profile avatar" class="w-10 h-10 rounded-full border border-outline-variant/30" data-alt="Close up portrait of a young professional man with a slight smile, studio lighting with cool blue ambient tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrSbXrDXPwifdsRUIeOPlxkZtaT7Ng3xfk0DB-Ys9cFtzt4gv9paWShrtSC48jykF6PPbA1Vy-UmpboBcnO_XLNs1Qob9viO_4Z-6O0YGei3H-m7yDfVJATpro-3hihynuS-VbEYTpwq_9aOIKX-22Vukj_WW1I5x0Guz-Ynn5yUSEqq3-W2RkV5F_5hxN_Nbba7njpn922hZfLx-xtxGoFQYzMGlvlVpBmCprjuClTfjd2V3V3am8TMOYuqCmtQ_oSz5NGliqaOJn"/>
</div>
</header>
<!-- Sidebar Navigation (Hidden on mobile) -->
<aside class="hidden md:flex h-screen w-64 fixed left-0 top-0 pt-24 flex-col bg-slate-900 border-r border-slate-800/50 z-40">
<div class="px-6 mb-8">
<div class="flex items-center gap-3 py-4">
<div class="w-2 h-2 rounded-full bg-tertiary glow-cyan animate-pulse"></div>
<span class="text-xs font-label uppercase tracking-widest text-on-surface-variant">Freelancer Portal</span>
</div>
<p class="text-[10px] text-cyan-400 font-headline font-bold uppercase tracking-tighter">AI-Verified Status</p>
</div>
<nav class="flex-1 space-y-1 px-3">
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 transition-all duration-200 group" href="#">
<span class="material-symbols-outlined">assignment_turned_in</span>
<span class="font-label text-sm">My Tasks</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 transition-all duration-200 group" href="#">
<span class="material-symbols-outlined">payments</span>
<span class="font-label text-sm">My Earnings</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 bg-cyan-400/10 text-cyan-400 border-r-4 border-cyan-400 transition-all duration-200" href="#">
<span class="material-symbols-outlined">analytics</span>
<span class="font-label text-sm">Reports</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 transition-all duration-200 group" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-label text-sm">Settings</span>
</a>
</nav>
<div class="p-6 mt-auto border-t border-slate-800/30">
<button class="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-headline font-bold text-sm tracking-tight hover:brightness-110 active:scale-95 transition-all">
                Upgrade to Pro
            </button>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="md:ml-64 pt-28 pb-12 px-6 md:px-12">
<!-- Report Header Section -->
<section class="mb-12">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<nav class="flex items-center gap-2 text-xs font-label text-on-surface-variant mb-4">
<span>Reports</span>
<span class="material-symbols-outlined text-sm">chevron_right</span>
<span class="text-on-surface">Verification #V-8942</span>
</nav>
<h1 class="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tighter">Verification Report View</h1>
<p class="text-on-surface-variant mt-2 max-w-lg">AI-powered deep analysis of the Technical Documentation submission for Project 'Aura-X'.</p>
</div>
<div class="flex items-center gap-4">
<button class="px-6 py-2 border border-outline-variant/30 text-on-surface text-sm font-label rounded-lg hover:bg-surface-bright transition-all">Download PDF</button>
<button class="px-6 py-2 bg-primary text-on-primary-fixed text-sm font-headline font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all">Acknowledge</button>
</div>
</div>
</section>
<!-- Bento Grid Analysis Layout -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
<!-- AI Confidence Score Card -->
<div class="md:col-span-4 glass-panel rounded-xl p-8 flex flex-col items-center justify-center border border-outline-variant/10 glow-cyan">
<div class="relative w-40 h-40 flex items-center justify-center">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-container-highest" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" stroke-width="8"></circle>
<circle class="text-primary-dim drop-shadow-[0_0_8px_rgba(0,222,236,0.6)]" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" stroke-dasharray="440" stroke-dashoffset="66" stroke-width="8"></circle>
</svg>
<div class="absolute flex flex-col items-center">
<span class="text-5xl font-headline font-extrabold text-on-surface">85%</span>
<span class="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Confidence</span>
</div>
</div>
<div class="mt-8 text-center">
<h3 class="text-lg font-headline font-bold text-on-surface">AI Verification Score</h3>
<p class="text-sm text-on-surface-variant mt-2">Analysis confirms high compliance with core task parameters and structural integrity.</p>
</div>
</div>
<!-- Recommendation & Status Card -->
<div class="md:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
<div class="flex items-center gap-3 mb-6">
<div class="w-10 h-10 rounded-lg bg-tertiary-container/20 flex items-center justify-center text-tertiary-dim">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
</div>
<div>
<h3 class="text-xl font-headline font-bold text-on-surface">AI Recommendation</h3>
<p class="text-xs text-on-surface-variant font-label">Generated via Synthos Core Neural Network</p>
</div>
</div>
<div class="bg-surface-container-highest/50 rounded-lg p-6 mb-8 border-l-4 border-tertiary">
<div class="flex justify-between items-start">
<div class="max-w-md">
<h4 class="text-tertiary font-headline font-bold text-lg">Auto-Approve Recommended</h4>
<p class="text-on-surface-variant text-sm mt-2 leading-relaxed">
                                Submission exceeds all critical thresholds. Minimal variances detected in non-critical 'Length' metrics. Verification level: <span class="text-on-surface font-bold">OPTIMAL</span>.
                            </p>
</div>
<span class="bg-tertiary/10 text-tertiary border border-tertiary/20 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Safe to Process</span>
</div>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div class="bg-surface-container p-4 rounded-lg flex items-center gap-4 border border-outline-variant/10">
<span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<div>
<p class="text-[10px] text-on-surface-variant uppercase tracking-tighter">Content Safety</p>
<p class="text-sm font-bold text-on-surface">Clear of Plagiarism</p>
</div>
</div>
<div class="bg-surface-container p-4 rounded-lg flex items-center gap-4 border border-outline-variant/10">
<span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">verified</span>
<div>
<p class="text-[10px] text-on-surface-variant uppercase tracking-tighter">Author Identity</p>
<p class="text-sm font-bold text-on-surface">Verified AI-ID 99.2%</p>
</div>
</div>
</div>
</div>
<!-- Requirement Compliance Checklist -->
<div class="md:col-span-7 bg-surface-container-low rounded-xl border border-outline-variant/5 overflow-hidden">
<div class="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
<h3 class="font-headline font-bold text-lg">Task Requirement Compliance</h3>
<span class="text-xs text-on-surface-variant">5 of 6 Passed</span>
</div>
<div class="p-4 space-y-2">
<div class="flex items-center justify-between p-4 bg-surface-container-high rounded-lg group hover:bg-surface-bright transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-sm text-on-surface font-medium">Keywords found</span>
</div>
<span class="text-[10px] font-label text-on-surface-variant">12/12 Targets met</span>
</div>
<div class="flex items-center justify-between p-4 bg-surface-container-high rounded-lg group hover:bg-surface-bright transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-sm text-on-surface font-medium">Tone matches</span>
</div>
<span class="text-[10px] font-label text-on-surface-variant">Formal / Technical</span>
</div>
<div class="flex items-center justify-between p-4 bg-surface-container-high rounded-lg group hover:bg-surface-bright transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-sm text-on-surface font-medium">Formatting Logic</span>
</div>
<span class="text-[10px] font-label text-on-surface-variant">Standard Markdown</span>
</div>
<div class="flex items-center justify-between p-4 bg-surface-container-high rounded-lg group hover:bg-surface-bright transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-error" style="font-variation-settings: 'FILL' 1;">warning</span>
<span class="text-sm text-on-surface font-medium">Length OK</span>
</div>
<span class="text-[10px] font-label text-error font-bold">-15% Under Target</span>
</div>
<div class="flex items-center justify-between p-4 bg-surface-container-high rounded-lg group hover:bg-surface-bright transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-sm text-on-surface font-medium">Code block syntax</span>
</div>
<span class="text-[10px] font-label text-on-surface-variant">Verified Python</span>
</div>
</div>
</div>
<!-- Missing Requirements / Issues -->
<div class="md:col-span-5 flex flex-col gap-6">
<div class="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 glow-purple flex-1">
<h3 class="font-headline font-bold text-lg mb-4 flex items-center gap-2">
<span class="material-symbols-outlined text-secondary">exclamation</span>
                        Potential Issues
                    </h3>
<div class="space-y-4">
<div class="bg-surface-container-lowest/40 p-4 rounded-lg border border-outline-variant/10">
<p class="text-xs font-bold text-on-surface">Word Count Deficiency</p>
<p class="text-xs text-on-surface-variant mt-1 leading-relaxed">The submission is 425 words, falling short of the requested 500 word minimum. Consider expanding the 'Methodology' section.</p>
</div>
<div class="bg-surface-container-lowest/40 p-4 rounded-lg border border-outline-variant/10">
<p class="text-xs font-bold text-on-surface">Syntactic Repetition</p>
<p class="text-xs text-on-surface-variant mt-1 leading-relaxed">AI detected recurring sentence structures in paragraphs 2 and 4. Lower risk of plagiarism, but suggests limited scope.</p>
</div>
</div>
</div>
<div class="bg-surface-container-highest rounded-xl p-6 border border-outline-variant/10 flex items-center justify-between group hover:bg-surface-bright cursor-pointer transition-all">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined">psychology</span>
</div>
<div>
<p class="text-sm font-headline font-bold text-on-surface">Human override needed?</p>
<p class="text-[10px] text-on-surface-variant uppercase font-label">Flag for manual review</p>
</div>
</div>
<span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
</div>
</div>
</div>
</main>
<!-- Global Footer -->
<Footer />