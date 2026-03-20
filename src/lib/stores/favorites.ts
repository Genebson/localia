import { writable, derived, get } from 'svelte/store';
import { allProperties, type Property } from './properties';

function createFavoritesStore() {
	const stored: string[] = [];
	
	if (typeof localStorage !== 'undefined') {
		const data = localStorage.getItem('localia_favorites');
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
			localStorage.setItem('localia_favorites', JSON.stringify(ids));
		}
	}

	return {
		subscribe,
		toggle: (id: string) => {
			update(ids => {
				const newIds = ids.includes(id) 
					? ids.filter(i => i !== id)
					: [...ids, id];
				persist(newIds);
				return newIds;
			});
		},
		has: (id: string): boolean => {
			return get({ subscribe }).includes(id);
		},
		add: (id: string) => {
			update(ids => {
				if (!ids.includes(id)) {
					const newIds = [...ids, id];
					persist(newIds);
					return newIds;
				}
				return ids;
			});
		},
		remove: (id: string) => {
			update(ids => {
				const newIds = ids.filter(i => i !== id);
				persist(newIds);
				return newIds;
			});
		},
		clear: () => {
			set([]);
			persist([]);
		}
	};
}

export const favorites = createFavoritesStore();

export const favoriteProperties = derived([favorites, allProperties], ([$favorites, $allProperties]) => {
	return $allProperties.filter(p => $favorites.includes(p.id));
});
