<script lang="ts">
import NavBar from '../common/NavBar.svelte';

import Footer from '../common/Footer.svelte';

</script>

<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-2xl shadow-cyan-900/10 flex justify-between items-center px-8 h-20 w-full">
<div class="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">
            Luminal Freelance
        </div>
<NavBar />
<div class="flex items-center gap-4">
<button class="p-2 text-slate-400 hover:bg-slate-800/50 transition-all rounded-full active:scale-95 duration-200">
<span class="material-symbols-outlined">notifications</span>
</button>
<div class="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30">
<img alt="User profile avatar" class="w-full h-full object-cover" data-alt="Close up portrait of a professional individual with soft cinematic lighting and a dark blurred background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe6iB8A-Y-0QzH0j1NOfAbWTrK9wwwhgOJsW5umDcyDGUMrUFblte1Q1GQTjvx6qSkevT-HXKwEtwZswmz-a61riYUs5q7qorApOmTxczHHPAixSKNFyp_PDuZjXELSMvuOhbKEdYXBevogTRKOFVgR4xb1VheUejIcODz2v3RmJ57n_Xu9Lc1G_JJVatnSBlu1lEsxkJY_UYdIxvb6sxPhLsPEB_OPUEZkJ5X9Ao-i5QpoDdpM9fKUrUdlRKrsendtWPI_G1YEiIe"/>
</div>
</div>
</header>
<!-- Side Navigation Bar -->
<aside class="h-screen w-64 fixed left-0 top-0 pt-24 bg-slate-900 flex flex-col border-r border-slate-800/50 hidden md:flex">
<div class="px-6 mb-8">
<div class="flex items-center gap-3">
<div class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
<span class="font-['Manrope'] text-sm text-slate-400">Freelancer Portal</span>
</div>
<div class="text-xs text-cyan-400 mt-1 uppercase tracking-widest font-bold">AI-Verified Status</div>
</div>
<nav class="flex-1 space-y-1 px-3">
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ease-in-out font-['Manrope'] text-sm" href="#">
<span class="material-symbols-outlined">assignment_turned_in</span>
                My Tasks
            </a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ease-in-out font-['Manrope'] text-sm" href="#">
<span class="material-symbols-outlined">payments</span>
                My Earnings
            </a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ease-in-out font-['Manrope'] text-sm" href="#">
<span class="material-symbols-outlined">analytics</span>
                Reports
            </a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ease-in-out font-['Manrope'] text-sm" href="#">
<span class="material-symbols-outlined">settings</span>
                Settings
            </a>
</nav>
<div class="p-6 space-y-4">
<div class="bg-slate-800/50 rounded-lg p-4 border border-outline-variant/10">
<p class="text-xs text-slate-400 mb-2">Unlock premium features</p>
<button class="w-full py-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-slate-950 font-bold text-xs rounded-lg active:scale-95 transition-transform">
                    Upgrade to Pro
                </button>
</div>
<div class="space-y-2">
<a class="flex items-center gap-3 text-slate-500 hover:text-cyan-400 text-xs transition-colors" href="#">
<span class="material-symbols-outlined text-sm">help</span>
                    Support
                </a>
<a class="flex items-center gap-3 text-slate-500 hover:text-cyan-400 text-xs transition-colors" href="#">
<span class="material-symbols-outlined text-sm">api</span>
                    API Status
                </a>
</div>
</div>
</aside>
<!-- Main Content Area -->
<main class="md:ml-64 pt-24 min-h-screen flex flex-col">
<div class="max-w-6xl mx-auto w-full px-8 py-8 flex-1">
<!-- Header Section -->
<div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
<div class="max-w-2xl">
<h1 class="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-surface mb-4">
                        Work Submission <span class="text-secondary">#7822</span>
</h1>
<p class="text-on-surface-variant text-lg leading-relaxed font-body">
                        Finalize your task contribution. Our AI verification system will scan for quality, tone consistency, and accuracy upon submission.
                    </p>
</div>
<div class="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
<span class="text-tertiary-dim flex items-center gap-2 text-sm font-bold tracking-wider">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">verified</span>
                        SYNTHOS CORE ACTIVE
                    </span>
</div>
</div>
<!-- Editor & Sidebar Grid -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
<!-- Main Editor Column -->
<div class="lg:col-span-8 space-y-8">
<!-- Text Editor Container -->
<div class="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/5 editorial-shadow">
<div class="bg-surface-container flex items-center justify-between px-6 py-3 border-b border-outline-variant/10">
<span class="text-xs font-bold text-on-surface-variant tracking-widest uppercase">Submission Workspace</span>
<div class="flex gap-4">
<span class="text-xs text-on-surface-variant">Word count: <span class="text-primary">1,240</span></span>
<span class="text-xs text-on-surface-variant">Last saved: <span class="text-on-surface">2m ago</span></span>
</div>
</div>
<div class="p-1">
<label class="sr-only" for="submission-content">Submission Content</label>
<textarea class="w-full h-[500px] bg-transparent border-none focus:ring-0 text-on-surface font-body leading-relaxed p-8 placeholder:text-outline/50 resize-none no-scrollbar" id="submission-content" placeholder="Start writing your submission here..."></textarea>
</div>
</div>
<!-- Notes Section -->
<div class="space-y-3">
<label class="text-sm font-headline font-medium text-on-surface-variant ml-1 flex items-center gap-2">
<span class="material-symbols-outlined text-sm">sticky_note_2</span>
                            Optional Worker Notes
                        </label>
