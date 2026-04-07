<script lang="ts">
import NavBar from '../common/NavBar.svelte';

import Footer from '../common/Footer.svelte';

</script>

<!-- TopNavBar -->
<NavBar />
<main class="pt-20">
<!-- Hero Section -->
<section class="relative min-h-[921px] flex flex-col items-center justify-center px-6 overflow-hidden">
<div class="absolute inset-0 z-0">
<div class="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
<div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
</div>
<div class="relative z-10 max-w-5xl mx-auto text-center">
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 border border-secondary/30 mb-8">
<span class="material-symbols-outlined text-secondary text-sm" style="font-variation-settings: 'FILL' 1;">bolt</span>
<span class="text-xs font-bold uppercase tracking-widest text-secondary">The Future of Freelancing</span>
</div>
<h1 class="text-5xl md:text-8xl font-headline font-bold text-on-surface tracking-tighter leading-[0.9] mb-8">
                    Turn tasks into <br/>
<span class="bg-gradient-to-r from-primary via-primary-dim to-secondary bg-clip-text text-transparent italic">guaranteed</span>, verifiable payments
                </h1>
<p class="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 font-body leading-relaxed">
                    Scale your operations with AI-verified workflows. Secure capital in smart escrow and witness automatic release upon cryptographically proven task completion.
                </p>
<div class="flex flex-col md:flex-row gap-4 justify-center items-center">
<button class="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-lg text-lg hover:shadow-[0_0_30px_rgba(143,245,255,0.3)] transition-all active:scale-95">
                        Get Started
                    </button>
<button class="px-8 py-4 bg-surface-container-low border border-outline-variant/30 text-on-surface font-bold rounded-lg text-lg hover:bg-surface-bright transition-all">
                        View Marketplace
                    </button>
</div>
</div>
<!-- Dashboard Preview (Asymmetric Layout) -->
<div class="relative z-10 mt-20 w-full max-w-6xl mx-auto px-4 translate-y-12">
<div class="bg-surface-container-low/50 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-4 shadow-2xl">
<img alt="Luminal Freelance Platform Dashboard" class="w-full h-auto rounded-lg shadow-inner" data-alt="Futuristic data analytics dashboard UI with neon cyan and purple charts on dark glass background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgDXqayZuooAIpLxfoCpG3Tey3E38pFaNpfSFy7cZ6nsCLMpbtf_DtqjdTq9c7vSqqHC4kVqFDJZjYV8ZI0lKsWTEfWN6bPFFCutATaXlpkPPKK5LUqLgTTBQEnbnQCgKSUVnslsuHNSK4Ja7Xnzb6m2grvq6tiyONAUwF925CIB-nqyQ6vad4aDicfzJbYbN0t5KucFHmjb47_zOagCL46GiJ9J6hxlGODPf4vnPrVwM395nUFjSrEbuSdAosl4bvqhJBOzc6_v0e"/>
</div>
</div>
</section>
<!-- How It Works Section -->
<section class="py-32 bg-surface-container-low relative">
<div class="max-w-7xl mx-auto px-8">
<div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
<div>
<h2 class="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight mb-4">Programmable Trust.</h2>
<p class="text-on-surface-variant max-w-md">Our flow eliminates disputes by making task completion a mathematical certainty.</p>
</div>
<div class="text-primary font-headline text-8xl opacity-10 font-black">01 // 04</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
<!-- Step 1 -->
<div class="p-8 bg-surface-container rounded-xl border-l-2 border-primary group hover:bg-surface-container-high transition-all">
<span class="material-symbols-outlined text-primary mb-6 text-4xl">add_task</span>
<h3 class="text-xl font-headline font-bold text-on-surface mb-3">Create &amp; Fund</h3>
<p class="text-sm text-on-surface-variant leading-relaxed">Define parameters and lock capital into the secure Luminal Vault.</p>
</div>
<!-- Step 2 -->
<div class="p-8 bg-surface-container rounded-xl border-l-2 border-secondary group hover:bg-surface-container-high transition-all">
<span class="material-symbols-outlined text-secondary mb-6 text-4xl">terminal</span>
<h3 class="text-xl font-headline font-bold text-on-surface mb-3">Work</h3>
<p class="text-sm text-on-surface-variant leading-relaxed">Freelancers execute tasks within the integrated agent-monitored environment.</p>
</div>
<!-- Step 3 -->
<div class="p-8 bg-surface-container rounded-xl border-l-2 border-tertiary group hover:bg-surface-container-high transition-all">
<span class="material-symbols-outlined text-tertiary mb-6 text-4xl">fact_check</span>
<h3 class="text-xl font-headline font-bold text-on-surface mb-3">AI Verifies</h3>
<p class="text-sm text-on-surface-variant leading-relaxed">Autonomous agents validate output against the initial task signature.</p>
</div>
<!-- Step 4 -->
<div class="p-8 bg-surface-container rounded-xl border-l-2 border-primary-dim group hover:bg-surface-container-high transition-all">
<span class="material-symbols-outlined text-primary-dim mb-6 text-4xl">payments</span>
<h3 class="text-xl font-headline font-bold text-on-surface mb-3">Automatic Payout</h3>
<p class="text-sm text-on-surface-variant leading-relaxed">Instant release of funds upon verification. No manual approvals needed.</p>
</div>
</div>
</div>
</section>
<!-- For Who Section (Asymmetric Bento) -->
<section class="py-32">
<div class="max-w-7xl mx-auto px-8">
<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
<!-- Clients -->
<div class="md:col-span-7 bg-surface-container rounded-2xl p-12 overflow-hidden relative group">
<div class="absolute top-0 right-0 p-8 opacity-20 text-9xl font-black text-on-surface-variant">CLIENT</div>
<div class="relative z-10">
<h2 class="text-3xl font-headline font-bold text-on-surface mb-6">For Global <span class="text-primary">Architects</span></h2>
<p class="text-lg text-on-surface-variant mb-8 max-w-sm">Scale your engineering and creative teams without the overhead of manual project management. Pay only for verified results.</p>
<ul class="space-y-4 mb-10">
<li class="flex items-center gap-3 text-on-surface">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                                    Zero Management Overhead
                                </li>
