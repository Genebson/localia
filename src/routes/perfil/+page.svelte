<script lang="ts">
	import {
		Heart,
		Eye,
		Building2,
		User,
		Calendar,
		MapPin,
		Bed,
		Bath,
		Maximize,
		ExternalLink,
		Plus,
		X,
		Check,
		AlertTriangle
	} from 'lucide-svelte';
	import { base } from '$app/paths';
	import { currentUser, isAgent, auth } from '$lib/stores/auth';
	import { favoriteProperties } from '$lib/stores/favorites';
	import { viewed } from '$lib/stores/viewed';
	import { allProperties } from '$lib/stores/properties';
	import { authModalOpen } from '$lib/stores/authModal';
	import { agenciesStore } from '$lib/stores/agencies';
	import { onMount } from 'svelte';

	onMount(() => {
		auth.init();
	});

	$: viewedList = $viewed
		.map((id) => $allProperties.find((p) => p.id === id))
		.filter((p): p is NonNullable<typeof p> => p !== undefined);

	$: userAgency = $currentUser?.id
		? $agenciesStore.find((a) => a.agentId === $currentUser.id)
		: undefined;

	function handleLoginRedirect() {
		authModalOpen.set(true);
	}

	let showAgencyModal = false;
	let showDeleteModal = false;
	let agencyForm = {
		name: '',
		tagline: '',
		description: '',
		phone: '',
		email: '',
		whatsapp: '',
		location: '',
		website: ''
	};
	let agencySuccess = false;
	let agencyError = '';

	function openAgencyModal() {
		if (userAgency) {
			agencyForm = {
				name: userAgency.name,
				tagline: userAgency.tagline || '',
				description: userAgency.description || '',
				phone: userAgency.phone,
				email: userAgency.email || '',
				whatsapp: userAgency.whatsapp || '',
				location: userAgency.location || '',
				website: userAgency.website || ''
			};
		} else {
			agencyForm = {
				name: '',
				tagline: '',
				description: '',
				phone: '',
				email: '',
				whatsapp: '',
				location: '',
				website: ''
			};
		}
		showAgencyModal = true;
		agencySuccess = false;
		agencyError = '';
	}

	function closeAgencyModal() {
		showAgencyModal = false;
	}

	function handleAgencySubmit() {
		agencyError = '';
		if (!agencyForm.name.trim()) {
			agencyError = 'El nombre es obligatorio.';
			return;
		}
		if (!agencyForm.phone.trim()) {
			agencyError = 'El teléfono es obligatorio.';
			return;
		}
		if (!agencyForm.email.trim()) {
			agencyError = 'El email es obligatorio.';
			return;
		}

		const slug = agencyForm.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');

		if (userAgency) {
			agenciesStore.update(userAgency.id, {
				name: agencyForm.name.trim(),
				tagline: agencyForm.tagline.trim(),
				description: agencyForm.description.trim(),
				phone: agencyForm.phone.trim(),
				email: agencyForm.email.trim(),
				whatsapp: agencyForm.whatsapp.trim() || undefined,
				location: agencyForm.location.trim() || undefined,
				website: agencyForm.website.trim() || undefined
			});
		} else {
			agenciesStore.create({
				slug,
				name: agencyForm.name.trim(),
				tagline: agencyForm.tagline.trim() || 'Tu hogar ideal está acá',
				description: agencyForm.description.trim() || 'Bienvenido a nuestra inmobiliaria.',
				phone: agencyForm.phone.trim(),
				email: agencyForm.email.trim(),
				whatsapp: agencyForm.whatsapp.trim() || agencyForm.phone.trim(),
				location: agencyForm.location.trim() || 'Mercedes, Buenos Aires',
				website: agencyForm.website.trim() || undefined,
				logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(agencyForm.name)}&background=1E3A5F&color=fff&size=128`,
				banner: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
				team: [
					{ name: $currentUser!.name, role: 'Martillero', phone: agencyForm.phone.trim() }
				],
				agentId: $currentUser!.id,
				propertyCount: 0
			});
		}

		agencySuccess = true;
		setTimeout(() => {
			showAgencyModal = false;
		}, 1500);
	}

	function handleDeleteAgency() {
		showDeleteModal = true;
	}

	function confirmDeleteAgency() {
		if (userAgency) {
			agenciesStore.remove(userAgency.id);
			showDeleteModal = false;
		}
	}

	function closeDeleteModal() {
		showDeleteModal = false;
	}
</script>

<svelte:head>
	<title>Mi Perfil | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	{#if !$currentUser}
		<div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="bg-white rounded-2xl shadow-sm p-8 text-center">
				<div
					class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<User class="w-8 h-8 text-primary" />
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">Iniciá sesión</h1>
				<p class="text-gray-500 mb-6">Tenés que iniciar sesión para ver tu perfil.</p>
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
							<span
								class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
							>
								<Calendar class="w-4 h-4" />
								Miembro desde 2024
							</span>
							{#if $currentUser.role === 'agent'}
								<span
									class="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full"
								>
									<Building2 class="w-4 h-4" />
									Martillero Inmobiliario
								</span>
								{#if $currentUser.licenseNumber}
									<span
										class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full"
									>
										Matrícula: {$currentUser.licenseNumber}
									</span>
								{/if}
							{:else}
								<span
									class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
								>
									<User class="w-4 h-4" />
									Buscador
								</span>
							{/if}
						</div>
					</div>
				</div>
			</div>

			{#if $isAgent}
				<div class="bg-white rounded-2xl shadow-sm p-6 mb-8">
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center gap-3">
							<div
								class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
							>
								<Building2 class="w-5 h-5 text-primary" />
							</div>
							<div>
								<h2 class="text-lg font-bold text-gray-900">Mi Inmobiliaria</h2>
								<p class="text-sm text-gray-500">Tu página de inmobiliaria</p>
							</div>
						</div>
					</div>
					{#if userAgency}
						<div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
							<div class="flex items-center gap-3">
								<img
									src={userAgency.logo}
									alt={userAgency.name}
									class="w-12 h-12 rounded-lg"
								/>
								<div>
									<p class="font-semibold text-gray-900">{userAgency.name}</p>
									<p class="text-sm text-gray-500">{userAgency.tagline}</p>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<button
									on:click={openAgencyModal}
									class="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Editar
								</button>
								<a
									href="{base}/inmobiliaria/{userAgency.slug}"
									class="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors"
								>
									Ver página <ExternalLink class="w-4 h-4" />
								</a>
								<button
									on:click={handleDeleteAgency}
									class="px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
								>
									Eliminar
								</button>
							</div>
						</div>
					{:else}
						<div class="text-center py-6">
							<p class="text-gray-500 mb-4">Aún no tenés tu inmobiliaria creada</p>
							<button
								on:click={openAgencyModal}
								class="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors mx-auto"
							>
								<Plus class="w-4 h-4" /> Crear mi inmobiliaria
							</button>
						</div>
					{/if}
				</div>
			{/if}

			{#if $favoriteProperties.length > 0}
				<section class="mb-10">
					<div class="flex items-center gap-3 mb-4">
						<Heart class="w-6 h-6 text-red-500" />
						<h2 class="text-xl font-bold text-gray-900">Propiedades Favoritas</h2>
						<span class="text-gray-500 text-sm">({$favoriteProperties.length})</span>
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each $favoriteProperties as favProperty (favProperty.id)}
							<a
								href="{base}/property/{favProperty.id}"
								class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
							>
								<div class="aspect-[16/10] overflow-hidden">
									<img
										src={favProperty.image}
										alt={favProperty.title}
										class="w-full h-full object-cover"
									/>
								</div>
								<div class="p-4">
									<p class="font-bold text-lg text-gray-900 truncate">
										{favProperty.title}
									</p>
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
							<a
								href="{base}/property/{prop.id}"
								class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
							>
								<div class="aspect-[16/10] overflow-hidden">
									<img
										src={prop.image}
										alt={prop.title}
										class="w-full h-full object-cover"
									/>
								</div>
								<div class="p-4">
									<p class="font-bold text-lg text-gray-900 truncate">
										{prop.title}
									</p>
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
					<div
						class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
					>
						<Heart class="w-8 h-8 text-gray-400" />
					</div>
					<h2 class="text-xl font-semibold text-gray-900 mb-2">Tu perfil está vacío</h2>
					<p class="text-gray-500 mb-6">
						Explorá propiedades y guardá las que te gusten para verlas después.
					</p>
					<a
						href="{base}/"
						class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
					>
						Explorar propiedades
					</a>
				</div>
			{/if}
		</div>
	{/if}
</main>

{#if showAgencyModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div
			class="absolute inset-0 bg-black/50"
			on:click={closeAgencyModal}
			on:keydown={(e) => e.key === 'Escape' && closeAgencyModal()}
			role="button"
			tabindex="0"
			aria-label="Cerrar"
		></div>
		<div
			class="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
		>
			<button
				on:click={closeAgencyModal}
				class="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
			>
				<X class="w-5 h-5 text-gray-500" />
			</button>
			<h2 class="text-xl font-bold text-gray-900 mb-6">
				{userAgency ? 'Editar mi inmobiliaria' : 'Crear mi inmobiliaria'}
			</h2>

			{#if agencySuccess}
				<div class="text-center py-8">
					<div
						class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
					>
						<Check class="w-8 h-8 text-green-600" />
					</div>
					<p class="text-lg font-semibold text-gray-900">¡Guardado!</p>
				</div>
			{:else}
				{#if agencyError}
					<div
						class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
					>
						{agencyError}
					</div>
				{/if}
				<form on:submit|preventDefault={handleAgencySubmit} class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"
							>Nombre de la inmobiliaria *</label
						>
						<input
							type="text"
							bind:value={agencyForm.name}
							required
							placeholder="Ej: Inmobiliaria López"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"
							>Teléfono *</label
						>
						<input
							type="tel"
							bind:value={agencyForm.phone}
							required
							placeholder="Ej: 5491123456789"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
						<input
							type="email"
							bind:value={agencyForm.email}
							required
							placeholder="Ej: contacto@inmobiliaria.com"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
						<input
							type="tel"
							bind:value={agencyForm.whatsapp}
							placeholder="Ej: 5491123456789"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
						<input
							type="text"
							bind:value={agencyForm.tagline}
							placeholder="Ej: Tu hogar ideal está acá"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"
							>Descripción</label
						>
						<textarea
							bind:value={agencyForm.description}
							rows="3"
							placeholder="Contanos sobre tu inmobiliaria..."
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
						></textarea>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label
						>
						<input
							type="text"
							bind:value={agencyForm.location}
							placeholder="Ej: Mercedes, Buenos Aires"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label
						>
						<input
							type="url"
							bind:value={agencyForm.website}
							placeholder="Ej: https://tuinmobiliaria.com"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>
					<button
						type="submit"
						class="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
					>
						{userAgency ? 'Guardar cambios' : 'Crear inmobiliaria'}
					</button>
				</form>
			{/if}
		</div>
	</div>
{/if}

{#if showDeleteModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div
			class="absolute inset-0 bg-black/50"
			on:click={closeDeleteModal}
			on:keydown={(e) => e.key === 'Escape' && closeDeleteModal()}
			role="button"
			tabindex="0"
			aria-label="Cerrar"
		></div>
		<div class="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
			<button
				on:click={closeDeleteModal}
				class="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
			>
				<X class="w-5 h-5 text-gray-500" />
			</button>
			<div class="text-center">
				<div
					class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<AlertTriangle class="w-8 h-8 text-red-600" />
				</div>
				<h2 class="text-xl font-bold text-gray-900 mb-2">Eliminar inmobiliaria</h2>
				<p class="text-gray-600 mb-6">
					¿Estás seguro de que querés eliminar tu inmobiliaria? Esta acción no se puede
					deshacer.
				</p>
				<div class="flex gap-3">
					<button
						on:click={closeDeleteModal}
						class="flex-1 py-3 px-4 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
					>
						Cancelar
					</button>
					<button
						on:click={confirmDeleteAgency}
						class="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
					>
						Eliminar
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
