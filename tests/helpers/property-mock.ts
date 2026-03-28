import { type Page } from '@playwright/test';

interface MockProperty {
	id: string;
	title: string;
	description: string | null;
	operation: 'buy' | 'rent';
	propertyType: 'apartment' | 'house' | 'penthouse' | 'terrain' | 'commercial';
	price: number;
	currency: 'USD' | 'ARS';
	location: string;
	address: string | null;
	attributes: { bedrooms: number; bathrooms: number; area: number };
	images: string[];
	priceLabel: string;
	image: string | null;
	featured: boolean;
	agentId: string;
	createdAt: string;
	updatedAt: string;
}

const sharedProperties: MockProperty[] = [];

function makeProperty(overrides: Partial<MockProperty> = {}): MockProperty {
	const id = `prop-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
	const price = overrides.price ?? 250000;
	const currency = overrides.currency ?? 'USD';
	const operation = overrides.operation ?? 'buy';
	const formatted = currency === 'USD'
		? `USD ${price.toLocaleString('en-US')}`
		: `$ ${price.toLocaleString('es-AR')}`;
	const priceLabel = operation === 'rent' ? `${formatted}/mes` : formatted;
	return {
		id,
		title: 'Depto Palermo',
		description: 'Excelente propiedad',
		operation: 'buy',
		propertyType: 'apartment',
		price: 250000,
		currency: 'USD',
		location: 'Palermo, Buenos Aires',
		address: 'Av. Santa Fe 2456',
		attributes: { bedrooms: 2, bathrooms: 1, area: 80 },
		images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
		priceLabel,
		image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
		featured: true,
		agentId: 'test-user-id',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		...overrides
	};
}

async function setupPropertyRoutes(page: Page) {
		await page.route('**/upload', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					url: `https://res.cloudinary.com/test/image/upload/v1/localia/${Date.now()}.jpg`
				})
			});
		});

		await page.route('**/property', async (route) => {
			if (route.request().method() === 'POST') {
				const body = JSON.parse(route.request().postData() || '{}');
				const property = makeProperty({
					...body,
					images: body.images?.length ? body.images : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80']
				});
				sharedProperties.push(property);
				await route.fulfill({
					status: 201,
					contentType: 'application/json',
					body: JSON.stringify({ property })
				});
			} else {
				await route.fulfill({ status: 405 });
			}
		});

		await page.route(/\/property\/.+/, async (route) => {
			const url = route.request().url();
			const id = url.split('/property/')[1].split('?')[0];
			const method = route.request().method();

			if (method === 'PUT') {
				const body = JSON.parse(route.request().postData() || '{}');
				const idx = sharedProperties.findIndex((p) => p.id === id);
				if (idx === -1) {
					await route.fulfill({ status: 404, body: JSON.stringify({ message: 'Not found' }) });
				} else {
					sharedProperties[idx] = {
						...sharedProperties[idx],
						...body,
						updatedAt: new Date().toISOString()
					};
					await route.fulfill({
						status: 200,
						contentType: 'application/json',
						body: JSON.stringify({ property: sharedProperties[idx] })
					});
				}
			} else if (method === 'DELETE') {
				const idx = sharedProperties.findIndex((p) => p.id === id);
				if (idx === -1) {
					await route.fulfill({ status: 404, body: JSON.stringify({ message: 'Not found' }) });
				} else {
					sharedProperties.splice(idx, 1);
					await route.fulfill({ status: 204 });
				}
			} else if (method === 'GET') {
				const property = sharedProperties.find((p) => p.id === id);
				if (!property) {
					await route.fulfill({ status: 404, body: JSON.stringify({ message: 'Not found' }) });
				} else {
					await route.fulfill({
						status: 200,
						contentType: 'application/json',
						body: JSON.stringify({ property })
					});
				}
			}
		});

		await page.route('**/properties', async (route) => {
			if (route.request().method() === 'GET') {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ properties: sharedProperties })
				});
			} else {
				await route.fulfill({ status: 405 });
			}
		});

		await page.route('**/properties/featured', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ properties: sharedProperties.filter((p) => p.featured) })
			});
		});
	}

function addProperty(overrides: Partial<MockProperty> = {}): MockProperty {
	const p = makeProperty(overrides);
	sharedProperties.push(p);
	return p;
}

function clearProperties() {
	sharedProperties.length = 0;
}

async function mockPropertyApi(page: Page) {
	clearProperties();
	await setupPropertyRoutes(page);
}

export { mockPropertyApi, addProperty, clearProperties, type MockProperty };
