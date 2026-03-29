import { writable, derived, get } from 'svelte/store';
import { agencies as defaultAgencies, type Agency } from '$lib/data/agencies';
import { inmobiliarias } from '$lib/data/inmobiliarias';
import { propertiesStore } from './properties';

const STORAGE_KEY = 'localia_agencies';

interface UserAgency extends Agency {
	team?: { name: string; role: string; phone: string }[];
	tagline?: string;
	banner?: string;
	whatsapp?: string;
	agentId?: string;
}

function loadUserAgencies(): UserAgency[] {
	if (typeof localStorage === 'undefined') return [];
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		try {
			return JSON.parse(stored);
		} catch {
			return [];
		}
	}
	return [];
}

function saveUserAgencies(agencies: UserAgency[]) {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(agencies));
	}
}

function createUserAgenciesStore() {
	const { subscribe, set, update } = writable<UserAgency[]>(loadUserAgencies());

	return {
		subscribe,
		init() {
			set(loadUserAgencies());
		},
		create(agency: Omit<UserAgency, 'id'>): UserAgency {
			const newAgency: UserAgency = { ...agency, id: crypto.randomUUID() };
			update((agencies) => {
				const updated = [...agencies, newAgency];
				saveUserAgencies(updated);
				return updated;
			});
			return newAgency;
		},
		update(id: string, changes: Partial<UserAgency>) {
			update((agencies) => {
				const updated = agencies.map((a) => (a.id === id ? { ...a, ...changes } : a));
				saveUserAgencies(updated);
				return updated;
			});
		},
		remove(id: string) {
			update((agencies) => {
				const updated = agencies.filter((a) => a.id !== id);
				saveUserAgencies(updated);
				return updated;
			});
		}
	};
}

const userAgenciesStore = createUserAgenciesStore();
export const agenciesStore = userAgenciesStore;

function convertInmobiliarias(): Agency[] {
	return inmobiliarias.map((i: any) => ({
		id: i.id,
		name: i.name,
		slug: i.slug,
		logo: i.logo,
		verified: false,
		description: i.description,
		propertyCount: i.team?.length || 0,
		website: '',
		phone: i.phone,
		email: i.email,
		location: 'Mercedes, Buenos Aires'
	}));
}

function getUserPropertyCount(agentId: string): number {
	try {
		const props = get(propertiesStore);
		return props.filter((p) => p.agentId === agentId && p.published).length;
	} catch {
		return 0;
	}
}

export const allAgencies = derived(
	[userAgenciesStore, propertiesStore],
	([$userAgencies, $properties]) => {
		const defaultWithCount = defaultAgencies.map((a) => ({ ...a }));
		const inmobiliariasConverted = convertInmobiliarias();
		const userWithCount = $userAgencies.map((agency) => ({
			...agency,
			propertyCount: agency.agentId
				? $properties.filter((p) => p.agentId === agency.agentId && p.published).length
				: agency.propertyCount || 0
		}));
		return [...defaultWithCount, ...inmobiliariasConverted, ...userWithCount];
	}
);

export function getAgencyById(id: string): Agency | undefined {
	const userAgs = loadUserAgencies();
	const all = [...defaultAgencies, ...convertInmobiliarias(), ...userAgs];
	return all.find((a) => a.id === id);
}

export function getAgencyBySlug(slug: string): Agency | undefined {
	const userAgs = loadUserAgencies();
	const all = [...defaultAgencies, ...convertInmobiliarias(), ...userAgs];
	return all.find((a) => a.slug === slug);
}

export function searchAllAgencies(query: string): Agency[] {
	const q = query.toLowerCase();
	const userAgs = loadUserAgencies();
	const all = [...defaultAgencies, ...convertInmobiliarias(), ...userAgs];
	return all.filter(
		(a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
	);
}
