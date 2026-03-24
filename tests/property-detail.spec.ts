import { test, expect, type Page } from '@playwright/test';

async function logout(page: Page) {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	try {
		const userMenuButton = page.locator('.user-menu > button');
		if (await userMenuButton.isVisible({ timeout: 1000 })) {
			await userMenuButton.click();
			await page.waitForTimeout(300);
			const logoutBtn = page.getByRole('button', { name: 'Cerrar sesión' });
			if (await logoutBtn.isVisible({ timeout: 1000 })) {
				await logoutBtn.click();
				await page.waitForTimeout(500);
			}
		}
	} catch {
		// User not logged in, continue
	}
}

async function loginAs(page: Page, email: string) {
	await logout(page);
	await page.getByRole('button', { name: 'Iniciar sesión' }).click();
	await page.waitForTimeout(500);
	await page.locator('input[type="email"]').fill(email);
	await page.locator('input[type="password"]').fill('password123');
	await page.locator('[role="dialog"] button:has-text("Iniciar sesión")').click();
	await page.waitForTimeout(2000);
}

test.describe('Property Detail Page', () => {
	test('should navigate to property detail when clicking a property card', async ({ page }) => {
		await page.goto('/');
		await page.waitForSelector('a[href*="/property/"]', { timeout: 10000 });
		await page.locator('a[href*="/property/"]').first().click();
		await expect(page).toHaveURL(/\/property\/.+/);
	});

	test('should open auth modal when clicking favorite while logged out', async ({ page }) => {
		await logout(page);
		await page.goto('/');
		await page.waitForSelector('a[href*="/property/"]', { timeout: 10000 });
		await page.locator('a[href*="/property/"]').first().click();
		await expect(page).toHaveURL(/\/property\/.+/);
		const favoriteBtn = page.locator('button[aria-label="Agregar a favoritos"]');
		await favoriteBtn.waitFor({ state: 'visible' });
		await favoriteBtn.click();
		await expect(page.locator('text=Bienvenido')).toBeVisible({ timeout: 5000 });
	});

	test('should toggle favorite when logged in', async ({ page }) => {
		await loginAs(page, 'buscador@test.com');
		await page.goto('/');
		await page.waitForSelector('a[href*="/property/"]', { timeout: 10000 });
		await page.locator('a[href*="/property/"]').first().click();
		await expect(page).toHaveURL(/\/property\/.+/);
		await page.locator('button[aria-label="Agregar a favoritos"]').click();
		await expect(page.locator('button[aria-label="Quitar de favoritos"]')).toBeVisible({
			timeout: 5000
		});
	});
});
