import { test, expect, type Page } from '@playwright/test';
import { mockAuthApi, loginAs } from './helpers/auth-mock';

const mockAgentLogin = async ({ page }: { page: Page }) => {
	await mockAuthApi(page);
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.evaluate(() => {
		localStorage.setItem(
			'localia_mock_users',
			JSON.stringify([
				{
					id: 'test-user-1',
					email: 'agente@test.com',
					name: 'Agente Test',
					role: 'agent',
					licenseNumber: 'MAT-12345',
					passwordHash: 'xxx'
				}
			])
		);
		localStorage.setItem(
			'localia_mock_session',
			JSON.stringify({ userId: 'test-user-1', token: 'test_token_123' })
		);
	});
	await page.reload();
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(500);
};

async function openProfileModal({ page }: { page: Page }) {
	await page.locator('button:has-text("Agente Test"), [aria-label="Perfil"]').first().click();
	await page.waitForTimeout(300);
	const perfilLink = page.locator('a[href="/perfil"], button:has-text("Perfil")');
	if (await perfilLink.first().isVisible()) {
		await perfilLink.first().click();
	} else {
		await page.goto('/perfil');
	}
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(500);
	const editButton = page.locator('button:has-text("Editar perfil"), button:has-text("Editar")');
	if (await editButton.isVisible()) {
		await editButton.click();
	}
	await page.waitForTimeout(300);
}

test.describe('Publicar Property Page', () => {
	test('should allow agent to access publicar page after login', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/publicar');
		await expect(page).toHaveURL(/\/publicar/);
	});
});

test.describe('Mis Propiedades Page', () => {
	test('should allow agent to access mis-propiedades page after login', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/mis-propiedades');
		await expect(page).toHaveURL(/\/mis-propiedades/);
	});
});

test.describe('Perfil Page', () => {
	test('should allow agent to access perfil page after login', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/perfil');
		await expect(page).toHaveURL(/\/perfil/);
	});

	test('agent should NOT see rental profile section', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		await page.goto('/perfil');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);
		await expect(page.locator('h2:has-text("Perfil para alquilar")')).not.toBeVisible();
	});

	test('agent should NOT see introduction letter section', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		await page.goto('/perfil');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);
		await expect(page.locator('h2:has-text("Carta de presentación")')).not.toBeVisible();
	});

	test('agent should see Seguridad section', async ({ page }) => {
		await loginAs(page, 'agente@test.com');
		await page.goto('/perfil');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);
		await expect(page.locator('h2:has-text("Seguridad")')).toBeVisible();
	});

	test('seeker should see all sections', async ({ page }) => {
		await loginAs(page, 'buscador@test.com');
		await page.goto('/perfil');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);
		await expect(page.locator('h2:has-text("Perfil para alquilar")')).toBeVisible();
		await expect(page.locator('text=Información de contacto')).toBeVisible();
	});
});

test.describe('ChePibe CRM Page', () => {
	test('should allow agent to access chepibe page after login', async ({ page }) => {
		await mockAgentLogin({ page });
		await page.goto('/chepibe');
		await expect(page).toHaveURL(/\/chepibe/);
	});
});
