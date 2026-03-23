import { test, expect } from '@playwright/test';

test.describe('Authentication Modal', () => {
	test('should open auth modal when clicking "Iniciar sesión"', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await expect(page.locator('dialog')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Bienvenido' })).toBeVisible();
	});

	test('should show email and password fields in login form', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await expect(page.locator('textbox[placeholder="tu@email.com"]')).toBeVisible();
		await expect(page.locator('textbox[placeholder="••••••••"]')).toBeVisible();
	});

	test('should switch to register form when clicking "Crear una"', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.getByRole('button', { name: 'Crear una' }).click();
		await expect(page.getByRole('heading', { name: 'Crear cuenta' })).toBeVisible();
	});

	test('should show role selection (Buscador/Agente) in register form', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.getByRole('button', { name: 'Crear una' }).click();
		await expect(page.getByRole('button', { name: 'Buscador' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Agente' })).toBeVisible();
	});

	test('should show name field in register form', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.getByRole('button', { name: 'Crear una' }).click();
		await expect(page.locator('textbox[placeholder="Tu nombre"]')).toBeVisible();
	});

	test('should close auth modal', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.getByRole('button', { name: 'Cerrar' }).click();
		await expect(page.locator('dialog')).not.toBeVisible();
	});
});

test.describe('Auth - Mock Login', () => {
	test('should login with mock credentials and show user menu', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.locator('textbox[placeholder="tu@email.com"]').fill('agente@test.com');
		await page.locator('textbox[placeholder="••••••••"]').fill('password123');
		await page.getByRole('button', { name: 'Iniciar sesión' }).last().click();
		await page.waitForTimeout(1000);
		await expect(page.getByText('Mi perfil')).toBeVisible({ timeout: 5000 });
	});
});
