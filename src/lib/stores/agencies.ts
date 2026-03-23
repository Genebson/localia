import { writable, derived } from 'svelte/store';
import { inmobiliarias } from '$lib/data/inmobiliarias';
import type { Inmobiliaria } from '$lib/data/inmobiliarias';

const STORAGE_KEY = 'localia_agencies';

function loadFromStorage(): Inmobiliaria[] {
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

function saveToStorage(agencies: Inmobiliaria[]) {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(agencies));
	}
}

function createAgencyStore() {
	const { subscribe, set, update } = writable<Inmobiliaria[]>(loadFromStorage());

	return {
		subscribe,
		init() {
			const stored = loadFromStorage();
			set(stored);
		},
		create(agency: Omit<Inmobiliaria, 'id'>): Inmobiliaria {
			const newAgency: Inmobiliaria = {
				...agency,
				id: crypto.randomUUID()
			};
			update(agencies => {
				const updated = [...agencies, newAgency];
				saveToStorage(updated);
				return updated;
			});
			return newAgency;
		},
		update(id: string, changes: Partial<Inmobiliaria>) {
			update(agencies => {
				const updated = agencies.map(a => a.id === id ? { ...a, ...changes } : a);
				saveToStorage(updated);
				return updated;
			});
		},
		remove(id: string) {
			update(agencies => {
				const updated = agencies.filter(a => a.id !== id);
				saveToStorage(updated);
				return updated;
			});
		}
	};
}

export const agencyStore = createAgencyStore();

export const allAgencies = derived(agencyStore, ($agencies) => {
	return [...inmobiliarias, ...$agencies];
});