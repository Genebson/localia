import { writable, derived } from 'svelte/store';
import { properties as staticProperties, type Property } from '$lib/data/properties';
import { propertiesStore, allProperties } from './properties';

export interface Filters {
	operation: 'buy' | 'rent' | 'all';
	location: string;
	minPrice: string;
	maxPrice: string;
	currency: 'USD' | 'ARS' | 'all';
	bedrooms: number | null;
	propertyType: string;
}

function createFiltersStore() {
	const { subscribe, set, update } = writable<Filters>({
		operation: 'all',
		location: '',
		minPrice: '',
		maxPrice: '',
		currency: 'all',
		bedrooms: null,
		propertyType: ''
	});

	return {
		subscribe,
		setOperation: (op: 'buy' | 'rent' | 'all') => update(f => ({ ...f, operation: op })),
		setLocation: (loc: string) => update(f => ({ ...f, location: loc })),
		setMinPrice: (price: string) => update(f => ({ ...f, minPrice: price })),
		setMaxPrice: (price: string) => update(f => ({ ...f, maxPrice: price })),
		setCurrency: (currency: 'USD' | 'ARS' | 'all') => update(f => ({ ...f, currency })),
		setBedrooms: (beds: number | null) => update(f => ({ ...f, bedrooms: beds })),
		setPropertyType: (type: string) => update(f => ({ ...f, propertyType: type })),
		reset: () => set({
			operation: 'all',
			location: '',
			minPrice: '',
			maxPrice: '',
			currency: 'all',
			bedrooms: null,
			propertyType: ''
		})
	};
}

export const filters = createFiltersStore();

export const filteredProperties = derived([filters, allProperties], ([$filters, $allProperties]) => {
	const all = $allProperties.filter((p: Property) => p.featured);
	
	return all.filter((property: Property) => {
		if ($filters.operation !== 'all' && property.operation !== $filters.operation) {
			return false;
		}

		if ($filters.location) {
			const loc = $filters.location.toLowerCase();
			if (!property.location.toLowerCase().includes(loc) && 
				!property.title.toLowerCase().includes(loc) &&
				!property.address.toLowerCase().includes(loc)) {
				return false;
			}
		}

		if ($filters.currency !== 'all' && property.currency !== $filters.currency) {
			return false;
		}

		if ($filters.minPrice) {
			const min = parseInt($filters.minPrice);
			if (property.price < min) return false;
		}

		if ($filters.maxPrice) {
			const max = parseInt($filters.maxPrice);
			if (property.price > max) return false;
		}

		if ($filters.bedrooms !== null) {
			if ($filters.bedrooms === 4) {
				if (property.attributes.bedrooms < 4) return false;
			} else if (property.attributes.bedrooms !== $filters.bedrooms) {
				return false;
			}
		}

		if ($filters.propertyType && property.propertyType !== $filters.propertyType) {
			return false;
		}

		return true;
	});
});

export const totalProperties = derived(allProperties, ($allProperties) => staticProperties.length + $allProperties.length);