<div class="bg-surface-container-low rounded-lg p-1 border border-outline-variant/5">
<textarea class="w-full h-24 bg-transparent border-none focus:ring-0 text-on-surface font-body text-sm p-4 placeholder:text-outline/30 resize-none" placeholder="Add any context or clarification for the reviewer..."></textarea>
</div>
</div>
<!-- Submit Actions -->
<div class="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-6">
<div class="flex items-center gap-4 text-on-surface-variant">
<span class="material-symbols-outlined text-secondary">info</span>
<p class="text-xs leading-tight max-w-xs">
                                By clicking submit, you agree that your work will be processed by our 
                                <span class="text-on-surface font-semibold">AI Neural Validator</span> for immediate feedback.
                            </p>
</div>
<div class="flex items-center gap-4 w-full md:w-auto">
<button class="px-8 py-4 text-on-surface font-bold hover:bg-surface-bright transition-all rounded-lg flex-1 md:flex-none">
                                Save Draft
                            </button>
<button class="px-10 py-4 bg-gradient-to-br from-primary to-secondary text-on-primary-fixed font-headline font-extrabold rounded-lg hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all flex-1 md:flex-none">
                                Submit Work
                            </button>
</div>
</div>
</div>
<!-- Reference Sidebar -->
<aside class="lg:col-span-4 space-y-6">
<div class="bg-surface-container rounded-xl p-6 border border-outline-variant/10 sticky top-28">
<h3 class="text-sm font-headline font-bold text-primary tracking-widest uppercase mb-6">Task Reference</h3>
<div class="space-y-6">
<!-- Requirements -->
<div class="space-y-3">
<h4 class="text-xs font-bold text-on-surface-variant">CORE REQUIREMENTS</h4>
<ul class="space-y-3">
<li class="flex gap-3 items-start">
<span class="material-symbols-outlined text-tertiary text-lg">check_circle</span>
<span class="text-sm text-on-surface/80">Tone must be authoritative but accessible.</span>
</li>
<li class="flex gap-3 items-start">
<span class="material-symbols-outlined text-tertiary text-lg">check_circle</span>
<span class="text-sm text-on-surface/80">Minimum length: 1,000 words.</span>
</li>
<li class="flex gap-3 items-start">
<span class="material-symbols-outlined text-outline text-lg">radio_button_unchecked</span>
<span class="text-sm text-on-surface/80">Include at least 3 case study citations.</span>
</li>
</ul>
</div>
<!-- Keywords -->
<div class="space-y-3">
<h4 class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Target Keywords</h4>
<div class="flex flex-wrap gap-2">
<span class="px-3 py-1 bg-surface-container-high rounded text-xs text-on-surface border border-outline-variant/10">Neural Interface</span>
<span class="px-3 py-1 bg-surface-container-high rounded text-xs text-on-surface border border-outline-variant/10">Bio-feedback</span>
<span class="px-3 py-1 bg-surface-container-high rounded text-xs text-on-surface border border-outline-variant/10">Latency</span>
<span class="px-3 py-1 bg-surface-container-high rounded text-xs text-on-surface border border-outline-variant/10">Edge Computing</span>
</div>
</div>
<!-- AI Assistant Preview -->
<div class="p-4 bg-secondary-container/10 border border-secondary/20 rounded-lg relative overflow-hidden group">
<div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-7xl text-secondary">auto_awesome</span>
</div>
<h4 class="text-xs font-bold text-secondary mb-2 flex items-center gap-2">
<span class="material-symbols-outlined text-sm">bolt</span>
                                    PRE-VALIDATION TIP
                                </h4>
<p class="text-xs text-on-secondary-container leading-relaxed">
                                    Your current draft lacks a summary conclusion. The AI model prioritizes structures with a clear "Key Takeaways" section.
                                </p>
</div>
</div>
<!-- Image Context -->
<div class="mt-8 rounded-lg overflow-hidden h-32 relative group">
<img alt="Abstract fluid art" class="w-full h-full object-cover" data-alt="Abstract flowing fluid textures in deep blues and purples with digital grain and neon cyan highlights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlOUNHAcSPN6XQ1dEuz9Os7ga2T3fvZ4_SpJ2kv4BbbBFnnB9hGSNtRRPLGY4mm_rVRYi6EACBfjRopq75s2nFpmaro1csCksVmUsppGqHWxU-oeYDo8v4evET7w4_H8BvBYFcTv-q3UpWL9d2nc5XSC3mrfztT0jBl3uReuA5XugyXLlQo2A7S4RckeQteGdLbXNmvvWwQqfoBf4G43qtPK9mhtXN8Lu6lFgEPMgKXaI7z5x6FePmZJSEFWA7jYMd64KrCHsKUKTi"/>
<div class="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
<button class="text-xs font-headline font-bold bg-slate-950/80 px-4 py-2 rounded backdrop-blur">View Asset Library</button>
</div>
</div>
</div>
</aside>
</div>
</div>
<!-- Footer -->
<Footer />
</main>