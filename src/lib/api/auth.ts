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

const USERS_KEY = 'localia_mock_users';
const SESSION_KEY = 'localia_mock_session';

interface StoredUser extends ApiUser {
	passwordHash: string;
}

function getUsers(): StoredUser[] {
	if (typeof localStorage === 'undefined') return [];
	const data = localStorage.getItem(USERS_KEY);
	if (!data) return [];
	try {
		return JSON.parse(data);
	} catch {
		return [];
	}
}

function setUsers(users: StoredUser[]): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentSession(): { userId: string; token: string } | null {
	if (typeof localStorage === 'undefined') return null;
	const data = localStorage.getItem(SESSION_KEY);
	if (!data) return null;
	try {
		return JSON.parse(data);
	} catch {
		return null;
	}
}

function setCurrentSession(session: { userId: string; token: string } | null): void {
	if (typeof localStorage === 'undefined') return;
	if (session) {
		localStorage.setItem(SESSION_KEY, JSON.stringify(session));
	} else {
		localStorage.removeItem(SESSION_KEY);
	}
}

function hashPassword(password: string): string {
	let hash = 0;
	for (let i = 0; i < password.length; i++) {
		const char = password.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return String(hash);
}

function createToken(): string {
	return 'mock_token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function seedDemoUsers(): void {
	const users = getUsers();
	if (users.length === 0) {
		const demoUsers: StoredUser[] = [
			{
				id: 'demo-user-1',
				email: 'demo@localia.com',
				name: 'Demo Usuario',
				role: 'agent',
				licenseNumber: 'MAT-12345',
				passwordHash: hashPassword('demo123')
			},
			{
				id: 'demo-user-2',
				email: 'buscador@localia.com',
				name: 'Juan Buscador',
				role: 'seeker',
				passwordHash: hashPassword('buscador123')
			}
		];
		setUsers(demoUsers);
	}
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
	seedDemoUsers();
	const users = getUsers();
	const passwordHash = hashPassword(password);
	const user = users.find((u) => u.email === email && u.passwordHash === passwordHash);

	if (!user) {
		throw new Error('Credenciales inválidas');
	}

	const token = createToken();
	setCurrentSession({ userId: user.id, token });

	return {
		data: {
			type: 'user',
			id: user.id,
			attributes: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				licenseNumber: user.licenseNumber,
				image: user.image
			},
			session: {
				token,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
			}
		}
	};
}

export async function signUpWithEmail(
	email: string,
	password: string,
	name: string,
	role?: UserRole,
	licenseNumber?: string
): Promise<AuthResponse> {
	seedDemoUsers();
	const users = getUsers();

	if (users.find((u) => u.email === email)) {
		throw new Error('Este email ya está registrado');
	}

	const newUser: StoredUser = {
		id: 'user_' + crypto.randomUUID(),
		email,
		name,
		role: role || 'seeker',
		licenseNumber: licenseNumber || null,
		passwordHash: hashPassword(password)
	};

	users.push(newUser);
	setUsers(users);

	const token = createToken();
	setCurrentSession({ userId: newUser.id, token });

	return {
		data: {
			type: 'user',
			id: newUser.id,
			attributes: {
				id: newUser.id,
				email: newUser.email,
				name: newUser.name,
				role: newUser.role,
				licenseNumber: newUser.licenseNumber
			},
			session: {
				token,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
			}
		}
	};
}

export async function signInWithGoogle(callbackUrl?: string): Promise<void> {
	seedDemoUsers();
	const users = getUsers();
	const demoUser = users.find((u) => u.email === 'demo@localia.com');

	if (!demoUser) {
		throw new Error('No se encontró usuario demo');
	}

	const token = createToken();
	setCurrentSession({ userId: demoUser.id, token });

	const redirectUrl = callbackUrl || '/localia/';
	window.location.href = redirectUrl;
}

export async function getSession(): Promise<{
	data: { type: 'session'; id: string; attributes: { expiresAt: string; userId: string } } | null;
}> {
	seedDemoUsers();
	const session = getCurrentSession();

	if (!session) {
		return { data: null };
	}

	return {
		data: {
			type: 'session',
			id: session.userId,
			attributes: {
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
				userId: session.userId
			}
		}
	};
}

export async function getMe(): Promise<AuthResponse> {
	seedDemoUsers();
	const session = getCurrentSession();

	if (!session) {
		throw new Error('No hay sesión activa');
	}

	const users = getUsers();
	const user = users.find((u) => u.id === session.userId);

	if (!user) {
		throw new Error('Usuario no encontrado');
	}

	return {
		data: {
			type: 'user',
			id: user.id,
			attributes: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				licenseNumber: user.licenseNumber,
				image: user.image
			}
		}
	};
}

export async function getUser(): Promise<AuthResponse> {
	return getMe();
}

export async function updateRole(role: UserRole, licenseNumber?: string): Promise<AuthResponse> {
	seedDemoUsers();
	const session = getCurrentSession();

	if (!session) {
		throw new Error('No hay sesión activa');
	}

	const users = getUsers();
	const userIndex = users.findIndex((u) => u.id === session.userId);

	if (userIndex === -1) {
		throw new Error('Usuario no encontrado');
	}

	users[userIndex] = {
		...users[userIndex],
		role,
		licenseNumber: licenseNumber || null
	};
	setUsers(users);

	const user = users[userIndex];

	return {
		data: {
			type: 'user',
			id: user.id,
			attributes: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				licenseNumber: user.licenseNumber,
				image: user.image
			}
		}
	};
}

export async function signOut(): Promise<void> {
	setCurrentSession(null);
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean }> {
	seedDemoUsers();
	return { success: true };
}

export async function resetPassword(
	_token: string,
	_password: string
): Promise<{ success: boolean }> {
	return { success: true };
}

export async function apiFetch<T>(_endpoint: string, _options?: RequestInit): Promise<T> {
	throw new Error('apiFetch is deprecated - use mock functions directly');
}
