<script lang="ts">
	import {
		Search as SearchIcon,
		Phone,
		MapPin,
		Clock,
		Plus,
		X,
		Check,
		User
	} from 'lucide-svelte';
	import { searches as initialSearches, type Search } from '$lib/data/searches';
	import { currentUser, auth } from '$lib/stores/auth';
	import { authModalOpen } from '$lib/stores/authModal';
	import { writable, get } from 'svelte/store';
	import { onMount } from 'svelte';

	onMount(() => {
		auth.init();
	});

	const STORAGE_KEY = 'localia_tablero_searches';

	function loadFromStorage(): Search[] {
		if (typeof localStorage === 'undefined') return initialSearches;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				return initialSearches;
			}
		}
		return initialSearches;
	}

	function saveToStorage(searches: Search[]) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
		}
	}

	let allSearches = writable<Search[]>(loadFromStorage());
	allSearches.subscribe(saveToStorage);

	let selectedType = '';
	let showForm = false;
	let formSuccess = false;

	let formData = {
		name: '',
		type: '',
		zone: '',
		budget: '',
		message: '',
		phone: ''
	};

	const propertyTypes = [
		'Casa',
		'Departamento',
		'Terreno',
		'Galpón',
		'Local',
		'Chacra',
		'Quinta',
		'Oficina'
	];

	$: filteredSearches = selectedType
		? $allSearches.filter((s) => s.type === selectedType)
		: $allSearches;

	function getInitials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	function getWhatsAppLink(search: Search) {
		const msg = `Hola, vi tu búsqueda en Localia sobre ${search.type} en ${search.zone}. Tengo propiedades que te pueden interesar. "${search.message}"`;
		return `https://wa.me/${search.phone}?text=${encodeURIComponent(msg)}`;
	}

	function openForm() {
		if (!$currentUser) {
			authModalOpen.set(true);
			return;
		}
		formData.name = $currentUser.name;
		showForm = true;
	}

	function handleSubmit() {
		const newSearch: Search = {
			id: Date.now().toString(),
			name: formData.name,
			type: formData.type,
			zone: formData.zone,
			budget: formData.budget,
			message: formData.message,
			phone: formData.phone,
			timestamp: 0
		};
		allSearches.update((s) => {
			const updated = [newSearch, ...s];
			saveToStorage(updated);
			return updated;
		});
		formSuccess = true;
		showForm = false;
		setTimeout(() => {
			formSuccess = false;
			formData = { name: '', type: '', zone: '', budget: '', message: '', phone: '' };
		}, 3000);
	}
</script>

<svelte:head>
	<title>Tablero de búsquedas | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
			<div>
				<h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
					Buscamos propiedades
				</h1>
				<p class="text-gray-500">
					Encontrá compradores que buscan exactamente lo que tenés
				</p>
			</div>
			{#if $currentUser}
				<button
					on:click={openForm}
					class="flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto"
				>
					<Plus class="w-4 h-4 sm:w-5 sm:h-5" />
					Publicar búsqueda
				</button>
			{/if}
		</div>

		<div class="mb-6 flex flex-wrap gap-2">
			<button
				on:click={() => (selectedType = '')}
				class="px-4 py-2 rounded-full text-sm font-medium transition-colors {selectedType ===
				''
					? 'bg-primary text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
			>
				Todas
			</button>
			{#each propertyTypes as type}
				<button
					on:click={() => (selectedType = type)}
					class="px-4 py-2 rounded-full text-sm font-medium transition-colors {selectedType ===
					type
						? 'bg-primary text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					{type}
				</button>
			{/each}
		</div>

		{#if formSuccess}
			<div
				class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
			>
				<Check class="w-5 h-5 text-green-600" />
				<span class="text-green-700 font-medium">¡Búsqueda publicada exitosamente!</span>
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredSearches as search (search.id)}
				<div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
					<div class="flex items-start gap-3 mb-4">
						<div
							class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
						>
							<span class="text-primary font-semibold"
								>{getInitials(search.name)}</span
							>
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold text-gray-900 truncate">{search.name}</h3>
							<div class="flex items-center gap-1 text-sm text-gray-500">
								<Clock class="w-3 h-3" />
								<span
									>Hace {search.timestamp}
									{search.timestamp === 1 ? 'día' : 'días'}</span
								>
							</div>
						</div>
					</div>

					<div class="space-y-2 mb-4">
						<div class="flex items-center gap-2 text-sm">
							<span class="px-2 py-0.5 bg-primary/10 text-primary rounded font-medium"
								>{search.type}</span
							>
							<span class="font-semibold text-accent">{search.budget}</span>
						</div>
						<div class="flex items-center gap-1 text-sm text-gray-500">
							<MapPin class="w-4 h-4" />
							<span>{search.zone}</span>
						</div>
					</div>

					<p class="text-sm text-gray-600 mb-4 line-clamp-2">{search.message}</p>

					<a
						href={getWhatsAppLink(search)}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
					>
						<Phone class="w-4 h-4" />
						Contactar
					</a>
				</div>
			{/each}
		</div>

		{#if filteredSearches.length === 0}
			<div class="text-center py-16">
				<div
					class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<SearchIcon class="w-8 h-8 text-gray-400" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">No hay búsquedas</h3>
				<p class="text-gray-500">No hay búsquedas de este tipo en este momento.</p>
			</div>
		{/if}
	</div>

	{#if showForm}
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				class="absolute inset-0 bg-black/50"
				on:click={() => (showForm = false)}
				on:keydown={(e) => e.key === 'Escape' && (showForm = false)}
				role="button"
				tabindex="0"
				aria-label="Cerrar"
			></div>
			<div
				class="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
			>
				<button
					on:click={() => (showForm = false)}
					class="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
				>
					<X class="w-5 h-5 text-gray-500" />
				</button>
				<h2 class="text-xl font-bold text-gray-900 mb-6">Publicar mi búsqueda</h2>
				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Tu nombre</label
						>
						<input
							type="text"
							bind:value={formData.name}
							required
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"
							>Teléfono de contacto</label
						>
						<input
							type="tel"
							bind:value={formData.phone}
							required
							placeholder="Ej: 5491123456789"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"
							>Tipo de propiedad</label
						>
						<select
							bind:value={formData.type}
							required
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						>
							<option value="">Seleccionar...</option>
							{#each propertyTypes as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Zona</label>
						<input
							type="text"
							bind:value={formData.zone}
							required
							placeholder="Ej: Palermo, Buenos Aires"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"
							>Presupuesto</label
						>
						<input
							type="text"
							bind:value={formData.budget}
							required
							placeholder="Ej: USD 200.000"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
						<textarea
							bind:value={formData.message}
							rows="3"
							required
							placeholder="Describe qué estás buscando..."
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
						></textarea>
					</div>
					<button
						type="submit"
						class="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
					>
						Publicar búsqueda
					</button>
				</form>
			</div>
		</div>
	{/if}
</main>
