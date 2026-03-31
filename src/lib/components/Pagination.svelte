<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let currentPage: number;
	export let totalPages: number;
	export let totalItems: number;
	export let onPageChange: (page: number) => void;

	$: pages = Array.from({ length: totalPages }, (_, i) => i + 1);
	$: visiblePages = pages.slice(Math.max(0, currentPage - 3), currentPage + 2);
</script>

{#if totalPages > 1}
	<div class="flex items-center justify-center gap-2 py-8">
		<button
			on:click={() => onPageChange(currentPage - 1)}
			disabled={currentPage === 1}
			class="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
			aria-label="Página anterior"
		>
			<ChevronLeft class="w-5 h-5" />
		</button>

		{#if visiblePages[0] > 1}
			<button
				on:click={() => onPageChange(1)}
				class="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">1</button
			>
			{#if visiblePages[0] > 2}
				<span class="px-2">...</span>
			{/if}
		{/if}

		{#each visiblePages as p}
			<button
				on:click={() => onPageChange(p)}
				class="px-4 py-2 rounded-lg transition-colors {p === currentPage
					? 'bg-primary text-white'
					: 'hover:bg-gray-50'}"
			>
				{p}
			</button>
		{/each}

		{#if visiblePages[visiblePages.length - 1] < totalPages}
			{#if visiblePages[visiblePages.length - 1] < totalPages - 1}
				<span class="px-2">...</span>
			{/if}
			<button
				on:click={() => onPageChange(totalPages)}
				class="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">{totalPages}</button
			>
		{/if}

		<button
			on:click={() => onPageChange(currentPage + 1)}
			disabled={currentPage === totalPages}
			class="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
			aria-label="Página siguiente"
		>
			<ChevronRight class="w-5 h-5" />
		</button>
	</div>

	<p class="text-center text-sm text-gray-500 pb-4">
		Mostrando página {currentPage} de {totalPages} ({totalItems} propiedades)
	</p>
{/if}