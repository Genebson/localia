import { test, expect, type Page } from '@playwright/test';
import { mockAuthApi } from './helpers/auth-mock';

const mockAgentLogin = async ({ page }: { page: Page }) => {
	await mockAuthApi(page);
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.evaluate(() => {
		localStorage.setItem(
			'localia_mock_users',
			JSON.stringify([
				{
					id: 'test-user-1',
					email: 'agente@test.com',
					name: 'Agente Test',
					role: 'agent',
					licenseNumber: 'MAT-12345',
					passwordHash: 'xxx'
				}
			])
		);
		localStorage.setItem(
			'localia_mock_session',
			JSON.stringify({ userId: 'test-user-1', token: 'test_token_123' })
		);
	});
	await page.reload();
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(500);
};

test.describe('Publicar Property Page', () => {
	test('should allow agent to access publicar page after login', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/publicar');
		await expect(page).toHaveURL(/\/publicar/);
	});
});

test.describe('Mis Propiedades Page', () => {
	test('should allow agent to access mis-propiedades page after login', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/mis-propiedades');
		await expect(page).toHaveURL(/\/mis-propiedades/);
	});
});

test.describe('Perfil Page', () => {
	test('should allow agent to access perfil page after login', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/perfil');
		await expect(page).toHaveURL(/\/perfil/);
	});
});

test.describe('ChePibe CRM Page', () => {
	test('should allow agent to access chepibe page after login', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/chepibe');
		await expect(page).toHaveURL(/\/chepibe/);
	});
});
