import { writable, derived, get } from 'svelte/store';
import { allProperties } from './properties';

function createViewedStore() {
	const stored: string[] = [];

	if (typeof localStorage !== 'undefined') {
		const data = localStorage.getItem('localia_viewed');
		if (data) {
			try {
				stored.push(...JSON.parse(data));
			} catch {
				stored.length = 0;
			}
		}
	}

	const { subscribe, set, update } = writable<string[]>(stored);

	function persist(ids: string[]) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('localia_viewed', JSON.stringify(ids));
		}
	}

	return {
		subscribe,
		add: (id: string) => {
			update((ids) => {
				const filtered = ids.filter((i) => i !== id);
				const newIds = [id, ...filtered].slice(0, 50);
				persist(newIds);
				return newIds;
			});
		},
		has: (id: string): boolean => {
			return get({ subscribe }).includes(id);
		},
		clear: () => {
			set([]);
			persist([]);
		}
	};
}

export const viewed = createViewedStore();

export const viewedProperties = derived(viewed, ($viewed) => {
	const all = get(allProperties);
	return $viewed.map((id) => all.find((p) => p.id === id)).filter(Boolean);
});
