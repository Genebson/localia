<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import {
		Building2,
		Upload,
		X,
		MapPin,
		Home,
		User,
		Check,
		FileText,
		Link,
		Loader2,
		AlertCircle,
		ExternalLink
	} from 'lucide-svelte';
	import { auth, isAgent, currentUser } from '$lib/stores/auth';
	import { authModalOpen } from '$lib/stores/authModal';
	import { getPropertyById } from '$lib/stores/properties';
	import { onMount } from 'svelte';
	import type { PropertyType } from '$lib/data/properties';
	import { createProperty, updateProperty, uploadImage } from '$lib/api/properties';

	onMount(() => {
		auth.init();
	});

	let editId = $page.url.searchParams.get('edit');
	let isEditing = !!editId;

	// Publish mode: 'form' | 'file' | 'url'
	let publishMode: 'form' | 'file' | 'url' = 'form';

	// Form fields
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
	let createdPropertyId: string | null = null;
	let submitting = false;

	// File upload state
	let fileDragOver = false;
	let fileUploading = false;
	let fileExtractionProgress = 0;
	let fileExtractionDone = false;
	let selectedFile: File | null = null;

	// URL upload state
	let urlInput = '';
	let urlUploading = false;
	let urlExtractionProgress = 0;
	let urlExtractionDone = false;

	// Extracted data (from file or URL)
	let extractedData: {
		title: string;
		description: string;
		price: string;
		currency: 'USD' | 'ARS';
		operation: 'buy' | 'rent';
		location: string;
		address: string;
		bedrooms: string;
		bathrooms: string;
		area: string;
		propertyType: string;
	} | null = null;

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

	const propertyTypeMap: Record<string, PropertyType> = {
		Departamento: 'apartment',
		Casa: 'house',
		PH: 'apartment',
		'Local comercial': 'commercial',
		Oficina: 'commercial',
		Terreno: 'terrain',
		Quincho: 'house',
		Dúplex: 'apartment',
		Penthouse: 'penthouse'
	};

	const propertyTypeLabels: Record<string, string> = {
		apartment: 'Departamento',
		house: 'Casa',
		penthouse: 'Penthouse',
		terrain: 'Terreno',
		commercial: 'Local comercial'
	};

	if (isEditing) {
		const existing = getPropertyById(editId);
		if (existing) {
			title = existing.title;
			description = existing.description || '';
			operation = existing.operation;
			propertyType = propertyTypeLabels[existing.propertyType] || '';
			price = existing.price.toString();
			currency = existing.currency;
			location = existing.location;
			address = existing.address;
			bedrooms = existing.attributes.bedrooms.toString();
			bathrooms = existing.attributes.bathrooms.toString();
			area = existing.attributes.area.toString();
			if (existing.images?.length) imagePreviews = existing.images;
			publishMode = 'form';
		}
	}

	function handleLoginRedirect() {
		authModalOpen.set(true);
	}

	function applyExtractedData() {
		if (!extractedData) return;
		title = extractedData.title;
		description = extractedData.description;
		operation = extractedData.operation;
		propertyType = extractedData.propertyType;
		price = extractedData.price;
		currency = extractedData.currency;
		location = extractedData.location;
		address = extractedData.address;
		bedrooms = extractedData.bedrooms;
		bathrooms = extractedData.bathrooms;
		area = extractedData.area;
		publishMode = 'form';
		fileExtractionDone = false;
		urlExtractionDone = false;
		extractedData = null;
	}

	function simulateExtraction(source: string) {
		const interval = setInterval(() => {
			if (source === 'file') fileExtractionProgress += Math.random() * 15;
			else urlExtractionProgress += Math.random() * 15;

			const progress = source === 'file' ? fileExtractionProgress : urlExtractionProgress;

			if (progress >= 100) {
				clearInterval(interval);
				if (source === 'file') {
					fileExtractionProgress = 100;
					fileUploading = false;
					fileExtractionDone = true;
				} else {
					urlExtractionProgress = 100;
					urlUploading = false;
					urlExtractionDone = true;
				}

				const hints = (
					source === 'file' ? selectedFile?.name || '' : urlInput
				).toLowerCase();
				const isRent = hints.includes('alquiler') || hints.includes('rent');
				const isHouse =
					hints.includes('casa') || hints.includes('house') || hints.includes('chalet');
				const isTerrain = hints.includes('terreno') || hints.includes('land');

				extractedData = {
					title: (selectedFile
						? selectedFile.name
								.replace(/\.[^/.]+$/, '')
								.replace(/[-_]/g, ' ')
								.replace(/\b\w/g, (l) => l.toUpperCase())
						: `Propiedad en ${new URL(urlInput).hostname.replace('www.', '').split('.')[0]}`
					).slice(0, 80),
					description:
						'Excelente propiedad en ubicación privilegiada. Ambientes luminosos, buena distribución, cercanía a medios de transporte y comercios. Ideal para vivir o invertir.',
					price: String(Math.floor(Math.random() * 500000) + 100000),
					currency: isRent ? 'ARS' : 'USD',
					operation: isRent ? 'rent' : 'buy',
					location: isTerrain
						? 'Nordelta, Tigre'
						: isHouse
							? 'Olivos, Vicente López'
							: 'Palermo, Buenos Aires',
					address: isTerrain ? 'Manzana 12 Lote 45' : 'Av. Santa Fe 2456',
					bedrooms: isHouse
						? '4'
						: isTerrain
							? '0'
							: String(Math.floor(Math.random() * 3) + 1),
					bathrooms: isHouse
						? '3'
						: isTerrain
							? '0'
							: String(Math.floor(Math.random() * 2) + 1),
					area: isTerrain
						? String(Math.floor(Math.random() * 2000) + 500)
						: isHouse
							? String(Math.floor(Math.random() * 200) + 120)
							: String(Math.floor(Math.random() * 80) + 40),
					propertyType: isTerrain ? 'Terreno' : isHouse ? 'Casa' : 'Departamento'
				};
			}
		}, 200);
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files?.[0]) {
			selectedFile = input.files[0];
			fileUploading = true;
			fileExtractionProgress = 0;
			fileExtractionDone = false;
			simulateExtraction('file');
		}
	}

	function handleDrop(e: DragEvent) {
		fileDragOver = false;
		if (e.dataTransfer?.files?.[0]) {
			selectedFile = e.dataTransfer.files[0];
			fileUploading = true;
			fileExtractionProgress = 0;
			fileExtractionDone = false;
			simulateExtraction('file');
		}
	}

	function handleUrlSubmit() {
		if (!urlInput.trim()) return;
		urlUploading = true;
		urlExtractionProgress = 0;
		urlExtractionDone = false;
		simulateExtraction('url');
	}

	async function handleSubmit() {
		if (extractedData) applyExtractedData();
		error = '';
		if (!title.trim() || !price || !location) {
			error = 'Completá los campos obligatorios: título, precio y ubicación.';
			return;
		}
		if (!propertyType) {
			error = 'Seleccioná el tipo de propiedad.';
			return;
		}

		submitting = true;
		try {
			// Upload new images first
			const uploadedImages: string[] = [];
			for (const file of images) {
				try {
					const url = await uploadImage(file);
					uploadedImages.push(url);
				} catch {
					// Fall back to preview URL if upload fails
					const reader = new FileReader();
					const result = await new Promise<string>((resolve) => {
						reader.onload = (e) => resolve(e.target?.result as string);
						reader.readAsDataURL(file);
					});
					uploadedImages.push(result);
				}
			}

			// If editing with existing images that weren't changed, keep them
			const existingImages = isEditing
				? (getPropertyById(editId)?.images ?? []).filter((url) =>
						imagePreviews.includes(url)
					)
				: [];
			const allImages = [...existingImages, ...uploadedImages];

			const priceNum = parseInt(price);
			const apiData = {
				title: title.trim(),
				description: description || undefined,
				operation: operation as 'buy' | 'rent',
				propertyType: (propertyTypeMap[propertyType] || 'apartment') as
					| 'apartment'
					| 'house'
					| 'penthouse'
					| 'terrain'
					| 'commercial',
				price: priceNum,
				currency: currency as 'USD' | 'ARS',
				location,
				address: address || undefined,
				attributes: {
					bedrooms: parseInt(bedrooms) || 0,
					bathrooms: parseInt(bathrooms) || 0,
					area: parseInt(area) || 0,
				},
				images: allImages,
				featured: true,
			};

			if (isEditing && editId) {
				await updateProperty(editId, apiData);
				success = true;
			} else {
				const result = await createProperty(apiData);
				createdPropertyId = result.id;
				success = true;
			}
			window.scrollTo(0, 0);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error al guardar la propiedad';
		} finally {
			submitting = false;
		}
	}

	function handleImageUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files?.length) return;
		const total = Math.min(input.files.length, 5 - images.length);
		for (let i = 0; i < total; i++) {
			const file = input.files[i];
			if (images.length >= 5) break;
			const reader = new FileReader();
			reader.onload = (ev) => {
				const previews = [...imagePreviews, ev.target?.result as string];
				imagePreviews = previews;
				images = [...images, file];
			};
			reader.readAsDataURL(file);
		}
	}

	function removeImage(index: number) {
		imagePreviews = imagePreviews.filter((_, i) => i !== index);
		images = images.filter((_, i) => i !== index);
	}

	function distributeToPortal(portal: 'zonaprop' | 'argenprop' | 'mercadolibre') {
		const urls = {
			zonaprop: 'https://www.zonaprop.com.ar/publicar-propiedad.html',
			argenprop: 'https://www.argenprop.com.ar/Publicar',
			mercadolibre: 'https://www.mercadolibre.com.ar/anuncios/publicar'
		};
		window.open(urls[portal], '_blank', 'noopener,noreferrer');
	}
