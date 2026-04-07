<script lang="ts">
import NavBar from '../common/NavBar.svelte';

import Footer from '../common/Footer.svelte';

</script>

<svelte:head>
  <title>Review &amp; Approval | Luminal Freelance</title>
</svelte:head>

<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-2xl shadow-cyan-900/10 flex justify-between items-center px-8 h-20 w-full">
<div class="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">
            Luminal Freelance
        </div>
<NavBar />
<div class="flex items-center gap-6">
<button class="text-cyan-400 hover:bg-slate-800/50 transition-all p-2 rounded-lg active:scale-95 duration-200">
<span class="material-symbols-outlined">notifications</span>
</button>
<div class="w-10 h-10 rounded-full bg-surface-container overflow-hidden">
<img alt="User profile avatar" class="w-full h-full object-cover" data-alt="close-up portrait of a professional male freelancer with glasses in a tech-focused modern office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMlVNqabePtvZkBjETlS3tMttvoTN4x4qTkA3erO0Qe7BnIRX5kM8g1Ccuoha_QYs41awgGv5rPZs07I4nBALbMl8Gzlo-5GvlUa1_AzykL1_7_nA43szKItTYUzkh_g1CQQs-qIobnaf3zH8gT7-FhO5e1SX8AdPEMt2zB_1D4lREcEjFSt_o19TbfJA5oMhA8rfaBw6Wj6UApgezEzFxTMEfqS8EAY4h2COkPh6s-VHYquXGU0ZLKhFCCp0LVL_yC9RnHg_gUW1l"/>
</div>
</div>
</header>
<div class="flex flex-1 pt-20">
<!-- Sidebar Navigation -->
<aside class="h-screen w-64 fixed left-0 top-0 pt-24 bg-slate-900 flex flex-col h-full border-r border-slate-800/50 z-40">
<div class="px-6 mb-8">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center">
<span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">assignment_turned_in</span>
</div>
<div>
<p class="font-headline font-bold text-on-surface leading-tight">Freelancer Portal</p>
<p class="text-[10px] text-tertiary uppercase tracking-widest">AI-Verified Status</p>
</div>
</div>
</div>
<nav class="flex-1 space-y-1 px-4">
<a class="bg-cyan-400/10 text-cyan-400 border-r-4 border-cyan-400 flex items-center gap-3 px-4 py-3 font-['Manrope'] text-sm duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined">assignment_turned_in</span>
                    My Tasks
                </a>
<a class="text-slate-400 hover:bg-slate-800 flex items-center gap-3 px-4 py-3 font-['Manrope'] text-sm duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined">payments</span>
                    My Earnings
                </a>
<a class="text-slate-400 hover:bg-slate-800 flex items-center gap-3 px-4 py-3 font-['Manrope'] text-sm duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined">analytics</span>
                    Reports
                </a>
<a class="text-slate-400 hover:bg-slate-800 flex items-center gap-3 px-4 py-3 font-['Manrope'] text-sm duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined">settings</span>
                    Settings
                </a>
</nav>
<div class="p-4 mt-auto border-t border-slate-800/50">
<button class="w-full py-3 luminous-gradient rounded-lg text-on-primary-fixed font-bold text-sm tracking-wide active:scale-95 duration-200 mb-4">
                    Upgrade to Pro
                </button>
<div class="space-y-2">
<a class="text-slate-400 hover:text-white flex items-center gap-3 px-2 py-1 text-xs" href="#">
<span class="material-symbols-outlined text-sm">help</span> Support
                    </a>
<a class="text-slate-400 hover:text-white flex items-center gap-3 px-2 py-1 text-xs" href="#">
<span class="material-symbols-outlined text-sm">api</span> API Status
                    </a>
