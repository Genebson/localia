<script lang="ts">
	import { X, ChevronDown } from 'lucide-svelte';
	import { filters, syncFiltersToUrl } from '$lib/stores/filters';

	export let isOpen = false;
	export let onClose: () => void = () => {};

	let priceSyncTimer: ReturnType<typeof setTimeout>;

	let expandedSections: Record<string, boolean> = {
		operation: true,
		estado: true,
		rooms: true,
		features: false,
		floor: false,
		energy: false,
		multimedia: false,
		adType: false,
		date: false
	};

	function toggleSection(key: string) {
		expandedSections[key] = !expandedSections[key];
	}

	function clearFilters() {
		filters.reset();
	}

	function toggleOperation(op: 'buy' | 'rent') {
		const currentOps = $filters.operation;
		if (currentOps === 'all') filters.setOperation(op);
		else if (currentOps === op) filters.setOperation('all');
		else filters.setOperation(op);
		syncFiltersToUrl();
	}

	function handleMinPrice(value: string) {
		filters.setMinPrice(value);
		clearTimeout(priceSyncTimer);
		priceSyncTimer = setTimeout(syncFiltersToUrl, 500);
	}

	function handleMaxPrice(value: string) {
		filters.setMaxPrice(value);
		clearTimeout(priceSyncTimer);
		priceSyncTimer = setTimeout(syncFiltersToUrl, 500);
	}

	const featureList = [
		'Admite mascotas', 'Aire acondicionado', 'Armarios empotrados', 'Ascensor',
		'Balcón / Terraza', 'Exterior', 'Garaje', 'Jardín', 'Piscina', 'Trastero', 'Vivienda accesible'
	];

	const featureMap: Record<string, string> = {
		'Admite mascotas': 'petFriendly',
		'Aire acondicionado': 'airConditioning',
		'Armarios empotrados': 'builtInWardrobes',
		'Ascensor': 'elevator',
		'Balcón / Terraza': 'balcony',
		'Exterior': 'outdoor',
		'Garaje': 'garage',
		'Jardín': 'garden',
		'Piscina': 'pool',
		'Trastero': 'storageRoom',
		'Vivienda accesible': 'accessible'
	};

	function setFloorValue(val: string) {
		filters.setFloor($filters.floor === val ? '' as FloorLevel : val as FloorLevel);
		syncFiltersToUrl();
	}

	function setEnergyValue(val: string) {
		filters.setEnergyRating($filters.energyRating === val ? '' as EnergyRating : val as EnergyRating);
		syncFiltersToUrl();
	}

	function setEstadoValue(val: string) {
		filters.setEstado($filters.estado === val ? '' as PropertyState : val as PropertyState);
		syncFiltersToUrl();
	}

	function setPublishedValue(days: number | null) {
		filters.setPublishedDays($filters.publishedDays === days ? null : days);
		syncFiltersToUrl();
	}

	function toggleFeature(label: string) {
		filters.toggleFeature(featureMap[label]);
		syncFiltersToUrl();
	}

	function isFeatureActive(label: string): boolean {
		return $filters.features.includes(featureMap[label]);
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 md:hidden">
		<div class="absolute inset-0 bg-black/50" on:click={onClose} on:keydown={(e) => e.key === 'Escape' && onClose()} role="button" tabindex="0" aria-label="Cerrar filtros"></div>
		<div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
			<div class="sticky top-0 flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
				<h2 class="font-semibold text-lg text-gray-900">Filtros</h2>
				<button on:click={onClose} class="p-2 hover:bg-gray-100 rounded-full transition-colors">
					<X class="w-5 h-5 text-gray-500" />
				</button>
			</div>
			<div class="p-4 space-y-2">
				<div>
					<button on:click={() => toggleSection('operation')} class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900">
						Operación
						<ChevronDown class="w-4 h-4 text-gray-400 transition-transform {expandedSections.operation ? 'rotate-180' : ''}" />
					</button>
					{#if expandedSections.operation}
						<div class="flex gap-2 pb-3">
							<button on:click={() => { filters.setOperation('buy'); syncFiltersToUrl(); }} class="flex-1 py-2 rounded-lg text-sm font-medium {$filters.operation === 'buy' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">Comprar</button>
							<button on:click={() => { filters.setOperation('rent'); syncFiltersToUrl(); }} class="flex-1 py-2 rounded-lg text-sm font-medium {$filters.operation === 'rent' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">Alquilar</button>
						</div>
					{/if}
				</div>

				<div>
					<button on:click={() => toggleSection('estado')} class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900">
						Estado
						<ChevronDown class="w-4 h-4 text-gray-400 transition-transform {expandedSections.estado ? 'rotate-180' : ''}" />
					</button>
					{#if expandedSections.estado}
						<div class="flex flex-wrap gap-2 pb-3">
							{#each ['Obra nueva', 'Buen estado', 'A reformar'] as opt}
								<button on:click={() => { filters.setEstado(opt === 'Obra nueva' ? 'nueva' : opt === 'Buen estado' ? 'bueno' : 'reformar'); syncFiltersToUrl(); }}
									class="px-3 py-1.5 rounded-full text-sm {$filters.estado === (opt === 'Obra nueva' ? 'nueva' : opt === 'Buen estado' ? 'bueno' : 'reformar') ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
									{opt}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<div>
					<button on:click={() => toggleSection('rooms')} class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900">
						Habitaciones y baños
						<ChevronDown class="w-4 h-4 text-gray-400 transition-transform {expandedSections.rooms ? 'rotate-180' : ''}" />
					</button>
					{#if expandedSections.rooms}
						<div class="space-y-3 pb-3">
							<div>
								<p class="text-xs text-gray-500 mb-1.5">Habitaciones</p>
								<div class="flex gap-2">
									{#each [0, 1, 2, 3, 4] as n}
										<button on:click={() => { filters.setRooms($filters.rooms === n ? null : n); syncFiltersToUrl(); }}
											class="flex-1 h-10 rounded-lg text-sm font-medium {$filters.rooms === n ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
											{n === 0 ? '0' : n === 4 ? '4+' : n}
										</button>
									{/each}
								</div>
							</div>
							<div>
								<p class="text-xs text-gray-500 mb-1.5">Baños</p>
								<div class="flex gap-2">
									{#each [1, 2, 3] as n}
										<button on:click={() => { filters.setBathrooms($filters.bathrooms === n ? null : n); syncFiltersToUrl(); }}
											class="flex-1 h-10 rounded-lg text-sm font-medium {$filters.bathrooms === n ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
											{n}{n === 3 ? '+' : ''}
										</button>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>

				<div>
					<button on:click={() => toggleSection('features')} class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900">
						Características
						<ChevronDown class="w-4 h-4 text-gray-400 transition-transform {expandedSections.features ? 'rotate-180' : ''}" />
					</button>
					{#if expandedSections.features}
						<div class="flex flex-wrap gap-2 pb-3">
							{#each featureList as feat}
								<button on:click={() => toggleFeature(feat)}
									class="px-3 py-1.5 rounded-full text-sm {isFeatureActive(feat) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
									{feat}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<div>
					<button on:click={() => toggleSection('floor')} class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900">
						Planta
						<ChevronDown class="w-4 h-4 text-gray-400 transition-transform {expandedSections.floor ? 'rotate-180' : ''}" />
					</button>
					{#if expandedSections.floor}
						<div class="flex flex-wrap gap-2 pb-3">
							{#each [['Última planta', 'top'], ['Plantas intermedias', 'intermediate'], ['Bajos', 'ground']] as [label, val]}
								<button on:click={() => setFloorValue(val)}
									class="px-3 py-1.5 rounded-full text-sm {$filters.floor === val ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
									{label}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<div>
					<button on:click={() => toggleSection('energy')} class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900">
						Eficiencia energética
						<ChevronDown class="w-4 h-4 text-gray-400 transition-transform {expandedSections.energy ? 'rotate-180' : ''}" />
					</button>
					{#if expandedSections.energy}
						<div class="flex flex-wrap gap-2 pb-3">
							{#each [['Alta', 'alta'], ['Media', 'media'], ['Baja', 'baja']] as [label, val]}
								<button on:click={() => setEnergyValue(val)}
									class="px-3 py-1.5 rounded-full text-sm {$filters.energyRating === val ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
									{label}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<div>
					<button on:click={() => toggleSection('multimedia')} class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900">
						Multimedia
						<ChevronDown class="w-4 h-4 text-gray-400 transition-transform {expandedSections.multimedia ? 'rotate-180' : ''}" />
					</button>
					{#if expandedSections.multimedia}
						<div class="flex gap-2 pb-3">
							<button on:click={() => { filters.setBoolean('hasFloorPlan', $filters.hasFloorPlan === true ? null : true); syncFiltersToUrl(); }}
								class="px-3 py-1.5 rounded-full text-sm {$filters.hasFloorPlan === true ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">Con plano</button>
							<button on:click={() => { filters.setBoolean('hasVirtualTour', $filters.hasVirtualTour === true ? null : true); syncFiltersToUrl(); }}
								class="px-3 py-1.5 rounded-full text-sm {$filters.hasVirtualTour === true ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">Con visita virtual</button>
						</div>
					{/if}
				</div>

				<div>
					<button on:click={() => toggleSection('adType')} class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900">
						Tipo de anuncio
						<ChevronDown class="w-4 h-4 text-gray-400 transition-transform {expandedSections.adType ? 'rotate-180' : ''}" />
					</button>
					{#if expandedSections.adType}
						<div class="pb-3">
							<button on:click={() => { filters.setBoolean('isFromBank', $filters.isFromBank === true ? null : true); syncFiltersToUrl(); }}
								class="px-3 py-1.5 rounded-full text-sm {$filters.isFromBank === true ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
								De bancos
							</button>
						</div>
					{/if}
				</div>

				<div>
					<button on:click={() => toggleSection('date')} class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900">
						Fecha de publicación
						<ChevronDown class="w-4 h-4 text-gray-400 transition-transform {expandedSections.date ? 'rotate-180' : ''}" />
					</button>
					{#if expandedSections.date}
						<div class="flex flex-wrap gap-2 pb-3">
							{#each [['Últimas 24 horas', 1], ['La última semana', 7], ['El último mes', 30]] as [label, days]}
								<button on:click={() => { filters.setPublishedDays($filters.publishedDays === days ? null : days); syncFiltersToUrl(); }}
									class="px-3 py-1.5 rounded-full text-sm {$filters.publishedDays === days ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
									{label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
			<div class="sticky bottom-0 p-4 border-t border-gray-100 bg-white">
				<button on:click={clearFilters} class="w-full py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
					Limpiar filtros
				</button>
			</div>
		</div>
	</div>
{/if}

<aside class="hidden lg:block w-72 flex-shrink-0">
	<div class="sticky top-24 bg-white rounded-xl shadow-sm p-5 space-y-1">
		<div class="flex items-center justify-between mb-4">
			<h2 class="font-semibold text-lg text-gray-900">Filtros</h2>
			<button on:click={clearFilters} class="text-sm text-primary hover:text-primary-light transition-colors">Limpiar</button>
		</div>

		{#each [
			{ key: 'operation', label: 'Operación' },
			{ key: 'estado', label: 'Estado' },
			{ key: 'rooms', label: 'Habitaciones y baños' },
			{ key: 'features', label: 'Características' },
			{ key: 'floor', label: 'Planta' },
			{ key: 'energy', label: 'Eficiencia energética' },
			{ key: 'multimedia', label: 'Multimedia' },
			{ key: 'adType', label: 'Tipo de anuncio' },
			{ key: 'date', label: 'Fecha de publicación' }
		] as section}
			<div class="border-b border-gray-100 last:border-0">
				<button on:click={() => toggleSection(section.key)} class="w-full flex items-center justify-between py-3 text-sm font-medium text-gray-900">
					{section.label}
					<ChevronDown class="w-4 h-4 text-gray-400 transition-transform {expandedSections[section.key] ? 'rotate-180' : ''}" />
				</button>

				{#if expandedSections[section.key]}
					<div class="pb-3">
						{#if section.key === 'operation'}
							<div class="space-y-2">
								<label class="flex items-center gap-3 cursor-pointer group">
									<input type="radio" name="op" checked={$filters.operation === 'all'} on:change={() => { filters.setOperation('all'); syncFiltersToUrl(); }} class="w-4 h-4 text-primary" />
									<span class="text-sm text-gray-600 group-hover:text-gray-900">Todas</span>
								</label>
								<label class="flex items-center gap-3 cursor-pointer group">
									<input type="radio" name="op" checked={$filters.operation === 'buy'} on:change={() => { filters.setOperation('buy'); syncFiltersToUrl(); }} class="w-4 h-4 text-primary" />
									<span class="text-sm text-gray-600 group-hover:text-gray-900">Comprar</span>
								</label>
								<label class="flex items-center gap-3 cursor-pointer group">
									<input type="radio" name="op" checked={$filters.operation === 'rent'} on:change={() => { filters.setOperation('rent'); syncFiltersToUrl(); }} class="w-4 h-4 text-primary" />
									<span class="text-sm text-gray-600 group-hover:text-gray-900">Alquilar</span>
								</label>
							</div>

						{:else if section.key === 'estado'}
							<div class="space-y-2">
								{#each [['Obra nueva', 'nueva'], ['Buen estado', 'bueno'], ['A reformar', 'reformar']] as [label, val]}
									<label class="flex items-center gap-3 cursor-pointer group">
										<input type="radio" name="estado" checked={$filters.estado === val} on:change={() => setEstadoValue(val)} class="w-4 h-4 text-primary" />
										<span class="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
									</label>
								{/each}
							</div>

						{:else if section.key === 'rooms'}
							<div class="space-y-3">
								<div>
									<p class="text-xs text-gray-500 mb-1.5">Habitaciones</p>
									<div class="flex gap-1">
										{#each [0, 1, 2, 3, 4] as n}
											<button on:click={() => { filters.setRooms($filters.rooms === n ? null : n); syncFiltersToUrl(); }}
												class="flex-1 h-9 rounded-lg text-xs font-medium {$filters.rooms === n ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
												{n === 0 ? '0' : n === 4 ? '4+' : n}
											</button>
										{/each}
									</div>
								</div>
								<div>
									<p class="text-xs text-gray-500 mb-1.5">Baños</p>
									<div class="flex gap-1">
										{#each [1, 2, 3] as n}
											<button on:click={() => { filters.setBathrooms($filters.bathrooms === n ? null : n); syncFiltersToUrl(); }}
												class="flex-1 h-9 rounded-lg text-xs font-medium {$filters.bathrooms === n ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
												{n}{n === 3 ? '+' : ''}
											</button>
										{/each}
									</div>
								</div>
							</div>

						{:else if section.key === 'features'}
							<div class="space-y-2">
								{#each featureList as feat}
									<label class="flex items-center gap-3 cursor-pointer group">
										<input type="checkbox" checked={isFeatureActive(feat)} on:change={() => toggleFeature(feat)} class="w-4 h-4 text-primary rounded" />
										<span class="text-sm text-gray-600 group-hover:text-gray-900">{feat}</span>
									</label>
								{/each}
							</div>

						{:else if section.key === 'floor'}
							<div class="space-y-2">
								{#each [['Última planta', 'top'], ['Plantas intermedias', 'intermediate'], ['Bajos', 'ground']] as [label, val]}
									<label class="flex items-center gap-3 cursor-pointer group">
										<input type="radio" name="floor" checked={$filters.floor === val} on:change={() => setFloorValue(val)} class="w-4 h-4 text-primary" />
										<span class="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
									</label>
								{/each}
							</div>

						{:else if section.key === 'energy'}
							<div class="space-y-2">
								{#each [['Alta', 'alta'], ['Media', 'media'], ['Baja', 'baja']] as [label, val]}
									<label class="flex items-center gap-3 cursor-pointer group">
										<input type="radio" name="energy" checked={$filters.energyRating === val} on:change={() => setEnergyValue(val)} class="w-4 h-4 text-primary" />
										<span class="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
									</label>
								{/each}
							</div>

						{:else if section.key === 'multimedia'}
							<div class="space-y-2">
								<label class="flex items-center gap-3 cursor-pointer group">
									<input type="checkbox" checked={$filters.hasFloorPlan === true} on:change={() => { filters.setBoolean('hasFloorPlan', $filters.hasFloorPlan === true ? null : true); syncFiltersToUrl(); }} class="w-4 h-4 text-primary rounded" />
									<span class="text-sm text-gray-600 group-hover:text-gray-900">Con plano</span>
								</label>
								<label class="flex items-center gap-3 cursor-pointer group">
									<input type="checkbox" checked={$filters.hasVirtualTour === true} on:change={() => { filters.setBoolean('hasVirtualTour', $filters.hasVirtualTour === true ? null : true); syncFiltersToUrl(); }} class="w-4 h-4 text-primary rounded" />
									<span class="text-sm text-gray-600 group-hover:text-gray-900">Con visita virtual</span>
								</label>
							</div>

						{:else if section.key === 'adType'}
							<label class="flex items-center gap-3 cursor-pointer group">
								<input type="checkbox" checked={$filters.isFromBank === true} on:change={() => { filters.setBoolean('isFromBank', $filters.isFromBank === true ? null : true); syncFiltersToUrl(); }} class="w-4 h-4 text-primary rounded" />
								<span class="text-sm text-gray-600 group-hover:text-gray-900">De bancos</span>
							</label>

						{:else if section.key === 'date'}
							<div class="space-y-2">
								{#each [['Últimas 24 horas', 1], ['La última semana', 7], ['El último mes', 30]] as [label, days]}
									<label class="flex items-center gap-3 cursor-pointer group">
										<input type="radio" name="date" checked={$filters.publishedDays === days} on:change={() => { filters.setPublishedDays(days); syncFiltersToUrl(); }} class="w-4 h-4 text-primary" />
										<span class="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
									</label>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</aside>
