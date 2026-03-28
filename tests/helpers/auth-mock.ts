import { type Page } from '@playwright/test';

const TEST_AGENT = { email: 'agente@test.com', password: 'password123' };
const TEST_SEEKER = { email: 'buscador@test.com', password: 'password123' };

function createAuthMocks(page: Page) {
	async function setup() {
		await page.route('**/auth/sign-in/email', async (route) => {
			const body = JSON.parse(route.request().postData() || '{}');
			if (body.email && body.password) {
				const isAgent = body.email.includes('agente');
				const name = isAgent ? 'Agente Test' : 'Buscador Test';
				const role = isAgent ? 'agent' : 'seeker';
				await page.context().addCookies([{
					name: 'mock_user_email',
					value: encodeURIComponent(body.email),
					domain: 'localhost',
					path: '/'
				}, {
					name: 'mock_user_name',
					value: encodeURIComponent(name),
					domain: 'localhost',
					path: '/'
				}, {
					name: 'mock_user_role',
					value: role,
					domain: 'localhost',
					path: '/'
				}, {
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
								name,
								role,
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
				const name = body.name || body.email.split('@')[0];
				const role = isAgent ? 'agent' : 'seeker';
				await page.context().addCookies([{
					name: 'mock_user_email',
					value: encodeURIComponent(body.email),
					domain: 'localhost',
					path: '/'
				}, {
					name: 'mock_user_name',
					value: encodeURIComponent(name),
					domain: 'localhost',
					path: '/'
				}, {
					name: 'mock_user_role',
					value: role,
					domain: 'localhost',
					path: '/'
				}, {
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
								name,
								role,
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
			await page.context().addCookies([
				{ name: 'mock_user_email', value: '', domain: 'localhost', path: '/' },
				{ name: 'mock_user_name', value: '', domain: 'localhost', path: '/' },
				{ name: 'mock_user_role', value: '', domain: 'localhost', path: '/' },
				{ name: 'better-auth.session_token', value: '', domain: 'localhost', path: '/' }
			]);
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
			const cookies = await page.context().cookies();
			const emailCookie = cookies.find(c => c.name === 'mock_user_email');
			const nameCookie = cookies.find(c => c.name === 'mock_user_name');
			const roleCookie = cookies.find(c => c.name === 'mock_user_role');
			if (emailCookie && nameCookie && roleCookie) {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						user: {
							id: 'test-user-id',
							email: decodeURIComponent(emailCookie.value),
							name: decodeURIComponent(nameCookie.value),
							role: roleCookie.value,
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
			const cookies = await page.context().cookies();
			const emailCookie = cookies.find(c => c.name === 'mock_user_email');
			const nameCookie = cookies.find(c => c.name === 'mock_user_name');
			const roleCookie = cookies.find(c => c.name === 'mock_user_role');
			if (emailCookie && nameCookie && roleCookie) {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						data: {
							id: 'test-user-id',
							attributes: {
								id: 'test-user-id',
								email: decodeURIComponent(emailCookie.value),
								name: decodeURIComponent(nameCookie.value),
								role: roleCookie.value,
								emailVerified: false,
								image: null,
								licenseNumber: roleCookie.value === 'agent' ? 'MAT-12345' : null,
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

		await page.route('**/notifications/forgot-password', async (route) => {
			await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
		});

		await page.route('**/auth/reset-password', async (route) => {
			await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
		});
	}

	async function logout() {
		await page.context().clearCookies();
		await page.goto('about:blank');
		await setup();
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	}

	async function loginAs(email: string) {
		await page.context().clearCookies();
		await setup();
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.waitForTimeout(500);
		await page.locator('input[type="email"]').fill(email);
		await page.locator('input[type="password"]').fill('password123');
		await page.locator('[role="dialog"] button:has-text("Iniciar sesión")').click();
		await page.waitForTimeout(2000);
	}

	return { setup, loginAs, logout };
}

async function mockAuthApi(page: Page) {
	await page.context().clearCookies();
	await createAuthMocks(page).setup();
}

async function loginAs(page: Page, email: string) {
	await createAuthMocks(page).loginAs(email);
}

async function logout(page: Page) {
	await createAuthMocks(page).logout();
}

export { mockAuthApi, loginAs, logout, TEST_AGENT, TEST_SEEKER, createAuthMocks };
