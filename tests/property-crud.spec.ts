import { test, expect } from '@playwright/test';
import { mockAuthApi, loginAs } from './helpers/auth-mock';
import { mockPropertyApi, addProperty } from './helpers/property-mock';

test.describe('Property CRUD', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuthApi(page);
		await mockPropertyApi(page);
	});

	test('should publish a property successfully', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		await page.goto('/localia/publicar');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1500);

		await page.locator('input[placeholder*="ej: Departamento"]').fill('Departamento en Palermo');
		await page.locator('input[placeholder*="Ej: Palermo, Buenos Aires"]').fill('Palermo, Buenos Aires');
		await page.locator('input[type="number"]').first().fill('250000');
		await page.locator('select').nth(2).selectOption('Departamento');

		await page.getByRole('button', { name: 'Publicar en Localia' }).click();

		await expect(page.locator('text=¡Propiedad publicada!')).toBeVisible({ timeout: 8000 });
	});

	test('should edit own property from mis-propiedades', async ({ page }) => {
		addProperty({ id: 'edit-test-prop', title: 'Casa original' });

		await loginAs(page, 'agente@test.com');
		await page.goto('/localia/mis-propiedades');
		await page.waitForLoadState('networkidle');

		await expect(page.locator('[title="Editar"]').first()).toBeVisible({ timeout: 8000 });
		await expect(page.locator('h3:has-text("Casa original")')).toBeVisible();

		await page.locator('[title="Editar"]').first().click();
		await page.waitForURL(/\?edit=/);
		await page.waitForLoadState('networkidle');

		const titleInput = page.locator('input[placeholder*="Departamento"]');
		await titleInput.clear();
		await titleInput.fill('Casa editada');

		await page.getByRole('button', { name: 'Guardar cambios' }).click();

		await expect(page.locator('text=¡Propiedad actualizada!')).toBeVisible({ timeout: 8000 });
	});

	test('should delete own property from mis-propiedades', async ({ page }) => {
		addProperty({ id: 'delete-test-prop', title: 'Propiedad para eliminar' });

		await loginAs(page, 'agente@test.com');
		await page.goto('/localia/mis-propiedades');
		await page.waitForLoadState('networkidle');

		await expect(page.locator('[title="Eliminar"]').first()).toBeVisible({ timeout: 8000 });
		await expect(page.locator('h3:has-text("Propiedad para eliminar")')).toBeVisible();

		await page.locator('[title="Eliminar"]').first().click();
		await expect(page.locator('text=¿Eliminar propiedad?')).toBeVisible();

		await page.locator('.fixed >> text=Eliminar').last().click();
		await page.waitForTimeout(2000);

		await expect(page.locator('h3:has-text("Propiedad para eliminar")')).not.toBeVisible({ timeout: 5000 });
	});
});
