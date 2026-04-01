import { type Page } from '@playwright/test';

interface MockProperty {
	id: string;
	title: string;
	description: string | null;
	operation: 'buy' | 'rent';
	propertyType: 'apartment' | 'house' | 'penthouse' | 'terrain' | 'commercial' | 'lot' | 'farm' | 'country-house' | 'warehouse' | 'estate' | 'land' | 'commercial-space';
	price: number;
	currency: 'USD' | 'ARS';
	location: string;
	address: string | null;
	attributes: { bedrooms: number; bathrooms: number; area: number };
	images: string[];
	priceLabel: string;
	image: string | null;
	featured: boolean;
	published: boolean;
	publishedAt: string | null;
	listingCode: string | null;
	isFinancingEligible: boolean;
	petFriendly: boolean;
	airConditioning: boolean;
	elevator: boolean;
	balcony: boolean;
	outdoor: boolean;
	garage: boolean;
	garden: boolean;
	pool: boolean;
	storageRoom: boolean;
	accessible: boolean;
	condition: 'new' | 'good' | 'needs-renovation' | null;
	furnishings: 'furnished' | 'equipped-kitchen' | null;
	distributedTo: string[];
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
		title: overrides.title ?? 'Depto Palermo',
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
		published: true,
		publishedAt: new Date().toISOString(),
		listingCode: `LCL-TEST-${id.slice(-4)}`,
		isFinancingEligible: false,
		petFriendly: false,
		airConditioning: false,
		elevator: false,
		balcony: false,
		outdoor: false,
		garage: false,
		garden: false,
		pool: false,
		storageRoom: false,
		accessible: false,
		condition: null,
		furnishings: null,
		distributedTo: [],
		agentId: 'test-user-1',
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

		await page.route('**/my-properties', async (route) => {
			if (route.request().method() === 'GET') {
				const url = route.request().url();
				const pageParam = new URL(url).searchParams.get('page') || '1';
				const limitParam = new URL(url).searchParams.get('limit') || '10';
				const sortParam = new URL(url).searchParams.get('sort') || 'desc';
				const page = parseInt(pageParam);
				const limit = parseInt(limitParam);
				const totalItems = sharedProperties.length;
				const totalPages = Math.ceil(totalItems / limit) || 1;
				const sorted = [...sharedProperties].sort((a, b) => {
					const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
					const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
					return sortParam === 'asc' ? dateA - dateB : dateB - dateA;
				});
				const offset = (page - 1) * limit;
				const items = sorted.slice(offset, offset + limit);
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						properties: items,
						total: totalItems,
						page,
						limit,
						totalPages
					})
				});
			} else {
				await route.fulfill({ status: 405 });
			}
		});

		await page.route(/\/properties(\?.*)?$/, async (route) => {
			const url = route.request().url();
			const pageParam = new URL(url).searchParams.get('page') || '1';
			const limitParam = new URL(url).searchParams.get('limit') || '12';
			const page = parseInt(pageParam);
			const limit = parseInt(limitParam);
			const published = sharedProperties.filter((p) => p.published !== false);
			const totalItems = published.length;
			const totalPages = Math.ceil(totalItems / limit) || 1;
			const offset = (page - 1) * limit;
			const items = published.slice(offset, offset + limit);
			const prevPage = page > 1 ? page - 1 : undefined;
			const nextPage = page < totalPages ? page + 1 : undefined;
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					currentPage: page,
					totalItems,
					totalPages,
					items,
					links: {
						prev: prevPage ? `/properties?page=${prevPage}&limit=${limit}` : undefined,
						next: nextPage ? `/properties?page=${nextPage}&limit=${limit}` : undefined
					}
				})
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
	addProperty({ id: 'featured-1', title: 'Depto Palermo', featured: true });
	addProperty({ id: 'featured-2', title: 'Casa Nordelta', featured: true });
}

export { mockPropertyApi, addProperty, clearProperties, type MockProperty };
