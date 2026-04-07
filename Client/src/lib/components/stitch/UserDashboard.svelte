<script lang="ts">
import NavBar from '../common/NavBar.svelte';

import Footer from '../common/Footer.svelte';

</script>

<svelte:head>
  <title>Luminal Freelance | Dashboard</title>
</svelte:head>

<!-- TopNavBar -->
<NavBar />
<!-- SideNavBar -->
<aside class="h-screen w-64 fixed left-0 top-0 pt-24 hidden md:flex flex-col bg-slate-900 border-r border-slate-800/50 font-['Manrope'] text-sm z-40">
<div class="px-6 mb-10">
<div class="flex flex-col gap-1">
<span class="text-on-surface font-bold">Freelancer Portal</span>
<span class="text-cyan-400 text-xs flex items-center gap-1">
<span class="material-symbols-outlined text-xs" data-icon="verified" style="font-variation-settings: 'FILL' 1;">verified</span>
                    AI-Verified Status
                </span>
</div>
</div>
<div class="flex-1 space-y-2 px-3">
<a class="flex items-center gap-3 px-4 py-3 rounded bg-cyan-400/10 text-cyan-400 border-r-4 border-cyan-400 duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined" data-icon="assignment_turned_in">assignment_turned_in</span>
<span>My Tasks</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined" data-icon="payments">payments</span>
<span>My Earnings</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span>Reports</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
</div>
<div class="p-4 mx-4 mb-8 bg-surface-container-high rounded-xl border border-outline-variant/10">
<p class="text-xs text-on-surface-variant mb-3">Maximize your potential with Pro features.</p>
<button class="w-full bg-gradient-to-r from-primary to-secondary py-2 rounded font-bold text-on-primary-fixed text-xs tracking-wider uppercase hover:opacity-90 transition-opacity">
                Upgrade to Pro
            </button>
</div>
<div class="mt-auto border-t border-slate-800/50 p-4 space-y-2">
<a class="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-cyan-400 transition-colors" href="#">
<span class="material-symbols-outlined text-sm" data-icon="help">help</span>
<span>Support</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-cyan-400 transition-colors" href="#">
<span class="material-symbols-outlined text-sm" data-icon="api">api</span>
<span>API Status</span>
</a>
</div>
</aside>
<!-- Main Content -->
<main class="md:ml-64 pt-28 px-8 pb-12 min-h-screen">
<header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
<div>
<h1 class="text-4xl font-headline font-bold tracking-tight text-on-surface mb-2">Workspace Overview</h1>
<p class="text-on-surface-variant max-w-md">Welcome back. You have <span class="text-primary font-bold">4 active tasks</span> needing attention today.</p>
</div>
<button class="flex items-center gap-3 px-8 py-4 rounded bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold tracking-tight shadow-lg shadow-primary-dim/10 active:scale-95 transition-all">
<span class="material-symbols-outlined" data-icon="add_circle">add_circle</span>
                Create Task
            </button>
</header>
<!-- Stats Grid -->
<section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
<div class="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl" data-icon="task_alt">task_alt</span>
</div>
<p class="text-on-surface-variant font-label text-sm uppercase tracking-widest mb-2">Active Tasks</p>
<div class="flex items-baseline gap-2">
<span class="text-4xl font-headline font-bold text-on-surface">12</span>
<span class="text-tertiary text-xs font-bold font-label">+2 this week</span>
</div>
</div>
<div class="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl" data-icon="pending_actions">pending_actions</span>
</div>
<p class="text-on-surface-variant font-label text-sm uppercase tracking-widest mb-2">Pending Reviews</p>
<div class="flex items-baseline gap-2">
<span class="text-4xl font-headline font-bold text-on-surface">03</span>
<span class="text-on-surface-variant text-xs font-label">Action required</span>
</div>
</div>
<div class="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl" data-icon="account_balance_wallet">account_balance_wallet</span>
</div>
<p class="text-on-surface-variant font-label text-sm uppercase tracking-widest mb-2">Total Earnings</p>
<div class="flex items-baseline gap-2">
<span class="text-4xl font-headline font-bold text-primary">$8,420.50</span>
<span class="text-on-surface-variant text-xs font-label">USD</span>
</div>
</div>
</section>
<!-- Main Dashboard Layout (Asymmetric) -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
<!-- Your Tasks Section -->
<section class="lg:col-span-8">
<div class="flex items-center justify-between mb-8">
<h2 class="text-2xl font-headline font-bold text-on-surface">Your Tasks</h2>
<button class="text-primary text-sm font-bold flex items-center gap-2 hover:underline">
                        View all tasks
                        <span class="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
