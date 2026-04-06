<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Building2, Tag, Key, Building, TrendingUp, ShieldCheck, MapPin } from 'lucide-svelte';
	import { mercadoData } from '$lib/data/mercado';

	let chartCanvas: HTMLCanvasElement;
	let chartInstance: any = null;

	onMount(async () => {
		if (browser && chartCanvas) {
			const {
				Chart,
				BarController,
				BarElement,
				CategoryScale,
				LinearScale,
				Title,
				Tooltip,
				Legend
			} = await import('chart.js');

			Chart.register(
				BarController,
				BarElement,
				CategoryScale,
				LinearScale,
				Title,
				Tooltip,
				Legend
			);

			chartInstance = new Chart(chartCanvas, {
				type: 'bar',
				data: {
					labels: mercadoData.priceRanges.map((r) => r.label),
					datasets: [
						{
							label: 'Propiedades',
							data: mercadoData.priceRanges.map((r) => r.count),
							backgroundColor: [
								'rgba(59, 130, 246, 0.7)',
								'rgba(99, 102, 241, 0.7)',
								'rgba(139, 92, 246, 0.7)',
								'rgba(167, 139, 250, 0.7)'
							],
							borderColor: [
								'rgb(59, 130, 246)',
								'rgb(99, 102, 241)',
								'rgb(139, 92, 246)',
								'rgb(167, 139, 250)'
							],
							borderWidth: 1,
							borderRadius: 6
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							backgroundColor: 'rgba(0, 0, 0, 0.8)',
							titleFont: { size: 14 },
							bodyFont: { size: 13 },
							padding: 12,
							cornerRadius: 8
						}
					},
					scales: {
						y: {
							beginAtZero: true,
							grid: {
								color: 'rgba(0, 0, 0, 0.05)'
							},
							ticks: {
								font: { size: 12 }
							}
						},
						x: {
							grid: {
								display: false
							},
							ticks: {
								font: { size: 11 },
								maxRotation: 45,
								minRotation: 0
							}
						}
					}
				}
			});
		}

		return () => {
			if (chartInstance) {
				chartInstance.destroy();
			}
		};
	});

	const maxPropertyTypeCount = Math.max(...mercadoData.propertyTypes.map((p) => p.count));
</script>

