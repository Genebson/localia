import { writable, derived, get } from 'svelte/store';
import type { Property } from '$lib/data/properties';

export const propertiesStore = writable<Property[]>([]);

interface PropertiesStore {
	subscribe: (callback: (value: Property[]) => void) => () => void;
	add: (property: Omit<Property, 'id'>) => Property;
	update: (id: string, updates: Partial<Property>) => void;
	delete: (id: string) => void;
	toggleFeatured: (id: string) => void;
	reset: () => void;
	load: () => void;
}

function createPropertiesStore(): PropertiesStore {
	const stored: Property[] = [];
	const { subscribe, set, update: updateStore } = writable<Property[]>(stored);

	function loadStored(): Property[] {
		if (typeof localStorage === 'undefined') return [];
		const data = localStorage.getItem('localia_properties');
		if (!data) return [];
		try {
			return JSON.parse(data);
		} catch {
			return [];
		}
	}

	function persist(properties: Property[]) {
		if (typeof localStorage === 'undefined') return;
		try {
			localStorage.setItem('localia_properties', JSON.stringify(properties));
		} catch {
			throw new Error(
				'No se pudo guardar la propiedad. El almacenamiento está lleno. Probá borrando propiedades anteriores.'
			);
		}
	}

	return {
		subscribe,
		add: (property: Omit<Property, 'id'>) => {
			const newProperty: Property = {
				...property,
				id: crypto.randomUUID(),
				publishedAt: new Date().toISOString()
			};
			updateStore((props) => {
				const updated = [newProperty, ...props];
				persist(updated);
				return updated;
			});
			return newProperty;
		},
		update: (id: string, updates: Partial<Property>) => {
			updateStore((props) => {
				const updated = props.map((p) => (p.id === id ? { ...p, ...updates } : p));
				persist(updated);
				return updated;
			});
		},
		delete: (id: string) => {
			updateStore((props) => {
				const updated = props.filter((p) => p.id !== id);
				persist(updated);
				return updated;
			});
		},
		toggleFeatured: (id: string) => {
			updateStore((props) => {
				const updated = props.map((p) =>
					p.id === id ? { ...p, featured: !p.featured } : p
				);
				persist(updated);
				return updated;
			});
		},
		reset: () => {
			set([]);
			persist([]);
		},
		load: () => {
			const data = loadStored();
			set(data);
		}
	};
}

export const propertiesStoreWithMethods: PropertiesStore = createPropertiesStore();

Object.assign(propertiesStore, {
	add: propertiesStoreWithMethods.add,
	update: propertiesStoreWithMethods.update,
	delete: propertiesStoreWithMethods.delete,
	toggleFeatured: propertiesStoreWithMethods.toggleFeatured,
	reset: propertiesStoreWithMethods.reset,
	load: propertiesStoreWithMethods.load
});

export const allProperties = derived(propertiesStore, ($propertiesStore) => $propertiesStore);

export function getPropertyById(id: string): Property | undefined {
	return get(propertiesStore).find((p) => p.id === id);
}
