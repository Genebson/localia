<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import AuthModal from '$lib/components/AuthModal.svelte';
	import { authModalOpen, closeAuthModal } from '$lib/stores/authModal';
	import { auth } from '$lib/stores/auth';
	import { propertiesStore } from '$lib/stores/properties';
	import { onMount } from 'svelte';

	onMount(() => {
		propertiesStore.load();
		auth.init();
	});
</script>

<svelte:head>
	<link
		rel="icon"
		href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%231E5F4A' rx='15' width='100' height='100'/><path d='M50 25L20 45V75L50 65L80 75V45L50 25Z' fill='white'/></svg>"
	/>
</svelte:head>

{#if $authModalOpen}
	<AuthModal isOpen={true} onClose={closeAuthModal} />
{/if}

<div class="min-h-screen flex flex-col">
	<Header />
	<main class="flex-1 pt-16 md:pt-20">
		<slot />
	</main>
	<Footer />
</div>
