<script lang="ts">
	import { page } from '$app/stores';
	import { MapPin, Phone, X, CheckCircle, Clock, User } from 'lucide-svelte';
	import { loteos, type Parcel } from '$lib/data/masterplans';

	const lotoId = $page.params.id;
	const loto = loteos.find(l => l.id === lotoId);

	let selectedParcel: Parcel | null = null;
	let hoveredParcel: Parcel | null = null;
	let tooltipX = 0;
	let tooltipY = 0;

	const statusColors = {
		available: { bg: '#10B981', light: '#D1FAE5', text: 'Disponible' },
		reserved: { bg: '#F59E0B', light: '#FEF3C7', text: 'Reservado' },
		sold: { bg: '#EF4444', light: '#FEE2E2', text: 'Vendido' }
	};

	const manzanas = [...new Set(loto?.parcels.map(p => p.manzana) || [])].sort();

	function getParcelsByManzana(mz: string) {
		return loto?.parcels.filter(p => p.manzana === mz).sort((a, b) => a.lote.localeCompare(b.lote)) || [];
	}

	function handleParcelHover(event: MouseEvent, parcel: Parcel) {
		hoveredParcel = parcel;
		tooltipX = event.clientX + 10;
		tooltipY = event.clientY + 10;
	}

	function handleParcelLeave() {
		hoveredParcel = null;
	}

	function handleParcelClick(parcel: Parcel) {
		selectedParcel = parcel;
	}

	function closeModal() {
		selectedParcel = null;
	}

	function getWhatsAppLink(parcel: Parcel) {
		const msg = `Hola, me interesa el lote ${parcel.manzana}-${parcel.lote} en ${loto?.name}. Precio: USD ${parcel.price.toLocaleString()}.`;
		return `https://wa.me/?text=${encodeURIComponent(msg)}`;
	}
</script>

<svelte:head>
	<title>{loto?.name || 'Masterplan'} | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	{#if !loto}
		<div class="max-w-7xl mx-auto px-4 py-16 text-center">
			<h1 class="text-2xl font-bold text-gray-900 mb-4">Loteo no encontrado</h1>
			<p class="text-gray-500">El loteo que buscas no existe.</p>
		</div>
	{:else}
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="mb-8">
				<h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{loto.name}</h1>
				<div class="flex items-center gap-2 text-gray-500">
					<MapPin class="w-4 h-4" />
					<span>{loto.location}</span>
				</div>
				<p class="mt-2 text-gray-600">{loto.description}</p>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div class="lg:col-span-2">
					<div class="bg-white rounded-xl shadow-sm p-6">
						<div class="mb-4 flex items-center gap-4 text-sm">
							<span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-500"></span> Disponible</span>
							<span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-yellow-500"></span> Reservado</span>
							<span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-red-500"></span> Vendido</span>
						</div>
						<div class="flex flex-wrap gap-6 justify-center">
							{#each manzanas as mz}
								<div>
									<p class="text-center text-sm font-medium text-gray-500 mb-2">Manzana {mz}</p>
									<div class="flex flex-wrap gap-1 justify-center" style="max-width: 280px;">
										{#each getParcelsByManzana(mz) as parcel}
											<button
												on:mouseenter={(e) => handleParcelHover(e, parcel)}
												on:mouseleave={handleParcelLeave}
												on:click={() => handleParcelClick(parcel)}
												style="background-color: {statusColors[parcel.status].bg}; width: 36px; height: 36px; border-radius: 4px; font-size: 10px; font-weight: 600; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid transparent; transition: all 0.15s;"
												on:mouseenter={(e) => e.currentTarget.style.borderColor = '#1E3A5F'}
											>
												{parcel.lote}
											</button>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="lg:col-span-1">
					<div class="bg-white rounded-xl shadow-sm p-6">
						<h2 class="font-semibold text-lg text-gray-900 mb-4">Lotes disponibles</h2>
						<div class="space-y-3 max-h-96 overflow-y-auto">
							{#each loto.parcels.filter(p => p.status === 'available') as parcel}
								<button
									on:click={() => handleParcelClick(parcel)}
									class="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-primary hover:bg-primary/5 transition-colors"
								>
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-900">Manzana {parcel.manzana} - Lote {parcel.lote}</span>
										<span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">Disponible</span>
									</div>
									<div class="mt-1 flex items-center justify-between">
										<span class="text-sm text-gray-500">{parcel.size} m²</span>
										<span class="font-semibold text-accent">USD {parcel.price.toLocaleString()}</span>
									</div>
								</button>
							{/each}
							{#if loto.parcels.filter(p => p.status === 'available').length === 0}
								<p class="text-gray-500 text-sm text-center py-4">No hay lotes disponibles</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		{#if selectedParcel}
			<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div class="absolute inset-0 bg-black/50" on:click={closeModal} on:keydown={(e) => e.key === 'Escape' && closeModal()} role="button" tabindex="0" aria-label="Cerrar"></div>
				<div class="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
					<button on:click={closeModal} class="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full">
						<X class="w-5 h-5 text-gray-500" />
					</button>
					<div class="mb-4">
						<span class="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium" style="background-color: {statusColors[selectedParcel.status].light}; color: {statusColors[selectedParcel.status].bg};">
							{#if selectedParcel.status === 'available'}
								<CheckCircle class="w-4 h-4" />
							{:else if selectedParcel.status === 'reserved'}
								<Clock class="w-4 h-4" />
							{:else}
								<X class="w-4 h-4" />
							{/if}
							{statusColors[selectedParcel.status].text}
						</span>
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-2">Manzana {selectedParcel.manzana} - Lote {selectedParcel.lote}</h3>
					<div class="space-y-2 mb-6">
						<div class="flex justify-between text-gray-600">
							<span>Superficie</span>
							<span class="font-medium">{selectedParcel.size} m²</span>
						</div>
						<div class="flex justify-between text-gray-600">
							<span>Precio</span>
							<span class="font-bold text-xl text-accent">USD {selectedParcel.price.toLocaleString()}</span>
						</div>
					</div>
					{#if selectedParcel.status === 'available'}
						<a
							href={getWhatsAppLink(selectedParcel)}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
						>
							<Phone class="w-5 h-5" />
							Consultar por WhatsApp
						</a>
					{:else}
						<div class="flex items-center justify-center gap-2 w-full py-3 bg-gray-200 text-gray-500 font-semibold rounded-lg cursor-not-allowed">
							<X class="w-5 h-5" />
							{selectedParcel.status === 'reserved' ? 'Reservado' : 'Vendido'}
						</div>
					{/if}
				</div>
			</div>
		{/if}

		{#if hoveredParcel}
			<div
				class="fixed z-50 px-3 py-2 rounded-lg shadow-lg text-sm font-medium"
				style="left: {tooltipX}px; top: {tooltipY}px; background-color: {statusColors[hoveredParcel.status].bg}; color: white; pointer-events: none;"
			>
				Manzana {hoveredParcel.manzana} - Lote {hoveredParcel.lote}
				<br />
				<span style="opacity: 0.9;">USD {hoveredParcel.price.toLocaleString()} · {hoveredParcel.size} m²</span>
			</div>
		{/if}
	{/if}
</main>
