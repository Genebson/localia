<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { Upload, FileText, Link, Loader2, Check, AlertCircle, ExternalLink, X } from 'lucide-svelte';
	import { auth, isAgent, currentUser } from '$lib/stores/auth';
	import { authModalOpen } from '$lib/stores/authModal';
	import { propertiesStore } from '$lib/stores/properties';
	import type { PropertyType } from '$lib/data/properties';

	let uploadMode: 'file' | 'url' = 'file';
	let urlInput = '';
	let dragOver = false;
	let uploading = false;
	let extractionProgress = 0;
	let extractionDone = false;
	let uploadError = '';

	// Extracted data
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
	} = {
		title: '',
		description: '',
		price: '',
		currency: 'USD',
		operation: 'buy',
		location: '',
		address: '',
		bedrooms: '',
		bathrooms: '',
		area: '',
		propertyType: ''
	};

	// Form values (editable after extraction)
	let formData = { ...extractedData };
	let selectedFile: File | null = null;

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

	// Portal distribution state
	let distributed = {
		zonaprop: false,
		argenprop: false,
		mercadolibre: false
	};

	function simulateExtraction(fileName?: string) {
		uploading = true;
		extractionProgress = 0;
		extractionDone = false;
		uploadError = '';

		const interval = setInterval(() => {
			extractionProgress += Math.random() * 15;
			if (extractionProgress >= 100) {
				extractionProgress = 100;
				clearInterval(interval);

				// Simulated AI extraction based on file/URL hints
				const hints = (fileName || urlInput || '').toLowerCase();
				const isRent = hints.includes('alquiler') || hints.includes('rent') || hints.includes('alquiler');
				const isHouse = hints.includes('casa') || hints.includes('house') || hints.includes('chalet');
				const isTerrain = hints.includes('terreno') || hints.includes('land') || hints.includes('parcela');
				const isPenthouse = hints.includes('penthouse') || hints.includes('duplex') || hints.includes('dúplex');

				const sampleData = {
					title: fileName
						? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
						: urlInput
							? `Propiedad en ${new URL(urlInput).hostname.replace('www.', '').split('.')[0]}`
							: 'Departamento en Palermo',
					description: 'Excelente propiedad en ubicación privilegiada. Ambientes luminosos, buena distribución, cercanía a medios de transporte y comercios. Ideal para vivir o invertir.',
					price: String(Math.floor(Math.random() * 500000) + 100000),
					currency: isRent ? 'ARS' : 'USD',
					operation: isRent ? 'rent' : 'buy',
					location: isTerrain ? 'Nordelta, Tigre' : isHouse ? 'Olivos, Vicente López' : 'Palermo, Buenos Aires',
					address: isTerrain ? 'Manzana 12 Lote 45' : 'Av. Santa Fe 2456',
					bedrooms: isHouse ? '4' : isTerrain ? '0' : String(Math.floor(Math.random() * 3) + 1),
					bathrooms: isHouse ? '3' : isTerrain ? '0' : String(Math.floor(Math.random() * 2) + 1),
					area: isTerrain ? String(Math.floor(Math.random() * 2000) + 500) : isHouse ? String(Math.floor(Math.random() * 200) + 120) : String(Math.floor(Math.random() * 80) + 40),
					propertyType: isTerrain ? 'Terreno' : isHouse ? (isPenthouse ? 'Penthouse' : 'Casa') : 'Departamento'
				};

				extractedData = sampleData;
				formData = { ...sampleData };
				uploading = false;
				extractionDone = true;
			}
		}, 200);
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			selectedFile = input.files[0];
			simulateExtraction(selectedFile.name);
		}
	}

	function handleDrop(e: DragEvent) {
		dragOver = false;
		if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
			selectedFile = e.dataTransfer.files[0];
			simulateExtraction(selectedFile.name);
		}
	}

	function handleUrlSubmit() {
		if (!urlInput.trim()) return;
		simulateExtraction();
	}

	function publishToLocalia() {
		if (!$currentUser) {
			authModalOpen.set(true);
			return;
		}

		const priceNum = parseInt(formData.price);
		if (!priceNum || !formData.title || !formData.location) {
			uploadError = 'Completá los campos obligatorios: título, precio y ubicación.';
			return;
		}

		propertiesStore.add({
			title: formData.title,
			description: formData.description,
			price: priceNum,
			priceLabel: `${formData.currency === 'USD' ? 'USD' : '$'} ${priceNum.toLocaleString('es-AR')}${formData.operation === 'rent' ? '/mes' : ''}`,
			currency: formData.currency,
			location: formData.location,
			address: formData.address,
			image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
			propertyType: propertyTypeMap[formData.propertyType] || 'apartment',
			attributes: {
				bedrooms: parseInt(formData.bedrooms) || 0,
				bathrooms: parseInt(formData.bathrooms) || 0,
				area: parseInt(formData.area) || 0
			},
			operation: formData.operation,
			featured: true,
			agentEmail: $currentUser.email,
			isUserProperty: true
		});

		goto(`${base}/mis-propiedades`);
	}

	function distributeToPortal(portal: 'zonaprop' | 'argenprop' | 'mercadolibre') {
		const urls: Record<string, string> = {
			zonaprop: 'https://www.zonaprop.com.ar/publicar-propiedad.html',
			argenprop: 'https://www.argenprop.com.ar/Publicar',
			mercadolibre: 'https://www.mercadolibre.com.ar/anuncios/publicar'
		};
		window.open(urls[portal], '_blank', 'noopener,noreferrer');
	}