<div class="space-y-6">
<!-- Task Card 1 -->
<div class="bg-surface-container p-6 rounded-xl border border-outline-variant/10 hover:border-primary-dim/30 transition-all group">
<div class="flex justify-between items-start mb-6">
<div>
<h3 class="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">Neural Network Optimization Phase 2</h3>
<p class="text-on-surface-variant text-sm">Deep learning architecture for real-time video processing.</p>
</div>
<div class="text-right">
<span class="text-2xl font-headline font-bold text-on-surface">$1,250.00</span>
<div class="mt-2">
<span class="bg-tertiary-container/20 text-tertiary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(105,246,184,0.1)]">In Progress</span>
</div>
</div>
</div>
<div class="flex items-center gap-4">
<div class="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-primary" style="width: 65%"></div>
</div>
<span class="text-xs font-bold text-on-surface-variant">65%</span>
</div>
</div>
<!-- Task Card 2 -->
<div class="bg-surface-container p-6 rounded-xl border border-outline-variant/10 hover:border-primary-dim/30 transition-all group">
<div class="flex justify-between items-start mb-6">
<div>
<h3 class="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">Luminal Interface Design System</h3>
<p class="text-on-surface-variant text-sm">Core UI tokens and component library for mobile apps.</p>
</div>
<div class="text-right">
<span class="text-2xl font-headline font-bold text-on-surface">$3,400.00</span>
<div class="mt-2">
<span class="bg-secondary-container/20 text-secondary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(172,138,255,0.1)]">Awaiting Review</span>
</div>
</div>
</div>
<div class="flex items-center gap-4">
<div class="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-secondary" style="width: 95%"></div>
</div>
<span class="text-xs font-bold text-on-surface-variant">95%</span>
</div>
</div>
<!-- Task Card 3 -->
<div class="bg-surface-container p-6 rounded-xl border border-outline-variant/10 hover:border-primary-dim/30 transition-all group opacity-75 grayscale hover:grayscale-0 hover:opacity-100">
<div class="flex justify-between items-start mb-6">
<div>
<h3 class="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">E-commerce API Integration</h3>
<p class="text-on-surface-variant text-sm">Stripe and PayPal gateway synchronization module.</p>
</div>
<div class="text-right">
<span class="text-2xl font-headline font-bold text-on-surface">$850.00</span>
<div class="mt-2">
<span class="bg-surface-container-highest text-on-surface-variant text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Completed</span>
</div>
</div>
</div>
<div class="flex items-center gap-4">
<div class="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-on-surface-variant" style="width: 100%"></div>
</div>
<span class="text-xs font-bold text-on-surface-variant">100%</span>
</div>
</div>
</div>
</section>
<!-- Activity / Notifications Sidebar -->
<section class="lg:col-span-4">
<div class="bg-surface-container-low p-8 rounded-xl border border-outline-variant/5 h-full">
<h2 class="text-xl font-headline font-bold text-on-surface mb-8">Recent Activity</h2>
<div class="space-y-8 relative">
<!-- Timeline Line -->
<div class="absolute left-3 top-2 bottom-2 w-px bg-outline-variant/20"></div>
<!-- Activity Item 1 -->
<div class="relative pl-10">
<div class="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(143,245,255,0.6)]"></div>
<p class="text-xs font-label text-on-surface-variant uppercase tracking-tighter mb-1">10 Minutes ago</p>
<h4 class="text-sm font-bold text-on-surface mb-1">AI Verification Success</h4>
<p class="text-xs text-on-surface-variant leading-relaxed">Task 'Neural Net Phase 2' passed automated quality check with 98% accuracy score.</p>
</div>
<!-- Activity Item 2 -->
<div class="relative pl-10">
<div class="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-tertiary shadow-[0_0_8px_rgba(155,255,206,0.6)]"></div>
<p class="text-xs font-label text-on-surface-variant uppercase tracking-tighter mb-1">2 Hours ago</p>
<h4 class="text-sm font-bold text-on-surface mb-1">Payment Released</h4>
<p class="text-xs text-on-surface-variant leading-relaxed">Payment of $850.00 for 'E-commerce API' has been credited to your wallet.</p>
</div>
<!-- Activity Item 3 -->
<div class="relative pl-10">
<div class="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-secondary shadow-[0_0_8px_rgba(172,138,255,0.6)]"></div>
<p class="text-xs font-label text-on-surface-variant uppercase tracking-tighter mb-1">Yesterday</p>
<h4 class="text-sm font-bold text-on-surface mb-1">New Message</h4>
<p class="text-xs text-on-surface-variant leading-relaxed">System admin requested further clarification on the 'Interface Design' documentation.</p>
</div>
<!-- Activity Item 4 -->
<div class="relative pl-10">
<div class="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-outline-variant shadow-none"></div>
<p class="text-xs font-label text-on-surface-variant uppercase tracking-tighter mb-1">2 Days ago</p>
<h4 class="text-sm font-bold text-on-surface mb-1">Login Detected</h4>
<p class="text-xs text-on-surface-variant leading-relaxed">Secure login from a new device in San Francisco, CA.</p>
</div>
</div>
<button class="w-full mt-12 py-4 bg-surface-container-high border border-outline-variant/10 rounded font-bold text-sm text-on-surface hover:bg-surface-bright transition-colors">
                        Clear Notifications
                    </button>
