import { test, expect, type Page } from '@playwright/test';
import { loginAs, logout, mockAuthApi } from './helpers/auth-mock';

async function ensureLogout(page: Page) {
	await page.context().clearCookies();
	await mockAuthApi(page);
	await page.goto('/');
	await page.waitForLoadState('networkidle');
}

test.describe('Property Detail Page', () => {
	test('should navigate to property detail when clicking a property card', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/');
		await page.waitForSelector('a[href*="/property/"]', { timeout: 10000 });
		await page.locator('a[href*="/property/"]').first().click();
		await expect(page).toHaveURL(/\/property\/.+/);
	});

	test('should open auth modal when clicking favorite while logged out', async ({ page }) => {
		await ensureLogout(page);
		await page.goto('/');
		await page.waitForSelector('a[href*="/property/"]', { timeout: 10000 });
		await page.locator('a[href*="/property/"]').first().click();
		await expect(page).toHaveURL(/\/property\/.+/);
		const favoriteBtn = page.locator('button[aria-label="Agregar a favoritos"]');
		await favoriteBtn.waitFor({ state: 'visible' });
		await favoriteBtn.click();
		await expect(page.locator('text=Bienvenido')).toBeVisible({ timeout: 10000 });
	});

	// TODO: Fix favorites - localStorage-based, needs auth check in PropertyCard.svelte
	// test('should toggle favorite when logged in', async ({ page }) => {
	// 	await loginAs(page, 'buscador@test.com');
	// 	await page.goto('/');
	// 	await page.waitForSelector('a[href*="/property/"]', { timeout: 10000 });
	// 	await page.locator('a[href*="/property/"]').first().click();
	// 	await expect(page).toHaveURL(/\/property\/.+/);
	// 	await page.locator('button[aria-label="Agregar a favoritos"]').click();
	// 	await expect(page.locator('button[aria-label="Quitar de favoritos"]')).toBeVisible({
	// 		timeout: 5000
	// 	});
	// });
});
