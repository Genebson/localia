import { writable, derived } from 'svelte/store';

export type UserRole = 'guest' | 'user' | 'agent';

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	matricula?: string;
}

function createAuthStore() {
	const { subscribe, set } = writable<User | null>(null);

	function login(
		email: string,
		password: string,
		role: UserRole,
		name?: string,
		matricula?: string
	): User {
		const user: User = {
			id: crypto.randomUUID(),
			email,
			name: name || email.split('@')[0],
			role,
			matricula
		};
		set(user);
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('localia_user', JSON.stringify(user));
		}
		return user;
	}

	function logout() {
		set(null);
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('localia_user');
		}
	}

	function init() {
		if (typeof localStorage !== 'undefined') {
			const stored = localStorage.getItem('localia_user');
			if (stored) {
				try {
					set(JSON.parse(stored));
				} catch {
					localStorage.removeItem('localia_user');
				}
			}
		}
	}

	return {
		subscribe,
		login,
		logout,
		init
	};
}

export const auth = createAuthStore();

export const isAgent = derived(auth, ($auth) => $auth?.role === 'agent');
export const isUser = derived(auth, ($auth) => $auth?.role === 'user');
export const currentUser = auth;