</div>
</div>
</aside>
<!-- Main Content Area -->
<main class="ml-64 flex-1 p-8 pb-24">
<div class="max-w-6xl mx-auto">
<!-- Header & Auto-Release Timer -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h1 class="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">Review &amp; Approval</h1>
<p class="text-on-surface-variant max-w-xl">Project: <span class="text-primary">Neural Mesh Interface Design</span> • Task ID: #LF-8829</p>
</div>
<div class="glass-panel p-4 rounded-xl border border-outline-variant/15 flex items-center gap-4">
<div class="text-right">
<p class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Auto-Release Window</p>
<p class="text-2xl font-headline font-bold text-secondary">04:22:18</p>
</div>
<div class="w-12 h-12 rounded-full border-2 border-secondary/30 flex items-center justify-center">
<span class="material-symbols-outlined text-secondary">schedule</span>
</div>
</div>
</div>
<!-- Bento Grid Layout -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
<!-- Left: AI Verification Summary -->
<div class="lg:col-span-4 flex flex-col gap-6">
<div class="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
<div class="absolute top-0 right-0 p-4">
<span class="material-symbols-outlined text-tertiary-dim text-4xl opacity-20">verified_user</span>
</div>
<h2 class="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">AI Verification Summary</h2>
<div class="space-y-8">
<div class="flex items-center justify-between">
<div>
<p class="text-on-surface font-headline text-lg">Integrity Score</p>
<p class="text-xs text-on-surface-variant">Synthesized verification level</p>
</div>
<div class="text-3xl font-headline font-bold text-tertiary">98%</div>
</div>
<div class="space-y-4">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-tertiary text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-sm text-on-surface">No plagiarism detected</span>
</div>
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-tertiary text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-sm text-on-surface">Code standards compliant</span>
</div>
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-tertiary text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-sm text-on-surface">AI-generation check passed</span>
</div>
</div>
<div class="pt-6 border-t border-outline-variant/15">
<p class="text-xs text-on-surface-variant italic mb-2">"Agent Lumina performed a full deep-scan. All assets align with project constraints and brand guidelines."</p>
<div class="flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
<span class="text-[10px] text-tertiary uppercase font-bold">Live AI Monitoring Active</span>
</div>
</div>
</div>
</div>
<!-- Mini Asset Card -->
<div class="bg-surface-container p-6 rounded-xl border border-outline-variant/15">
<h3 class="text-xs font-bold uppercase text-on-surface-variant mb-4">Attached Deliverables</h3>
<div class="space-y-3">
<div class="flex items-center justify-between p-3 bg-surface-container-low rounded">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">description</span>
<span class="text-xs truncate max-w-[120px]">interface_spec.pdf</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">download</span>
</div>
<div class="flex items-center justify-between p-3 bg-surface-container-low rounded">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">folder_zip</span>
<span class="text-xs truncate max-w-[120px]">assets_v2.zip</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">download</span>
</div>
</div>
</div>
</div>
<!-- Right: Submission Content -->
<div class="lg:col-span-8 space-y-6">
<div class="bg-surface-container p-8 rounded-xl border border-outline-variant/15 min-h-[500px] flex flex-col">
<div class="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/15">
<h2 class="text-xl font-headline font-bold">Submission Content</h2>
<div class="flex gap-2">
<button class="px-3 py-1 bg-surface-container-high text-xs text-on-surface-variant rounded hover:text-on-surface">Raw Text</button>
<button class="px-3 py-1 bg-primary text-xs text-on-primary-container rounded font-bold">Formatted View</button>
</div>
</div>
<article class="prose prose-invert max-w-none flex-1">
<h3 class="text-on-surface">1. Executive Summary</h3>
<p class="text-on-surface-variant leading-relaxed">The proposed Neural Mesh Interface (NMI) leverages a decentralized node structure to ensure ultra-low latency data transmission. By implementing a predictive load-balancing algorithm, we've achieved a 40% reduction in cognitive overhead for the end-user.</p>
<h3 class="text-on-surface mt-8">2. Visual Architecture</h3>
<p class="text-on-surface-variant leading-relaxed">The UI utilizes a "Luminous Depth" model, where interactive elements are treated as light sources. This provides an intuitive hierarchy without the need for traditional heavy outlines or high-contrast borders.</p>
<div class="my-8 rounded-lg overflow-hidden glass-panel p-4">
<img alt="UI Design concept visualization" class="w-full h-auto rounded-lg" data-alt="futuristic user interface design concept with neon blue and purple glowing nodes and thin white lines on a dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUU7BeViJZYb7L35jlc3Gr-RJAugQ_0qlJhuhcG0yF4lp09W1bGK_OUAfOx745DYHtHlD3e7G1ZgoakC1s15_oxCkct6GWh08BXCEvR1_u0rXOJ6lAXa_9X2t6qQmb9uoZ5Kug1z9feocUBBMqYIjRINs45Xikq5CDgDE_FC8X2rlBho7CGWD-rLvuOOrF9f37AvzUEnD1sZfnX49pTyux0petssm22miw064OcN5swmMZAc7Rn5vRxBzLRIYMl4ywgW_9KdFUGUsU"/>
</div>
<h3 class="text-on-surface mt-8">3. Technical Implementation</h3>
<p class="text-on-surface-variant leading-relaxed">All React components have been optimized for tree-shaking and utilize CSS custom properties for theme dynamicism. The underlying engine is powered by the Synthos Core API, ensuring seamless integration with the existing ecosystem.</p>
</article>
</div>
<!-- Action Controls -->
<div class="flex flex-col gap-4">
<!-- Rejection Field (Optional State Simulation) -->
<div class="hidden animate-in slide-in-from-top duration-300" id="rejection-box">
<label class="block text-sm font-bold text-on-surface-variant mb-2">REJECTION REASON</label>
<textarea class="w-full bg-surface-container-low border-none rounded-lg text-on-surface p-4 focus:ring-2 focus:ring-error-dim" placeholder="Please specify why this submission is being rejected..." rows="3"></textarea>
</div>
<div class="grid grid-cols-2 gap-4">
<button class="py-5 bg-surface-container-highest border border-error-dim/30 text-error-dim font-headline font-bold text-lg rounded-xl hover:bg-error-container hover:text-on-error transition-all active:scale-[0.98]" onclick={() => { document.getElementById('rejection-box')?.classList.toggle('hidden') }}>
                                    REJECT SUBMISSION
                                </button>
<button class="py-5 luminous-gradient text-on-primary-fixed font-headline font-bold text-lg rounded-xl shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98]">
                                    APPROVE &amp; RELEASE
                                </button>
</div>
<p class="text-center text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                                Clicking 'Approve' will immediately transfer funds to the freelancer's wallet.
                            </p>
</div>
</div>
</div>
</div>
</main>
</div>
<!-- Footer -->
<Footer />