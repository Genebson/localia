import { writable } from 'svelte/store';

export const authModalOpen = writable(false);
export const authModalMode = writable<'login' | 'register'>('login');

export function openAuthModal(mode: 'login' | 'register' = 'login') {
	authModalMode.set(mode);
	authModalOpen.set(true);
}

export function closeAuthModal() {
	authModalOpen.set(false);
}
