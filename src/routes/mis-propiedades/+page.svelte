<script lang="ts">
	import {
		Building2,
		Edit,
		Trash2,
		Plus,
		Eye,
		EyeOff,
		MapPin,
		Bed,
		Bath,
		Maximize,
		Globe,
		EyeOff as UnpublishIcon,
		Clock,
		AlertTriangle
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { auth, currentUser, isAgent, authLoading } from '$lib/stores/auth';
	import { authModalOpen } from '$lib/stores/authModal';
	import { onMount } from 'svelte';
	import type { Property } from '$lib/data/properties';
	import { listMyProperties, updateProperty, deleteProperty } from '$lib/api/properties';

	onMount(async () => {
		isLoading = true;
		try {
			await auth.init();
		} catch {
			// ignore auth errors
		}
		await new Promise((resolve) => setTimeout(resolve, 100));
		try {
			userProperties = await listMyProperties();
		} catch {
			userProperties = [];
		}
		isLoading = false;
	});

	let userProperties: Property[] = [];
	let isLoading = true;
	let showDeleteConfirm: string | null = null;

	function handleLoginRedirect() {
		authModalOpen.set(true);
	}

	function getDaysOnMarket(publishedAt?: string): number {
		if (!publishedAt) return 0;
		return Math.floor((Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24));
	}

	async function togglePublished(id: string) {
		const prop = userProperties.find((p) => p.id === id);
		if (!prop) return;
		try {
			const newPublished = !prop.published;
			await updateProperty(id, { published: newPublished });
			userProperties = userProperties.map((p) =>
				p.id === id ? { ...p, published: newPublished } : p
			);
		} catch {
			// Silently fail
		}
	}

	async function handleDeleteProperty(id: string) {
		try {
			await deleteProperty(id);
			userProperties = userProperties.filter((p) => p.id !== id);
		} catch {
			// Silently fail
		}
		showDeleteConfirm = null;
	}

	function formatPrice(price: number, currency: string): string {
		if (currency === 'USD') {
			return `USD ${price.toLocaleString('en-US')}`;
		}
		return `$ ${price.toLocaleString('es-AR')}`;
	}
</script>

<svelte:head>
	<title>Mis propiedades | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	{#if !$authLoading && !$currentUser}
		<div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="bg-white rounded-2xl shadow-sm p-8 text-center">
				<div
					class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<Building2 class="w-8 h-8 text-primary" />
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">Iniciá sesión</h1>
				<p class="text-gray-500 mb-6">Tenés que iniciar sesión para ver tus propiedades.</p>
				<button
					on:click={handleLoginRedirect}
					class="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
				>
					Iniciar sesión
				</button>
			</div>
		</div>
	{:else if !$authLoading && !$isAgent}
		<div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="bg-white rounded-2xl shadow-sm p-8 text-center">
				<div
					class="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<Building2 class="w-8 h-8 text-accent" />
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">Solo martilleros</h1>
				<p class="text-gray-500 mb-6">
					Tu cuenta es de tipo buscador. Los martilleros inmobiliarios pueden gestionar
					propiedades.
				</p>
			</div>
		</div>
	{:else}
		<div class="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="flex items-center justify-between mb-8">
				<div>
					<h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
						Mis propiedades
					</h1>
					<p class="text-gray-500">
						{userProperties.length}
						{userProperties.length === 1 ? 'propiedad' : 'propiedades'} publicadas
					</p>
				</div>
				<a
					href="{base}/publicar"
					class="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
				>
					<Plus class="w-4 h-4 sm:w-5 sm:h-5" />
					Nueva propiedad
				</a>
			</div>

			{#if !isLoading && userProperties.length === 0}
				<div class="bg-white rounded-2xl shadow-sm p-12 text-center">
					<div
						class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
					>
						<Building2 class="w-8 h-8 text-gray-400" />
					</div>
					<h2 class="text-xl font-semibold text-gray-900 mb-2">No tenés propiedades</h2>
					<p class="text-gray-500 mb-6">
						Empezá a publicar propiedades y llegan a miles de compradores.
					</p>
					<a
						href="{base}/publicar"
						class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
					>
						<Plus class="w-5 h-5" />
						Publicar mi primera propiedad
					</a>
				</div>
			{:else}
				<div class="space-y-4">
					{#each userProperties as property (property.id)}
						<div
							class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col sm:flex-row"
						>
							<a
								href="{base}/property/{property.id}"
								class="block w-full sm:w-[324px] sm:h-full h-40 sm:h-auto sm:flex-shrink-0"
							>
								<img
									src={property.image}
									alt={property.title}
									class="w-full h-full object-cover"
								/>
							</a>
							<div
								class="flex-1 p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
							>
								<div class="flex-1 min-w-0">
									<div class="flex flex-wrap items-center gap-2 mb-1">
										<a
											href="{base}/property/{property.id}"
											class="hover:text-primary transition-colors"
										>
											<h3
												class="text-lg font-semibold text-gray-900 truncate max-w-full"
											>
												{property.title}
											</h3>
										</a>
										{#if property.aptoCredito}
											<span
												class="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded"
											>
												Apto Crédito
											</span>
										{/if}
										{#if property.published === false}
											<span
												class="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded"
											>
												No publicada
											</span>
										{/if}
									</div>
									<p class="text-accent font-bold text-xl mb-1">
										{property.priceLabel}
									</p>
									<div
										class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500"
									>
										<span class="flex items-center gap-1">
											<MapPin class="w-4 h-4" />
											{property.location}
										</span>
										{#if property.attributes.bedrooms > 0}
											<span class="flex items-center gap-1">
												<Bed class="w-4 h-4" />
												{property.attributes.bedrooms}
											</span>
										{/if}
										<span class="flex items-center gap-1">
											<Bath class="w-4 h-4" />
											{property.attributes.bathrooms}
										</span>
										<span class="flex items-center gap-1">
											<Maximize class="w-4 h-4" />
											{property.attributes.area} m²
										</span>
										<span class="flex items-center gap-1">
											<Eye class="w-4 h-4" />
											{property.views || 0} vistas
										</span>
										<span class="flex items-center gap-1">
											<Clock class="w-4 h-4" />
											{property.publishedAt
												? getDaysOnMarket(property.publishedAt) === 0
													? 'Publicado hoy'
													: `Publicado hace ${getDaysOnMarket(property.publishedAt)} ${getDaysOnMarket(property.publishedAt) === 1 ? 'día' : 'días'}`
												: 'Sin publicar'}
										</span>
										{#if getDaysOnMarket(property.publishedAt) > 30}
											<span class="flex items-center gap-1 text-orange-600">
												<AlertTriangle class="w-4 h-4" />
												+30 días
											</span>
										{/if}
									</div>
									{#if property.distributedTo && property.distributedTo.length > 0}
										<div class="flex items-center gap-1 mt-2">
											<Globe class="w-3 h-3 text-gray-400" />
											<span class="text-xs text-gray-500">Distribuido:</span>
											{#if property.distributedTo.includes('zonaprop')}
												<span
													class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
													>ZonaProp</span
												>
											{/if}
											{#if property.distributedTo.includes('argenprop')}
												<span
													class="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded"
													>ArgenProp</span
												>
											{/if}
											{#if property.distributedTo.includes('mercadolibre')}
												<span
													class="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded"
													>MercadoLibre</span
												>
											{/if}
										</div>
									{/if}
								</div>
							</div>
							<div class="flex items-center gap-2 flex-shrink-0">
								<button
									on:click={() => togglePublished(property.id)}
									class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
									title={property.published === false
										? 'Publicar'
										: 'Despublicar'}
								>
									{#if property.published === false}
										<Eye class="w-5 h-5" />
									{:else}
										<UnpublishIcon class="w-5 h-5" />
									{/if}
								</button>
								<a
									href="{base}/publicar?edit={property.id}"
									class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
									title="Editar"
								>
									<Edit class="w-5 h-5" />
								</a>
								<button
									on:click={() => (showDeleteConfirm = property.id)}
									class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
									title="Eliminar"
								>
									<Trash2 class="w-5 h-5" />
								</button>
							</div>
						</div>

						{#if showDeleteConfirm === property.id}
							<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
								<div
									class="absolute inset-0 bg-black/50"
									on:click={() => (showDeleteConfirm = null)}
									on:keydown={(e) =>
										e.key === 'Escape' && (showDeleteConfirm = null)}
									role="button"
									tabindex="0"
								></div>
								<div
									class="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
								>
									<h3 class="text-lg font-bold text-gray-900 mb-2">
										¿Eliminar propiedad?
									</h3>
									<p class="text-gray-500 mb-6">
										Estás por eliminar "{property.title}". Esta acción no se
										puede deshacer.
									</p>
									<div class="flex gap-3">
										<button
											on:click={() => (showDeleteConfirm = null)}
											class="flex-1 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
										>
											Cancelar
										</button>
										<button
											on:click={() => handleDeleteProperty(property.id)}
											class="flex-1 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
										>
											Eliminar
										</button>
									</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</main>
