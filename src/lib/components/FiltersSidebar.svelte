<script lang="ts">
	import { X } from 'lucide-svelte';
	import { filters } from '$lib/stores/filters';

	export let isOpen = false;
	export let onClose: () => void = () => {};

	function clearFilters() {
		filters.reset();
	}

	function toggleOperation(op: 'buy' | 'rent') {
		const currentOps = $filters.operation;
		if (currentOps === 'all') {
			filters.setOperation(op);
		} else if (currentOps === op) {
			if ($filters.operation !== 'all') {
				filters.setOperation('all');
			}
		} else {
			filters.setOperation(op);
		}
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 md:hidden">
		<div class="absolute inset-0 bg-black/50" on:click={onClose} on:keydown={(e) => e.key === 'Escape' && onClose()} role="button" tabindex="0" aria-label="Cerrar filtros"></div>
		<div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
			<div class="sticky top-0 flex items-center justify-between p-4 border-b border-gray-100 bg-white">
				<h2 class="font-semibold text-lg text-gray-900">Filtros</h2>
				<button on:click={onClose} class="p-2 hover:bg-gray-100 rounded-full transition-colors">
					<X class="w-5 h-5 text-gray-500" />
				</button>
			</div>
			<div class="p-4 space-y-6">
				<div>
					<h3 class="font-medium text-sm text-gray-700 mb-3">Tipo de operación</h3>
					<div class="flex gap-2">
						<button
							on:click={() => toggleOperation('buy')}
							class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {$filters.operation === 'buy' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						>
							Comprar
						</button>
						<button
							on:click={() => toggleOperation('rent')}
							class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {$filters.operation === 'rent' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						>
							Alquilar
						</button>
					</div>
				</div>

				<div>
					<h3 class="font-medium text-sm text-gray-700 mb-3">Moneda</h3>
					<div class="flex gap-2">
						<button
							on:click={() => filters.setCurrency('all')}
							class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors {$filters.currency === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						>
							Todas
						</button>
						<button
							on:click={() => filters.setCurrency('USD')}
							class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors {$filters.currency === 'USD' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						>
							USD
						</button>
						<button
							on:click={() => filters.setCurrency('ARS')}
							class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors {$filters.currency === 'ARS' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						>
							ARS
						</button>
					</div>
				</div>

				<div>
					<h3 class="font-medium text-sm text-gray-700 mb-3">Rango de precio ({$filters.currency === 'all' ? 'USD' : $filters.currency})</h3>
					<div class="flex gap-3">
						<input
							type="number"
							value={$filters.minPrice}
							on:input={(e) => filters.setMinPrice(e.currentTarget.value)}
							placeholder="Min"
							class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
						/>
						<input
							type="number"
							value={$filters.maxPrice}
							on:input={(e) => filters.setMaxPrice(e.currentTarget.value)}
							placeholder="Max"
							class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
						/>
					</div>
				</div>

				<div>
					<h3 class="font-medium text-sm text-gray-700 mb-3">Dormitorios</h3>
					<div class="flex gap-2">
						{#each [1, 2, 3, 4] as num}
							<button
								on:click={() => filters.setBedrooms($filters.bedrooms === num ? null : num)}
								class="w-12 h-12 rounded-lg text-sm font-medium transition-colors {$filters.bedrooms === num ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							>
								{num}{num === 4 ? '+' : ''}
							</button>
						{/each}
					</div>
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

<aside class="hidden lg:block w-72 flex-shrink-0">
	<div class="sticky top-24 bg-white rounded-xl shadow-sm p-5 space-y-6">
		<div class="flex items-center justify-between">
			<h2 class="font-semibold text-lg text-gray-900">Filtros</h2>
			<button on:click={clearFilters} class="text-sm text-primary hover:text-primary-light transition-colors">
				Limpiar
			</button>
		</div>

		<div>
			<h3 class="font-medium text-sm text-gray-700 mb-3">Tipo de operación</h3>
			<div class="space-y-2">
				<label class="flex items-center gap-3 cursor-pointer group">
					<input
						type="radio"
						name="operation"
						checked={$filters.operation === 'buy'}
						on:change={() => filters.setOperation('buy')}
						class="w-5 h-5 border-gray-300 text-primary focus:ring-primary"
					/>
					<span class="text-gray-600 group-hover:text-gray-900 transition-colors">Comprar</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer group">
					<input
						type="radio"
						name="operation"
						checked={$filters.operation === 'rent'}
						on:change={() => filters.setOperation('rent')}
						class="w-5 h-5 border-gray-300 text-primary focus:ring-primary"
					/>
					<span class="text-gray-600 group-hover:text-gray-900 transition-colors">Alquilar</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer group">
					<input
						type="radio"
						name="operation"
						checked={$filters.operation === 'all'}
						on:change={() => filters.setOperation('all')}
						class="w-5 h-5 border-gray-300 text-primary focus:ring-primary"
					/>
					<span class="text-gray-600 group-hover:text-gray-900 transition-colors">Todos</span>
				</label>
			</div>
		</div>

		<div>
			<h3 class="font-medium text-sm text-gray-700 mb-3">Moneda</h3>
			<div class="flex gap-2">
				<button
					on:click={() => filters.setCurrency('all')}
					class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors {$filters.currency === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					Todas
				</button>
				<button
					on:click={() => filters.setCurrency('USD')}
					class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors {$filters.currency === 'USD' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					USD
				</button>
				<button
					on:click={() => filters.setCurrency('ARS')}
					class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors {$filters.currency === 'ARS' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					ARS
				</button>
			</div>
		</div>

		<div>
			<h3 class="font-medium text-sm text-gray-700 mb-3">Rango de precio ({$filters.currency === 'all' ? 'USD' : $filters.currency})</h3>
			<div class="flex gap-3">
				<input
					type="number"
					value={$filters.minPrice}
					on:input={(e) => filters.setMinPrice(e.currentTarget.value)}
					placeholder="Min"
					class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
				/>
				<input
					type="number"
					value={$filters.maxPrice}
					on:input={(e) => filters.setMaxPrice(e.currentTarget.value)}
					placeholder="Max"
					class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
				/>
			</div>
		</div>

		<div>
			<h3 class="font-medium text-sm text-gray-700 mb-3">Dormitorios</h3>
			<div class="flex gap-2">
				{#each [1, 2, 3, 4] as num}
					<button
						on:click={() => filters.setBedrooms($filters.bedrooms === num ? null : num)}
						class="flex-1 h-10 rounded-lg text-sm font-medium transition-colors {$filters.bedrooms === num ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
					>
						{num}{num === 4 ? '+' : ''}
					</button>
				{/each}
			</div>
		</div>
	</div>
</aside>
