import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@splidejs/splide/components': '@splidejs/splide/dist/js/splide.esm.js'
		}
	}
});
