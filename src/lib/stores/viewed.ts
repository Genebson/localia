import { writable } from 'svelte/store';
import type { Property } from '$lib/data/properties';

function createViewedStore() {
	const { subscribe, set, update } = writable<Property[]>([]);

	return {
		subscribe,
		add: (_property: Property) => {},
		has: (_id: string): boolean => false,
		clear: () => set([])
	};
}

export const viewed = createViewedStore();
