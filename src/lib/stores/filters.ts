import { writable, derived, get } from 'svelte/store';
import { type Property, type PropertyState, type Equipment } from '$lib/data/properties';
import { allProperties } from './properties';

export interface Filters {
	operation: 'buy' | 'rent' | 'all';
	location: string;
	minPrice: string;
	maxPrice: string;
	currency: 'USD' | 'ARS' | 'all';
	bedrooms: number | null;
	propertyType: string;
	rooms: number | null;
	bathrooms: number | null;
	estado: PropertyState | '';
	features: string[];
	equipamiento: Equipment | '';
	petFriendly: boolean | null;
	airConditioning: boolean | null;
	elevator: boolean | null;
	balcony: boolean | null;
	outdoor: boolean | null;
	garage: boolean | null;
	garden: boolean | null;
	pool: boolean | null;
	storageRoom: boolean | null;
	accessible: boolean | null;
	publishedDays: number | null;
	zone: '' | 'plaza' | 'barrio-norte' | 'barrio-sur' | 'zona-club' | 'centro';
}

const DEFAULT_FILTERS: Filters = {
	operation: 'all',
	location: '',
	minPrice: '',
	maxPrice: '',
	currency: 'all',
	bedrooms: null,
	propertyType: '',
	rooms: null,
	bathrooms: null,
	estado: '',
	features: [],
	equipamiento: '',
	petFriendly: null,
	airConditioning: null,
	elevator: null,
	balcony: null,
	outdoor: null,
	garage: null,
	garden: null,
	pool: null,
	storageRoom: null,
	accessible: null,
	publishedDays: null,
	zone: ''
};

