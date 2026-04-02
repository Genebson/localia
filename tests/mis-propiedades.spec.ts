import { test, expect, type Page } from '@playwright/test';
import { loginAs } from './helpers/auth-mock';
import { mockPropertyApi, addProperty, clearProperties } from './helpers/property-mock';

test.describe('Mis Propiedades', () => {
	test.beforeEach(async ({ page }) => {
		clearProperties();
		await mockPropertyApi(page);
		clearProperties();
	});

	test('should display pagination controls when there are more than 10 properties', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		for (let i = 0; i < 12; i++) {
			addProperty({ title: `Propiedad ${i + 1}` });
		}
		await page.goto('/mis-propiedades');
		await page.waitForTimeout(1500);

		await expect(page.locator('button:has-text("Anterior")')).toBeVisible();
		await expect(page.locator('button:has-text("Siguiente")')).toBeVisible();
		await expect(page.locator('text=Página 1 de 2')).toBeVisible();
	});

	test('should navigate to next page when clicking Siguiente', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		for (let i = 0; i < 12; i++) {
			addProperty({ title: `Propiedad ${i + 1}` });
		}
		await page.goto('/mis-propiedades');
		await page.waitForTimeout(1500);

		await page.locator('button:has-text("Siguiente")').click();
		await page.waitForTimeout(500);

		await expect(page.locator('text=Página 2 de 2')).toBeVisible();
	});

	test('should disable Previous button on first page', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		for (let i = 0; i < 12; i++) {
			addProperty({ title: `Propiedad ${i}` });
		}
		await page.goto('/mis-propiedades');
		await page.waitForTimeout(1500);

		const prevButton = page.locator('button:has-text("Anterior")');
		await expect(prevButton).toBeDisabled();
	});

	test('should disable Next button on last page', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		for (let i = 0; i < 12; i++) {
			addProperty({ title: `Propiedad ${i}` });
		}
		await page.goto('/mis-propiedades');
		await page.waitForTimeout(1500);

		await expect(page.locator('text=Página 1 de 2')).toBeVisible();
		await page.locator('button:has-text("Siguiente")').click();
		await page.waitForTimeout(500);

		await expect(page.locator('text=Página 2 de 2')).toBeVisible();
		const nextButton = page.locator('button:has-text("Siguiente")');
		await expect(nextButton).toBeDisabled();
	});

	test('should change sort to oldest first when selecting option', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		addProperty({ title: 'Propiedad Vieja' });
		addProperty({ title: 'Propiedad Nueva' });
		await page.goto('/mis-propiedades');
		await page.waitForTimeout(1500);

		const select = page.locator('select');
		await select.selectOption('asc');
		await page.waitForTimeout(500);

		const firstTitle = page.locator('[class*="rounded-xl"] h3').first();
		await expect(firstTitle).toContainText('Propiedad Vieja');
	});

	test('should reset to page 1 when changing sort', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		for (let i = 0; i < 15; i++) {
			addProperty({ title: `Propiedad ${i}` });
		}
		await page.goto('/mis-propiedades');
		await page.waitForTimeout(1500);

		await page.locator('button:has-text("Siguiente")').click();
		await page.waitForTimeout(500);
		await expect(page.locator('text=Página 2 de 2')).toBeVisible();

		const select = page.locator('select');
		await select.selectOption('asc');
		await page.waitForTimeout(500);

		await expect(page.locator('text=Página 1 de 2')).toBeVisible();
	});

	test('should show empty state when agent has no properties', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		await page.goto('/mis-propiedades');
		await page.waitForTimeout(1500);

		await expect(page.locator('text=No tenés propiedades')).toBeVisible();
		await expect(page.locator('text=Nueva propiedad')).toBeVisible();
	});

	test('should show total count of properties', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		addProperty({ title: 'Prop 1' });
		addProperty({ title: 'Prop 2' });
		addProperty({ title: 'Prop 3' });
		await page.goto('/mis-propiedades');
		await page.waitForTimeout(1500);

		await expect(page.locator('text=3 propiedades en total')).toBeVisible();
	});
});
