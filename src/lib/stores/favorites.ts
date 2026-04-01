import { writable, derived, get } from 'svelte/store';
import { propertiesStore } from './properties';
import { addFavorite, removeFavorite, listFavorites } from '$lib/api/favorites';
import { auth } from './auth';

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

	function clearLocalStorage() {
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('localia_favorites');
		}
	}

	async function loadFromServer() {
		try {
			const result = await listFavorites();
			set(result.favorites);
			persist(result.favorites);
		} catch {
			// Ignore errors, keep local state
		}
	}

	async function toggle(id: string) {
		const isLoggedIn = !!get(auth);
		if (isLoggedIn) {
			const current = get({ subscribe });
			const isFav = current.includes(id);
			if (isFav) {
				await removeFavorite(id);
			} else {
				await addFavorite(id);
			}
			update((ids) => {
				const newIds = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
				persist(newIds);
				return newIds;
			});
		} else {
			update((ids) => {
				const newIds = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
				persist(newIds);
				return newIds;
			});
		}
	}

	return {
		subscribe,
		toggle,
		has: (id: string): boolean => {
			return get({ subscribe }).includes(id);
		},
		add: (id: string) => {
			update((ids) => {
				if (!ids.includes(id)) {
					const newIds = [...ids, id];
					persist(newIds);
					return newIds;
				}
				return ids;
			});
		},
		remove: (id: string) => {
			update((ids) => {
				const newIds = ids.filter((i) => i !== id);
				persist(newIds);
				return newIds;
			});
		},
		clear,
		clearLocalStorage,
		loadFromServer
	};

	function clear() {
		set([]);
		persist([]);
	}
}

export const favorites = createFavoritesStore();

export const favoriteProperties = derived(
	[favorites, propertiesStore],
	([$favorites, $propertiesStore]) => {
		return $propertiesStore.filter((p) => $favorites.includes(p.id));
	}
);
