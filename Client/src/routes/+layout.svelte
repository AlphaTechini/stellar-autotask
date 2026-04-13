<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppShell from '$lib/components/common/AppShell.svelte';
	import { navigating } from '$app/state';

	let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if navigating.to}
	<div class="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-white">
		<div class="h-full w-1/3 animate-pulse bg-yellow-400"></div>
	</div>
{/if}

<AppShell session={data.session}>
	{@render children()}
</AppShell>
