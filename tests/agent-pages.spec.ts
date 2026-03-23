import { test, expect } from '@playwright/test';

const mockAgentLogin = async ({ page }: { page: any }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.getByRole('button', { name: 'Iniciar sesión' }).click();
	await page.waitForTimeout(500);
	await page.locator('input[type="email"]').fill('agente@test.com');
	await page.locator('input[type="password"]').fill('password123');
	await page.locator('[role="dialog"] button:has-text("Iniciar sesión")').click();
	await page.waitForTimeout(1500);
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
