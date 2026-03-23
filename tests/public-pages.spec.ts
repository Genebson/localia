import { test, expect } from '@playwright/test';

test.describe('Masterplan Page', () => {
	test('should display masterplan page', async ({ page }) => {
		await page.goto('/masterplan');
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(1000);
		await expect(page.locator('body')).toBeVisible();
	});
});

test.describe('Tablero Page', () => {
	test('should display tablero page', async ({ page }) => {
		await page.goto('/tablero');
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(1000);
		await expect(page.locator('body')).toBeVisible();
	});
});

test.describe('Furnisher Page', () => {
	test('should display furnisher page', async ({ page }) => {
		await page.goto('/furnisher');
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(1000);
		await expect(page.locator('body')).toBeVisible();
	});
});
