<script lang="ts">
	import { Heart, Eye, Building2, User, Calendar, MapPin, Bed, Bath, Maximize } from 'lucide-svelte';
	import { currentUser, isAgent } from '$lib/stores/auth';
	import { favoriteProperties } from '$lib/stores/favorites';
	import { viewed } from '$lib/stores/viewed';
	import { allProperties } from '$lib/stores/properties';
	import { authModalOpen } from '$lib/stores/authModal';

	$: viewedList = $viewed.map(id => $allProperties.find(p => p.id === id)).filter((p): p is NonNullable<typeof p> => p !== undefined);

	function handleLoginRedirect() {
		authModalOpen.set(true);
	}
</script>

<svelte:head>
	<title>Mi Perfil | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	{#if !$currentUser}
		<div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="bg-white rounded-2xl shadow-sm p-8 text-center">
				<div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
					<User class="w-8 h-8 text-primary" />
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">Iniciá sesión</h1>
				<p class="text-gray-500 mb-6">
					Tenés que iniciar sesión para ver tu perfil.
				</p>
				<button
					on:click={handleLoginRedirect}
					class="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
				>
					Iniciar sesión
				</button>
			</div>
		</div>
	{:else}
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="bg-white rounded-2xl shadow-sm p-6 mb-8">
				<div class="flex flex-col md:flex-row items-center gap-6">
					<div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
						{#if $currentUser.role === 'agent'}
							<Building2 class="w-10 h-10 text-white" />
						{:else}
							<User class="w-10 h-10 text-white" />
						{/if}
					</div>
					<div class="text-center md:text-left">
						<h1 class="text-2xl font-bold text-gray-900 mb-1">{$currentUser.name}</h1>
						<p class="text-gray-500 mb-2">{$currentUser.email}</p>
						<div class="flex flex-wrap justify-center md:justify-start gap-3">
							<span class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
								<Calendar class="w-4 h-4" />
								Miembro desde 2024
							</span>
							{#if $currentUser.role === 'agent'}
								<span class="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
									<Building2 class="w-4 h-4" />
									Agente Inmobiliario
								</span>
								{#if $currentUser.matricula}
									<span class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
										Matrícula: {$currentUser.matricula}
									</span>
								{/if}
							{:else}
								<span class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
									<User class="w-4 h-4" />
									Buscador
								</span>
							{/if}
						</div>
					</div>
				</div>
			</div>

			{#if $favoriteProperties.length > 0}
				<section class="mb-10">
					<div class="flex items-center gap-3 mb-4">
						<Heart class="w-6 h-6 text-red-500" />
						<h2 class="text-xl font-bold text-gray-900">Propiedades Favoritas</h2>
						<span class="text-gray-500 text-sm">({$favoriteProperties.length})</span>
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each $favoriteProperties as favProperty (favProperty.id)}
							<a href="/property/{favProperty.id}" class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
								<div class="aspect-[16/10] overflow-hidden">
									<img src={favProperty.image} alt={favProperty.title} class="w-full h-full object-cover" />
								</div>
								<div class="p-4">
									<p class="font-bold text-lg text-gray-900 truncate">{favProperty.title}</p>
									<p class="text-accent font-bold">{favProperty.priceLabel}</p>
									<p class="text-gray-500 text-sm flex items-center gap-1 mt-1">
										<MapPin class="w-4 h-4" />
										{favProperty.location}
									</p>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			{#if viewedList.length > 0}
				<section>
					<div class="flex items-center gap-3 mb-4">
						<Eye class="w-6 h-6 text-gray-500" />
						<h2 class="text-xl font-bold text-gray-900">Propiedades Visitadas</h2>
						<span class="text-gray-500 text-sm">({viewedList.length})</span>
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each viewedList as prop (prop.id)}
							<a href="/property/{prop.id}" class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
								<div class="aspect-[16/10] overflow-hidden">
									<img src={prop.image} alt={prop.title} class="w-full h-full object-cover" />
								</div>
								<div class="p-4">
									<p class="font-bold text-lg text-gray-900 truncate">{prop.title}</p>
									<p class="text-accent font-bold">{prop.priceLabel}</p>
									<p class="text-gray-500 text-sm flex items-center gap-1 mt-1">
										<MapPin class="w-4 h-4" />
										{prop.location}
									</p>
									<div class="flex items-center gap-3 mt-2 text-sm text-gray-500">
										<span class="flex items-center gap-1">
											<Bed class="w-4 h-4" />
											{prop.attributes.bedrooms}
										</span>
										<span class="flex items-center gap-1">
											<Bath class="w-4 h-4" />
											{prop.attributes.bathrooms}
										</span>
										<span class="flex items-center gap-1">
											<Maximize class="w-4 h-4" />
											{prop.attributes.area}m²
										</span>
									</div>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			{#if $favoriteProperties.length === 0 && viewedList.length === 0}
				<div class="bg-white rounded-2xl shadow-sm p-12 text-center">
					<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Heart class="w-8 h-8 text-gray-400" />
					</div>
					<h2 class="text-xl font-semibold text-gray-900 mb-2">Tu perfil está vacío</h2>
					<p class="text-gray-500 mb-6">Explorá propiedades y guardá las que te gusten para verlas después.</p>
					<a
						href="/"
						class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
					>
						Explorar propiedades
					</a>
				</div>
			{/if}
		</div>
	{/if}
</main>