<svelte:head>
	<title>Mercado | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-gray-50">
	<!-- Hero Section -->
	<section class="bg-gradient-to-br from-primary via-primary to-primary-light py-16 md:py-24">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
				Estadísticas del Mercado
			</h1>
			<p class="text-blue-100 text-lg max-w-2xl mx-auto">
				Datos y análisis del mercado inmobiliario en Mercedes
			</p>
		</div>
	</section>

	<!-- Key Metrics -->
	<section class="py-12 -mt-8">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<!-- Propiedades activas -->
				<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<div class="flex items-center gap-3 mb-3">
						<div class="p-2 bg-primary/10 rounded-lg">
							<Building2 class="w-5 h-5 text-primary" />
						</div>
					</div>
					<p class="text-3xl font-bold text-gray-900">{mercadoData.totalProperties}</p>
					<p class="text-gray-500 text-sm mt-1">Propiedades activas</p>
				</div>

				<!-- En venta -->
				<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<div class="flex items-center gap-3 mb-3">
						<div class="p-2 bg-accent/10 rounded-lg">
							<Tag class="w-5 h-5 text-accent" />
						</div>
					</div>
					<p class="text-3xl font-bold text-gray-900">{mercadoData.forSale}</p>
					<p class="text-gray-500 text-sm mt-1">En venta</p>
				</div>

				<!-- En alquiler -->
				<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<div class="flex items-center gap-3 mb-3">
						<div class="p-2 bg-green-100 rounded-lg">
							<Key class="w-5 h-5 text-green-600" />
						</div>
					</div>
					<p class="text-3xl font-bold text-gray-900">{mercadoData.forRent}</p>
					<p class="text-gray-500 text-sm mt-1">En alquiler</p>
				</div>

				<!-- Inmobiliarias activas -->
				<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<div class="flex items-center gap-3 mb-3">
						<div class="p-2 bg-purple-100 rounded-lg">
							<Building class="w-5 h-5 text-purple-600" />
						</div>
					</div>
					<p class="text-3xl font-bold text-gray-900">{mercadoData.agencies}</p>
					<p class="text-gray-500 text-sm mt-1">Inmobiliarias activas</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Property Type Distribution -->
	<section class="py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<h2 class="text-xl font-bold text-gray-900 mb-6">
					Distribución por tipo de propiedad
				</h2>
				<div class="space-y-4">
					{#each mercadoData.propertyTypes as propertyType}
						<div class="flex items-center gap-4">
							<span class="w-28 text-sm font-medium text-gray-700"
								>{propertyType.name}</span
							>
							<div class="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
								<div
									class="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
									style="width: {(propertyType.count / maxPropertyTypeCount) *
										100}%"
								></div>
							</div>
							<span class="w-16 text-right text-sm text-gray-500"
								>{propertyType.count}</span
							>
							<span class="w-12 text-right text-sm font-semibold text-primary"
								>{propertyType.percentage}%</span
							>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Most Active Neighborhoods -->
	<section class="py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<h2 class="text-xl font-bold text-gray-900 mb-6">Barrios más activos</h2>
				<div class="space-y-4">
					{#each mercadoData.neighborhoods as neighborhood, i}
						{@const maxCount = mercadoData.neighborhoods[0].count}
						<div class="relative group">
							<div
								class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200"
							>
								<div
									class="relative w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
									{i === 0
										? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg'
										: i === 1
											? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg'
											: i === 2
												? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg'
												: 'bg-gray-100 text-gray-500'}"
								>
									{i + 1}
									{#if i === 0}
										<span
											class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
										>
											<svg
												class="w-2.5 h-2.5 text-yellow-800"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
												/>
											</svg>
										</span>
									{/if}
								</div>
								<div class="flex-1 min-w-0">
									<div class="flex items-center justify-between mb-1">
										<span class="font-semibold text-gray-900 truncate"
											>{neighborhood.name}</span
										>
										<span class="text-sm font-medium text-primary"
											>{neighborhood.count} propiedades</span
										>
									</div>
									<div class="h-2 bg-gray-100 rounded-full overflow-hidden">
										<div
											class="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500 group-hover:from-primary-light group-hover:to-accent"
											style="width: {(neighborhood.count / maxCount) * 100}%"
										></div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Price Distribution Chart -->
	<section class="py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<h2 class="text-xl font-bold text-gray-900 mb-6">
					Distribución de precios (Venta)
				</h2>
				<div class="h-80">
					<canvas bind:this={chartCanvas}></canvas>
				</div>
			</div>
		</div>
	</section>

	<!-- Market Insights -->
	<section class="py-12 pb-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-xl font-bold text-gray-900 mb-6">Insights del mercado</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<!-- Mercado Activo -->
				<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<div class="flex items-center gap-3 mb-4">
						<div class="p-2 bg-green-100 rounded-lg">
							<TrendingUp class="w-5 h-5 text-green-600" />
						</div>
						<h3 class="font-semibold text-gray-900">Mercado Activo</h3>
					</div>
					<p class="text-gray-600 text-sm">
						El mercado inmobiliario de Mercedes muestra una tendencia estable con una
						demanda creciente en la zona centro y barrios residenciales.
					</p>
				</div>

				<!-- Zonas Destacadas -->
				<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<div class="flex items-center gap-3 mb-4">
						<div class="p-2 bg-primary/10 rounded-lg">
							<MapPin class="w-5 h-5 text-primary" />
						</div>
					</div>
					<h3 class="font-semibold text-gray-900">Zonas Destacadas</h3>
					<p class="text-gray-600 text-sm">
						El centro y la zona rural concentran la mayor cantidad de propiedades. Los
						barrios Las Acacias y San Miguel presentan el mayor crecimiento en oferta.
					</p>
				</div>

				<!-- Profesionales Verificados -->
				<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<div class="flex items-center gap-3 mb-4">
						<div class="p-2 bg-accent/10 rounded-lg">
							<ShieldCheck class="w-5 h-5 text-accent" />
						</div>
					</div>
					<h3 class="font-semibold text-gray-900">Profesionales Verificados</h3>
					<p class="text-gray-600 text-sm">
						12 inmobiliarias activas con más de 50 martilleros profesionales verificados
						publican propiedades en nuestra plataforma.
					</p>
				</div>
			</div>
		</div>
	</section>
</main>
