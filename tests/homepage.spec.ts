import { test, expect, type Page } from '@playwright/test';
import { loginAs, logout, mockAuthApi } from './helpers/auth-mock';

const agenteEmail = 'agente@test.com';
const buscadorEmail = 'buscador@test.com';

test.describe('Homepage', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should display the Localia header with logo', async ({ page }) => {
		await expect(page.locator('header')).toBeVisible();
		await expect(page.getByText('Localia').first()).toBeVisible();
	});

	test('should show search bar with location input', async ({ page }) => {
		const searchInput = page.locator('input[placeholder="Zona o barrio"]');
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
	test.beforeEach(async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should show filters sidebar with "Filtros" heading', async ({ page }) => {
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

test.describe('Homepage - Agent CTA', () => {
	test('should show "¿Sos agente?" CTA when not logged in', async ({ page }) => {
		await mockAuthApi(page);
		await logout(page);
		await expect(page.getByText('¿Sos agente inmobiliario?')).toBeVisible();
	});

	test('should NOT show "¿Sos agente?" CTA when logged in as buscador', async ({ page }) => {
		await loginAs(page, buscadorEmail);
		await expect(page.getByText('¿Sos agente inmobiliario?')).not.toBeVisible();
	});

	test('should NOT show "¿Sos agente?" CTA when logged in as agente', async ({ page }) => {
		await loginAs(page, agenteEmail);
		await expect(page.getByText('¿Sos agente inmobiliario?')).not.toBeVisible();
	});
});

test.describe('Homepage - Search', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should accept text in search input', async ({ page }) => {
		const searchInput = page.locator('input[placeholder*="Zona"]');
		await searchInput.waitFor({ state: 'visible' });
		await searchInput.fill('Mercedes');
		await expect(searchInput).toHaveValue('Mercedes');
	});
});
