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
		AlertTriangle,
		Camera,
		Minus,
		DollarSign
	} from 'lucide-svelte';
	import { base } from '$app/paths';
	import { currentUser, isAgent, auth } from '$lib/stores/auth';
	import { favoriteProperties } from '$lib/stores/favorites';
	import { viewed } from '$lib/stores/viewed';
	import { authModalOpen } from '$lib/stores/authModal';
	import { agenciesStore } from '$lib/stores/agencies';
	import { onMount } from 'svelte';
	import {
		updateProfile,
		uploadProfileImage,
		updateRentalProfile,
		updateIntroductionLetter,
		requestPasswordReset
	} from '$lib/api/auth';

	onMount(() => {
		auth.init();
	});

	$: viewedList = $viewed;

	$: userAgency = $currentUser?.id
		? $agenciesStore.find((a) => a.agentId === $currentUser.id)
		: undefined;

	function handleLoginRedirect() {
		authModalOpen.set(true);
	}

	let showProfileModal = false;
	let showAgencyModal = false;
	let showDeleteModal = false;

	function openProfileModal() {
		section1Form = {
			name: $currentUser?.name || '',
			phone: $currentUser?.phone || ''
		};
		section2Form = {
			tenantCount: $currentUser?.tenantCount || 1,
			pets: $currentUser?.pets || 'none',
			moveDate: $currentUser?.moveDate || 'flexible',
			monthlyIncome: $currentUser?.monthlyIncome || null
		};
		section3Form = {
			introductionLetter: $currentUser?.introductionLetter || ''
		};
		section1Saving = false;
		section1Success = false;
		section1Error = '';
		section2Saving = false;
		section2Success = false;
		section2Error = '';
		section3Saving = false;
		section3Success = false;
		section3Error = '';
		profileSuccess = false;
		showProfileModal = true;
	}

	function closeProfileModal() {
		showProfileModal = false;
	}

	let profileSuccess = false;
	let profileError = '';
	let passwordResetSent = false;
	let passwordResetError = '';

	let section1Form = {
		name: $currentUser?.name || '',
		phone: $currentUser?.phone || ''
	};
	let section1Saving = false;
	let section1Success = false;
	let section1Error = '';

	let section2Form = {
		tenantCount: $currentUser?.tenantCount || 1,
		pets: $currentUser?.pets || 'none',
		moveDate: $currentUser?.moveDate || 'flexible',
		monthlyIncome: $currentUser?.monthlyIncome || null
	};
	let section2Saving = false;
	let section2Success = false;
	let section2Error = '';

	let section3Form = {
		introductionLetter: $currentUser?.introductionLetter || ''
	};
	let section3Saving = false;
	let section3Success = false;
	let section3Error = '';

	async function handlePhotoUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = async (e) => {
			const base64 = e.target?.result as string;
			try {
				await uploadProfileImage(base64);
				await auth.init();
			} catch {
				section1Error = 'Error al subir la foto.';
			}
		};
		reader.readAsDataURL(file);
	}

	async function sendPasswordReset() {
		if (!$currentUser?.email) return;
		passwordResetError = '';
		try {
			await requestPasswordReset($currentUser.email);
			passwordResetSent = true;
		} catch {
			passwordResetError = 'Error al enviar el email. Intentá de nuevo.';
		}
	}

	async function handleProfileSave() {
		profileError = '';
		let hasError = false;

		if (section1Form.name.trim().length < 2) {
			section1Error = 'El nombre debe tener al menos 2 caracteres.';
			hasError = true;
		}

		if (!hasError) {
			section1Saving = true;
			try {
				await updateProfile(section1Form.name, section1Form.phone);
				await auth.init();
				section1Success = true;
			} catch {
				section1Error = 'Error al guardar los datos básicos.';
				hasError = true;
			} finally {
				section1Saving = false;
			}
		}

		if (!hasError) {
			section2Saving = true;
			try {
				await updateRentalProfile(
					section2Form.tenantCount,
					section2Form.pets,
					section2Form.moveDate,
					section2Form.monthlyIncome
				);
				await auth.init();
				section2Success = true;
			} catch {
				section2Error = 'Error al guardar el perfil de alquiler.';
				hasError = true;
			} finally {
				section2Saving = false;
			}
		}

		if (!hasError && section3Form.introductionLetter.length > 300) {
			section3Error = 'Máximo 300 caracteres.';
			hasError = true;
		}

		if (!hasError) {
			section3Saving = true;
			try {
				await updateIntroductionLetter(section3Form.introductionLetter);
				await auth.init();
				section3Success = true;
			} catch {
				section3Error = 'Error al guardar la carta de presentación.';
				hasError = true;
			} finally {
				section3Saving = false;
			}
		}

		if (!hasError) {
			profileSuccess = true;
			setTimeout(() => {
				closeProfileModal();
			}, 1500);
		}
	}

	function decrementTenant() {
		if (section2Form.tenantCount > 1) {
			section2Form.tenantCount--;
		}
	}

	function incrementTenant() {
		if (section2Form.tenantCount < 10) {
			section2Form.tenantCount++;
		}
	}

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
				phone: userAgency.phone || '',
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
				verified: false,
				slug,
				name: agencyForm.name.trim(),
				tagline: agencyForm.tagline.trim() || 'Tu hogar ideal está acá',
				description: agencyForm.description.trim() || 'Bienvenido a nuestra inmobiliaria.',
				phone: agencyForm.phone.trim(),
				email: agencyForm.email.trim(),
				whatsapp: agencyForm.whatsapp.trim() || agencyForm.phone.trim(),
				location: agencyForm.location.trim() || 'Mercedes, Buenos Aires',
				website: agencyForm.website.trim(),
				logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(agencyForm.name)}&background=1E3A5F&color=fff&size=128`,
				banner: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
				team: [
					{ name: $currentUser!.name, role: 'Agente', phone: agencyForm.phone.trim() }
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
					{#if $currentUser.image}
						<img
							src={$currentUser.image}
							alt={$currentUser.name}
							class="w-20 h-20 rounded-full object-cover"
						/>
					{:else}
						<div
							class="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold"
						>
							{$currentUser.name?.charAt(0).toUpperCase() || 'U'}
						</div>
					{/if}
					<div class="text-center md:text-left flex-1">
						<h1 class="text-2xl font-bold text-gray-900 mb-1">{$currentUser.name}</h1>
						<p class="text-gray-500 mb-3">{$currentUser.email}</p>
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
									Agente Inmobiliario
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
					<div class="flex gap-2">
						<button
							on:click={openProfileModal}
							class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
						>
							Editar perfil
						</button>
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

{#if showProfileModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div
			class="absolute inset-0 bg-black/60 backdrop-blur-sm"
			on:click={closeProfileModal}
			on:keydown={(e) => e.key === 'Escape' && closeProfileModal()}
			role="button"
			tabindex="0"
			aria-label="Cerrar"
		></div>
		<div
			class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
		>
			<button
				on:click={closeProfileModal}
				class="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
				aria-label="Cerrar"
			>
				<X class="w-5 h-5 text-gray-500" />
			</button>

			<div class="p-8">
				{#if profileSuccess}
					<div class="text-center py-12">
						<div
							class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<Check class="w-8 h-8 text-green-600" />
						</div>
						<p class="text-lg font-semibold text-gray-900">¡Guardado!</p>
					</div>
				{:else}
					<h2 class="text-xl font-bold text-gray-900 mb-6">Editar perfil</h2>

					{#if profileError}
						<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
							{profileError}
						</div>
					{/if}

					<div class="space-y-6">
						<div>
							<div class="flex items-center gap-4 mb-4">
								<div class="relative">
									{#if $currentUser?.image}
										<img
											src={$currentUser.image}
											alt={$currentUser.name}
											class="w-16 h-16 rounded-full object-cover"
										/>
									{:else}
										<div
											class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold"
										>
											{$currentUser?.name?.charAt(0).toUpperCase() || 'U'}
										</div>
									{/if}
									<label
										class="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-light transition-colors"
									>
										<Camera class="w-3.5 h-3.5 text-white" />
										<input
											type="file"
											accept="image/*"
											class="hidden"
											on:change={handlePhotoUpload}
										/>
									</label>
								</div>
								<div>
									<button class="text-sm text-primary hover:underline">Añadir foto</button>
									<p class="text-xs text-gray-500 mt-0.5">Una buena foto transmite más confianza</p>
								</div>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
							<input
								type="text"
								bind:value={section1Form.name}
								placeholder="Nombre Apellido"
								class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
							/>
							{#if section1Error}
								<p class="text-xs text-red-600 mt-1">{section1Error}</p>
							{/if}
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
							<div class="flex gap-2">
								<div
									class="flex items-center gap-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
								>
									<span class="font-medium">+54</span>
								</div>
								<input
									type="tel"
									bind:value={section1Form.phone}
									placeholder="11 5555 1234"
									class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								/>
							</div>
						</div>

						<div class="border-t border-gray-100 pt-4">
							<h3 class="text-sm font-semibold text-gray-900 mb-3">Perfil para alquilar</h3>

							<div class="space-y-4">
								<div>
									<label class="block text-xs font-medium text-gray-500 mb-1.5">Número de personas</label>
									<div class="flex items-center gap-2">
										<button
											on:click={decrementTenant}
											disabled={section2Form.tenantCount <= 1}
											class="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
										>
											<Minus class="w-3.5 h-3.5" />
										</button>
										<span class="text-sm font-medium w-20 text-center">
											{section2Form.tenantCount} {section2Form.tenantCount === 1 ? 'persona' : 'personas'}
										</span>
										<button
											on:click={incrementTenant}
											disabled={section2Form.tenantCount >= 10}
											class="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
										>
											<Plus class="w-3.5 h-3.5" />
										</button>
									</div>
								</div>

								<div>
									<label class="block text-xs font-medium text-gray-500 mb-1.5">Mascotas</label>
									<div class="flex gap-4">
										<label class="flex items-center gap-2 cursor-pointer">
											<input
												type="radio"
												name="pets"
												value="none"
												bind:group={section2Form.pets}
												class="w-3.5 h-3.5 text-primary border-gray-300 focus:ring-primary"
											/>
											<span class="text-sm text-gray-700">No tengo mascota</span>
										</label>
										<label class="flex items-center gap-2 cursor-pointer">
											<input
												type="radio"
												name="pets"
												value="has_pet"
												bind:group={section2Form.pets}
												class="w-3.5 h-3.5 text-primary border-gray-300 focus:ring-primary"
											/>
											<span class="text-sm text-gray-700">Tengo mascota</span>
										</label>
									</div>
								</div>

								<div>
									<label class="block text-xs font-medium text-gray-500 mb-1.5">Fecha de mudanza</label>
									<div class="flex flex-wrap gap-3">
										<label class="flex items-center gap-1.5 cursor-pointer">
											<input
												type="radio"
												name="moveDate"
												value="asap"
												bind:group={section2Form.moveDate}
												class="w-3.5 h-3.5 text-primary border-gray-300 focus:ring-primary"
											/>
											<span class="text-xs text-gray-700">Lo antes posible</span>
										</label>
										<label class="flex items-center gap-1.5 cursor-pointer">
											<input
												type="radio"
												name="moveDate"
												value="flexible"
												bind:group={section2Form.moveDate}
												class="w-3.5 h-3.5 text-primary border-gray-300 focus:ring-primary"
											/>
											<span class="text-xs text-gray-700">Tengo flexibilidad</span>
										</label>
										<label class="flex items-center gap-1.5 cursor-pointer">
											<input
												type="radio"
												name="moveDate"
												value="exact_date"
												bind:group={section2Form.moveDate}
												class="w-3.5 h-3.5 text-primary border-gray-300 focus:ring-primary"
											/>
											<span class="text-xs text-gray-700">En fecha exacta</span>
										</label>
									</div>
								</div>

								<div>
									<label class="block text-xs font-medium text-gray-500 mb-1">Ingresos mensuales (opcional)</label>
									<div class="relative">
										<DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
										<input
											type="number"
											bind:value={section2Form.monthlyIncome}
											placeholder="$ / mes"
											class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
										/>
									</div>
									<p class="text-xs text-gray-400 mt-1">Este dato añade valor a tu perfil</p>
								</div>
							</div>
						</div>

						<div class="border-t border-gray-100 pt-4">
							<h3 class="text-sm font-semibold text-gray-900 mb-2">Seguridad</h3>
							{#if passwordResetSent}
								<div class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
									<Check class="w-4 h-4 text-green-600" />
									<span class="text-sm text-green-700">Email de recuperación enviado a {$currentUser?.email}</span>
								</div>
							{:else}
								<p class="text-xs text-gray-500 mb-2">Recibí un email para cambiar tu contraseña.</p>
								<button
									on:click={sendPasswordReset}
									class="text-sm text-primary hover:text-primary-light font-medium"
								>
									Cambiar contraseña
								</button>
								{#if passwordResetError}
									<p class="text-xs text-red-600 mt-1">{passwordResetError}</p>
								{/if}
							{/if}
						</div>

						<div class="border-t border-gray-100 pt-4">
							<h3 class="text-sm font-semibold text-gray-900 mb-2">Tu carta de presentación <span class="text-gray-400 font-normal">(opcional)</span></h3>
							<ul class="text-xs text-gray-500 mb-3 space-y-0.5">
								<li>• ¿A qué te dedicás?</li>
								<li>• ¿Qué contrato laboral tenés?</li>
								<li>• ¿Por qué te mudás?</li>
							</ul>
							<div class="relative">
								<textarea
									bind:value={section3Form.introductionLetter}
									maxlength="300"
									rows="3"
									placeholder="Trabajo en el sector tecnológico con contrato indefinido. Busco una vivienda tranquila por motivos laborales..."
									class="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
								></textarea>
								<div class="absolute bottom-2 right-3 text-xs text-gray-400">
									{section3Form.introductionLetter.length}/300
								</div>
							</div>
							{#if section3Error}
								<p class="text-xs text-red-600 mt-1">{section3Error}</p>
							{/if}
						</div>
					</div>

					<button
						on:click={handleProfileSave}
						disabled={section1Saving || section2Saving || section3Saving}
						class="mt-6 w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50"
					>
						Guardar cambios
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

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