</div>
</section>
</div>
<!-- AI Insights Module (Glassmorphism) -->
<section class="mt-12 p-8 rounded-2xl bg-secondary-container/5 border border-secondary/10 relative overflow-hidden backdrop-blur-md">
<div class="absolute -right-24 -top-24 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full"></div>
<div class="flex flex-col md:flex-row gap-8 items-center relative z-10">
<div class="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary-dim flex items-center justify-center">
<span class="material-symbols-outlined text-on-secondary text-3xl" data-icon="auto_awesome" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
</div>
<div>
<h3 class="text-xl font-headline font-bold text-secondary mb-2">Luminal AI Insights</h3>
<p class="text-on-surface-variant text-sm max-w-2xl leading-relaxed">Based on your recent performance metrics and coding speed, we suggest increasing your hourly rate for <span class="text-on-surface font-bold">Neural Optimization</span> tasks by 12%. Demand for this skill is currently at an all-time high in the Marketplace.</p>
</div>
<div class="ml-auto">
<button class="px-6 py-3 bg-secondary text-on-secondary font-bold rounded-lg text-sm whitespace-nowrap active:scale-95 transition-transform">Apply Adjustment</button>
</div>
</div>
</section>
</main>
<!-- Footer -->
<Footer />
<!-- Mobile Navigation Overlay (Visible on small screens only) -->
<nav class="md:hidden fixed bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/50 flex justify-around items-center h-16 z-50">
<button class="flex flex-col items-center gap-1 text-cyan-400">
<span class="material-symbols-outlined" data-icon="dashboard" style="font-variation-settings: 'FILL' 1;">dashboard</span>
<span class="text-[10px] uppercase font-bold">Dash</span>
</button>
<button class="flex flex-col items-center gap-1 text-slate-500">
<span class="material-symbols-outlined" data-icon="explore">explore</span>
<span class="text-[10px] uppercase font-bold">Market</span>
</button>
<button class="flex flex-col items-center gap-1 -mt-8">
<div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary-dim/20">
<span class="material-symbols-outlined text-on-primary-fixed" data-icon="add">add</span>
</div>
</button>
<button class="flex flex-col items-center gap-1 text-slate-500">
<span class="material-symbols-outlined" data-icon="chat">chat</span>
<span class="text-[10px] uppercase font-bold">Chat</span>
</button>
<button class="flex flex-col items-center gap-1 text-slate-500">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="text-[10px] uppercase font-bold">Profile</span>
</button>
</nav>