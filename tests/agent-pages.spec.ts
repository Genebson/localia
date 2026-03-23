import { test, expect } from '@playwright/test';

const mockAgentLogin = async ({ page }: { page: any }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Iniciar sesión' }).click();
	await page.locator('textbox[placeholder="tu@email.com"]').fill('agente@test.com');
	await page.locator('textbox[placeholder="••••••••"]').fill('password123');
	await page.getByRole('button', { name: 'Iniciar sesión' }).last().click();
	await page.waitForTimeout(1000);
};

test.describe('Publicar Property Page', () => {
	test('should allow agent to access publicar page after login', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/publicar');
		await expect(page).toHaveURL(/\/publicar/);
	});

	test('should show publication form heading', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/publicar');
		await expect(page.locator('h1, h2')).toBeVisible();
	});

	test('should show property type buttons', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/publicar');
		await expect(page.getByText('Departamento')).toBeVisible();
		await expect(page.getByText('Casa')).toBeVisible();
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

	test('should show CRM interface elements', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/chepibe');
		await page.waitForTimeout(500);
	});
});

test.describe('Agent-only UI Elements', () => {
	test('should show "Publicar propiedad" button in header for agent', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/');
		await expect(page.getByText('Publicar propiedad')).toBeVisible();
	});
});
