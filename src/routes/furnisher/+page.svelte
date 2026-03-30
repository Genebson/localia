<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { Sparkles, Upload, Check } from 'lucide-svelte';
	import { isAgent, currentUser, auth } from '$lib/stores/auth';
	import { authModalOpen } from '$lib/stores/authModal';

	$: isAuthorized = $currentUser && $isAgent;

	onMount(async () => {
		try {
			await auth.init();
		} catch {
			// ignore auth errors
		}

		if (!$currentUser) {
			authModalOpen.set(true);
			goto(base + '/');
		} else if (!$isAgent) {
			goto(base + '/');
		}
	});

	interface StagingExample {
		id: string;
		title: string;
		style: string;
		before: string;
		after: string;
		beforeLabel: string;
		afterLabel: string;
	}

	const examples: StagingExample[] = [
		{
			id: '1',
			title: 'Living vacío',
			style: 'Escandinavo',
			before: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
			after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
			beforeLabel: 'Antes',
			afterLabel: 'Después'
		},
		{
			id: '2',
			title: 'Dormitorio desordenado',
			style: 'Moderno',
			before: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
			after: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
			beforeLabel: 'Antes',
			afterLabel: 'Después'
		},
		{
			id: '3',
			title: 'Casa de época',
			style: 'Wipe & Replace',
			before: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
			after: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
			beforeLabel: 'Antes',
			afterLabel: 'Después'
		}
	];

	const styles = ['Escandinavo', 'Minimalista', 'Moderno', 'Nórdico', 'Industrial'];

	let sliders: Record<string, number> = {};
	let activeExample: string | null = null;

	function initSlider(id: string) {
		sliders[id] = 50;
		activeExample = id;
	}

	function handleSliderMove(e: MouseEvent | TouchEvent, id: string) {
		if (!activeExample || activeExample !== id) return;
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const x = clientX - rect.left;
		const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
		sliders[id] = percentage;
	}

	function handleSliderEnd() {
		activeExample = null;
	}
</script>

<svelte:head>
	<title>Furnisher | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="text-center mb-12">
			<div
				class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
			>
				<Sparkles class="w-4 h-4" />
				Powered by Furnisher.ai
			</div>
			<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
				Mejorá tus fotos con IA
			</h1>
			<p class="text-gray-500 text-lg max-w-2xl mx-auto">
				Transformá propiedades vacías o desordenadas en imágenes profesionales amuebladas
				con inteligencia artificial
			</p>
		</div>

		<div class="mb-12">
			<h2 class="text-xl font-semibold text-gray-900 mb-4">Estilos disponibles</h2>
			<div class="flex flex-wrap gap-3">
				{#each styles as style}
					<span
						class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
						>{style}</span
					>
				{/each}
			</div>
		</div>

		<div class="space-y-8">
			{#each examples as example}
				<div class="bg-white rounded-xl shadow-sm p-6">
					<div class="flex items-center justify-between mb-4">
						<div>
							<h3 class="text-lg font-semibold text-gray-900">{example.title}</h3>
							<p class="text-sm text-gray-500">Estilo: {example.style}</p>
						</div>
						<button
							class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white font-medium rounded-lg transition-colors"
						>
							<Upload class="w-4 h-4" />
							Aplicar a mi foto
						</button>
					</div>

					<div
						class="relative overflow-hidden rounded-lg cursor-col-resize select-none"
						style="height: 400px;"
						on:mousedown={() => initSlider(example.id)}
						on:mousemove={(e) => handleSliderMove(e, example.id)}
						on:mouseup={handleSliderEnd}
						on:mouseleave={handleSliderEnd}
						on:touchstart={() => initSlider(example.id)}
						on:touchmove={(e) => handleSliderMove(e, example.id)}
						on:touchend={handleSliderEnd}
						role="slider"
						aria-label="Before/After slider"
						tabindex="0"
					>
						<img
							src={example.after}
							alt={example.afterLabel}
							class="absolute inset-0 w-full h-full object-cover"
						/>
						<div
							class="absolute inset-0 overflow-hidden"
							style="width: {sliders[example.id] || 50}%;"
						>
							<img
								src={example.before}
								alt={example.beforeLabel}
								class="absolute inset-0 w-full h-full object-cover"
								style="min-width: {(100 / (sliders[example.id] || 50)) * 100}%;"
							/>
						</div>
						<div
							class="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize"
							style="left: {sliders[example.id] || 50}%; transform: translateX(-50%);"
						>
							<div
								class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
							>
								<div class="flex gap-0.5">
									<div class="w-1 h-4 bg-gray-300 rounded"></div>
									<div class="w-1 h-4 bg-gray-300 rounded"></div>
								</div>
							</div>
						</div>
						<span
							class="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white text-sm font-medium rounded-full"
						>
							{example.beforeLabel}
						</span>
						<span
							class="absolute top-4 right-4 px-3 py-1 bg-black/60 text-white text-sm font-medium rounded-full"
						>
							{example.afterLabel}
						</span>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-12 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl text-center">
			<Sparkles class="w-8 h-8 text-primary mx-auto mb-3" />
			<h3 class="text-lg font-semibold text-gray-900 mb-2">
				¿Querés mejorar tus propiedades?
			</h3>
			<p class="text-gray-500 mb-4">Subí tus fotos y lasciá que la IA las transforme</p>
			<button
				class="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
			>
				Subir fotos
			</button>
		</div>
	</div>
</main>
