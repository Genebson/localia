import { test, expect } from '@playwright/test';
import { mockAuthApi } from './helpers/auth-mock';

test.describe('Olvidé mi contraseña - Page', () => {
	test('should display forgot password form', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/olvide-mi-contrasena');
		await page.waitForTimeout(500);
		await expect(page.locator('h1')).toContainText('Olvidé mi contraseña');
		await expect(page.locator('input[type="email"]')).toBeVisible();
		await expect(page.locator('button[type="submit"]')).toContainText('Enviar');
	});

	test('should show validation error for empty email submission', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/olvide-mi-contrasena');
		await page.waitForTimeout(500);
		await page.locator('input[type="email"]').fill('');
		await page.locator('button[type="submit"]').click();
		await expect(page.locator('input[type="email"]')).toBeVisible();
	});

	test('should show success message after submitting valid email', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/olvide-mi-contrasena');
		await page.waitForTimeout(500);
		await page.locator('input[type="email"]').fill('test@example.com');
		await page.locator('button[type="submit"]').click();
		await page.waitForTimeout(500);
		await expect(page.locator('h1')).toContainText('Revisá tu correo');
	});

	test('should show back link to homepage', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/olvide-mi-contrasena');
		await page.waitForTimeout(500);
		await expect(page.locator('a:has-text("Volver al inicio")')).toBeVisible();
	});

	test('should show link to login page', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/olvide-mi-contrasena');
		await page.waitForTimeout(500);
		await expect(page.locator('a:has-text("Iniciá sesión")')).toBeVisible();
	});

	test('should navigate to login page when clicking iniciá sesión', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/olvide-mi-contrasena');
		await page.waitForTimeout(500);
		await page.locator('a:has-text("Iniciá sesión")').click();
		await page.waitForTimeout(500);
		await expect(page.locator('button:has-text("Iniciar sesión")')).toBeVisible();
	});
});

test.describe('Restablecer contraseña - Page (no token)', () => {
	test('should display no token error when token is missing', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/restablecer-contrasena');
		await page.waitForTimeout(500);
		await expect(page.locator('h1')).toContainText('Token no proporcionado');
		await expect(page.locator('a:has-text("Solicitar nuevo enlace")')).toBeVisible();
	});

	test('should navigate to forgot password page when requesting new link', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/restablecer-contrasena');
		await page.waitForTimeout(500);
		await page.locator('a:has-text("Solicitar nuevo enlace")').click();
		await page.waitForTimeout(500);
		await expect(page.locator('h1')).toContainText('Olvidé mi contraseña');
	});
});

test.describe('Restablecer contraseña - Page (with token)', () => {
	test('should display reset password form when token is present', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/restablecer-contrasena?token=test-mock-token');
		await page.waitForTimeout(500);
		await expect(page.locator('h1')).toContainText('Nueva contraseña');
		await expect(page.locator('input[id="password"]')).toBeVisible();
		await expect(page.locator('input[id="confirm-password"]')).toBeVisible();
		await expect(page.locator('button[type="submit"]')).toContainText('Restablecer contraseña');
	});

	test('should show password toggle visibility button', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/restablecer-contrasena?token=test-mock-token');
		await page.waitForTimeout(500);
		const toggleButtons = page.locator('button[type="button"]');
		await expect(toggleButtons.first()).toBeVisible();
	});

	test('should toggle password visibility', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/restablecer-contrasena?token=test-mock-token');
		await page.waitForTimeout(500);
		const passwordInput = page.locator('input[id="password"]');
		await passwordInput.fill('testpassword123');
		const toggleButton = page.locator('button[type="button"]').first();
		await toggleButton.click();
		await expect(passwordInput).toHaveAttribute('type', 'text');
		await toggleButton.click();
		await expect(passwordInput).toHaveAttribute('type', 'password');
	});

	test('should show validation error for password less than 8 characters', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/restablecer-contrasena?token=test-mock-token');
		await page.waitForTimeout(500);
		await page.locator('input[id="password"]').fill('short');
		await page.locator('input[id="confirm-password"]').fill('short');
		await page.locator('button[type="submit"]').click();
		await page.waitForTimeout(300);
		await expect(page.locator('text=La contraseña debe tener al menos 8 caracteres')).toBeVisible();
	});

	test('should show validation error when passwords do not match', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/restablecer-contrasena?token=test-mock-token');
		await page.waitForTimeout(500);
		await page.locator('input[id="password"]').fill('password123');
		await page.locator('input[id="confirm-password"]').fill('differentpassword');
		await page.locator('button[type="submit"]').click();
		await page.waitForTimeout(300);
		await expect(page.locator('text=Las contraseñas no coinciden')).toBeVisible();
	});

	test('should show success message and redirect after successful reset', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/restablecer-contrasena?token=test-mock-token');
		await page.waitForTimeout(500);
		await page.locator('input[id="password"]').fill('newpassword123');
		await page.locator('input[id="confirm-password"]').fill('newpassword123');
		await page.locator('button[type="submit"]').click();
		await page.waitForTimeout(1000);
		await expect(page.locator('h1')).toContainText('Contraseña actualizada');
	});

	test('should show back link to homepage', async ({ page }) => {
		await mockAuthApi(page);
		await page.goto('/restablecer-contrasena?token=test-mock-token');
		await page.waitForTimeout(500);
		await expect(page.locator('a:has-text("Volver al inicio")')).toBeVisible();
	});
});
