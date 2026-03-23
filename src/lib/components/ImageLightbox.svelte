<script lang="ts">
	import { X, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let images: string[] = [];
	export let isOpen: boolean = false;

	let currentIndex = 0;

	const dispatch = createEventDispatcher<{ close: void }>();

	$: if (isOpen) {
		currentIndex = 0;
	}

	function close() {
		isOpen = false;
		dispatch('close');
	}

	function next() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
		if (e.key === 'ArrowRight') next();
		if (e.key === 'ArrowLeft') prev();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div
		class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
	>
		<button
			on:click={close}
			class="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
			aria-label="Cerrar"
		>
			<X class="w-8 h-8" />
		</button>

		{#if images.length > 1}
			<button
				on:click={prev}
				class="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
				aria-label="Imagen anterior"
			>
				<ChevronLeft class="w-10 h-10" />
			</button>

			<button
				on:click={next}
				class="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
				aria-label="Siguiente imagen"
			>
				<ChevronRight class="w-10 h-10" />
			</button>
		{/if}

		<img
			src={images[currentIndex]}
			alt="Imagen {currentIndex + 1} de {images.length}"
			class="max-w-[90vw] max-h-[90vh] object-contain"
			on:click|stopPropagation
		/>

		{#if images.length > 1}
			<div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
				{currentIndex + 1} / {images.length}
			</div>
		{/if}
	</div>
{/if}
