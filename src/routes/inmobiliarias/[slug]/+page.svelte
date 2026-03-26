<script lang="ts">
	import { page } from '$app/stores';
	import { getAgencyById, allAgencies, agenciesStore } from '$lib/stores/agencies';
	import { Globe, MapPin, Phone, Mail, Building2, ArrowLeft, CheckCircle } from 'lucide-svelte';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	onMount(() => {
		agenciesStore.init();
	});

	$: slug = $page.params.slug;
	$: agency = getAgencyById(slug) || $allAgencies.find((a) => a.slug === slug);
</script>

<svelte:head>
	<title>{agency?.name || 'Inmobiliaria'} | Localia</title>
</svelte:head>

<main class="pt-20 md:pt-24 min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<a
			href="{base}/inmobiliarias"
			class="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-colors"
		>
			<ArrowLeft class="w-4 h-4" />
			Volver a Inmobiliarias
		</a>

		{#if agency}
			<div class="bg-white rounded-2xl shadow-sm overflow-hidden">
				<div class="p-6 sm:p-8">
					<div
						class="flex flex-col sm:flex-row sm:items-start sm:gap-6 gap-4 mb-6 sm:mb-8"
					>
						{#if agency.logo}
							<img
								src={agency.logo}
								alt={agency.name}
								class="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl flex-shrink-0"
							/>
						{:else}
							<div
								class="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"
							>
								<Building2 class="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
							</div>
						{/if}
						<div class="flex-1">
							<div class="flex items-center gap-3 mb-2">
								<h1 class="text-2xl font-bold text-gray-900">{agency.name}</h1>
								{#if agency.verified}
									<CheckCircle class="w-5 h-5 text-green-500" />
								{/if}
							</div>
							<p class="text-gray-500 flex items-center gap-1 mb-4">
								<MapPin class="w-4 h-4" />
								{agency.location}
							</p>
							<div class="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 gap-3">
								{#if agency.website}
									<a
										href={agency.website}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm w-full sm:w-auto"
									>
										<Globe class="w-4 h-4" />
										Sitio Web
									</a>
								{/if}
								{#if agency.phone}
									<a
										href="tel:{agency.phone}"
										class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm w-full sm:w-auto"
									>
										<Phone class="w-4 h-4" />
										{agency.phone}
									</a>
								{/if}
								{#if agency.email}
									<a
										href="mailto:{agency.email}"
										class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm w-full sm:w-auto"
									>
										<Mail class="w-4 h-4 flex-shrink-0" />
										<span class="truncate">{agency.email}</span>
									</a>
								{/if}
							</div>
						</div>
					</div>

					<div class="border-t border-gray-100 pt-8">
						<h2 class="text-lg font-semibold text-gray-900 mb-4">
							Sobre la inmobiliaria
						</h2>
						<p class="text-gray-600 leading-relaxed">{agency.description}</p>
					</div>

					<div class="border-t border-gray-100 pt-8 mt-8">
						<div class="flex items-center justify-between">
							<h2 class="text-lg font-semibold text-gray-900">Propiedades</h2>
							<span class="text-primary font-semibold"
								>{agency.propertyCount}
								{agency.propertyCount === 1 ? 'propiedad' : 'propiedades'}</span
							>
						</div>
						<p class="text-gray-500 mt-2">
							Ver todas las propiedades de {agency.name} en nuestro directorio.
						</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="text-center py-16">
				<Building2 class="w-16 h-16 text-gray-300 mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Inmobiliaria no encontrada</h3>
				<p class="text-gray-500 mb-4">La inmobiliaria que buscas no existe.</p>
				<a
					href="{base}/inmobiliarias"
					class="inline-flex items-center gap-2 text-primary hover:underline"
				>
					<ArrowLeft class="w-4 h-4" />
					Volver a Inmobiliarias
				</a>
			</div>
		{/if}
	</div>
</main>
