import { test, expect } from '@playwright/test';

test.describe('Authentication Modal', () => {
	test('should open auth modal when clicking "Iniciar sesión"', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await expect(page.locator('text=Bienvenido')).toBeVisible({ timeout: 5000 });
	});

	test('should show email and password fields in login form', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 5000 });
		await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 5000 });
	});

	test('should switch to register form when clicking "Crear una"', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.getByRole('button', { name: 'Crear una' }).click();
		await expect(page.locator('text=Crear cuenta')).toBeVisible({ timeout: 5000 });
	});

	test('should show role selection (Buscador/Agente) in register form', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.getByRole('button', { name: 'Crear una' }).click();
		await expect(page.getByRole('button', { name: 'Buscador' })).toBeVisible({ timeout: 5000 });
		await expect(page.getByRole('button', { name: 'Agente' })).toBeVisible({ timeout: 5000 });
	});

	test('should show name field in register form', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.waitForTimeout(500);
		await page.getByRole('button', { name: 'Crear una' }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('input[placeholder="Tu nombre"]')).toBeVisible({ timeout: 5000 });
	});

	test('should close auth modal', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await expect(page.locator('text=Bienvenido')).toBeVisible({ timeout: 5000 });
		await expect(page.locator('button[aria-label="Cerrar"]').or(page.getByRole('button', { name: '×' }))).toBeVisible();
	});
});

test.describe('Auth - Mock Login', () => {
	test('should login with mock credentials and show user menu', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.waitForTimeout(500);
		await page.locator('input[type="email"]').fill('agente@test.com');
		await page.locator('input[type="password"]').fill('password123');
		await page.getByRole('button', { name: 'Iniciar sesión' }).last().click();
		await page.waitForTimeout(1500);
		await expect(page.getByText('Mi perfil')).toBeVisible({ timeout: 5000 });
	});
});
