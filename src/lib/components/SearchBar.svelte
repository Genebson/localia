<script lang="ts">
	import { Search, MapPin } from 'lucide-svelte';
	import { filters, syncFiltersToUrl } from '$lib/stores/filters';

	let operation: 'buy' | 'rent' = 'buy';
	let location = '';
	let minPrice = '';
	let maxPrice = '';
	let currency: 'USD' | 'ARS' = 'USD';

	const zones = [
		{ label: 'Todas', value: '' },
		{ label: 'Centro', value: 'centro' },
		{ label: 'Barrio Norte', value: 'barrio-norte' },
		{ label: 'Barrio Sur', value: 'barrio-sur' },
		{ label: 'Zona del Club', value: 'zona-club' },
		{ label: 'Cerca de la plaza', value: 'plaza' }
	];

	function handleSubmit() {
		filters.setOperation(operation);
		filters.setLocation(location);
		filters.setCurrency(currency);
		filters.setMinPrice(minPrice);
		filters.setMaxPrice(maxPrice);
		syncFiltersToUrl();
		const propertiesSection = document.getElementById('properties');
		if (propertiesSection) {
			propertiesSection.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function selectZone(zoneValue: string) {
		filters.setZone(
			zoneValue as '' | 'plaza' | 'barrio-norte' | 'barrio-sur' | 'zona-club' | 'centro'
		);
		syncFiltersToUrl();
		const propertiesSection = document.getElementById('properties');
		if (propertiesSection) {
			propertiesSection.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function clearFilters() {
		operation = 'buy';
		location = '';
		minPrice = '';
		maxPrice = '';
		currency = 'USD';
		filters.reset();
	}
</script>

<div class="bg-white rounded-2xl shadow-xl p-4 md:p-6">
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<div class="flex gap-2 p-1 bg-gray-100 rounded-lg">
			<button
				type="button"
				on:click={() => (operation = 'buy')}
				class="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-150 {operation ===
				'buy'
					? 'bg-primary text-white shadow-sm'
					: 'text-gray-600 hover:text-gray-900'}"
			>
				Comprar
			</button>
			<button
				type="button"
				on:click={() => (operation = 'rent')}
				class="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-150 {operation ===
				'rent'
					? 'bg-primary text-white shadow-sm'
					: 'text-gray-600 hover:text-gray-900'}"
			>
				Alquilar
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-5 gap-3">
			<div class="md:col-span-2 relative">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
				<input
					type="text"
					bind:value={location}
					placeholder="Zona o barrio"
					class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
				/>
			</div>

			<select
				bind:value={currency}
				class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
			>
				<option value="USD">USD</option>
				<option value="ARS">ARS</option>
			</select>

			<input
				type="number"
				bind:value={minPrice}
				placeholder="Precio mínimo"
				class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
			/>

			<input
				type="number"
				bind:value={maxPrice}
				placeholder="Precio máximo"
				class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
			/>
		</div>

		<div class="space-y-3">
			<div class="flex items-center gap-2 text-sm text-gray-500">
				<MapPin class="w-4 h-4" />
				<span>Buscar por zona:</span>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each zones as zone}
					<button
						type="button"
						on:click={() => selectZone(zone.value)}
						class="px-4 py-2 rounded-full text-sm font-medium transition-colors {$filters.zone ===
						zone.value
							? 'bg-primary text-white'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
					>
						{zone.label}
					</button>
				{/each}
			</div>
		</div>

		<button
			type="submit"
			class="px-8 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors active:scale-[0.98]"
		>
			Buscar
		</button>
		<button
			type="button"
			on:click={clearFilters}
			class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
		>
			Limpiar
		</button>
	</form>
</div>
