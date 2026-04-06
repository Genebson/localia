import { test, expect, type Page } from '@playwright/test';
import { loginAs, logout, mockAuthApi } from './helpers/auth-mock';

const agenteEmail = 'agente@test.com';
const buscadorEmail = 'buscador@test.com';

test.describe('Header Dropdown', () => {
	test.describe('Searcher (Buscador)', () => {
		test('should show only profile options in dropdown', async ({ page }) => {
			await loginAs(page, buscadorEmail);

			await page.locator('.user-menu > button').click();
			await page.waitForTimeout(500);

			await expect(page.getByRole('link', { name: 'Mi Perfil' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Tablero de Búsquedas' })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
		});

		test('should NOT show agent-only options for buscador', async ({ page }) => {
			await loginAs(page, buscadorEmail);

			await page.locator('.user-menu > button').click();
			await page.waitForTimeout(500);

			await expect(page.getByRole('link', { name: 'Mis Propiedades' })).not.toBeVisible();
			await expect(page.getByRole('link', { name: /Furnisher/ })).not.toBeVisible();
			await expect(page.getByRole('link', { name: /ChePibe/ })).not.toBeVisible();
		});

		test('should NOT show Publicar propiedad link for buscador', async ({ page }) => {
			await loginAs(page, buscadorEmail);

			await expect(
				page.locator('header').getByRole('link', { name: 'Publicar propiedad' })
			).not.toBeVisible();
		});
	});

	test.describe('Martillero', () => {
		test('should show all options in dropdown', async ({ page }) => {
			await loginAs(page, agenteEmail);

			await page.locator('.user-menu > button').click();
			await page.waitForTimeout(500);

			await expect(page.getByRole('link', { name: 'Mi Perfil' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Mis Chats' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Mis Propiedades' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Tablero de Búsquedas' })).toBeVisible();
			await expect(page.getByRole('link', { name: /Furnisher/ })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
		});

		test('should show Publicar propiedad link for agent', async ({ page }) => {
			await loginAs(page, agenteEmail);

			await expect(
				page.locator('header').getByRole('link', { name: 'Publicar propiedad' })
			).toBeVisible();
		});

		test('should show furnisher with gradient styling', async ({ page }) => {
			await loginAs(page, agenteEmail);

			await page.locator('.user-menu > button').click();
			await page.waitForTimeout(500);

			const furnisherLink = page.getByRole('link', { name: /Furnisher/ });

			await expect(furnisherLink).toBeVisible();

			await expect(furnisherLink).toHaveClass(/from-green-600/);
			await expect(furnisherLink).toHaveClass(/to-emerald-500/);
		});

		test('should show Nuevo badge on furnisher', async ({ page }) => {
			await loginAs(page, agenteEmail);

			await page.locator('.user-menu > button').click();
			await page.waitForTimeout(500);

			const nuevoBadges = page.locator('.user-menu >> text=Nuevo');
			await expect(nuevoBadges).toHaveCount(1);
		});
	});
});
