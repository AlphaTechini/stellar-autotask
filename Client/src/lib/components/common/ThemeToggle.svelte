<script lang="ts">
	import { onMount } from 'svelte';

	type ThemeMode = 'light' | 'dark';

	let theme = $state<ThemeMode>('light');

	function applyTheme(nextTheme: ThemeMode) {
		theme = nextTheme;
		document.documentElement.classList.toggle('dark', nextTheme === 'dark');
		localStorage.setItem('stellar-autotask-theme', nextTheme);
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('stellar-autotask-theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const initialTheme = savedTheme === 'dark' || savedTheme === 'light'
			? savedTheme
			: prefersDark
				? 'dark'
				: 'light';

		applyTheme(initialTheme);
	});
</script>

<button
	type="button"
	class="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:border-yellow-500 hover:bg-yellow-100 dark:border-white/20 dark:bg-black dark:text-white dark:hover:border-yellow-400 dark:hover:bg-zinc-900"
	aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	onclick={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}
>
	<span class="material-symbols-outlined text-base">
		{theme === 'dark' ? 'light_mode' : 'dark_mode'}
	</span>
	<span class="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
</button>
