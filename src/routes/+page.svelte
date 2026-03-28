<script lang="ts">
	import {
		Filter,
		Building2,
		TrendingUp,
		Shield,
		ChevronDown,
		MapPin,
		LayoutGrid,
		Map
	} from 'lucide-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import FiltersSidebar from '$lib/components/FiltersSidebar.svelte';
	import PropertyCard from '$lib/components/PropertyCard.svelte';
	import MapView from '$lib/components/MapView.svelte';
	import { authModalOpen } from '$lib/stores/authModal';
	import { auth, isAgent } from '$lib/stores/auth';
	import {
		filters,
		filteredProperties,
		totalProperties,
		syncFiltersToUrl
	} from '$lib/stores/filters';
	import { onMount } from 'svelte';
	import { loadHomepageProperties } from '$lib/api/homepage';

	let filtersOpen = false;
	let viewMode: 'grid' | 'map' = 'grid';
	let lastUrl = '';

	$: if (typeof window !== 'undefined' && $page.url.href !== lastUrl) {
		lastUrl = $page.url.href;
		filters.initFromUrl($page.url);
	}

	onMount(() => {
		loadHomepageProperties();
	});
</script>

<section
	class="relative bg-gradient-to-br from-primary via-primary to-primary-light overflow-hidden"
>
	<div class="absolute inset-0 opacity-10">
		<div class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
		<div class="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
	</div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
		<div class="text-center mb-8 md:mb-12">
			<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
				Encontrá tu próximo hogar
			</h1>
			<p class="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
				Miles de propiedades te esperan. Casas, departamentos y más en las mejores zonas.
			</p>
		</div>

		<SearchBar />

		<div class="flex flex-wrap justify-center gap-4 mt-8">
			<button
				on:click={() => {
					filters.setPropertyType(
						$filters.propertyType === 'apartment' ? '' : 'apartment'
					);
					syncFiltersToUrl();
					document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
				}}
				class="px-6 py-2.5 {$filters.propertyType === 'apartment'
					? 'bg-white text-primary'
					: 'bg-white/10 text-white'} hover:bg-white/20 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
			>
				<Building2 class="w-4 h-4" />
				Departamentos
			</button>
			<button
				on:click={() => {
					filters.setPropertyType($filters.propertyType === 'house' ? '' : 'house');
					syncFiltersToUrl();
					document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
				}}
				class="px-6 py-2.5 {$filters.propertyType === 'house'
					? 'bg-white text-primary'
					: 'bg-white/10 text-white'} hover:bg-white/20 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
			>
				<TrendingUp class="w-4 h-4" />
				Casas
			</button>
			<button
				on:click={() => {
					filters.setPropertyType($filters.propertyType === 'terrain' ? '' : 'terrain');
					syncFiltersToUrl();
					document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
				}}
				class="px-6 py-2.5 {$filters.propertyType === 'terrain'
					? 'bg-white text-primary'
					: 'bg-white/10 text-white'} hover:bg-white/20 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
			>
				<Shield class="w-4 h-4" />
				Terrenos
			</button>
		</div>
	</div>
</section>

{#if !$auth}
	<section class="bg-accent/10 border-y border-accent/20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="flex flex-col md:flex-row items-center justify-between gap-4">
				<div class="flex items-center gap-3">
					<div class="p-3 bg-accent/20 rounded-xl">
						<Building2 class="w-6 h-6 text-accent" />
					</div>
					<div>
						<p class="font-semibold text-gray-900">¿Sos agente inmobiliario?</p>
						<p class="text-sm text-gray-600">
							Publicá tus propiedades y llegá a miles de compradores
						</p>
					</div>
				</div>
				<button
					on:click={() => authModalOpen.set(true)}
					class="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
				>
					Quiero publicar mi propiedad
					<ChevronDown class="w-4 h-4 rotate-[-90deg]" />
				</button>
			</div>
		</div>
	</section>
{/if}

<section id="properties" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">Propiedades</h2>
			<p class="text-gray-500 mt-1">
				{$filteredProperties.length}
				{$filteredProperties.length === 1
					? 'propiedad encontrada'
					: 'propiedades encontradas'}
				{#if $filteredProperties.length !== $totalProperties}
					<span class="text-primary">(de {$totalProperties} total)</span>
				{/if}
			</p>
		</div>
		<div class="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
			<button
				on:click={() => (filtersOpen = true)}
				class="lg:hidden flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
				title="Filtros"
			>
				<Filter class="w-4 h-4" />
				<span class="text-sm font-medium">Filtros</span>
			</button>
			<button
				on:click={() => (viewMode = 'grid')}
				class="p-2 transition-colors {viewMode === 'grid'
					? 'bg-primary text-white'
					: 'text-gray-500 hover:bg-gray-50'}"
				title="Grid view"
			>
				<LayoutGrid class="w-4 h-4" />
			</button>
			<button
				on:click={() => (viewMode = 'map')}
				class="p-2 transition-colors {viewMode === 'map'
					? 'bg-primary text-white'
					: 'text-gray-500 hover:bg-gray-50'}"
				title="Map view"
			>
				<Map class="w-4 h-4" />
			</button>
		</div>
	</div>

	<div class="flex gap-8">
		<FiltersSidebar isOpen={filtersOpen} onClose={() => (filtersOpen = false)} />

		<div class="flex-1">
			{#if $filteredProperties.length === 0}
				<div class="text-center py-16">
					<div
						class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
					>
						<MapPin class="w-8 h-8 text-gray-400" />
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">No hay propiedades</h3>
					<p class="text-gray-500 mb-4">Intentá con otros filtros o buscá en otra zona</p>
					<button
						on:click={() => filters.reset()}
						class="text-primary hover:text-primary-light font-medium"
					>
						Limpiar filtros
					</button>
				</div>
			{:else if viewMode === 'map'}
				<div class="h-[600px] rounded-xl overflow-hidden border border-gray-200">
					<MapView properties={$filteredProperties} />
				</div>
			{:else}
				<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
					{#each $filteredProperties as property (property.id)}
						<PropertyCard {property} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>

<section class="bg-gray-50 border-t">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="text-center mb-12">
			<h2 class="text-2xl font-bold text-gray-900 mb-2">¿Por qué elegir Localia?</h2>
			<p class="text-gray-500">Las ventajas de buscar con nosotros</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="text-center">
				<div
					class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
				>
					<Shield class="w-7 h-7 text-primary" />
				</div>
				<h3 class="font-semibold text-lg text-gray-900 mb-2">Propiedades verificadas</h3>
				<p class="text-gray-500 text-sm">
					Todas las propiedades pasan por un proceso de verificación antes de publicarse.
				</p>
			</div>

			<div class="text-center">
				<div
					class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
				>
					<MapPin class="w-7 h-7 text-primary" />
				</div>
				<h3 class="font-semibold text-lg text-gray-900 mb-2">Ubicaciones privilegiadas</h3>
				<p class="text-gray-500 text-sm">
					Encontrá propiedades en los barrios y zonas más cotizados del mercado.
				</p>
			</div>

			<div class="text-center">
				<div
					class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
				>
					<TrendingUp class="w-7 h-7 text-primary" />
				</div>
				<h3 class="font-semibold text-lg text-gray-900 mb-2">Precios competitivos</h3>
				<p class="text-gray-500 text-sm">
					Compará precios de mercado y encontrá las mejores ofertas del momento.
				</p>
			</div>
		</div>
	</div>
</section>
