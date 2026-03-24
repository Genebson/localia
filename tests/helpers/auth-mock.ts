import { test as base, type Page } from '@playwright/test';

const TEST_AGENT = { email: 'agente@test.com', password: 'password123' };
const TEST_SEEKER = { email: 'buscador@test.com', password: 'password123' };

let loggedInUser: { email: string; name: string; role: 'seeker' | 'agent' } | null = null;

async function mockAuthApi(page: Page) {
	await page.route('**/auth/sign-in/email', async (route) => {
		const body = JSON.parse(route.request().postData() || '{}');
		if (body.email && body.password) {
			const isAgent = body.email.includes('agente');
			loggedInUser = {
				email: body.email,
				name: isAgent ? 'Agente Test' : 'Buscador Test',
				role: isAgent ? 'agent' : 'seeker'
			};
			await page.context().addCookies([{
				name: 'better-auth.session_token',
				value: 'mock-session-token',
				domain: 'localhost',
				path: '/'
			}]);
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					session: {
						user: {
							id: 'test-user-id',
							email: body.email,
							name: isAgent ? 'Agente Test' : 'Buscador Test',
							role: isAgent ? 'agent' : 'seeker',
							emailVerified: false,
							image: null,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString()
						}
					}
				})
			});
		} else {
			await route.fulfill({ status: 400, body: JSON.stringify({ message: 'Invalid' }) });
		}
	});

	await page.route('**/auth/sign-up/email', async (route) => {
		const body = JSON.parse(route.request().postData() || '{}');
		if (body.email && body.password) {
			const isAgent = body.role === 'agent';
			loggedInUser = {
				email: body.email,
				name: body.name || body.email.split('@')[0],
				role: isAgent ? 'agent' : 'seeker'
			};
			await page.context().addCookies([{
				name: 'better-auth.session_token',
				value: 'mock-session-token',
				domain: 'localhost',
				path: '/'
			}]);
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					session: {
						user: {
							id: 'new-user-id',
							email: body.email,
							name: body.name || body.email.split('@')[0],
							role: isAgent ? 'agent' : 'seeker',
							emailVerified: false,
							image: null,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString()
						}
					}
				})
			});
		} else {
			await route.fulfill({ status: 400, body: JSON.stringify({ message: 'Invalid' }) });
		}
	});

	await page.route('**/auth/sign-out', async (route) => {
		loggedInUser = null;
		await page.context().addCookies([{
			name: 'better-auth.session_token',
			value: '',
			domain: 'localhost',
			path: '/'
		}]);
		await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
	});

	await page.route('**/auth/get-session', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ session: null, user: null })
		});
	});

	await page.route('**/auth/session', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ session: null, user: null })
		});
	});

	await page.route('**/auth/me', async (route) => {
		if (loggedInUser) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					user: {
						id: 'test-user-id',
						email: loggedInUser.email,
						name: loggedInUser.name,
						role: loggedInUser.role,
						emailVerified: false,
						image: null,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString()
					}
				})
			});
		} else {
			await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Unauthorized' }) });
		}
	});

	await page.route('**/profile', async (route) => {
		if (loggedInUser) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					data: {
						id: 'test-user-id',
						attributes: {
							id: 'test-user-id',
							email: loggedInUser.email,
							name: loggedInUser.name,
							role: loggedInUser.role,
							emailVerified: false,
							image: null,
							licenseNumber: loggedInUser.role === 'agent' ? 'MAT-12345' : null,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString()
						}
					}
				})
			});
		} else {
			await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Unauthorized' }) });
		}
	});

	await page.route('**/notifications/welcome-email', async (route) => {
		await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
	});
}

async function loginAs(page: Page, email: string) {
	loggedInUser = null;
	await page.context().clearCookies();
	await mockAuthApi(page);
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.getByRole('button', { name: 'Iniciar sesión' }).click();
	await page.waitForTimeout(500);
	await page.locator('input[type="email"]').fill(email);
	await page.locator('input[type="password"]').fill('password123');
	await page.locator('[role="dialog"] button:has-text("Iniciar sesión")').click();
	await page.waitForTimeout(2000);
}

async function logout(page: Page) {
	await page.context().clearCookies();
	await mockAuthApi(page);
	await page.goto('/');
	await page.waitForLoadState('networkidle');
}

export { mockAuthApi, loginAs, logout, TEST_AGENT, TEST_SEEKER };
