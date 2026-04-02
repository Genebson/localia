import axios from 'axios';
import { API_BASE_URL } from '$lib/config';

export type UserRole = 'seeker' | 'agent';

export interface ApiUser {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	licenseNumber?: string | null;
	image?: string | null;
	phone?: string | null;
	tenantCount?: number;
	pets?: 'none' | 'has_pet';
	moveDate?: 'asap' | 'flexible' | 'exact_date';
	monthlyIncome?: number | null;
	introductionLetter?: string | null;
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

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const response = await axiosInstance({
		url: endpoint,
		method: options.method || 'GET',
		data: options.body ? JSON.parse(options.body) : undefined,
		headers: options.headers as Record<string, string> | undefined
	});
	return response.data;
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
	const response = await axiosInstance.post('/auth/sign-in/social', {
		provider: 'google',
		callbackURL: callbackUrl || 'http://localhost:5173/localia/'
	});
	const { url } = response.data as { url: string };
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

export async function updateProfile(name: string, phone: string): Promise<AuthResponse> {
	return apiFetch<AuthResponse>('/profile', {
		method: 'PATCH',
		body: JSON.stringify({ name, phone })
	});
}

export async function uploadProfileImage(image: string): Promise<{ url: string }> {
	return apiFetch<{ url: string }>('/profile/image', {
		method: 'POST',
		body: JSON.stringify({ image })
	});
}

export async function updateRentalProfile(
	tenantCount: number,
	pets: 'none' | 'has_pet',
	moveDate: 'asap' | 'flexible' | 'exact_date',
	monthlyIncome?: number | null
): Promise<AuthResponse> {
	return apiFetch<AuthResponse>('/profile/rental-profile', {
		method: 'PATCH',
		body: JSON.stringify({ tenantCount, pets, moveDate, monthlyIncome })
	});
}

export async function updateIntroductionLetter(introductionLetter: string): Promise<AuthResponse> {
	return apiFetch<AuthResponse>('/profile/introduction-letter', {
		method: 'PATCH',
		body: JSON.stringify({ introductionLetter })
	});
}

export async function signOut(): Promise<void> {
	await apiFetch('/auth/sign-out', { method: 'POST' });
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean }> {
	return apiFetch<{ success: boolean }>('/notifications/forgot-password', {
		method: 'POST',
		body: JSON.stringify({ email }),
	});
}

export async function resetPassword(token: string, password: string): Promise<{ success: boolean }> {
	return apiFetch<{ success: boolean }>('/auth/reset-password', {
		method: 'POST',
		body: JSON.stringify({ newPassword: password, token }),
	});
}

export interface PublicUser {
	data: {
		type: 'user';
		id: string;
		attributes: {
			name: string | null;
			image: string | null;
			phone: string | null;
			email: string;
			licenseNumber: string | null;
		};
	};
}

export async function getPublicUser(userId: string): Promise<PublicUser> {
	return apiFetch<PublicUser>(`/users/${userId}`);
}

export interface SendEmailToAgentPayload {
	propertyId: string;
	seekerName: string;
	seekerEmail: string;
	seekerPhone: string;
	message: string;
}

export async function sendEmailToAgent(payload: SendEmailToAgentPayload): Promise<{ success: boolean; message: string }> {
	return apiFetch<{ success: boolean; message: string }>('/contact/send-email', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}
