import { test, expect, type Page } from '@playwright/test';
import { loginAs } from './helpers/auth-mock';
import { mockPropertyApi } from './helpers/property-mock';

const sharedFavorites: string[] = [];

async function mockFavoritesApi(page: Page) {
	await page.route('**/favorites', async (route) => {
		const method = route.request().method();
		if (method === 'GET') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ favorites: sharedFavorites })
			});
		} else if (method === 'POST') {
			const body = JSON.parse(route.request().postData() || '{}');
			if (!sharedFavorites.includes(body.propertyId)) {
				sharedFavorites.push(body.propertyId);
			}
			await route.fulfill({
				status: 201,
				contentType: 'application/json',
				body: JSON.stringify({ success: true })
			});
		} else {
			await route.fulfill({ status: 405 });
		}
	});

	await page.route(/\/favorites\/.+/, async (route) => {
		const url = route.request().url();
		const propertyId = url.split('/favorites/')[1];
		const method = route.request().method();
		if (method === 'DELETE') {
			const idx = sharedFavorites.indexOf(propertyId);
			if (idx !== -1) {
				sharedFavorites.splice(idx, 1);
			}
			await route.fulfill({ status: 204 });
		} else {
			await route.fulfill({ status: 405 });
		}
	});
}

test.describe('Favorites', () => {
	test.beforeEach(async ({ page }) => {
		sharedFavorites.length = 0;
		await mockPropertyApi(page);
		await mockFavoritesApi(page);
	});

	test('should toggle favorite when logged in', async ({ page }) => {
		await loginAs(page, 'buscador@test.com');
		await page.goto('/');
		await page.waitForTimeout(2000);

		const heartButton = page.locator('button[aria-label="Agregar a favoritos"]').first();

		await heartButton.click();
		await page.waitForTimeout(500);

		await expect(page.locator('button[aria-label="Quitar de favoritos"]').first()).toBeVisible({ timeout: 3000 });
	});

	test('should call POST /favorites when adding favorite', async ({ page }) => {
		await loginAs(page, 'buscador@test.com');
		await page.goto('/');
		await page.waitForTimeout(2000);

		let postCalled = false;
		page.on('request', (req) => {
			if (req.url().includes('/favorites') && req.method() === 'POST') {
				postCalled = true;
			}
		});

		const heartButton = page.locator('button[aria-label="Agregar a favoritos"]').first();
		await heartButton.click();
		await page.waitForTimeout(1000);

		expect(postCalled).toBe(true);
	});
});
