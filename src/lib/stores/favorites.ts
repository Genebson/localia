import { writable, derived, get } from 'svelte/store';
import { propertiesStore } from './properties';
import { addFavorite, removeFavorite, listFavorites } from '$lib/api/favorites';
import { auth } from './auth';

function createFavoritesStore() {
	const { subscribe, set, update } = writable<string[]>([]);

	async function loadFromServer() {
		try {
			const result = await listFavorites();
			set(result.favorites);
		} catch {
			set([]);
		}
	}

	async function toggle(id: string) {
		if (!get(auth)) return;

		const current = get({ subscribe });
		const isFav = current.includes(id);
		if (isFav) {
			await removeFavorite(id);
		} else {
			await addFavorite(id);
		}
		update((ids) => (isFav ? ids.filter((i) => i !== id) : [...ids, id]));
	}

	return {
		subscribe,
		toggle,
		has: (id: string): boolean => get({ subscribe }).includes(id),
		add: async (id: string) => {
			if (!get(auth)) return;
			await addFavorite(id);
			update((ids) => (ids.includes(id) ? ids : [...ids, id]));
		},
		remove: async (id: string) => {
			if (!get(auth)) return;
			await removeFavorite(id);
			update((ids) => ids.filter((i) => i !== id));
		},
		clear: () => set([]),
		loadFromServer
	};
}

export const favorites = createFavoritesStore();

export const favoriteProperties = derived(
	[favorites, propertiesStore],
	([$favorites, $propertiesStore]) => {
		return $propertiesStore.filter((p) => $favorites.includes(p.id));
	}
);
