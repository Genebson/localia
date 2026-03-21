<script lang="ts">
	import { Building2, Edit, Trash2, Plus, Eye, EyeOff, MapPin, Bed, Bath, Maximize } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { auth, currentUser, isAgent } from '$lib/stores/auth';
	import { authModalOpen } from '$lib/stores/authModal';
	import { propertiesStore, allProperties } from '$lib/stores/properties';

	let showDeleteConfirm: string | null = null;

	$: userProperties = $allProperties.filter(p => p.agentEmail === $currentUser?.email);

	function handleLoginRedirect() {
		authModalOpen.set(true);
	}

	function toggleVisibility(id: string) {
		propertiesStore.toggleFeatured(id);
	}

	function deleteProperty(id: string) {
		propertiesStore.delete(id);
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
	{#if !$currentUser}
		<div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="bg-white rounded-2xl shadow-sm p-8 text-center">
				<div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
					<Building2 class="w-8 h-8 text-primary" />
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">Iniciá sesión</h1>
				<p class="text-gray-500 mb-6">
					Tenés que iniciar sesión para ver tus propiedades.
				</p>
				<button
					on:click={handleLoginRedirect}
					class="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
				>
					Iniciar sesión
				</button>
			</div>
		</div>
	{:else if !$isAgent}
		<div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="bg-white rounded-2xl shadow-sm p-8 text-center">
				<div class="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
					<Building2 class="w-8 h-8 text-accent" />
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">Solo agentes</h1>
				<p class="text-gray-500 mb-6">
					Tu cuenta es de tipo buscador. Los agentes inmobiliarios pueden gestionar propiedades.
				</p>
			</div>
		</div>
	{:else}
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="flex items-center justify-between mb-8">
				<div>
					<h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mis propiedades</h1>
					<p class="text-gray-500">{userProperties.length} {userProperties.length === 1 ? 'propiedad' : 'propiedades'} publicadas</p>
				</div>
				<a
					href="{base}/publicar"
					class="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
				>
					<Plus class="w-5 h-5" />
					Nueva propiedad
				</a>
			</div>

			{#if userProperties.length === 0}
				<div class="bg-white rounded-2xl shadow-sm p-12 text-center">
					<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Building2 class="w-8 h-8 text-gray-400" />
					</div>
					<h2 class="text-xl font-semibold text-gray-900 mb-2">No tenés propiedades</h2>
					<p class="text-gray-500 mb-6">Empezá a publicar propiedades y llegan a miles de compradores.</p>
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
						<div class="bg-white rounded-xl shadow-sm overflow-hidden group">
							<div class="flex flex-col md:flex-row">
								<div class="md:w-64 h-48 md:h-auto flex-shrink-0">
									<a href="{base}/property/{property.id}" class="block w-full h-full">
										<img
											src={property.image}
											alt={property.title}
											class="w-full h-full object-cover"
										/>
									</a>
								</div>
								<div class="flex-1 p-6">
									<div class="flex items-start justify-between gap-4">
										<div class="flex-1 min-w-0">
											<div class="flex flex-wrap items-center gap-2 mb-2">
												<a href="{base}/property/{property.id}" class="hover:text-primary transition-colors">
													<h3 class="text-lg font-semibold text-gray-900 truncate max-w-full">
														{property.title}
													</h3>
												</a>
												{#if property.featured}
													<span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
														Visible
													</span>
												{:else}
													<span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">
														Oculta
													</span>
												{/if}
											</div>
											<p class="text-accent font-bold text-xl mb-2">
												{property.priceLabel}
											</p>
											<div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
												<span class="flex items-center gap-1">
													<MapPin class="w-4 h-4" />
													{property.location}
												</span>
											</div>
											<div class="flex items-center gap-4 text-sm text-gray-500">
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
											</div>
										</div>
										<div class="flex items-center gap-2">
											<a
												href="{base}/publicar?edit={property.id}"
												class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
												title="Editar"
											>
												<Edit class="w-5 h-5" />
											</a>
											<button
												on:click={() => toggleVisibility(property.id)}
												class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
												title={property.featured ? 'Ocultar' : 'Mostrar'}
											>
												{#if property.featured}
													<EyeOff class="w-5 h-5" />
												{:else}
													<Eye class="w-5 h-5" />
												{/if}
											</button>
											<button
												on:click={() => showDeleteConfirm = property.id}
												class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
												title="Eliminar"
											>
												<Trash2 class="w-5 h-5" />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						{#if showDeleteConfirm === property.id}
							<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
								<div class="absolute inset-0 bg-black/50" on:click={() => showDeleteConfirm = null} on:keydown={(e) => e.key === 'Escape' && (showDeleteConfirm = null)} role="button" tabindex="0"></div>
								<div class="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
									<h3 class="text-lg font-bold text-gray-900 mb-2">¿Eliminar propiedad?</h3>
									<p class="text-gray-500 mb-6">
										Estás por eliminar "{property.title}". Esta acción no se puede deshacer.
									</p>
									<div class="flex gap-3">
										<button
											on:click={() => showDeleteConfirm = null}
											class="flex-1 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
										>
											Cancelar
										</button>
										<button
											on:click={() => deleteProperty(property.id)}
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