</script>

<svelte:head>
	<title>Subir propiedad | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Publicar desde archivo</h1>
			<p class="text-gray-500 mt-1">Subí un PDF, documento o enlace y publicá en Localia y otros portales.</p>
		</div>

		{#if !$isAgent}
			<div class="bg-accent/10 border border-accent/20 rounded-xl p-6 mb-8">
				<p class="text-gray-700 mb-4">Necesitás ser agente inmobiliario para publicar propiedades.</p>
				<button
					on:click={() => authModalOpen.set(true)}
					class="px-6 py-2 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
				>
					Iniciar sesión o registrarse
				</button>
			</div>
		{/if}

		{#if !extractionDone}
			<!-- Upload Section -->
			<div class="bg-white rounded-xl shadow-sm p-6 mb-8">
				<!-- Mode Toggle -->
				<div class="flex gap-2 mb-6">
					<button
						on:click={() => { uploadMode = 'file'; urlInput = ''; }}
						class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors {uploadMode === 'file' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
					>
						<FileText class="w-4 h-4" />
						Archivo
					</button>
					<button
						on:click={() => uploadMode = 'url'}
						class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors {uploadMode === 'url' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
					>
						<Link class="w-4 h-4" />
						URL
					</button>
				</div>

				{#if uploadMode === 'file'}
					<!-- File Upload -->
					<div
						on:dragover|preventDefault={() => dragOver = true}
						on:dragleave={() => dragOver = false}
						on:drop|preventDefault={handleDrop}
						class="border-2 border-dashed rounded-xl p-12 text-center transition-colors {dragOver ? 'border-primary bg-primary/5' : 'border-gray-200'}"
					>
						<Upload class="w-12 h-12 text-gray-300 mx-auto mb-4" />
						<p class="text-gray-600 mb-2">Arrastrá tu archivo acá o</p>
						<label class="cursor-pointer">
							<span class="text-primary font-medium hover:text-primary-light transition-colors">buscalo en tu computadora</span>
							<input
								type="file"
								accept=".pdf,.doc,.docx,.txt"
								on:change={handleFileSelect}
								class="hidden"
							/>
						</label>
						<p class="text-xs text-gray-400 mt-3">PDF, Word o texto plano</p>
					</div>
				{:else}
					<!-- URL Input -->
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
				{/if}

				{#if uploading}
					<!-- Extraction Progress -->
					<div class="mt-8">
						<div class="flex items-center gap-3 mb-2">
							<Loader2 class="w-5 h-5 text-primary animate-spin" />
							<span class="text-sm font-medium text-gray-600">Extrayendo datos con IA...</span>
						</div>
						<div class="w-full bg-gray-100 rounded-full h-2">
							<div
								class="bg-primary h-2 rounded-full transition-all duration-200"
								style="width: {extractionProgress}%"
							></div>
						</div>
						<div class="flex justify-between text-xs text-gray-400 mt-1">
							<span>Análisis de documento</span>
							<span>{Math.round(extractionProgress)}%</span>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Pre-filled Form -->
			<div class="space-y-6">
				{#if uploadError}
					<div class="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
						<AlertCircle class="w-5 h-5 flex-shrink-0" />
						<p class="text-sm">{uploadError}</p>
					</div>
				{/if}

				<!-- Title -->
				<div class="bg-white rounded-xl shadow-sm p-6">
					<h2 class="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
						<Check class="w-5 h-5 text-green-500" />
						Datos extraídos
					</h2>
					<p class="text-sm text-gray-500 mb-6">Revisá y completá la información antes de publicar.</p>

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
							<input
								type="text"
								bind:value={formData.title}
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								placeholder="Ej: Departamento de 2 ambientes en Palermo"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
							<textarea
								bind:value={formData.description}
								rows="4"
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
								placeholder="Descripción de la propiedad..."
							></textarea>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Operación *</label>
								<select
									bind:value={formData.operation}
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								>
									<option value="buy">Venta</option>
									<option value="rent">Alquiler</option>
								</select>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
								<select
									bind:value={formData.currency}
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								>
									<option value="USD">USD</option>
									<option value="ARS">ARS</option>
								</select>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
								<input
									type="number"
									bind:value={formData.price}
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
									placeholder="Ej: 185000"
								/>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
								<input
									type="text"
									bind:value={formData.location}
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
									placeholder="Ej: Palermo, Buenos Aires"
								/>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
								<input
									type="text"
									bind:value={formData.address}
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
									placeholder="Ej: Av. Santa Fe 2456"
								/>
							</div>
						</div>

						<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
								<select
									bind:value={formData.propertyType}
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								>
									{#each propertyTypes as type}
										<option value={type}>{type}</option>
									{/each}
								</select>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Dormitorios</label>
								<input
									type="number"
									bind:value={formData.bedrooms}
									min="0"
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								/>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Baños</label>
								<input
									type="number"
									bind:value={formData.bathrooms}
									min="0"
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								/>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
								<input
									type="number"
									bind:value={formData.area}
									min="0"
									class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Distribution -->
				<div class="bg-white rounded-xl shadow-sm p-6">
					<h2 class="font-semibold text-lg text-gray-900 mb-4">Distribuir en otros portales</h2>
					<p class="text-sm text-gray-500 mb-4">Publicá la misma propiedad en otros portales con un solo clic.</p>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
						<button
							on:click={() => distributeToPortal('zonaprop')}
							disabled={distributed.zonaprop}
							class="flex items-center justify-between px-4 py-3 border {distributed.zonaprop ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-primary'} rounded-lg transition-colors"
						>
							<span class="font-medium text-sm {distributed.zonaprop ? 'text-green-700' : 'text-gray-700'}">
								{distributed.zonaprop ? 'Publicado en ZonaProp' : 'ZonaProp'}
							</span>
							{#if distributed.zonaprop}
								<Check class="w-5 h-5 text-green-500" />
							{:else}
								<ExternalLink class="w-4 h-4 text-gray-400" />
							{/if}
						</button>

						<button
							on:click={() => distributeToPortal('argenprop')}
							disabled={distributed.argenprop}
							class="flex items-center justify-between px-4 py-3 border {distributed.argenprop ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-primary'} rounded-lg transition-colors"
						>
							<span class="font-medium text-sm {distributed.argenprop ? 'text-green-700' : 'text-gray-700'}">
								{distributed.argenprop ? 'Publicado en ArgenProp' : 'ArgenProp'}
							</span>
							{#if distributed.argenprop}
								<Check class="w-5 h-5 text-green-500" />
							{:else}
								<ExternalLink class="w-4 h-4 text-gray-400" />
							{/if}
						</button>

						<button
							on:click={() => distributeToPortal('mercadolibre')}
							disabled={distributed.mercadolibre}
							class="flex items-center justify-between px-4 py-3 border {distributed.mercadolibre ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-primary'} rounded-lg transition-colors"
						>
							<span class="font-medium text-sm {distributed.mercadolibre ? 'text-green-700' : 'text-gray-700'}">
								{distributed.mercadolibre ? 'Publicado en MercadoLibre' : 'MercadoLibre'}
							</span>
							{#if distributed.mercadolibre}
								<Check class="w-5 h-5 text-green-500" />
							{:else}
								<ExternalLink class="w-4 h-4 text-gray-400" />
							{/if}
						</button>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex items-center justify-between">
					<button
						on:click={() => { extractionDone = false; uploadError = ''; selectedFile = null; urlInput = ''; }}
						class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
					>
						<X class="w-4 h-4" />
						Volver a subir
					</button>

					<button
						on:click={publishToLocalia}
						class="px-8 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
					>
						Publicar en Localia
					</button>
				</div>
			</div>
		{/if}
	</div>
</main>
