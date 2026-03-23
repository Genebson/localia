<script lang="ts">
	import { MapPin, Grid3X3, Users } from 'lucide-svelte';
	import { loteos } from '$lib/data/masterplans';
	import { base } from '$app/paths';

	function getAvailableCount(loteo: typeof loteos[0]) {
		return loteo.parcels.filter(p => p.status === 'available').length;
	}

	function getPriceRange(loteo: typeof loteos[0]) {
		const available = loteo.parcels.filter(p => p.status === 'available');
		if (available.length === 0) return 'Sin disponibilidad';
		const prices = available.map(p => p.price);
		const min = Math.min(...prices);
		const max = Math.max(...prices);
		if (min === max) return `USD ${min.toLocaleString()}`;
		return `USD ${min.toLocaleString()} - ${max.toLocaleString()}`;
	}
</script>

<svelte:head>
	<title>Masterplans | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="text-center mb-12">
			<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loteos y Desarrollos</h1>
			<p class="text-gray-500 text-lg max-w-2xl mx-auto">
				Encontrá el lote perfecto para tu próximo hogar. Consultá disponibilidad en tiempo real.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each loteos as loteo}
				<a
					href="{base}/masterplan/{loteo.id}"
					class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
				>
					<div class="aspect-[16/9] overflow-hidden">
						<img
							src={loteo.image}
							alt={loteo.name}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						/>
					</div>
					<div class="p-5">
						<h2 class="text-lg font-bold text-gray-900 mb-2">{loteo.name}</h2>
						<div class="flex items-center gap-1 text-gray-500 text-sm mb-3">
							<MapPin class="w-4 h-4" />
							<span>{loteo.location}</span>
						</div>
						<p class="text-gray-600 text-sm mb-4 line-clamp-2">{loteo.description}</p>
						<div class="flex items-center justify-between pt-4 border-t border-gray-100">
							<div class="flex items-center gap-4 text-sm">
								<div class="flex items-center gap-1">
									<Grid3X3 class="w-4 h-4 text-gray-400" />
									<span class="font-medium text-green-600">{getAvailableCount(loteo)} disponibles</span>
								</div>
							</div>
							<span class="text-sm font-semibold text-accent">{getPriceRange(loteo)}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>

		{#if loteos.length === 0}
			<div class="text-center py-16">
				<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<Grid3X3 class="w-8 h-8 text-gray-400" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">No hay loteos disponibles</h3>
				<p class="text-gray-500">Próximamente tendremos nuevos desarrollos.</p>
			</div>
		{/if}
	</div>
</main>
