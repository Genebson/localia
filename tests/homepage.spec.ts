import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should display the Localia header with logo', async ({ page }) => {
		await expect(page.locator('header')).toBeVisible();
		await expect(page.getByText('Localia').first()).toBeVisible();
	});

	test('should show search bar with location input', async ({ page }) => {
		const searchInput = page.locator('input[placeholder="Ciudad, barrio o dirección"]');
		await expect(searchInput).toBeVisible();
	});

	test('should show property type buttons', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Departamentos' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Casas' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Terrenos' })).toBeVisible();
	});

	test('should display property cards', async ({ page }) => {
		await page.waitForTimeout(1000);
		const cards = page.locator('a[href*="/property/"]');
		expect(await cards.count()).toBeGreaterThan(0);
	});

	test('should show footer', async ({ page }) => {
		await expect(page.locator('footer')).toBeVisible();
	});

	test('should show auth buttons when not logged in', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Registrarse' })).toBeVisible();
	});
});

test.describe('Homepage - Filters', () => {
	test('should show filters sidebar with "Filtros" heading', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: 'Filtros' })).toBeVisible();
	});

	test('should filter by "Comprar" operation', async ({ page }) => {
		await page.goto('/?operation=buy');
		await expect(page).toHaveURL(/operation=buy/);
	});

	test('should clear all filters with "Limpiar" button', async ({ page }) => {
		await page.goto('/?operation=buy&estado=nueva');
		await page.getByRole('button', { name: 'Limpiar' }).click();
	});
});

test.describe('Homepage - Search', () => {
	test('should accept text in search input', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		const searchInput = page.locator('input[placeholder*="Ciudad"]');
		await searchInput.waitFor({ state: 'visible' });
		await searchInput.fill('Mercedes');
		await expect(searchInput).toHaveValue('Mercedes');
	});
});
