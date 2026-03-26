<script lang="ts">
	import { Search, Globe, MapPin, Building2, Phone, Mail, CheckCircle } from 'lucide-svelte';
	import { allAgencies, searchAllAgencies, agenciesStore } from '$lib/stores/agencies';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	let searchQuery = '';
	let filteredAgencies = $allAgencies;

	onMount(() => {
		agenciesStore.init();
	});

	$: filteredAgencies = searchQuery ? searchAllAgencies(searchQuery) : $allAgencies;
</script>

<svelte:head>
	<title>Inmobiliarias | Localia</title>
</svelte:head>

<main class="pt-20 md:pt-24 min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-gray-900 mb-4">Inmobiliarias en Mercedes</h1>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				Encontrá las mejores inmobiliarias de la zona. Todas las agencias verificadas y
				listadas con sus propiedades.
			</p>
		</div>

		<div class="mb-8">
			<div class="max-w-xl mx-auto relative">
				<Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Buscar inmobiliarias por nombre o descripción..."
					class="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-lg"
				/>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredAgencies as agency}
				<a
					href="{base}/inmobiliarias/{agency.slug}"
					class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
				>
					<div class="p-6">
						<div class="flex items-start gap-4 mb-4">
							{#if agency.logo}
								<img
									src={agency.logo}
									alt={agency.name}
									class="w-16 h-16 object-contain rounded-lg"
								/>
							{:else}
								<div
									class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center"
								>
									<Building2 class="w-8 h-8 text-primary" />
								</div>
							{/if}
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2">
									<h3 class="font-semibold text-gray-900 truncate">
										{agency.name}
									</h3>
									{#if agency.verified}
										<CheckCircle class="w-4 h-4 text-green-500 flex-shrink-0" />
									{/if}
								</div>
								<p class="text-sm text-gray-500 flex items-center gap-1">
									<MapPin class="w-3 h-3" />
									{agency.location}
								</p>
							</div>
						</div>

						<p class="text-sm text-gray-600 mb-4 line-clamp-2">{agency.description}</p>

						<div
							class="flex items-center justify-between pt-4 border-t border-gray-100"
						>
							<span class="text-sm font-medium text-primary">
								{agency.propertyCount}
								{agency.propertyCount === 1 ? 'propiedad' : 'propiedades'}
							</span>
							{#if agency.website}
								<a
									href={agency.website}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-1 text-sm text-accent font-medium hover:underline"
									on:click|stopPropagation
								>
									<Globe class="w-4 h-4" />
									Sitio Web
								</a>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>

		{#if filteredAgencies.length === 0}
			<div class="text-center py-16">
				<Building2 class="w-16 h-16 text-gray-300 mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-gray-900 mb-2">
					No se encontraron inmobiliarias
				</h3>
				<p class="text-gray-500">Probá con otros términos de búsqueda</p>
			</div>
		{/if}
	</div>
</main>
