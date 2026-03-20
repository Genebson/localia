<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Heart, Bed, Bath, Maximize, MapPin, Building2, Calendar, Share2, ArrowLeft, Check } from 'lucide-svelte';
	import { allProperties } from '$lib/stores/properties';
	import { favorites } from '$lib/stores/favorites';
	import { viewed } from '$lib/stores/viewed';

	$: property = $allProperties.find(p => p.id === $page.params.id);
	$: isFavorite = property ? $favorites.includes(property.id) : false;

	onMount(() => {
		if (property) {
			viewed.add(property.id);
		}
	});

	function toggleFavorite() {
		if (property) {
			favorites.toggle(property.id);
		}
	}

	function formatPrice(price: number, currency: string): string {
		if (currency === 'USD') {
			return `USD ${price.toLocaleString('en-US')}`;
		}
		return `$ ${price.toLocaleString('es-AR')}`;
	}

	const mockAgent = {
		name: 'María González',
		phone: '+54 11 5555 1234',
		email: 'maria.gonzalez@localia.com',
		photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
		matricula: 'COL-2020-45678'
	};

	const mockFeatures = [
		'Aire acondicionado',
		'Calefacción central',
		'Piso de madera',
		'Balcón',
		'Cochera cubierta',
		'Pileta',
		'Quincho',
		'Seguridad 24hs'
	];

	const mockDescription = `Exclusivo ${property?.title.toLowerCase()} en ubicación privilegiada.

Esta propiedad ofrece una combinación perfecta de comodidad y estilo. Con una arquitectura moderna y materiales de primera calidad, cada espacio ha sido diseñado para maximizar el confort.

La propiedad cuenta con ambientes luminosos y bien distribuidos, идеально para familias que buscan calidad de vida. La cocina está completamente equipada con appliances de última generación.

El edificio ofrece amenities de primer nivel incluyendo seguridad las 24 horas, gimnasio, y áreas comunes landscapadas. La ubicación cuenta con fácil acceso a transporte público y servicios.`;
</script>

<svelte:head>
	<title>{property?.title || 'Propiedad'} | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	{#if property}
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<a href="/" class="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6">
				<ArrowLeft class="w-4 h-4" />
				Volver a propiedades
			</a>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div class="lg:col-span-2 space-y-6">
					<div class="bg-white rounded-2xl overflow-hidden shadow-sm">
						<div class="relative aspect-[16/9]">
							<img
								src={property.image}
								alt={property.title}
								class="w-full h-full object-cover"
							/>
							<button
								on:click={toggleFavorite}
								class="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
							>
								<Heart class="w-6 h-6 {isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}" />
							</button>
							<div class="absolute bottom-4 left-4 flex gap-2">
								<span class="px-3 py-1 bg-primary text-white text-sm font-medium rounded">
									{property.operation === 'buy' ? 'Venta' : 'Alquiler'}
								</span>
								{#if property.featured}
									<span class="px-3 py-1 bg-accent text-white text-sm font-medium rounded">
										Destacado
									</span>
								{/if}
							</div>
						</div>

						<div class="p-6">
							<div class="flex items-start justify-between gap-4 mb-4">
								<div>
									<h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
										{property.title}
									</h1>
									<div class="flex items-center gap-2 text-gray-500">
										<MapPin class="w-5 h-5" />
										<span>{property.location}</span>
										<span class="text-gray-300">•</span>
										<span>{property.address}</span>
									</div>
								</div>
								<button class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
									<Share2 class="w-5 h-5 text-gray-500" />
								</button>
							</div>

							<div class="flex flex-wrap gap-4 py-4 border-y border-gray-100">
								{#if property.attributes.bedrooms > 0}
									<div class="flex items-center gap-2 text-gray-700">
										<Bed class="w-5 h-5 text-gray-400" />
										<span class="font-medium">{property.attributes.bedrooms}</span>
										<span class="text-gray-500">dormitorios</span>
									</div>
								{/if}
								<div class="flex items-center gap-2 text-gray-700">
									<Bath class="w-5 h-5 text-gray-400" />
									<span class="font-medium">{property.attributes.bathrooms}</span>
									<span class="text-gray-500">baños</span>
								</div>
								<div class="flex items-center gap-2 text-gray-700">
									<Maximize class="w-5 h-5 text-gray-400" />
									<span class="font-medium">{property.attributes.area}</span>
									<span class="text-gray-500">m² cubiertos</span>
								</div>
								<div class="flex items-center gap-2 text-gray-700">
									<Calendar class="w-5 h-5 text-gray-400" />
									<span class="font-medium">2020</span>
									<span class="text-gray-500">antigüedad</span>
								</div>
							</div>

							<div class="mt-6">
								<h2 class="text-lg font-semibold text-gray-900 mb-3">Descripción</h2>
								<p class="text-gray-600 leading-relaxed whitespace-pre-line">
									{mockDescription}
								</p>
							</div>

							<div class="mt-6">
								<h2 class="text-lg font-semibold text-gray-900 mb-3">Características</h2>
								<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
									{#each mockFeatures as feature}
										<div class="flex items-center gap-2 text-gray-600">
											<Check class="w-4 h-4 text-green-500" />
											<span class="text-sm">{feature}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="space-y-6">
					<div class="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
						<div class="text-center mb-6">
							<p class="text-3xl md:text-4xl font-bold text-primary">
								{property.priceLabel}
							</p>
							{#if property.operation === 'rent'}
								<p class="text-gray-500 text-sm mt-1">Precio por mes</p>
							{/if}
						</div>

						<div class="space-y-3">
							<button class="w-full py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors">
								Contactar agente
							</button>
							<button class="w-full py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-colors">
								Agendar visita
							</button>
						</div>

						<div class="mt-6 pt-6 border-t border-gray-100">
							<h3 class="font-semibold text-gray-900 mb-4">Tu agente</h3>
							<div class="flex items-center gap-4">
								<img
									src={mockAgent.photo}
									alt={mockAgent.name}
									class="w-14 h-14 rounded-full object-cover"
								/>
								<div>
									<p class="font-medium text-gray-900">{mockAgent.name}</p>
									<p class="text-sm text-gray-500">Agente matriculado</p>
									<p class="text-xs text-gray-400">{mockAgent.matricula}</p>
								</div>
							</div>
							<div class="mt-4 space-y-2">
								<a href="tel:{mockAgent.phone}" class="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
									{ mockAgent.phone }
								</a>
								<a href="mailto:{mockAgent.email}" class="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
									{ mockAgent.email }
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
			<div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
				<Building2 class="w-10 h-10 text-gray-400" />
			</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Propiedad no encontrada</h1>
			<p class="text-gray-500 mb-6">La propiedad que buscas no existe o fue eliminada.</p>
			<a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors">
				<ArrowLeft class="w-4 h-4" />
				Volver al inicio
			</a>
		</div>
	{/if}
</main>
