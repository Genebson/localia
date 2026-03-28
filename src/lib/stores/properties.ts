import { writable, get } from 'svelte/store';
import type { Property } from '$lib/data/properties';

export const propertiesStore = writable<Property[]>([]);

export function getPropertyById(id: string): Property | undefined {
	return get(propertiesStore).find((p) => p.id === id);
}
