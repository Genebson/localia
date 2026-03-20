<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Building2, Upload, X, MapPin, Home, User, Check } from 'lucide-svelte';
	import { auth, isAgent, currentUser } from '$lib/stores/auth';
	import { authModalOpen } from '$lib/stores/authModal';
	import { propertiesStore, getPropertyById } from '$lib/stores/properties';
	import type { PropertyType } from '$lib/data/properties';

	let editId = $page.url.searchParams.get('edit');
	let isEditing = !!editId;

	let title = '';
	let description = '';
	let operation: 'buy' | 'rent' = 'buy';
	let propertyType = '';
	let price = '';
	let currency: 'USD' | 'ARS' = 'USD';
	let location = '';
	let address = '';
	let bedrooms = '';
	let bathrooms = '';
	let area = '';
	let images: File[] = [];
	let imagePreviews: string[] = [];
	let error = '';
	let success = false;

	const propertyTypes = [
		'Departamento',
		'Casa',
		'PH',
		'Local comercial',
		'Oficina',
		'Terreno',
		'Quincho',
		'Dúplex',
		'Penthouse'
	];

	if (isEditing) {
		const existing = getPropertyById(editId);
		if (existing) {
			title = existing.title;
			description = existing.description || '';
			operation = existing.operation;
			propertyType = '';
			price = existing.price.toString();
			currency = existing.currency;
			location = existing.location;
			address = existing.address;
			bedrooms = existing.attributes.bedrooms.toString();
			bathrooms = existing.attributes.bathrooms.toString();
			area = existing.attributes.area.toString();
			if (existing.images && existing.images.length > 0) {
				imagePreviews = existing.images;
			}
		}
	}

	function handleImageUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files) return;

		const newImages: File[] = [];
		const newPreviews: string[] = [];
		let loaded = 0;
		const total = Math.min(input.files.length, 5 - images.length);

		for (let i = 0; i < input.files.length && newImages.length < 5 - images.length; i++) {
			const file = input.files[i];
			newImages.push(file);
			const reader = new FileReader();
			reader.onload = (evt) => {
				newPreviews.push(evt.target?.result as string);
				loaded++;
				if (loaded === total) {
					images = [...images, ...newImages];
					imagePreviews = [...imagePreviews, ...newPreviews];
				}
			};
			reader.readAsDataURL(file);
		}
	}

	function removeImage(index: number) {
		imagePreviews = imagePreviews.filter((_, i) => i !== index);
		images = images.filter((_, i) => i !== index);
	}

	async function handleSubmit() {
		error = '';

		if (!title || !description || !price || !location || !address || !propertyType) {
			error = 'Por favor completá todos los campos obligatorios';
			return;
		}

		if (!$isAgent) {
			error = 'Solo los agentes pueden publicar propiedades';
			return;
		}

		await new Promise(resolve => setTimeout(resolve, 500));

		const propertyTypeMap: Record<string, PropertyType> = {
			'Departamento': 'apartment',
			'Casa': 'house',
			'PH': 'apartment',
			'Local comercial': 'commercial',
			'Oficina': 'commercial',
			'Terreno': 'terrain',
			'Quincho': 'house',
			'Dúplex': 'apartment',
			'Penthouse': 'penthouse'
		};

		const propertyData = {
			title,
			description,
			price: parseInt(price),
			priceLabel: `${currency === 'USD' ? 'USD' : '$'} ${parseInt(price).toLocaleString('es-AR')}${operation === 'rent' ? '/mes' : ''}`,
			currency,
			location,
			address,
			image: imagePreviews[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
			propertyType: propertyTypeMap[propertyType] || 'apartment',
			attributes: {
				bedrooms: parseInt(bedrooms) || 0,
				bathrooms: parseInt(bathrooms) || 0,
				area: parseInt(area) || 0
			},
			operation,
			featured: true,
			agentEmail: $currentUser?.email,
			isUserProperty: true
		};

		if (isEditing && editId) {
			propertiesStore.update(editId, propertyData);
		} else {
			propertiesStore.add(propertyData);
		}

		success = true;
	}

	function handleLoginRedirect() {
		authModalOpen.set(true);
	}
</script>

<svelte:head>
	<title>{isEditing ? 'Editar' : 'Publicar'} propiedad | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	{#if success}
		<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="bg-white rounded-2xl shadow-sm p-8 text-center">
				<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<Check class="w-8 h-8 text-green-600" />
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">
					{isEditing ? '¡Propiedad actualizada!' : '¡Propiedad publicada!'}
				</h1>
				<p class="text-gray-500 mb-6">
					{isEditing ? 'Los cambios fueron guardados exitosamente.' : 'Tu propiedad fue publicada exitosamente.'}
				</p>
				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						on:click={() => goto('{base}/mis-propiedades')}
						class="px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
					>
						Mis propiedades
					</button>
					<button
						on:click={() => goto('/')}
						class="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg transition-colors hover:bg-gray-50"
					>
						Ver todas
					</button>
				</div>
			</div>
		</div>
	{:else if !$currentUser}
		<div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="bg-white rounded-2xl shadow-sm p-8 text-center">
				<div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
					<User class="w-8 h-8 text-primary" />
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">Iniciá sesión</h1>
				<p class="text-gray-500 mb-6">
					Tenés que iniciar sesión como agente para {isEditing ? 'editar' : 'publicar'} propiedades.
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
					Tu cuenta es de tipo buscador. Los agentes inmobiliarios pueden {isEditing ? 'editar' : 'publicar'} propiedades.
				</p>
			</div>
		</div>
	{:else}
		<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="mb-8">
				<h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
					{isEditing ? 'Editar propiedad' : 'Publicar propiedad'}
				</h1>
				<p class="text-gray-500">
					{isEditing ? 'Modificá los datos de tu propiedad' : 'Completá el formulario para publicar tu propiedad en Localia'}
				</p>
			</div>

			{#if error}
				<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
					{error}
				</div>
			{/if}

			<form on:submit|preventDefault={handleSubmit} class="space-y-8">
				<div class="bg-white rounded-2xl shadow-sm p-6 space-y-6">
					<h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
						<Home class="w-5 h-5" />
						Información básica
					</h2>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Título de la propiedad *
						</label>
						<input
							type="text"
							bind:value={title}
							placeholder="ej: Departamento de 2 ambientes en Palermo"
							class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Descripción *
						</label>
						<textarea
							bind:value={description}
							rows="4"
							placeholder="Describí tu propiedad, sus características, ventajas y ubicación..."
							class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
						></textarea>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Tipo de propiedad *
							</label>
							<select
								bind:value={propertyType}
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
							>
								<option value="">Seleccionar tipo</option>
								{#each propertyTypes as type}
									<option value={type}>{type}</option>
								{/each}
							</select>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Operación *
							</label>
							<div class="flex gap-2">
								<button
									type="button"
									on:click={() => operation = 'buy'}
									class="flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors {operation === 'buy' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								>
									Venta
								</button>
								<button
									type="button"
									on:click={() => operation = 'rent'}
									class="flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors {operation === 'rent' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								>
									Alquiler
								</button>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-2xl shadow-sm p-6 space-y-6">
					<h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
						<MapPin class="w-5 h-5" />
						Ubicación
					</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Ubicación *
							</label>
							<input
								type="text"
								bind:value={location}
								placeholder="ej: Palermo, Buenos Aires"
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Dirección *
							</label>
							<input
								type="text"
								bind:value={address}
								placeholder="ej: Fitz Roy 1547"
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
							/>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-2xl shadow-sm p-6 space-y-6">
					<h2 class="text-lg font-semibold text-gray-900">Precio</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Moneda
							</label>
							<div class="flex gap-2">
								<button
									type="button"
									on:click={() => currency = 'USD'}
									class="flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors {currency === 'USD' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								>
									USD
								</button>
								<button
									type="button"
									on:click={() => currency = 'ARS'}
									class="flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors {currency === 'ARS' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								>
									ARS
								</button>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Precio {currency === 'USD' ? '(USD)' : '(ARS)'} *
							</label>
							<input
								type="number"
								bind:value={price}
								placeholder={currency === 'USD' ? '185000' : '950000'}
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
							/>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-2xl shadow-sm p-6 space-y-6">
					<h2 class="text-lg font-semibold text-gray-900">Características</h2>

					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Dormitorios
							</label>
							<input
								type="number"
								bind:value={bedrooms}
								min="0"
								placeholder="0"
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Baños
							</label>
							<input
								type="number"
								bind:value={bathrooms}
								min="0"
								placeholder="0"
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Superficie (m²)
							</label>
							<input
								type="number"
								bind:value={area}
								min="0"
								placeholder="0"
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
							/>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-2xl shadow-sm p-6 space-y-6">
					<h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
						<Upload class="w-5 h-5" />
						Imágenes (máx. 5)
					</h2>

					<div class="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
						<input
							type="file"
							accept="image/*"
							multiple
							on:change={handleImageUpload}
							class="hidden"
							id="image-upload"
							disabled={images.length >= 5}
						/>
						<label
							for="image-upload"
							class="cursor-pointer"
							class:opacity-50={images.length >= 5}
							class:pointer-events-none={images.length >= 5}
						>
							<div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
								<Upload class="w-6 h-6 text-gray-400" />
							</div>
							<p class="text-gray-600 mb-1">Hacé clic para subir imágenes</p>
							<p class="text-sm text-gray-400">PNG, JPG hasta 5MB</p>
						</label>
					</div>

					{#if imagePreviews.length > 0}
						<div class="grid grid-cols-2 md:grid-cols-5 gap-4">
							{#each imagePreviews as preview, index}
								<div class="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
									<img src={preview} alt="Preview {index + 1}" class="w-full h-full object-cover" />
									<button
										type="button"
										on:click={() => removeImage(index)}
										class="absolute top-1 right-1 p-1 bg-white/90 rounded-full hover:bg-white"
									>
										<X class="w-4 h-4 text-gray-600" />
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<div class="flex justify-end gap-4">
					<button
						type="button"
						on:click={() => goto('{base}/mis-propiedades')}
						class="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg transition-colors hover:bg-gray-50"
					>
						Cancelar
					</button>
					<button
						type="submit"
						class="px-8 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
					>
						{isEditing ? 'Guardar cambios' : 'Publicar propiedad'}
					</button>
				</div>
			</form>
		</div>
	{/if}
</main>
