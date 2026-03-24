import { API_BASE_URL } from '$lib/config';

export type UserRole = 'seeker' | 'agent';

export interface ApiUser {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	licenseNumber?: string | null;
	image?: string;
}

export interface ApiSession {
	token: string;
	expiresAt: string;
}

export interface AuthResponse {
	data: {
		type: 'user';
		id: string;
		attributes: ApiUser;
		session?: ApiSession;
	};
}

export interface ApiError {
	message: string;
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;
	const response = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		},
		credentials: 'include'
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ message: 'Request failed' }));
		throw new Error(error.message || `HTTP ${response.status}`);
	}

	return response.json();
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
	return apiFetch<AuthResponse>('/auth/sign-in/email', {
		method: 'POST',
		body: JSON.stringify({ email, password })
	});
}

export async function signUpWithEmail(
	email: string,
	password: string,
	name: string,
	role?: UserRole,
	licenseNumber?: string
): Promise<AuthResponse> {
	return apiFetch<AuthResponse>('/auth/sign-up/email', {
		method: 'POST',
		body: JSON.stringify({ email, password, name, role, licenseNumber })
	});
}

export async function signInWithGoogle(callbackUrl?: string): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/auth/sign-in/social`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ provider: 'google', callbackURL: callbackUrl || 'http://localhost:5173/localia/' })
	});
	const { url } = await response.json() as { url: string };
	window.location.href = url;
}

export async function getSession(): Promise<{
	data: { type: 'session'; id: string; attributes: { expiresAt: string; userId: string } } | null;
}> {
	try {
		const user = await apiFetch('/profile');
		return {
			data: {
				type: 'session',
				id: (user as { data: { id: string } }).data.id,
				attributes: { expiresAt: '', userId: (user as { data: { id: string } }).data.id }
			}
		};
	} catch {
		return { data: null };
	}
}

export async function getMe(): Promise<AuthResponse> {
	return apiFetch<AuthResponse>('/profile');
}

export async function getUser(): Promise<AuthResponse> {
	return getMe();
}

export async function updateRole(role: UserRole, licenseNumber?: string): Promise<AuthResponse> {
	return apiFetch<AuthResponse>('/profile/role', {
		method: 'PATCH',
		body: JSON.stringify({ role, licenseNumber })
	});
}

export async function signOut(): Promise<void> {
	await apiFetch('/auth/sign-out', { method: 'POST' });
}
