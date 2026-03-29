import { type Page } from '@playwright/test';

const TEST_AGENT = { email: 'agente@test.com', password: 'password123' };
const TEST_SEEKER = { email: 'buscador@test.com', password: 'password123' };

function createAuthMocks(page: Page) {
	function mockUser(email: string, isAgent: boolean) {
		return {
			email,
			name: isAgent ? 'Agente Test' : 'Buscador Test',
			role: (isAgent ? 'agent' : 'seeker') as 'seeker' | 'agent'
		};
	}

	async function setSessionStorage(email: string, isAgent: boolean) {
		const SESSION_KEY = 'localia_mock_session';
		const USERS_KEY = 'localia_mock_users';

		const existingUsers = await page.evaluate(() => {
			const data = localStorage.getItem('localia_mock_users');
			return data ? JSON.parse(data) : [];
		});

		if (existingUsers.length === 0) {
			const demoUsers = [
				{
					id: 'test-user-1',
					email: 'agente@test.com',
					name: 'Agente Test',
					role: 'agent',
					licenseNumber: 'MAT-12345',
					passwordHash: '3232323232'
				},
				{
					id: 'test-user-2',
					email: 'buscador@test.com',
					name: 'Buscador Test',
					role: 'seeker',
					passwordHash: '3232323232'
				}
			];
			await page.evaluate((users) => {
				localStorage.setItem('localia_mock_users', JSON.stringify(users));
			}, demoUsers);
		}

		await page.evaluate(
			(data) => {
				localStorage.setItem(
					'localia_mock_session',
					JSON.stringify({
						userId: data.userId,
						token:
							'mock_token_' +
							Math.random().toString(36).substring(2) +
							Date.now().toString(36)
					})
				);
			},
			{
				userId: isAgent ? 'test-user-1' : 'test-user-2'
			}
		);
	}

	async function setup() {
		await page.route('**/auth/sign-in/email', async (route) => {
			const body = JSON.parse(route.request().postData() || '{}');
			if (body.email && body.password) {
				const isAgent = body.email.includes('agente');
				await setSessionStorage(body.email, isAgent);
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
				await setSessionStorage(body.email, isAgent);
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
			await page.evaluate(() => {
				localStorage.removeItem('localia_mock_session');
			});
			await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
		});

		await page.route('**/auth/get-session', async (route) => {
			const session = await page.evaluate(() => {
				const data = localStorage.getItem('localia_mock_session');
				return data ? JSON.parse(data) : null;
			});
			if (session) {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ session, user: null })
				});
			} else {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ session: null, user: null })
				});
			}
		});

		await page.route('**/auth/session', async (route) => {
			const session = await page.evaluate(() => {
				const data = localStorage.getItem('localia_mock_session');
				return data ? JSON.parse(data) : null;
			});
			if (session) {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ session, user: null })
				});
			} else {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ session: null, user: null })
				});
			}
		});

		await page.route('**/auth/me', async (route) => {
			const session = await page.evaluate(() => {
				const data = localStorage.getItem('localia_mock_session');
				return data ? JSON.parse(data) : null;
			});
			if (session) {
				const users = await page.evaluate(() => {
					const data = localStorage.getItem('localia_mock_users');
					return data ? JSON.parse(data) : [];
				});
				const user = users.find((u: any) => u.id === session.userId);
				if (user) {
					await route.fulfill({
						status: 200,
						contentType: 'application/json',
						body: JSON.stringify({
							user: {
								id: user.id,
								email: user.email,
								name: user.name,
								role: user.role,
								emailVerified: false,
								image: null,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString()
							}
						})
					});
					return;
				}
			}
			await route.fulfill({
				status: 401,
				contentType: 'application/json',
				body: JSON.stringify({ message: 'Unauthorized' })
			});
		});

		await page.route('**/profile', async (route) => {
			const session = await page.evaluate(() => {
				const data = localStorage.getItem('localia_mock_session');
				return data ? JSON.parse(data) : null;
			});
			if (session) {
				const users = await page.evaluate(() => {
					const data = localStorage.getItem('localia_mock_users');
					return data ? JSON.parse(data) : [];
				});
				const user = users.find((u: any) => u.id === session.userId);
				if (user) {
					await route.fulfill({
						status: 200,
						contentType: 'application/json',
						body: JSON.stringify({
							data: {
								id: user.id,
								attributes: {
									id: user.id,
									email: user.email,
									name: user.name,
									role: user.role,
									emailVerified: false,
									image: null,
									licenseNumber: user.role === 'agent' ? 'MAT-12345' : null,
									createdAt: new Date().toISOString(),
									updatedAt: new Date().toISOString()
								}
							}
						})
					});
					return;
				}
			}
			await route.fulfill({
				status: 401,
				contentType: 'application/json',
				body: JSON.stringify({ message: 'Unauthorized' })
			});
		});

		await page.route('**/notifications/welcome-email', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ success: true })
			});
		});
	}

	async function logout() {
		await page.context().clearCookies();
		await page.goto('/');
		await page.evaluate(() => localStorage.removeItem('localia_mock_session'));
		await page.reload();
		await page.waitForLoadState('networkidle');
	}

	async function loginAs(email: string) {
		await page.context().clearCookies();
		await setup();
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.evaluate(() => {
			localStorage.removeItem('localia_mock_session');
			localStorage.removeItem('localia_mock_users');
		});
		const isAgent = email.includes('agente');
		const userId = isAgent ? 'test-user-1' : 'test-user-2';
		await page.evaluate((id) => {
			localStorage.setItem(
				'localia_mock_users',
				JSON.stringify([
					{
						id: 'test-user-1',
						email: 'agente@test.com',
						name: 'Agente Test',
						role: 'agent',
						licenseNumber: 'MAT-12345',
						passwordHash: '3232323232'
					},
					{
						id: 'test-user-2',
						email: 'buscador@test.com',
						name: 'Buscador Test',
						role: 'seeker',
						passwordHash: '3232323232'
					}
				])
			);
			localStorage.setItem(
				'localia_mock_session',
				JSON.stringify({
					userId: id,
					token:
						'mock_token_' +
						Math.random().toString(36).substring(2) +
						Date.now().toString(36)
				})
			);
		}, userId);
		await page.reload();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1500);
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
