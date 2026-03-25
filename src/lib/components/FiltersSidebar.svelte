<script lang="ts">
	import { X, ChevronDown } from 'lucide-svelte';
	import { filters, syncFiltersToUrl } from '$lib/stores/filters';
	import { type PropertyState, type Equipment } from '$lib/data/properties';

	export let isOpen = false;
	export let onClose: () => void = () => {};

	let priceSyncTimer: ReturnType<typeof setTimeout>;

	let expandedSections: Record<string, boolean> = {
		operation: true,
		estado: true,
		rooms: true,
		zone: true,
		features: false,
		equipamiento: false,
		date: false
	};

	function toggleSection(key: string) {
		expandedSections[key] = !expandedSections[key];
	}

	function clearFilters() {
		filters.reset();
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
		'Admite mascotas',
		'Aire acondicionado',
		'Armarios empotrados',
		'Ascensor',
		'Balcón / Terraza',
		'Exterior',
		'Garaje',
		'Jardín',
		'Piscina',
		'Trastero',
		'Vivienda accesible'
	];

	const featureMap: Record<string, string> = {
		'Admite mascotas': 'petFriendly',
		'Aire acondicionado': 'airConditioning',
		'Armarios empotrados': 'builtInWardrobes',
		Ascensor: 'elevator',
		'Balcón / Terraza': 'balcony',
		Exterior: 'outdoor',
		Garaje: 'garage',
		Jardín: 'garden',
		Piscina: 'pool',
		Trastero: 'storageRoom',
		'Vivienda accesible': 'accessible'
	};

	function setEstadoValue(val: string) {
		filters.setEstado($filters.estado === val ? ('' as PropertyState) : (val as PropertyState));
		syncFiltersToUrl();
	}

	function setEquipamientoValue(val: string) {
		filters.setEquipamiento(
			$filters.equipamiento === val ? ('' as Equipment) : (val as Equipment)
		);
		syncFiltersToUrl();
	}

	function setZoneValue(
		val: '' | 'plaza' | 'barrio-norte' | 'barrio-sur' | 'zona-club' | 'centro'
	) {
		filters.setZone($filters.zone === val ? '' : val);
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
	<!-- Mobile drawer -->
	<div class="fixed inset-0 z-50 md:hidden">
		<div
			class="absolute inset-0 bg-black/50"
			on:click={onClose}
			on:keydown={(e) => e.key === 'Escape' && onClose()}
			role="button"
			tabindex="0"
			aria-label="Cerrar filtros"
		></div>
		<div
			class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto"
		>
			<div
				class="sticky top-0 flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10"
			>
				<h2 class="font-semibold text-lg text-gray-900">Filtros</h2>
				<button
					on:click={onClose}
					class="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<X class="w-5 h-5 text-gray-500" />
				</button>
			</div>
			<div class="p-4 space-y-2">
				<!-- Operación -->
				<div>
					<button
						on:click={() => toggleSection('operation')}
						class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900"
					>
						Operación
						<ChevronDown
							class="w-4 h-4 text-gray-400 transition-transform {expandedSections.operation
								? 'rotate-180'
								: ''}"
						/>
					</button>
					{#if expandedSections.operation}
						<div class="flex gap-2 pb-3">
							<button
								on:click={() => {
									filters.setOperation('buy');
									syncFiltersToUrl();
								}}
								class="flex-1 py-2 rounded-lg text-sm font-medium {$filters.operation ===
								'buy'
									? 'bg-primary text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								>Comprar</button
							>
							<button
								on:click={() => {
									filters.setOperation('rent');
									syncFiltersToUrl();
								}}
								class="flex-1 py-2 rounded-lg text-sm font-medium {$filters.operation ===
								'rent'
									? 'bg-primary text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								>Alquilar</button
							>
						</div>
					{/if}
				</div>

				<!-- Estado -->
				<div>
					<button
						on:click={() => toggleSection('estado')}
						class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900"
					>
						Estado
						<ChevronDown
							class="w-4 h-4 text-gray-400 transition-transform {expandedSections.estado
								? 'rotate-180'
								: ''}"
						/>
					</button>
					{#if expandedSections.estado}
						<div class="flex flex-wrap gap-2 pb-3">
							{#each [['Obra nueva', 'nueva'], ['Buen estado', 'bueno'], ['A reformar', 'reformar']] as [label, val]}
								<button
									on:click={() => {
										setEstadoValue(val);
										syncFiltersToUrl();
									}}
									class="px-3 py-1.5 rounded-full text-sm {$filters.estado === val
										? 'bg-primary text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								>
									{label}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Habitaciones y baños -->
				<div>
					<button
						on:click={() => toggleSection('rooms')}
						class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900"
					>
						Habitaciones y baños
						<ChevronDown
							class="w-4 h-4 text-gray-400 transition-transform {expandedSections.rooms
								? 'rotate-180'
								: ''}"
						/>
					</button>
					{#if expandedSections.rooms}
						<div class="space-y-3 pb-3">
							<div>
								<p class="text-xs text-gray-500 mb-1.5">Habitaciones</p>
								<div class="flex gap-2">
									{#each [0, 1, 2, 3, 4] as n}
										<button
											on:click={() => {
												filters.setRooms($filters.rooms === n ? null : n);
												syncFiltersToUrl();
											}}
											class="flex-1 h-10 rounded-lg text-sm font-medium {$filters.rooms ===
											n
												? 'bg-primary text-white'
												: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
										>
											{n === 0 ? '0' : n === 4 ? '4+' : n}
										</button>
									{/each}
								</div>
							</div>
							<div>
								<p class="text-xs text-gray-500 mb-1.5">Baños</p>
								<div class="flex gap-2">
									{#each [1, 2, 3] as n}
										<button
											on:click={() => {
												filters.setBathrooms(
													$filters.bathrooms === n ? null : n
												);
												syncFiltersToUrl();
											}}
											class="flex-1 h-10 rounded-lg text-sm font-medium {$filters.bathrooms ===
											n
												? 'bg-primary text-white'
												: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
										>
											{n}{n === 3 ? '+' : ''}
										</button>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>

				<div>
					<button
						on:click={() => toggleSection('zone')}
						class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900"
					>
						Zona
						<ChevronDown
							class="w-4 h-4 text-gray-400 transition-transform {expandedSections.zone
								? 'rotate-180'
								: ''}"
						/>
					</button>
					{#if expandedSections.zone}
						<div class="flex flex-wrap gap-2 pb-3">
							{#each [['Cerca de la plaza', 'plaza'], ['Barrio Norte', 'barrio-norte'], ['Barrio Sur', 'barrio-sur'], ['Zona del Club', 'zona-club'], ['Centro', 'centro']] as [label, val]}
								<button
									on:click={() => {
										setZoneValue(val);
									}}
									class="px-3 py-1.5 rounded-full text-sm {$filters.zone === val
										? 'bg-primary text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								>
									{label}
								</button>
					{/each}
					</div>
				</div>

				<!-- Características -->
				<div>
					<button
						on:click={() => toggleSection('features')}
						class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900"
					>
						Características
						<ChevronDown
							class="w-4 h-4 text-gray-400 transition-transform {expandedSections.features
								? 'rotate-180'
								: ''}"
						/>
					</button>
					{#if expandedSections.features}
						<div class="flex flex-wrap gap-2 pb-3">
							{#each featureList as feat}
								<button
									on:click={() => toggleFeature(feat)}
									class="px-3 py-1.5 rounded-full text-sm {isFeatureActive(feat)
										? 'bg-primary text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								>
									{feat}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Equipamiento -->
				<div>
					<button
						on:click={() => toggleSection('equipamiento')}
						class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900"
					>
						Equipamiento
						<ChevronDown
							class="w-4 h-4 text-gray-400 transition-transform {expandedSections.equipamiento
								? 'rotate-180'
								: ''}"
						/>
					</button>
					{#if expandedSections.equipamiento}
						<div class="flex flex-wrap gap-2 pb-3">
							{#each [['Amueblado', 'amueblado'], ['Solo cocina equipada', 'cocina-equipada']] as [label, val]}
								<button
									on:click={() => setEquipamientoValue(val)}
									class="px-3 py-1.5 rounded-full text-sm {$filters.equipamiento ===
									val
										? 'bg-primary text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								>
									{label}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Fecha de publicación -->
				<div>
					<button
						on:click={() => toggleSection('date')}
						class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900"
					>
						Fecha de publicación
						<ChevronDown
							class="w-4 h-4 text-gray-400 transition-transform {expandedSections.date
								? 'rotate-180'
								: ''}"
						/>
					</button>
					{#if expandedSections.date}
						<div class="flex flex-wrap gap-2 pb-3">
							{#each [['Últimas 24 horas', 1], ['La última semana', 7], ['El último mes', 30]] as [label, days]}
								<button
									on:click={() => {
										filters.setPublishedDays(
											$filters.publishedDays === days ? null : days
										);
										syncFiltersToUrl();
									}}
									class="px-3 py-1.5 rounded-full text-sm {$filters.publishedDays ===
									days
										? 'bg-primary text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								>
									{label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
			<div class="sticky bottom-0 p-4 border-t border-gray-100 bg-white">
				<button
					on:click={clearFilters}
					class="w-full py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
				>
					Limpiar filtros
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Desktop sidebar -->
<aside class="hidden lg:block w-72 flex-shrink-0">
	<div class="sticky top-24 bg-white rounded-xl shadow-sm p-5 space-y-1">
		<div class="flex items-center justify-between mb-4">
			<h2 class="font-semibold text-lg text-gray-900">Filtros</h2>
			<button
				on:click={clearFilters}
				class="text-sm text-primary hover:text-primary-light transition-colors"
				>Limpiar</button
			>
		</div>

		{#each [{ key: 'operation', label: 'Operación' }, { key: 'estado', label: 'Estado' }, { key: 'rooms', label: 'Habitaciones y baños' }, { key: 'zone', label: 'Zona' }, { key: 'features', label: 'Características' }, { key: 'equipamiento', label: 'Equipamiento' }, { key: 'date', label: 'Fecha de publicación' }] as section}
			<div class="border-b border-gray-100 last:border-0">
				<button
					on:click={() => toggleSection(section.key)}
					class="w-full flex items-center justify-between py-3 text-sm font-medium text-gray-900"
				>
					{section.label}
					<ChevronDown
						class="w-4 h-4 text-gray-400 transition-transform {expandedSections[
							section.key
						]
							? 'rotate-180'
							: ''}"
					/>
				</button>

				{#if expandedSections[section.key]}
					<div class="pb-3">
						{#if section.key === 'operation'}
							<div class="space-y-2">
								<label class="flex items-center gap-3 cursor-pointer group">
									<input
										type="radio"
										name="op"
										checked={$filters.operation === 'all'}
										on:change={() => {
											filters.setOperation('all');
											syncFiltersToUrl();
										}}
										class="w-4 h-4 text-primary"
									/>
									<span class="text-sm text-gray-600 group-hover:text-gray-900"
										>Todas</span
									>
								</label>
								<label class="flex items-center gap-3 cursor-pointer group">
									<input
										type="radio"
										name="op"
										checked={$filters.operation === 'buy'}
										on:change={() => {
											filters.setOperation('buy');
											syncFiltersToUrl();
										}}
										class="w-4 h-4 text-primary"
									/>
									<span class="text-sm text-gray-600 group-hover:text-gray-900"
										>Comprar</span
									>
								</label>
								<label class="flex items-center gap-3 cursor-pointer group">
									<input
										type="radio"
										name="op"
										checked={$filters.operation === 'rent'}
										on:change={() => {
											filters.setOperation('rent');
											syncFiltersToUrl();
										}}
										class="w-4 h-4 text-primary"
									/>
									<span class="text-sm text-gray-600 group-hover:text-gray-900"
										>Alquilar</span
									>
								</label>
							</div>
						{:else if section.key === 'estado'}
							<div class="space-y-2">
								{#each [['Obra nueva', 'nueva'], ['Buen estado', 'bueno'], ['A reformar', 'reformar']] as [label, val]}
									<label class="flex items-center gap-3 cursor-pointer group">
										<input
											type="radio"
											name="estado"
											checked={$filters.estado === val}
											on:change={() => {
												setEstadoValue(val);
												syncFiltersToUrl();
											}}
											class="w-4 h-4 text-primary"
										/>
										<span
											class="text-sm text-gray-600 group-hover:text-gray-900"
											>{label}</span
										>
									</label>
								{/each}
							</div>
						{:else if section.key === 'rooms'}
							<div class="space-y-3">
								<div>
									<p class="text-xs text-gray-500 mb-1.5">Habitaciones</p>
									<div class="flex gap-1">
										{#each [0, 1, 2, 3, 4] as n}
											<button
												on:click={() => {
													filters.setRooms(
														$filters.rooms === n ? null : n
													);
													syncFiltersToUrl();
												}}
												class="flex-1 h-9 rounded-lg text-xs font-medium {$filters.rooms ===
												n
													? 'bg-primary text-white'
													: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
											>
												{n === 0 ? '0' : n === 4 ? '4+' : n}
											</button>
										{/each}
									</div>
								</div>
								<div>
									<p class="text-xs text-gray-500 mb-1.5">Baños</p>
									<div class="flex gap-1">
										{#each [1, 2, 3] as n}
											<button
												on:click={() => {
													filters.setBathrooms(
														$filters.bathrooms === n ? null : n
													);
													syncFiltersToUrl();
												}}
												class="flex-1 h-9 rounded-lg text-xs font-medium {$filters.bathrooms ===
												n
													? 'bg-primary text-white'
													: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
											>
												{n}{n === 3 ? '+' : ''}
											</button>
										{/each}
									</div>
								</div>
							</div>
						{:else if section.key === 'zone'}
							<div class="space-y-3">
								<div class="flex flex-wrap gap-2">
									{#each [['Cerca de la plaza', 'plaza'], ['Barrio Norte', 'barrio-norte'], ['Barrio Sur', 'barrio-sur'], ['Zona del Club', 'zona-club'], ['Centro', 'centro']] as [label, val]}
										<label class="flex items-center gap-2 cursor-pointer">
											<input
												type="radio"
												name="zone"
												checked={$filters.zone === val}
												on:change={() => {
													setZoneValue(val);
												}}
												class="w-4 h-4 text-primary"
											/>
											<span
												class="text-sm text-gray-600 group-hover:text-gray-900"
												>{label}</span
											>
										</label>
									{/each}
								</div>
						{:else if section.key === 'features'}
							<div class="space-y-2">
								{#each featureList as feat}
									<label class="flex items-center gap-3 cursor-pointer group">
										<input
											type="checkbox"
											checked={isFeatureActive(feat)}
											on:change={() => toggleFeature(feat)}
											class="w-4 h-4 text-primary rounded"
										/>
										<span
											class="text-sm text-gray-600 group-hover:text-gray-900"
											>{feat}</span
										>
									</label>
								{/each}
							</div>
						{:else if section.key === 'equipamiento'}
							<div class="space-y-2">
								{#each [['Amueblado', 'amueblado'], ['Solo cocina equipada', 'cocina-equipada']] as [label, val]}
									<label class="flex items-center gap-3 cursor-pointer group">
										<input
											type="radio"
											name="equipamiento"
											checked={$filters.equipamiento === val}
											on:change={() => setEquipamientoValue(val)}
											class="w-4 h-4 text-primary"
										/>
										<span
											class="text-sm text-gray-600 group-hover:text-gray-900"
											>{label}</span
										>
									</label>
								{/each}
							</div>
						{:else if section.key === 'date'}
							<div class="space-y-2">
								{#each [['Últimas 24 horas', 1], ['La última semana', 7], ['El último mes', 30]] as [label, days]}
									<label class="flex items-center gap-3 cursor-pointer group">
										<input
											type="radio"
											name="date"
											checked={$filters.publishedDays === days}
											on:change={() => {
												filters.setPublishedDays(days);
												syncFiltersToUrl();
											}}
											class="w-4 h-4 text-primary"
										/>
										<span
											class="text-sm text-gray-600 group-hover:text-gray-900"
											>{label}</span
										>
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
