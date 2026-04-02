import axios from 'axios';
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
	image: string | null;
	phone: string | null;
	role: FrontendRole;
	licenseNumber?: string;
	tenantCount: number;
	pets: 'none' | 'has_pet';
	moveDate: 'asap' | 'flexible' | 'exact_date';
	monthlyIncome: number | null;
	introductionLetter: string | null;
}

export const authLoading = writable(true);

function createAuthStore() {
	const { subscribe, set } = writable<FrontendUser | null>(null);

	async function init() {
		authLoading.set(true);
		try {
			await getMe();
			const userData = await getUser();
			const backendUser = userData.data.attributes;
			const frontendUser: FrontendUser = {
				id: backendUser.id,
				email: backendUser.email,
				name: backendUser.name,
				image: backendUser.image ?? null,
				phone: backendUser.phone ?? null,
				role: backendUser.role === 'agent' ? 'agent' : 'seeker',
				licenseNumber: backendUser.licenseNumber || undefined,
				tenantCount: backendUser.tenantCount ?? 1,
				pets: backendUser.pets ?? 'none',
				moveDate: backendUser.moveDate ?? 'flexible',
				monthlyIncome: backendUser.monthlyIncome ?? null,
				introductionLetter: backendUser.introductionLetter ?? null
			};
			set(frontendUser);
		} catch {
			set(null);
		}
		authLoading.set(false);
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
				await sendWelcomeEmail(email, name || email.split('@')[0]);
			} else {
				await signInWithEmail(email, _password);
			}
			await init();
		} catch (e) {
			throw e;
		}
	}

	async function sendWelcomeEmail(email: string, name: string) {
		try {
			await axios.post(`${import.meta.env.VITE_API_URL}/notifications/welcome-email`, {
				email,
				name
			});
		} catch {
			// Ignore
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
