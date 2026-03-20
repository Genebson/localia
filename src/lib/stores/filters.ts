import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
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

const DEFAULT_FILTERS: Filters = {
	operation: 'all',
	location: '',
	minPrice: '',
	maxPrice: '',
	currency: 'all',
	bedrooms: null,
	propertyType: ''
};

function createFiltersStore() {
	const { subscribe, set, update } = writable<Filters>({ ...DEFAULT_FILTERS });

	let suppressUrlUpdate = false;

	return {
		subscribe,
		set,
		setOperation: (op: 'buy' | 'rent' | 'all') => update(f => ({ ...f, operation: op })),
		setLocation: (loc: string) => update(f => ({ ...f, location: loc })),
		setMinPrice: (price: string) => update(f => ({ ...f, minPrice: price })),
		setMaxPrice: (price: string) => update(f => ({ ...f, maxPrice: price })),
		setCurrency: (currency: 'USD' | 'ARS' | 'all') => update(f => ({ ...f, currency })),
		setBedrooms: (beds: number | null) => update(f => ({ ...f, bedrooms: beds })),
		setPropertyType: (type: string) => update(f => ({ ...f, propertyType: type })),
		reset: () => {
			set({ ...DEFAULT_FILTERS });
			goto('/', { replaceState: false, keepFocus: true, noScroll: true });
		},
		initFromUrl: (url: URL) => {
			suppressUrlUpdate = true;
			set({
				operation: (url.searchParams.get('operation') as 'buy' | 'rent' | 'all') || 'all',
				location: url.searchParams.get('location') || '',
				minPrice: url.searchParams.get('minPrice') || '',
				maxPrice: url.searchParams.get('maxPrice') || '',
				currency: (url.searchParams.get('currency') as 'USD' | 'ARS' | 'all') || 'all',
				bedrooms: url.searchParams.get('bedrooms') ? parseInt(url.searchParams.get('bedrooms')!) : null,
				propertyType: url.searchParams.get('propertyType') || ''
			});
			suppressUrlUpdate = false;
		}
	};
}

export const filters = createFiltersStore();

export function syncFiltersToUrl() {
	const f = get(filters);
	const params = new URLSearchParams();
	if (f.operation !== 'all') params.set('operation', f.operation);
	if (f.location) params.set('location', f.location);
	if (f.minPrice) params.set('minPrice', f.minPrice);
	if (f.maxPrice) params.set('maxPrice', f.maxPrice);
	if (f.currency !== 'all') params.set('currency', f.currency);
	if (f.bedrooms !== null) params.set('bedrooms', String(f.bedrooms));
	if (f.propertyType) params.set('propertyType', f.propertyType);
	const search = params.toString();
	const newUrl = search ? `?${search}` : '/';
	goto(newUrl, { replaceState: false, keepFocus: true, noScroll: true });
}

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

export const totalProperties = derived(allProperties, ($allProperties) => $allProperties.filter((p: Property) => p.featured).length);
