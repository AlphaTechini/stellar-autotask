<script lang="ts">
import NavBar from '../common/NavBar.svelte';

import Footer from '../common/Footer.svelte';

</script>

<svelte:head>
  <title>Luminal Freelance | Payment Receipt</title>
</svelte:head>

<!-- TopNavBar -->
<header class="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-2xl shadow-cyan-900/10 flex justify-between items-center px-8 h-20 w-full">
<div class="flex items-center gap-8">
<span class="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">Luminal Freelance</span>
<NavBar />
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-cyan-400 hover:bg-slate-800/50 transition-all rounded-full active:scale-95 duration-200">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<img alt="User profile avatar" class="w-10 h-10 rounded-full border border-outline-variant/30" data-alt="portrait of a confident man with short hair in a modern tech office setting, soft dramatic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1J_WQBZE7qPds8-Em5EByr-9Hd4p7XO5Np6hr9n5HE9GpXFtEQUQTqtt9QLOAeMGastdHGGH2oA-3M_J2y0LaZnHCj48_W0nGETLUfYA9xo78DB6qRYw3n5iRYtFp-FLE2hRZcIKLCfN-D6Rt4kSOKN_rYdIGH5uRW77ffSRLkCyqAA9Ti_0eiGj0CNGhS9ojL1d8WASY2szLWz8X9IZ4DozMFDvvVYnsDxpkF_QoovWPeNSZ8tEKfOZC2xu2H524MEPGZJNU0zt9"/>
</div>
</header>
<main class="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
<!-- Success Celebration Header -->
<section class="text-center mb-12">
<div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-tertiary-container/10 mb-6 shadow-[0_0_40px_rgba(105,246,184,0.15)]">
<span class="material-symbols-outlined text-tertiary text-5xl" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<h1 class="font-headline text-5xl font-bold tracking-tight mb-2">Payment Successful</h1>
<p class="text-on-surface-variant font-medium">Verification sequence complete. Funds released to your secure wallet.</p>
</section>
<div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
<!-- Left Column: Receipt Details -->
<div class="lg:col-span-3">
<div class="receipt-gradient p-8 rounded-xl relative overflow-hidden">
<!-- Geometric Accent Decor -->
<div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
<div class="flex justify-between items-start mb-10">
<div>
<p class="text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] mb-1">Transaction ID</p>
<p class="font-headline text-lg">#LUM-992-TX-8841</p>
</div>
<div class="text-right">
<p class="text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] mb-1">Status</p>
<div class="bg-tertiary-container/20 text-tertiary text-xs font-bold px-3 py-1 rounded-full border border-tertiary/20 flex items-center gap-1.5 shadow-[0_0_15px_rgba(105,246,184,0.1)]">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                                VERIFIED
                            </div>
</div>
</div>
<div class="space-y-6">
<div class="flex justify-between items-center py-4 border-b border-outline-variant/10">
<span class="text-on-surface-variant">Amount Paid</span>
<span class="font-headline text-2xl font-bold text-primary">2,450.00 USDC</span>
</div>
<div class="flex justify-between items-center py-4 border-b border-outline-variant/10">
<span class="text-on-surface-variant">Execution Date</span>
<span class="font-medium">Oct 24, 2024 • 14:32 UTC</span>
</div>
<div class="flex flex-col gap-1 py-4 border-b border-outline-variant/10">
<span class="text-on-surface-variant text-sm">Recipient Wallet Address</span>
<div class="flex items-center justify-between">
<span class="font-mono text-xs text-secondary truncate pr-4">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</span>
<button class="text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-sm" data-icon="content_copy">content_copy</span>
</button>
</div>
</div>
<div class="flex flex-col gap-1 py-4">
<span class="text-on-surface-variant text-sm">Blockchain Link</span>
<a class="flex items-center gap-2 text-primary hover:underline group" href="#">
<span class="font-headline font-bold">View Transaction Hash</span>
<span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" data-icon="open_in_new">open_in_new</span>
</a>
</div>
</div>
<div class="mt-8 p-4 bg-surface-container-highest/40 rounded-lg flex items-start gap-4">
<span class="material-symbols-outlined text-secondary" data-icon="auto_awesome">auto_awesome</span>
<div>
<p class="text-sm font-bold text-on-surface mb-1">AI-Verified Payout</p>
<p class="text-xs text-on-surface-variant leading-relaxed">The Luminal Neural Engine has confirmed the task milestones and triggered the smart contract release. Funds are now irreversible.</p>
</div>
</div>
</div>
</div>
<!-- Right Column: Task Summary -->
<div class="lg:col-span-2 space-y-6">
<div class="surface-container-low p-6 rounded-xl">
<p class="text-xs font-bold text-on-surface-variant tracking-widest uppercase mb-4">Task Context</p>
<div class="flex gap-4 mb-6">
<div class="w-16 h-16 rounded bg-slate-800 flex-shrink-0 overflow-hidden">
<img alt="Task Thumbnail" class="w-full h-full object-cover grayscale opacity-60" data-alt="abstract close up of purple and blue light lines on a dark electronic circuit board background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWD8vkRTVOo2wAmTAEjicUiaj9JA1TWsyImQfSMZ-q_-90XubkTG4D4uUgp1knprwk_yJvEgyAlNJUddMZ4RRe7gc532IN_vwVxO6wR4AVKVo-f9Lj2qcM8sR_h4w6N1pz5igI78wX1_ku0k3asjMtp_0Sf-jyetyYrCfEzoyOSUG--Q5UY0n0a7Ahg7Rh2YqGeCA78BzmG_8ZtFCxgyiQou0KvlizhrrjupoSihV3h66rSAs33jI_zkvlLjV7ONdsS3bJ2KvWhNJZ"/>
</div>
<div>
<h3 class="font-headline font-bold text-lg leading-tight mb-1">Edge Compute Optimization</h3>
<p class="text-sm text-on-surface-variant">Contract ID: #CNTR-042</p>
</div>
</div>
<div class="space-y-4">
<div class="flex items-center gap-3 text-sm">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="person_outline">person_outline</span>
<span class="text-on-surface-variant">Client:</span>
<span class="font-medium">Synthos Dynamics</span>
</div>
<div class="flex items-center gap-3 text-sm">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="timer">timer</span>
<span class="text-on-surface-variant">Duration:</span>
<span class="font-medium">12 Days (On Time)</span>
</div>
<div class="flex items-center gap-3 text-sm">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-on-surface-variant">Rating:</span>
<span class="font-medium text-tertiary">5.0 Perfect Score</span>
</div>
</div>
</div>
<div class="space-y-3">
<button class="w-full h-12 rounded-lg font-headline font-bold bg-gradient-to-r from-primary to-secondary text-on-primary-fixed hover:opacity-90 transition-opacity active:scale-[0.98] duration-200">
                        Download PDF Receipt
                    </button>
<button class="w-full h-12 rounded-lg font-headline font-bold bg-surface-container-highest text-on-surface hover:bg-surface-bright transition-all active:scale-[0.98] duration-200">
                        Back to Dashboard
                    </button>
</div>
<p class="text-center text-xs text-on-surface-variant px-4">
                    Having trouble? <a class="text-primary hover:underline" href="#">Contact Neural Support</a> for instant resolution.
                </p>
</div>
</div>
</main>
<!-- Footer -->
<Footer />
<!-- SideNavBar (Suppressed for focused Transactional screen as per mandate, but included for structure if needed in other context) -->
<!-- Hidden on this screen to prioritize the focus on receipt content -->