<script lang="ts">
	import { Heart, Bed, Bath, Maximize } from 'lucide-svelte';
	import { base } from '$app/paths';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';
	import type { Property } from '$lib/data/properties';
	import { favorites } from '$lib/stores/favorites';
	import { auth } from '$lib/stores/auth';
	import { authModalOpen } from '$lib/stores/authModal';

	export let property: Property;

	$: isFavorite = $favorites.includes(property.id);

	function toggleFavorite(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!$auth) {
			authModalOpen.set(true);
			return;
		}
		favorites.toggle(property.id);
	}

	function formatDate(isoString: string): string {
		const date = new Date(isoString);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		if (days === 0) return 'Hoy';
		if (days === 1) return 'Ayer';
		if (days < 7) return `Hace ${days} días`;
		if (days < 30) return `Hace ${Math.floor(days / 7)} sem`;
		return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
	}

	$: images =
		property.images && property.images.length > 0
			? property.images
			: property.image
				? [property.image]
				: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'];
</script>

<div
	class="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
>
	<a href="{base}/property/{property.id}" class="group block">
		<div class="relative aspect-[16/10] overflow-hidden bg-gray-100">
			<Splide
				options={{
					rewind: true,
					gap: '0.5rem',
					arrows: false,
					dots: true,
					autoplay: false,
					perPage: 1,
					cover: true,
					heightRatio: 0.625
				}}
				class="h-full"
			>
				{#each images as image}
					<SplideSlide>
						<img
							src={image}
							alt={property.title}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							loading="lazy"
						/>
					</SplideSlide>
				{/each}
			</Splide>
			{#if property.featured}
				<div
					class="absolute top-3 left-3 px-2 py-1 bg-accent text-white text-xs font-semibold rounded z-10"
				>
					Destacado
				</div>
			{/if}
			{#if property.aptoCredito}
				<div
					class="absolute top-3 {property.featured
						? 'left-3 mt-6'
						: 'left-3'} px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded z-10"
				>
					Apto Crédito
				</div>
			{/if}
			<div
				class="absolute bottom-3 left-3 px-2 py-1 bg-primary text-white text-xs font-medium rounded z-10"
			>
				{property.operation === 'buy' ? 'Venta' : 'Alquiler'}
			</div>
		</div>

		<div class="p-4">
			<div class="flex items-start justify-between gap-2 mb-2">
				<h3 class="font-semibold text-lg text-gray-900 leading-tight line-clamp-2">
					{property.title}
				</h3>
			</div>

			<p class="text-accent font-bold text-xl mb-1">
				{property.priceLabel}
			</p>

			<p class="text-gray-500 text-sm mb-3 flex items-center gap-1">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
				{property.location}
			</p>
			{#if property.publishedAt}
				<p class="text-gray-400 text-xs mb-3">{formatDate(property.publishedAt)}</p>
			{/if}

			<div class="flex items-center gap-4 pt-3 border-t border-gray-100">
				{#if property.attributes.bedrooms > 0}
					<div class="flex items-center gap-1.5 text-gray-600 text-sm">
						<Bed class="w-4 h-4" />
						<span
							>{property.attributes.bedrooms}
							{property.attributes.bedrooms === 1 ? 'dorm.' : 'dorm.'}</span
						>
					</div>
				{/if}
				<div class="flex items-center gap-1.5 text-gray-600 text-sm">
					<Bath class="w-4 h-4" />
					<span
						>{property.attributes.bathrooms}
						{property.attributes.bathrooms === 1 ? 'baño' : 'baños'}</span
					>
				</div>
				<div class="flex items-center gap-1.5 text-gray-600 text-sm">
					<Maximize class="w-4 h-4" />
					<span>{property.attributes.area} m²</span>
				</div>
			</div>
		</div>
	</a>
	<button
		on:click={toggleFavorite}
		class="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors z-10"
		aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
	>
		<Heart class="w-5 h-5 {isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}" />
	</button>
</div>
