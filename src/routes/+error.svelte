<script lang="ts">
	import { page } from '$app/stores';
	import { Home, Search, ArrowLeft, Compass } from 'lucide-svelte';
	import { base } from '$app/paths';

	$: status = $page.status;
	$: message = $page.error?.message || 'Página no encontrada';

	let searchQuery = '';

	const popularPages = [
		{ href: `${base}/`, label: 'Inicio', icon: Home },
		{ href: `${base}/masterplan`, label: 'Loteos y Desarrollos', icon: Compass },
		{ href: `${base}/tablero`, label: 'Tablero de búsquedas', icon: Search },
		{ href: `${base}/furnisher`, label: 'Furnisher', icon: Compass }
	];

	function handleSearch(e: KeyboardEvent) {
		if (e.key === 'Enter' && searchQuery.trim()) {
			window.location.href = `${base}/?q=${encodeURIComponent(searchQuery.trim())}`;
		}
	}
</script>

<svelte:head>
	<title>{status} | Localia</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
	<div class="max-w-2xl mx-auto px-4 py-16 text-center">
		<div class="mb-8">
			<div class="text-[12rem] md:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 leading-none select-none">
				{status}
			</div>
		</div>

		<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
			{status === 404 ? 'Página no encontrada' : 'Algo salió mal'}
		</h1>
		<p class="text-gray-500 text-lg mb-8 max-w-md mx-auto">
			{status === 404 
				? 'La página que buscas no existe, fue movida o eliminada.'
				: 'Ocurrió un error inesperado. Intentá de nuevo más tarde.'}
		</p>

		<div class="relative max-w-md mx-auto mb-10">
			<Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
			<input
				type="text"
				bind:value={searchQuery}
				on:keydown={handleSearch}
				placeholder="Buscar propiedades..."
				class="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-700"
			/>
		</div>

		<div class="mb-10">
			<p class="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">Páginas populares</p>
			<div class="flex flex-wrap justify-center gap-3">
				{#each popularPages as pg}
					<a
						href={pg.href}
						class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all hover:shadow-sm"
					>
						<svelte:component this={pg.icon} class="w-4 h-4 text-primary" />
						<span class="text-sm font-medium">{pg.label}</span>
					</a>
				{/each}
			</div>
		</div>

		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			<a
				href="{base}/"
				class="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
			>
				<Home class="w-5 h-5" />
				Volver al inicio
			</a>
			<button
				on:click={() => history.back()}
				class="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white hover:border-gray-300 transition-colors"
			>
				<ArrowLeft class="w-5 h-5" />
				Volver atrás
			</button>
		</div>

		<p class="mt-12 text-sm text-gray-400">
			¿Necesitás ayuda? <a href="mailto:soporte@localia.com" class="text-primary hover:underline">Contactá a soporte</a>
		</p>
	</div>
</main>
