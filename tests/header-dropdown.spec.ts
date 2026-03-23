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

test.describe('Header Dropdown', () => {
	test.describe('Searcher (Buscador)', () => {
		test('should show only profile options in dropdown', async ({ page }) => {
			await loginAs(page, 'buscador@test.com');

			await page.locator('.user-menu > button').click();
			await page.waitForTimeout(500);

			await expect(page.getByRole('link', { name: 'Mi Perfil' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Masterplan' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Tablero de Búsquedas' })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
		});

		test('should NOT show agent-only options for buscador', async ({ page }) => {
			await loginAs(page, 'buscador@test.com');

			await page.locator('.user-menu > button').click();
			await page.waitForTimeout(500);

			await expect(page.getByRole('link', { name: 'Mis Propiedades' })).not.toBeVisible();
			await expect(page.getByRole('link', { name: 'Furnisher' })).not.toBeVisible();
			await expect(page.getByRole('link', { name: 'ChePibe' })).not.toBeVisible();
		});

		test('should NOT show Publicar propiedad link for buscador', async ({ page }) => {
			await loginAs(page, 'buscador@test.com');

			await expect(
				page.locator('header').getByRole('link', { name: 'Publicar propiedad' })
			).not.toBeVisible();
		});
	});

	test.describe('Agent (Agente)', () => {
		test('should show all options in dropdown', async ({ page }) => {
			await loginAs(page, 'agente@test.com');

			await page.locator('.user-menu > button').click();
			await page.waitForTimeout(500);

			await expect(page.getByRole('link', { name: 'Mi Perfil' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Mis Propiedades' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Masterplan' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Tablero de Búsquedas' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Furnisher' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'ChePibe' })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
		});

		test('should show Publicar propiedad link for agent', async ({ page }) => {
			await loginAs(page, 'agente@test.com');

			await expect(
				page.locator('header').getByRole('link', { name: 'Publicar propiedad' })
			).toBeVisible();
		});

		test('should show furnisher and chepibe with gradient styling', async ({ page }) => {
			await loginAs(page, 'agente@test.com');

			await page.locator('.user-menu > button').click();
			await page.waitForTimeout(500);

			const furnisherLink = page.getByRole('link', { name: 'Furnisher' });
			const chepibeLink = page.getByRole('link', { name: 'ChePibe' });

			await expect(furnisherLink).toBeVisible();
			await expect(chepibeLink).toBeVisible();

			await expect(furnisherLink).toHaveClass(/from-green-600/);
			await expect(furnisherLink).toHaveClass(/to-emerald-500/);
			await expect(chepibeLink).toHaveClass(/from-green-600/);
			await expect(chepibeLink).toHaveClass(/to-emerald-500/);
		});

		test('should show Nuevo badge on furnisher and chepibe', async ({ page }) => {
			await loginAs(page, 'agente@test.com');

			await page.locator('.user-menu > button').click();
			await page.waitForTimeout(500);

			// Nuevo badge appears inside the furnisher and chepibe gradient cards
			const nuevoBadges = page.locator('.user-menu >> text=Nuevo');
			await expect(nuevoBadges).toHaveCount(2);
		});
	});
});