</script>

<svelte:head>
	<title>{isEditing ? 'Editar' : 'Publicar'} propiedad | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	{#if success}
		<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="bg-white rounded-2xl shadow-sm p-8 text-center">
				<div
					class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<Check class="w-8 h-8 text-green-600" />
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">
					{isEditing ? '¡Propiedad actualizada!' : '¡Propiedad publicada!'}
				</h1>
				<p class="text-gray-500 mb-6">
					{isEditing
						? 'Los cambios fueron guardados exitosamente.'
						: 'Tu propiedad fue publicada exitosamente.'}
				</p>
				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					{#if !isEditing && createdPropertyId}
						<a
							href="{base}/property/{createdPropertyId}"
							class="px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
						>
							Ver publicación
						</a>
					{/if}
					<button
						on:click={() => goto(base + '/mis-propiedades')}
						class="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg transition-colors hover:bg-gray-50"
					>
						Mis propiedades
					</button>
				</div>
			</div>
		</div>
	{:else if !$currentUser}
		<div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="bg-white rounded-2xl shadow-sm p-8 text-center">
				<div
					class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<User class="w-8 h-8 text-primary" />
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">Iniciá sesión</h1>
				<p class="text-gray-500 mb-6">
					Tenés que iniciar sesión para {isEditing ? 'editar' : 'publicar'} propiedades.
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
				<div
					class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<Building2 class="w-8 h-8 text-primary" />
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">Solo para inmobiliarias</h1>
				<p class="text-gray-500 mb-4">
					Solo los agentes inmobiliarios pueden publicar propiedades.
				</p>
				<p class="text-gray-500 mb-6">
					Si tenés una matrícula profesional, registrate como agente.
				</p>
				<button
					on:click={handleLoginRedirect}
					class="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
				>
					Registrarme como agente
				</button>
			</div>
		</div>
	{:else}
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="mb-6">
				<h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
					{isEditing ? 'Editar propiedad' : 'Publicar propiedad'}
				</h1>
				<p class="text-gray-500">
					{isEditing
						? 'Modificá los datos de tu propiedad'
						: 'Elegí cómo querés publicar: completá el formulario, subí un archivo o usá un enlace.'}
				</p>
			</div>

			{#if !isEditing}
				<div class="flex gap-2 p-1 bg-gray-100 rounded-xl mb-8 w-fit">
					<button
						on:click={() => (publishMode = 'form')}
						class="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all {publishMode ===
						'form'
							? 'bg-white shadow-sm text-gray-900'
							: 'text-gray-500 hover:text-gray-700'}"
					>
						<Home class="w-4 h-4" />
						Formulario
					</button>
					<button
						on:click={() => (publishMode = 'file')}
						class="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all {publishMode ===
						'file'
							? 'bg-white shadow-sm text-gray-900'
							: 'text-gray-500 hover:text-gray-700'}"
					>
						<FileText class="w-4 h-4" />
						Subir archivo
					</button>
					<button
						on:click={() => (publishMode = 'url')}
						class="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all {publishMode ===
						'url'
							? 'bg-white shadow-sm text-gray-900'
							: 'text-gray-500 hover:text-gray-700'}"
					>
						<Link class="w-4 h-4" />
						Desde URL
					</button>
				</div>
			{/if}

			{#if error}
				<div
					class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2"
				>
					<AlertCircle class="w-4 h-4 flex-shrink-0" />
					{error}
				</div>
			{/if}

			{#if publishMode === 'file' && !isEditing}
				<div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
					{#if !fileExtractionDone}
						<div
							on:dragover|preventDefault={() => (fileDragOver = true)}
							on:dragleave={() => (fileDragOver = false)}
							on:drop|preventDefault={handleDrop}
							class="border-2 border-dashed rounded-xl p-12 text-center transition-colors {fileDragOver
								? 'border-primary bg-primary/5'
								: 'border-gray-200'}"
						>
							<FileText class="w-12 h-12 text-gray-300 mx-auto mb-4" />
							<p class="text-gray-600 mb-2">Arrastrá tu archivo acá o</p>
							<label class="cursor-pointer">
								<span
									class="text-primary font-medium hover:text-primary-light transition-colors"
									>buscalo en tu computadora</span
								>
								<input
									type="file"
									accept=".pdf,.doc,.docx,.txt"
									on:change={handleFileSelect}
									class="hidden"
								/>
							</label>
							<p class="text-xs text-gray-400 mt-3">PDF, Word o texto plano</p>
						</div>

						{#if fileUploading}
							<div class="mt-6">
								<div class="flex items-center gap-3 mb-2">
									<Loader2 class="w-5 h-5 text-primary animate-spin" />
									<span class="text-sm font-medium text-gray-600"
										>Extrayendo datos con IA...</span
									>
								</div>
								<div class="w-full bg-gray-100 rounded-full h-2">
									<div
										class="bg-primary h-2 rounded-full transition-all"
										style="width: {fileExtractionProgress}%"
									></div>
								</div>
							</div>
						{/if}
					{:else}
						<div class="text-center py-4">
							<div
								class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
							>
								<Check class="w-6 h-6 text-green-600" />
							</div>
							<p class="font-medium text-gray-900 mb-1">¡Datos extraídos!</p>
							<p class="text-sm text-gray-500 mb-4">
								Revisá la información y completá lo que falte en el formulario.
							</p>
							<div class="flex gap-3 justify-center">
								<button
									on:click={() => {
										fileExtractionDone = false;
										selectedFile = null;
										extractedData = null;
									}}
									class="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm"
								>
									Volver a subir
								</button>
								<button
									on:click={applyExtractedData}
									class="px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition-colors"
								>
									Usar datos extraídos
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/if}

			{#if publishMode === 'url' && !isEditing}
				<div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
					{#if !urlExtractionDone}
						<div class="flex gap-3">
							<input
								type="url"
								bind:value={urlInput}
								placeholder="https://..."
								class="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
							/>
							<button
								on:click={handleUrlSubmit}
								disabled={!urlInput.trim()}
								class="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Extraer
							</button>
						</div>

						{#if urlUploading}
							<div class="mt-6">
								<div class="flex items-center gap-3 mb-2">
									<Loader2 class="w-5 h-5 text-primary animate-spin" />
									<span class="text-sm font-medium text-gray-600"
										>Extrayendo datos con IA...</span
									>
								</div>
								<div class="w-full bg-gray-100 rounded-full h-2">
									<div
										class="bg-primary h-2 rounded-full transition-all"
										style="width: {urlExtractionProgress}%"
									></div>
								</div>
							</div>
						{/if}
					{:else}
						<div class="text-center py-4">
							<div
								class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
							>
								<Check class="w-6 h-6 text-green-600" />
							</div>
							<p class="font-medium text-gray-900 mb-1">¡Datos extraídos!</p>
							<p class="text-sm text-gray-500 mb-4">
								Revisá la información y completá lo que falte en el formulario.
							</p>
							<div class="flex gap-3 justify-center">
								<button
									on:click={() => {
										urlExtractionDone = false;
										urlInput = '';
										extractedData = null;
									}}
									class="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm"
								>
									Volver a intentar
								</button>
								<button
									on:click={applyExtractedData}
									class="px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition-colors"
								>
									Usar datos extraídos
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/if}

			{#if publishMode === 'form' || isEditing}
				<form on:submit|preventDefault={handleSubmit} class="space-y-8">
					<div class="bg-white rounded-2xl shadow-sm p-6 space-y-6">
						<h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
							<Home class="w-5 h-5" />
							Información básica
						</h2>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1"
								>Título de la propiedad *</label
							>
							<input
								type="text"
								bind:value={title}
								maxlength={70}
								placeholder="ej: Departamento de 2 ambientes en Palermo"
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1"
								>Descripción</label
							>
							<textarea
								bind:value={description}
								rows="4"
								placeholder="Descripción de la propiedad..."
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
							></textarea>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1"
									>Operación *</label
								>
								<select
									bind:value={operation}
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								>
									<option value="buy">Venta</option>
									<option value="rent">Alquiler</option>
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1"
									>Moneda</label
								>
								<select
									bind:value={currency}
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								>
									<option value="USD">USD</option>
									<option value="ARS">ARS</option>
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1"
									>Precio *</label
								>
								<input
									type="number"
									bind:value={price}
									placeholder="Ej: 185000"
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								/>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1"
									>Ubicación *</label
								>
								<input
									type="text"
									bind:value={location}
									placeholder="Ej: Palermo, Buenos Aires"
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1"
									>Dirección</label
								>
								<input
									type="text"
									bind:value={address}
									placeholder="Ej: Av. Santa Fe 2456"
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								/>
							</div>
						</div>

						<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1"
									>Tipo *</label
								>
								<select
									bind:value={propertyType}
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								>
									<option value="">Seleccionar...</option>
									{#each propertyTypes as type}
										<option value={type}>{type}</option>
									{/each}
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1"
									>Dormitorios</label
								>
								<input
									type="number"
									bind:value={bedrooms}
									min="0"
									placeholder="Ej: 2"
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1"
									>Baños</label
								>
								<input
									type="number"
									bind:value={bathrooms}
									min="0"
									placeholder="Ej: 1"
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1"
									>Superficie (m²)</label
								>
								<input
									type="number"
									bind:value={area}
									min="0"
									placeholder="Ej: 80"
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								/>
							</div>
						</div>
					</div>

					<div class="bg-white rounded-2xl shadow-sm p-6 space-y-4">
						<h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
							<Upload class="w-5 h-5" />
							Fotos de la propiedad
						</h2>

						<label
							class="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors {images.length >=
							5
								? 'opacity-50 pointer-events-none'
								: ''}"
						>
							<Upload class="w-5 h-5 text-gray-400" />
							<span class="text-sm text-gray-500">
								{images.length >= 5 ? 'Máximo 5 fotos' : 'Agregar fotos (máx. 5)'}
							</span>
							<input
								type="file"
								accept="image/*"
								multiple
								on:change={handleImageUpload}
								class="hidden"
							/>
						</label>

						{#if imagePreviews.length > 0}
							<div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
								{#each imagePreviews as preview, index}
									<div class="relative aspect-square rounded-lg overflow-hidden">
										<img
											src={preview}
											alt="Preview {index + 1}"
											class="w-full h-full object-cover"
										/>
										<button
											type="button"
											on:click={() => removeImage(index)}
											class="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
										>
											<X class="w-3 h-3" />
										</button>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					{#if !isEditing}
						<div class="bg-white rounded-2xl shadow-sm p-6">
							<h2 class="text-lg font-semibold text-gray-900 mb-4">
								Distribuir en otros portales
							</h2>
							<p class="text-sm text-gray-500 mb-4">
								Publicá la misma propiedad en otros portales con un solo clic.
							</p>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
								<button
									type="button"
									on:click={() => distributeToPortal('zonaprop')}
									class="flex items-center justify-between px-4 py-3 border border-gray-200 hover:border-primary rounded-lg transition-colors"
								>
									<span class="font-medium text-sm text-gray-700">ZonaProp</span>
									<ExternalLink class="w-4 h-4 text-gray-400" />
								</button>
								<button
									type="button"
									on:click={() => distributeToPortal('argenprop')}
									class="flex items-center justify-between px-4 py-3 border border-gray-200 hover:border-primary rounded-lg transition-colors"
								>
									<span class="font-medium text-sm text-gray-700">ArgenProp</span>
									<ExternalLink class="w-4 h-4 text-gray-400" />
								</button>
								<button
									type="button"
									on:click={() => distributeToPortal('mercadolibre')}
									class="flex items-center justify-between px-4 py-3 border border-gray-200 hover:border-primary rounded-lg transition-colors"
								>
									<span class="font-medium text-sm text-gray-700"
										>MercadoLibre</span
									>
									<ExternalLink class="w-4 h-4 text-gray-400" />
								</button>
							</div>
						</div>
					{/if}

					<div class="flex justify-end">
						<button
							type="submit"
							disabled={submitting}
							class="px-8 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? 'Publicando...' : isEditing ? 'Guardar cambios' : 'Publicar en Localia'}
						</button>
					</div>
				</form>
			{/if}
		</div>
	{/if}
</main>
