<script lang="ts">
	import { Search } from 'lucide-svelte';
	import { filters } from '$lib/stores/filters';

	let operation: 'buy' | 'rent' = 'buy';
	let location = '';

	function handleSubmit() {
		filters.setOperation(operation);
		filters.setLocation(location);
		const propertiesSection = document.getElementById('properties');
		if (propertiesSection) {
			propertiesSection.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<div class="bg-white rounded-2xl shadow-xl p-4 md:p-6">
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<div class="flex gap-2 p-1 bg-gray-100 rounded-lg">
			<button
				type="button"
				on:click={() => operation = 'buy'}
				class="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-150 {operation === 'buy' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
			>
				Comprar
			</button>
			<button
				type="button"
				on:click={() => operation = 'rent'}
				class="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-150 {operation === 'rent' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
			>
				Alquilar
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-4 gap-3">
			<div class="md:col-span-2 relative">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
				<input
					type="text"
					bind:value={location}
					placeholder="Ciudad, barrio o dirección"
					class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
				/>
			</div>

			<input
				type="number"
				placeholder="Precio mínimo"
				class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
			/>

			<input
				type="number"
				placeholder="Precio máximo"
				class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
			/>
		</div>

		<button
			type="submit"
			class="w-full md:w-auto md:px-12 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors active:scale-[0.98]"
		>
			Buscar
		</button>
	</form>
</div>
