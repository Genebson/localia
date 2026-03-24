import { writable, derived, get } from 'svelte/store';
import {
	getMe,
	getUser,
	signInWithEmail,
	signUpWithEmail,
	updateRole,
	signOut as apiSignOut
} from '$lib/api/auth';
import { authModalMode } from './authModal';

export type FrontendRole = 'guest' | 'seeker' | 'agent';

export interface FrontendUser {
	id: string;
	email: string;
	name: string;
	role: FrontendRole;
	licenseNumber?: string;
}

function createAuthStore() {
	const { subscribe, set } = writable<FrontendUser | null>(null);

	async function init() {
		try {
			await getMe();
			const userData = await getUser();
			const backendUser = userData.data.attributes;
			const frontendUser: FrontendUser = {
				id: backendUser.id,
				email: backendUser.email,
				name: backendUser.name,
				role: backendUser.role === 'agent' ? 'agent' : 'seeker',
				licenseNumber: backendUser.licenseNumber || undefined
			};
			set(frontendUser);
		} catch {
			set(null);
		}
	}

	async function login(
		email: string,
		_password: string,
		role?: FrontendRole,
		name?: string,
		licenseNumber?: string
	): Promise<void> {
		try {
			const modalMode = get(authModalMode);
			if (modalMode === 'register') {
				await signUpWithEmail(
					email,
					_password,
					name || email.split('@')[0],
					role === 'agent' ? 'agent' : 'seeker',
					licenseNumber
				);
				await fetch(`${import.meta.env.VITE_API_URL}/notifications/welcome-email`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email,
						name: name || email.split('@')[0]
					})
				}).catch(() => {});
			} else {
				await signInWithEmail(email, _password);
			}
			await init();
		} catch (e) {
			throw e;
		}
	}

	async function logout() {
		try {
			await apiSignOut();
		} catch {
			// Ignore errors
		}
		set(null);
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
export const isSeeker = derived(auth, ($auth) => $auth?.role === 'seeker');
export const currentUser = auth;