function createFiltersStore() {
	const { subscribe, set, update } = writable<Filters>({ ...DEFAULT_FILTERS });

	return {
		subscribe,
		set,
		setOperation: (op: 'buy' | 'rent' | 'all') => update((f) => ({ ...f, operation: op })),
		setLocation: (loc: string) => update((f) => ({ ...f, location: loc })),
		setMinPrice: (price: string) => update((f) => ({ ...f, minPrice: price })),
		setMaxPrice: (price: string) => update((f) => ({ ...f, maxPrice: price })),
		setCurrency: (currency: 'USD' | 'ARS' | 'all') => update((f) => ({ ...f, currency })),
		setBedrooms: (beds: number | null) => update((f) => ({ ...f, bedrooms: beds })),
		setPropertyType: (type: string) => update((f) => ({ ...f, propertyType: type })),
		setRooms: (v: number | null) => update((f) => ({ ...f, rooms: v })),
		setBathrooms: (v: number | null) => update((f) => ({ ...f, bathrooms: v })),
		setEstado: (v: PropertyState | '') => update((f) => ({ ...f, estado: v })),
		toggleFeature: (feat: string) =>
			update((f) => {
				const features = f.features.includes(feat)
					? f.features.filter((x) => x !== feat)
					: [...f.features, feat];
				return { ...f, features };
			}),
		setEquipamiento: (v: Equipment | '') => update((f) => ({ ...f, equipamiento: v })),
		setBoolean: (key: keyof Filters, v: boolean | null) => update((f) => ({ ...f, [key]: v })),
		setPublishedDays: (v: number | null) => update((f) => ({ ...f, publishedDays: v })),
		setZone: (v: '' | 'plaza' | 'barrio-norte' | 'barrio-sur' | 'zona-club' | 'centro') =>
			update((f) => ({ ...f, zone: v })),
		reset: () => {
			set({ ...DEFAULT_FILTERS });
			history.replaceState(null, '', window.location.pathname + '?');
		},
		initFromUrl: (url: URL) => {
			set({
				operation: (url.searchParams.get('operation') as 'buy' | 'rent' | 'all') || 'all',
				location: url.searchParams.get('location') || '',
				minPrice: url.searchParams.get('minPrice') || '',
				maxPrice: url.searchParams.get('maxPrice') || '',
				currency: (url.searchParams.get('currency') as 'USD' | 'ARS' | 'all') || 'all',
				bedrooms: url.searchParams.get('bedrooms')
					? parseInt(url.searchParams.get('bedrooms')!)
					: null,
				propertyType: url.searchParams.get('propertyType') || '',
				rooms: url.searchParams.get('rooms')
					? parseInt(url.searchParams.get('rooms')!)
					: null,
				bathrooms: url.searchParams.get('bathrooms')
					? parseInt(url.searchParams.get('bathrooms')!)
					: null,
				estado: (url.searchParams.get('estado') as PropertyState) || '',
				features: url.searchParams.get('features')
					? url.searchParams.get('features')!.split(',')
					: [],
				equipamiento: (url.searchParams.get('equipamiento') as Equipment) || '',
				petFriendly: url.searchParams.get('petFriendly')
					? url.searchParams.get('petFriendly') === 'true'
					: null,
				airConditioning: url.searchParams.get('airConditioning')
					? url.searchParams.get('airConditioning') === 'true'
					: null,
				elevator: url.searchParams.get('elevator')
					? url.searchParams.get('elevator') === 'true'
					: null,
				balcony: url.searchParams.get('balcony')
					? url.searchParams.get('balcony') === 'true'
					: null,
				outdoor: url.searchParams.get('outdoor')
					? url.searchParams.get('outdoor') === 'true'
					: null,
				garage: url.searchParams.get('garage')
					? url.searchParams.get('garage') === 'true'
					: null,
				garden: url.searchParams.get('garden')
					? url.searchParams.get('garden') === 'true'
					: null,
				pool: url.searchParams.get('pool') ? url.searchParams.get('pool') === 'true' : null,
				storageRoom: url.searchParams.get('storageRoom')
					? url.searchParams.get('storageRoom') === 'true'
					: null,
				accessible: url.searchParams.get('accessible')
					? url.searchParams.get('accessible') === 'true'
					: null,
				publishedDays: url.searchParams.get('publishedDays')
					? parseInt(url.searchParams.get('publishedDays')!)
					: null,
				zone:
					(url.searchParams.get('zone') as
						| ''
						| 'plaza'
						| 'barrio-norte'
						| 'barrio-sur'
						| 'zona-club'
						| 'centro') || ''
			});
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
	if (f.rooms !== null) params.set('rooms', String(f.rooms));
	if (f.bathrooms !== null) params.set('bathrooms', String(f.bathrooms));
	if (f.estado) params.set('estado', f.estado);
	if (f.features.length > 0) params.set('features', f.features.join(','));
	if (f.equipamiento) params.set('equipamiento', f.equipamiento);
	if (f.petFriendly !== null) params.set('petFriendly', String(f.petFriendly));
	if (f.airConditioning !== null) params.set('airConditioning', String(f.airConditioning));
	if (f.elevator !== null) params.set('elevator', String(f.elevator));
	if (f.balcony !== null) params.set('balcony', String(f.balcony));
	if (f.outdoor !== null) params.set('outdoor', String(f.outdoor));
	if (f.garage !== null) params.set('garage', String(f.garage));
	if (f.garden !== null) params.set('garden', String(f.garden));
	if (f.pool !== null) params.set('pool', String(f.pool));
	if (f.storageRoom !== null) params.set('storageRoom', String(f.storageRoom));
	if (f.accessible !== null) params.set('accessible', String(f.accessible));
	if (f.publishedDays !== null) params.set('publishedDays', String(f.publishedDays));
	if (f.zone) params.set('zone', f.zone);
	const search = params.toString();
	const newUrl = search ? `?${search}` : window.location.pathname + '?';
	history.replaceState(null, '', newUrl);
}

export const filteredProperties = derived(
	[filters, allProperties],
	([$filters, $allProperties]) => {
		const all = $allProperties.filter((p: Property) => p.featured);

		return all.filter((property: Property) => {
			if ($filters.operation !== 'all' && property.operation !== $filters.operation)
				return false;

			if ($filters.location) {
				const loc = $filters.location.toLowerCase();
				if (
					!property.location.toLowerCase().includes(loc) &&
					!property.title.toLowerCase().includes(loc) &&
					!property.address.toLowerCase().includes(loc)
				)
					return false;
			}

			if ($filters.currency !== 'all' && property.currency !== $filters.currency)
				return false;

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
				} else if (property.attributes.bedrooms !== $filters.bedrooms) return false;
			}

			if ($filters.propertyType && property.propertyType !== $filters.propertyType)
				return false;

			if ($filters.rooms !== null) {
				if ($filters.rooms === 4) {
					if ((property.attributes.bedrooms || 0) < 4) return false;
				} else if ((property.attributes.bedrooms || 0) !== $filters.rooms) return false;
			}

			if ($filters.bathrooms !== null) {
				if ($filters.bathrooms === 3) {
					if ((property.attributes.bathrooms || 0) < 3) return false;
				} else if ((property.attributes.bathrooms || 0) !== $filters.bathrooms)
					return false;
			}

			if ($filters.estado && property.estado !== $filters.estado) return false;

			if ($filters.features.length > 0) {
				for (const feat of $filters.features) {
					const prop = property as Record<string, unknown>;
					if (prop[feat] !== true) return false;
				}
			}

			if ($filters.equipamiento && property.equipamiento !== $filters.equipamiento)
				return false;

			if ($filters.petFriendly !== null && property.petFriendly !== $filters.petFriendly)
				return false;
			if (
				$filters.airConditioning !== null &&
				property.airConditioning !== $filters.airConditioning
			)
				return false;
			if ($filters.elevator !== null && property.elevator !== $filters.elevator) return false;
			if ($filters.balcony !== null && property.balcony !== $filters.balcony) return false;
			if ($filters.outdoor !== null && property.outdoor !== $filters.outdoor) return false;
			if ($filters.garage !== null && property.garage !== $filters.garage) return false;
			if ($filters.garden !== null && property.garden !== $filters.garden) return false;
			if ($filters.pool !== null && property.pool !== $filters.pool) return false;
			if ($filters.storageRoom !== null && property.storageRoom !== $filters.storageRoom)
				return false;
			if ($filters.accessible !== null && property.accessible !== $filters.accessible)
				return false;

			if ($filters.publishedDays !== null) {
				if (!property.publishedAt) return false;
				const published = new Date(property.publishedAt);
				const now = new Date();
				const diff = (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24);
				if (diff > $filters.publishedDays) return false;
			}

			if ($filters.zone) {
				const zoneKeywords: Record<string, string[]> = {
					plaza: ['plaza', 'centro'],
					'barrio-norte': ['barrio norte', 'norte', 'barrio san martín', 'san martín'],
					'barrio-sur': ['barrio sur', 'sur', 'barrio progreso', 'progreso'],
					'zona-club': ['club', 'estadio', 'jockey'],
					centro: ['centro', 'av. principal', 'peatonal']
				};
				const keywords = zoneKeywords[$filters.zone] || [];
				if (keywords.length > 0) {
					const locLower = property.location.toLowerCase();
					const titleLower = property.title.toLowerCase();
					const hasZone = keywords.some(
						(kw) => locLower.includes(kw) || titleLower.includes(kw)
					);
					if (!hasZone) return false;
				}
			}

			return true;
		});
	}
);

export const totalProperties = derived(
	allProperties,
	($allProperties) => $allProperties.filter((p: Property) => p.featured).length
);
