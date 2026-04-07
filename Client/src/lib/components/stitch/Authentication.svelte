<script lang="ts">
import Footer from '../common/Footer.svelte';

</script>

<svelte:head>
  <title>Luminal Freelance | Authentication</title>
</svelte:head>

<div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
<div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-container/10 blur-[120px]"></div>
<div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-container/5 blur-[120px]"></div>
</div>
<main class="relative z-10 flex-grow flex items-center justify-center p-6">
<div class="w-full max-w-[480px]">
<div class="mb-12 text-center">
<h1 class="font-headline text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                    Luminal Freelance
                </h1>
<p class="text-on-surface-variant text-sm font-medium tracking-wide uppercase">AI-Verified Talent Network</p>
</div>
<div class="surface-container rounded-lg shadow-2xl shadow-surface-container-lowest/40 border border-outline-variant/10 p-8 md:p-12 relative overflow-hidden">
<div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
<div class="flex p-1 bg-surface-container-low rounded-lg mb-8">
<button class="flex-1 py-2.5 text-sm font-bold font-headline transition-all rounded-lg bg-surface-container-high text-primary shadow-sm">
                        Login
                    </button>
<button class="flex-1 py-2.5 text-sm font-bold font-headline transition-all rounded-lg text-on-surface-variant hover:text-on-surface">
                        Register
                    </button>
</div>
<form class="space-y-6">
<div class="space-y-1.5">
<label class="text-xs font-bold font-headline text-on-surface-variant uppercase tracking-widest ml-1">Email Address</label>
<div class="relative group">
<div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
<span class="material-symbols-outlined text-xl">alternate_email</span>
</div>
<input class="w-full bg-surface-container-low border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-primary/40 transition-all outline-none" placeholder="name@domain.com" type="email"/>
</div>
</div>
<div class="space-y-1.5">
<div class="flex justify-between items-center px-1">
<label class="text-xs font-bold font-headline text-on-surface-variant uppercase tracking-widest">Password</label>
<a class="text-[10px] font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest" href="#">Forgot?</a>
</div>
<div class="relative group">
<div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
<span class="material-symbols-outlined text-xl">lock_open</span>
</div>
<input class="w-full bg-surface-container-low border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-primary/40 transition-all outline-none" placeholder="••••••••" type="password"/>
</div>
</div>
<div class="space-y-1.5">
<label class="text-xs font-bold font-headline text-on-surface-variant uppercase tracking-widest ml-1">Wallet Address <span class="text-[10px] lowercase font-normal opacity-60">(Optional)</span></label>
<div class="relative group">
<div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
<span class="material-symbols-outlined text-xl">account_balance_wallet</span>
</div>
<input class="w-full bg-surface-container-low border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-primary/40 transition-all outline-none" placeholder="0x..." type="text"/>
</div>
</div>
<div class="pt-4">
<button class="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-110 active:scale-[0.98] transition-all py-4 rounded-lg text-on-primary-fixed font-headline font-bold text-base tracking-tight shadow-lg shadow-primary/20" type="submit">
                            Continue
                        </button>
</div>
</form>
<div class="mt-8 pt-8 border-t border-outline-variant/10 flex flex-col gap-4">
<p class="text-center text-xs text-on-surface-variant">Or continue with</p>
<div class="grid grid-cols-2 gap-4">
<button class="flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container-high py-3 rounded-lg border border-outline-variant/10 transition-colors">
<img alt="Google" class="w-5 h-5" data-alt="clean minimalist google logo icon on transparent background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8RAXAY2SWlahhm3QgC1ndwJRWmul0Yf2YsurME8_FnSmsqZMYOK2Whd0XfmCkDRTMQsUI4FG1Nek5Ht_GADVWVd12g-Ub-d2zb_xCNiYiQnow0N2IihMpeaXCaJBK24xkJlQCjZ1xoos7egqP59finXIHt71SDzLaE_k3lR_skjT6uvj9bh5UiN8-38pm91OXON5-Y4Ql-7JzaiZbHIXhSB3Z-aQENSVNyFccwJFblEaD9YR1t4r8bJMhLUG4D9buiVxcW4Otlah3"/>
<span class="text-sm font-bold font-headline">Google</span>
</button>
<button class="flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container-high py-3 rounded-lg border border-outline-variant/10 transition-colors">
<span class="material-symbols-outlined text-xl" data-weight="fill">terminal</span>
<span class="text-sm font-bold font-headline">GitHub</span>
</button>
</div>
</div>
</div>
<div class="mt-12 flex flex-col items-center gap-4">
<div class="flex gap-8">
<a class="text-[10px] text-on-surface-variant hover:text-primary transition-colors uppercase tracking-[0.2em] font-bold" href="#">Privacy Policy</a>
<a class="text-[10px] text-on-surface-variant hover:text-primary transition-colors uppercase tracking-[0.2em] font-bold" href="#">Terms of Service</a>
</div>
<div class="flex items-center gap-2 px-3 py-1 bg-tertiary-container/10 border border-tertiary/20 rounded-full">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(155,255,206,0.6)]"></span>
<span class="text-[10px] font-bold text-tertiary uppercase tracking-widest">System Status: Operational</span>
</div>
</div>
</div>
</main>
<Footer />