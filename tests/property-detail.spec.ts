import { test, expect } from '@playwright/test';

test.describe('Property Detail Page', () => {
	test('should navigate to property detail when clicking a property card', async ({ page }) => {
		await page.goto('/');
		await page.waitForSelector('a[href*="/property/"]', { timeout: 10000 });
		await page.locator('a[href*="/property/"]').first().click();
		await expect(page).toHaveURL(/\/property\/.+/);
	});

	test('should display property title', async ({ page }) => {
		await page.goto('/property/018d1a2b-3c4e-7f89-ab01-234567890abc', { waitUntil: 'networkidle' });
		await expect(page.locator('h1')).toContainText('Departamento', { timeout: 10000 });
	});

	test('should display property price', async ({ page }) => {
		await page.goto('/property/018d1a2b-3c4e-7f89-ab01-234567890abc', { waitUntil: 'networkidle' });
		await expect(page.getByText('USD 185.000')).toBeVisible({ timeout: 10000 });
	});

	test('should display property location', async ({ page }) => {
		await page.goto('/property/018d1a2b-3c4e-7f89-ab01-234567890abc', { waitUntil: 'networkidle' });
		await expect(page.getByText('Centro, Mercedes, Buenos Aires')).toBeVisible({ timeout: 10000 });
	});

	test('should display property attributes (bedrooms, bathrooms, surface)', async ({ page }) => {
		await page.goto('/property/018d1a2b-3c4e-7f89-ab01-234567890abc', { waitUntil: 'networkidle' });
		await expect(page.getByText('dormitorios')).toBeVisible({ timeout: 10000 });
		await expect(page.getByText('baños')).toBeVisible({ timeout: 10000 });
	});

	test('should show property description section', async ({ page }) => {
		await page.goto('/property/018d1a2b-3c4e-7f89-ab01-234567890abc', { waitUntil: 'networkidle' });
		await expect(page.getByRole('heading', { name: 'Descripción' })).toBeVisible({ timeout: 10000 });
	});

	test('should show property images gallery with thumbnails', async ({ page }) => {
		await page.goto('/property/018d1a2b-3c4e-7f89-ab01-234567890abc', { waitUntil: 'networkidle' });
		await page.waitForTimeout(1000);
		const thumbnails = page.locator('button:has-text("Miniatura")');
		expect(await thumbnails.count()).toBeGreaterThan(0);
	});

	test('should show "Contactar agente" button', async ({ page }) => {
		await page.goto('/property/018d1a2b-3c4e-7f89-ab01-234567890abc', { waitUntil: 'networkidle' });
		await expect(page.getByRole('button', { name: 'Contactar agente' })).toBeVisible({ timeout: 10000 });
	});

	test('should show "Agendar visita" button', async ({ page }) => {
		await page.goto('/property/018d1a2b-3c4e-7f89-ab01-234567890abc', { waitUntil: 'networkidle' });
		await expect(page.getByRole('button', { name: 'Agendar visita' })).toBeVisible({ timeout: 10000 });
	});

	test('should show agent information section', async ({ page }) => {
		await page.goto('/property/018d1a2b-3c4e-7f89-ab01-234567890abc', { waitUntil: 'networkidle' });
		await expect(page.getByRole('heading', { name: 'Tu agente' })).toBeVisible({ timeout: 10000 });
		await expect(page.getByText('María González')).toBeVisible({ timeout: 10000 });
	});

	test('should display property features/tags', async ({ page }) => {
		await page.goto('/property/018d1a2b-3c4e-7f89-ab01-234567890abc', { waitUntil: 'networkidle' });
		await expect(page.getByRole('heading', { name: 'Características' })).toBeVisible({ timeout: 10000 });
	});

	test('should have "Volver a propiedades" link', async ({ page }) => {
		await page.goto('/property/018d1a2b-3c4e-7f89-ab01-234567890abc', { waitUntil: 'networkidle' });
		await expect(page.getByText('Volver a propiedades')).toBeVisible({ timeout: 10000 });
	});
});
