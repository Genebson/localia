import { test, expect, type Page } from '@playwright/test';
import { logout, mockAuthApi } from './helpers/auth-mock';
import { mockPropertyApi, addProperty } from './helpers/property-mock';

async function ensureLogout(page: Page) {
	await page.context().clearCookies();
	await mockAuthApi(page);
	await mockPropertyApi(page);
	addProperty();
	await page.goto('/');
	await page.waitForLoadState('networkidle');
}

test.describe('Property Detail Page', () => {
	test('should navigate to property detail when clicking a property card', async ({ page }) => {
		await mockAuthApi(page);
		await mockPropertyApi(page);
		addProperty();
		await page.goto('/');
		await page.waitForSelector('a[href*="/property/"]', { timeout: 10000 });
		await page.locator('a[href*="/property/"]').first().click();
		await expect(page).toHaveURL(/\/property\/.+/);
	});

	test('should open auth modal when clicking favorite while logged out', async ({ page }) => {
		await ensureLogout(page);
		await page.waitForTimeout(1000);
		const favoriteBtn = page.locator('[aria-label="Agregar a favoritos"]').first();
		await favoriteBtn.waitFor({ state: 'visible', timeout: 10000 });
		await favoriteBtn.click();
		await expect(page.locator('text=Bienvenido')).toBeVisible({ timeout: 10000 });
	});

	test.skip('should toggle favorite when logged in', async ({ page }) => {
		await mockAuthApi(page);
		await mockPropertyApi(page);
		addProperty();
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.getByRole('button', { name: 'Iniciar sesión' }).click();
		await page.waitForTimeout(500);
		await page.locator('input[type="email"]').fill('buscador@test.com');
		await page.locator('input[type="password"]').fill('password123');
		await page.locator('[role="dialog"] button:has-text("Iniciar sesión")').click();
		await page.waitForTimeout(2000);
		await page.waitForSelector('a[href*="/property/"]', { timeout: 10000 });
		await page.locator('a[href*="/property/"]').first().click();
		await expect(page).toHaveURL(/\/property\/.+/);
		await page.waitForSelector('button[aria-label="Agregar a favoritos"]', { timeout: 10000 });
		await page.locator('button[aria-label="Agregar a favoritos"]').click();
		await expect(page.locator('button[aria-label="Quitar de favoritos"]')).toBeVisible({
			timeout: 5000
		});
	});
});
