import { test, expect, type Page } from '@playwright/test';
import { loginAs, logout, mockAuthApi } from './helpers/auth-mock';
import { mockPropertyApi } from './helpers/property-mock';

async function ensureLogout(page: Page) {
	await page.context().clearCookies();
	await mockAuthApi(page);
	await mockPropertyApi(page);
	await page.goto('/');
	await page.waitForTimeout(500);
}

test.describe('Property Detail Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuthApi(page);
		await mockPropertyApi(page);
	});

	test('should navigate to property detail when clicking a property card', async ({ page }) => {
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
});
