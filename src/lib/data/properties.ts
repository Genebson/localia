export type PropertyType =
	| 'apartment'
	| 'house'
	| 'penthouse'
	| 'terrain'
	| 'commercial'
	| 'lot'
	| 'farm'
	| 'country-house'
	| 'warehouse'
	| 'estate'
	| 'land'
	| 'commercial-space';
export type PropertyState = 'new' | 'good' | 'needs-renovation';
export type Equipment = 'furnished' | 'equipped-kitchen';

export interface Property {
	id: string;
	title: string;
	description?: string;
	price: number;
	priceLabel: string;
	currency: 'USD' | 'ARS';
	location: string;
	address: string;
	lat?: number;
	lng?: number;
	image: string;
	images?: string[];
	propertyType: PropertyType;
	attributes: {
		bedrooms: number;
		bathrooms: number;
		area: number;
	};
	operation: 'buy' | 'rent';
	featured?: boolean;
	agentEmail?: string;
	agentId?: string;
	isUserProperty?: boolean;
	rooms?: number;
	bathrooms?: number;
	condition?: PropertyState;
	features?: string[];
	isFinancingEligible?: boolean;
	furnishings?: Equipment;
	petFriendly?: boolean;
	airConditioning?: boolean;
	elevator?: boolean;
	balcony?: boolean;
	outdoor?: boolean;
	garage?: boolean;
	garden?: boolean;
	pool?: boolean;
	storageRoom?: boolean;
	accessible?: boolean;
	publishedAt?: string;
	distributedTo?: string[];
	listingCode?: string;
	published?: boolean;
	views?: number;
	lastUpdatedAt?: string;
}

export const properties: Property[] = [
	{
		id: '018d1a2b-3c4e-7f89-ab01-234567890abc',
		title: 'Departamento de 2 ambientes en Centro',
		price: 185000,
		priceLabel: 'USD 185.000',
		currency: 'USD',
		location: 'Centro, Mercedes, Buenos Aires',
		address: 'Calle 13 742',
		lat: -34.65,
		lng: -59.431,
		image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
		images: [
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
			'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
			'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80',
			'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'
		],
		propertyType: 'apartment',
		attributes: { bedrooms: 2, bathrooms: 1, area: 58 },
		operation: 'buy',
		featured: true,
		isFinancingEligible: true,
		condition: 'new',
		publishedAt: '2026-03-21T08:00:00Z',
		furnishings: 'equipped-kitchen',
		petFriendly: true,
		airConditioning: true,
		elevator: false,
		balcony: true,
		outdoor: false,
		garage: false,
		garden: false,
		pool: false,
		storageRoom: false,
		accessible: false
	},
	{
		id: '018d1a2b-3c4e-7f89-ab02-234567890abd',
		title: 'Casa quincho en Barrio Norte',
		price: 520000,
		priceLabel: 'USD 520.000',
		currency: 'USD',
		location: 'Barrio Norte, Mercedes, Buenos Aires',
		address: 'Av. San Martín 12450',
		lat: -34.645,
		lng: -59.428,
		image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
		images: [
			'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
			'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
			'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
			'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
			'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
		],
		propertyType: 'house',
		attributes: { bedrooms: 4, bathrooms: 3, area: 280 },
		operation: 'buy',
		featured: true,
		isFinancingEligible: true,
		condition: 'good',
		publishedAt: '2026-03-18T14:30:00Z',
		furnishings: 'equipped-kitchen',
		petFriendly: true,
		airConditioning: true,
		elevator: false,
		balcony: false,
		outdoor: true,
		garage: true,
		garden: true,
		pool: false,
		storageRoom: true,
		accessible: false
	},
	{
		id: '018d1a2b-3c4e-7f89-ab08-234567890ac3',
		title: 'Chalet en Zona del Club',
		price: 280000,
		priceLabel: 'USD 280.000',
		currency: 'USD',
		location: 'Zona del Club, Mercedes, Buenos Aires',
		address: 'Av. Jockey 456',
		lat: -34.638,
		lng: -59.425,
		image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
		images: [
			'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
			'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
			'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
			'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
			'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80'
		],
		propertyType: 'house',
		attributes: { bedrooms: 5, bathrooms: 4, area: 420 },
		operation: 'buy',
		featured: true,
		condition: 'good',
		publishedAt: '2026-03-12T15:00:00Z',
		furnishings: 'equipped-kitchen',
		petFriendly: true,
		airConditioning: true,
		elevator: false,
		balcony: false,
		outdoor: true,
		garage: true,
		garden: true,
		pool: true,
		storageRoom: true,
		accessible: false
	},
	{
		id: '018d1a2b-3c4e-7f89-ab0b-234567890ac6',
		title: 'Penthouse en Centro',
		price: 1200000,
		priceLabel: 'USD 1.200.000',
		currency: 'USD',
		location: 'Centro, Mercedes, Buenos Aires',
		address: 'Av. Principal 1088',
		lat: -34.651,
		lng: -59.433,
		image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
		images: [
			'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
			'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
			'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
			'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
			'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
		],
		propertyType: 'penthouse',
		attributes: { bedrooms: 4, bathrooms: 5, area: 380 },
		operation: 'buy',
		featured: true,
		condition: 'new',
		publishedAt: '2026-03-20T14:00:00Z',
		furnishings: 'furnished',
		petFriendly: true,
		airConditioning: true,
		elevator: true,
		balcony: true,
		outdoor: true,
		garage: true,
		garden: true,
		pool: true,
		storageRoom: true,
		accessible: true
	},
	{
		id: '018d1a2b-3c4e-7f89-int01-0000000001',
		title: 'Chacra de 12 hectáreas en Zona del Club',
		price: 450000,
		priceLabel: 'USD 450.000',
		currency: 'USD',
		location: 'Zona del Club, Mercedes, Buenos Aires',
		address: 'Ruta 41 Km 12',
		lat: -34.625,
		lng: -59.418,
		image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
		images: [
			'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
			'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
			'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
			'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
			'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
		],
		propertyType: 'farm',
		attributes: { bedrooms: 4, bathrooms: 3, area: 120000 },
		operation: 'buy',
		featured: true,
		condition: 'good',
		publishedAt: '2026-03-17T10:00:00Z',
		furnishings: 'equipped-kitchen',
		petFriendly: true,
		airConditioning: true,
		elevator: false,
		balcony: false,
		outdoor: true,
		garage: true,
		garden: true,
		pool: true,
		storageRoom: true,
		accessible: false
	}
];