<li class="flex items-center gap-3 text-on-surface">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                                    100% Capital Security
                                </li>
</ul>
<button class="font-bold text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                                Post a Task <span class="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
<!-- Workers -->
<div class="md:col-span-5 bg-secondary-container/10 rounded-2xl p-12 relative overflow-hidden border border-secondary/20">
<div class="relative z-10">
<h2 class="text-3xl font-headline font-bold text-on-surface mb-6">For High-End <span class="text-secondary">Executors</span></h2>
<p class="text-lg text-on-surface-variant mb-8">Stop chasing invoices. Focus on the craft and let the code handle your compensation.</p>
<div class="bg-surface-container-high/40 p-6 rounded-xl border border-outline-variant/10 mb-8 backdrop-blur-md">
<div class="flex justify-between items-center mb-4">
<span class="text-xs uppercase tracking-widest text-on-surface-variant">Current Earning Pot</span>
<span class="px-2 py-1 bg-tertiary-container/20 text-tertiary text-[10px] font-bold rounded">LIVE</span>
</div>
<div class="text-3xl font-headline font-bold text-on-surface">$12,480.00</div>
</div>
<button class="w-full py-4 bg-secondary text-on-secondary font-bold rounded-lg hover:shadow-lg transition-all">
                                Find Tasks
                            </button>
</div>
</div>
</div>
</div>
</section>
<!-- Key Features Section (Bento Grid) -->
<section class="py-32 bg-surface-dim">
<div class="max-w-7xl mx-auto px-8">
<div class="text-center mb-20">
<h2 class="text-4xl md:text-6xl font-headline font-bold tracking-tighter mb-6">Built on Intelligence.</h2>
<p class="text-on-surface-variant max-w-xl mx-auto">The infrastructure layer for the next generation of digital labor.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Feature 1 -->
<div class="md:col-span-2 h-[400px] relative rounded-2xl overflow-hidden group">
<img class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Abstract visualization of neural networks and glowing data streams in deep blue and purple hues" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJrCmcSqoMXePfK_9PI25elqk_bXi78U-gCHxVtYT5K0iwwX2RVnZQ6rOyQsamBFJOe39PwDOimy0U0yjkda4TtMqIngstGklQgTG9lvtezXl72d1bMB7yhc14OtJIG6cJ6prxrulNagAZjas_H5v8NKrNlh_jSLOFzja5HfK6VWKZcyauXsrXHxZVFJvZvMTdtcty8r-_9oKdr5NIeZT8cMe0czVt55Ik9V997dJFxJiPiwl2wv3qRDL6PWWfyu_5kLFk0VStLCiY"/>
<div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent"></div>
<div class="absolute bottom-0 left-0 p-10">
<h3 class="text-3xl font-headline font-bold text-on-surface mb-4">AI-Powered Verification</h3>
<p class="text-on-surface-variant max-w-md">Our multi-agent consensus model analyzes code, assets, and documentation to ensure requirements are met with 99.9% accuracy.</p>
</div>
</div>
<!-- Feature 2 -->
<div class="h-[400px] bg-surface-container-high rounded-2xl p-10 flex flex-col justify-between border border-outline-variant/10">
<span class="material-symbols-outlined text-primary text-5xl">verified_user</span>
<div>
<h3 class="text-2xl font-headline font-bold text-on-surface mb-4">Guaranteed Payouts</h3>
<p class="text-on-surface-variant">Escrow-less architecture that leverages programmable liquidity. The moment you finish, you are paid. Period.</p>
</div>
</div>
</div>
</div>
</section>
<!-- Final CTA Section -->
<section class="py-40 relative overflow-hidden">
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30">
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full animate-pulse"></div>
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-secondary/10 rounded-full"></div>
</div>
<div class="max-w-4xl mx-auto px-8 relative z-10 text-center">
<h2 class="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter mb-12">Ready to enter the <br/><span class="text-primary">Luminal</span> economy?</h2>
<div class="flex flex-col sm:flex-row gap-6 justify-center">
<button class="px-10 py-5 bg-primary text-on-primary-fixed font-bold rounded-lg text-xl hover:shadow-[0_0_40px_rgba(143,245,255,0.4)] transition-all">
                        Start Creating Tasks
                    </button>
<button class="px-10 py-5 bg-surface-container-highest text-on-surface font-bold rounded-lg text-xl border border-outline-variant/30 hover:bg-surface-bright transition-all">
                        Start Earning
                    </button>
</div>
<p class="mt-12 text-on-surface-variant font-label uppercase tracking-widest text-xs">No Credit Card Required • AI-Verified Status in 2 Minutes</p>
</div>
</section>
</main>
<!-- Footer -->
<Footer />