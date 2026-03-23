import { test, expect } from '@playwright/test';

test.describe('Masterplan Page', () => {
	test('should display masterplan page with title', async ({ page }) => {
		await page.goto('/masterplan');
		await expect(page.getByRole('heading', { name: 'Loteos y Desarrollos' })).toBeVisible();
	});

	test('should show list of loteos/developments', async ({ page }) => {
		await page.goto('/masterplan');
		const loteos = page.locator('a[href^="/localia/masterplan/"]');
		expect(await loteos.count()).toBeGreaterThan(0);
	});

	test('should navigate to masterplan detail', async ({ page }) => {
		await page.goto('/masterplan');
		await page.locator('a[href="/localia/masterplan/el-sol"]').click();
		await expect(page).toHaveURL(/\/masterplan\/el-sol/);
	});

	test('should display parcel map in detail page', async ({ page }) => {
		await page.goto('/masterplan/el-sol');
		await expect(page.getByText('Manzana A')).toBeVisible();
		await expect(page.getByText('Lotes disponibles')).toBeVisible();
	});

	test('should show available parcels list', async ({ page }) => {
		await page.goto('/masterplan/el-sol');
		await expect(page.getByText('Disponible')).toBeVisible();
	});
});

test.describe('Tablero Page', () => {
	test('should display tablero page with heading', async ({ page }) => {
		await page.goto('/tablero');
		await expect(page.getByRole('heading', { name: 'Buscamos propiedades' })).toBeVisible();
	});

	test('should show search postings', async ({ page }) => {
		await page.goto('/tablero');
		await page.waitForTimeout(500);
		await expect(page.getByText('María García')).toBeVisible();
	});

	test('should have filter buttons for property types', async ({ page }) => {
		await page.goto('/tablero');
		await expect(page.getByRole('button', { name: 'Todas' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Casa' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Terreno' })).toBeVisible();
	});

	test('should filter by property type', async ({ page }) => {
		await page.goto('/tablero');
		await page.getByRole('button', { name: 'Casa' }).click();
		await expect(page.getByText('Casa')).toBeVisible();
	});

	test('should show "Publicar búsqueda" button', async ({ page }) => {
		await page.goto('/tablero');
		await expect(page.getByRole('button', { name: 'Publicar búsqueda' })).toBeVisible();
	});

	test('should show WhatsApp contact links', async ({ page }) => {
		await page.goto('/tablero');
		await expect(page.getByText('Contactar')).toBeVisible();
	});
});

test.describe('Furnisher Page', () => {
	test('should display furnisher page', async ({ page }) => {
		await page.goto('/furnisher');
		await expect(page.getByText(/mejorá tus fotos/i)).toBeVisible();
	});

	test('should show "Aplicar a mi foto" button', async ({ page }) => {
		await page.goto('/furnisher');
		await expect(page.getByText(/aplicar a mi foto/i)).toBeVisible();
	});
});
