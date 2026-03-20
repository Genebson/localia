import { writable, derived, get } from 'svelte/store';
import { properties as initialProperties, type Property } from '$lib/data/properties';

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
		localStorage.setItem('localia_properties', JSON.stringify(properties));
	}

	return {
		subscribe,
		add: (property: Omit<Property, 'id'>) => {
			const newProperty: Property = {
				...property,
				id: crypto.randomUUID()
			};
			updateStore(props => {
				const updated = [newProperty, ...props];
				persist(updated);
				return updated;
			});
			return newProperty;
		},
		update: (id: string, updates: Partial<Property>) => {
			updateStore(props => {
				const updated = props.map(p => p.id === id ? { ...p, ...updates } : p);
				persist(updated);
				return updated;
			});
		},
		delete: (id: string) => {
			updateStore(props => {
				const updated = props.filter(p => p.id !== id);
				persist(updated);
				return updated;
			});
		},
		toggleFeatured: (id: string) => {
			updateStore(props => {
				const updated = props.map(p => p.id === id ? { ...p, featured: !p.featured } : p);
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

export const propertiesStore: PropertiesStore = createPropertiesStore();

export const allProperties = derived(propertiesStore, ($propertiesStore) => {
	const seen = new Set<string>();
	const result: Property[] = [];
	
	for (const p of initialProperties) {
		seen.add(p.id);
		result.push(p);
	}
	
	for (const p of $propertiesStore) {
		if (!seen.has(p.id)) {
			seen.add(p.id);
			result.push(p);
		}
	}
	
	return result;
});

export function getPropertyById(id: string): Property | undefined {
	const all = get(allProperties);
	return all.find(p => p.id === id);
}

export function getAgentProperties(agentEmail: string): Property[] {
	return get(propertiesStore).filter(p => p.agentEmail === agentEmail);
}
