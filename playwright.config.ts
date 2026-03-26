import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: 1,
	workers: 2,
	reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
	use: {
		baseURL: 'http://localhost:5173/',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: process.env.COVERAGE
		? undefined
		: {
				command: 'npm run dev',
				url: 'http://localhost:5173/',
				reuseExistingServer: !process.env.CI,
				timeout: 120000
			}
});
