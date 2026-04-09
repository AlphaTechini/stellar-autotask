import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

function manualChunks(id: string) {
	if (!id.includes('node_modules')) {
		return undefined;
	}

	if (id.includes('@stellar/stellar-sdk')) {
		return 'stellar-sdk';
	}

	if (id.includes('@stellar/freighter-api')) {
		return 'freighter';
	}

	if (id.includes('/svelte/') || id.includes('@sveltejs')) {
		return 'svelte';
	}

	return 'vendor';
}

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	build: {
		chunkSizeWarningLimit: 1200,
		rollupOptions: {
			output: {
				manualChunks
			}
		}
	}
});
