export type PropertyType = 'apartment' | 'house' | 'penthouse' | 'terrain' | 'commercial';
export type PropertyState = 'nueva' | 'bueno' | 'reformar';
export type EnergyRating = 'alta' | 'media' | 'baja';
export type FloorLevel = 'ground' | 'intermediate' | 'top';

export interface Property {
	id: string;
	title: string;
	description?: string;
	price: number;
	priceLabel: string;
	currency: 'USD' | 'ARS';
	location: string;
	address: string;
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
	isUserProperty?: boolean;
	// New fields
	rooms?: number;
	bathrooms?: number;
	estado?: PropertyState;
	features?: string[];
	floor?: FloorLevel;
	energyRating?: EnergyRating;
	hasFloorPlan?: boolean;
	hasVirtualTour?: boolean;
	isFromBank?: boolean;
	petFriendly?: boolean;
	airConditioning?: boolean;
	builtInWardrobes?: boolean;
	elevator?: boolean;
	balcony?: boolean;
	outdoor?: boolean;
	garage?: boolean;
	garden?: boolean;
	pool?: boolean;
	storageRoom?: boolean;
	accessible?: boolean;
	publishedAt?: string;
}

export const properties: Property[] = [
	{
		id: '018d1a2b-3c4e-7f89-ab01-234567890abc',
		title: 'Departamento de 2 ambientes en Palermo',
		price: 185000,
		priceLabel: 'USD 185.000',
		currency: 'USD',
		location: 'Palermo, Buenos Aires',
		address: 'Fitz Roy 1547',
		image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
		propertyType: 'apartment',
		attributes: { bedrooms: 2, bathrooms: 1, area: 58 },
		operation: 'buy',
		featured: true
	},
	{
		id: '018d1a2b-3c4e-7f89-ab02-234567890abd',
		title: 'Casa quincho en Martinez',
		price: 520000,
		priceLabel: 'USD 520.000',
		currency: 'USD',
		location: 'Martinez, San Isidro',
		address: 'Av. del Libertador 12450',
		image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
		propertyType: 'house',
		attributes: { bedrooms: 4, bathrooms: 3, area: 280 },
		operation: 'buy',
		featured: true
	},
	{
		id: '018d1a2b-3c4e-7f89-ab03-234567890abe',
		title: 'Monoambiente en Recoleta',
		price: 950000,
		priceLabel: '$ 950.000/mes',
		currency: 'ARS',
		location: 'Recoleta, Buenos Aires',
		address: 'Av. Santa Fe 2456',
		image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
		propertyType: 'apartment',
		attributes: { bedrooms: 1, bathrooms: 1, area: 35 },
		operation: 'rent'
	},
	{
		id: '018d1a2b-3c4e-7f89-ab04-234567890abf',
		title: 'Triplex con terraza en Belgrano',
		price: 380000,
		priceLabel: 'USD 380.000',
		currency: 'USD',
		location: 'Belgrano, Buenos Aires',
		address: 'Cuba 890',
		image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
		propertyType: 'penthouse',
		attributes: { bedrooms: 3, bathrooms: 2, area: 145 },
		operation: 'buy'
	},
	{
		id: '018d1a2b-3c4e-7f89-ab05-234567890ac0',
		title: 'PH en Villa Crespo',
		price: 165000,
		priceLabel: 'USD 165.000',
		currency: 'USD',
		location: 'Villa Crespo, Buenos Aires',
		address: 'Av. Corrientes 5100',
		image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
		propertyType: 'apartment',
		attributes: { bedrooms: 2, bathrooms: 1, area: 75 },
		operation: 'buy'
	},
	{
		id: '018d1a2b-3c4e-7f89-ab06-234567890ac1',
		title: 'Oficina en Catalinas',
		price: 2800000,
		priceLabel: '$ 2.800.000/mes',
		currency: 'ARS',
		location: 'Catalinas, Buenos Aires',
		address: 'Tucumán 745',
		image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
		propertyType: 'commercial',
		attributes: { bedrooms: 0, bathrooms: 1, area: 120 },
		operation: 'rent'
	},
	{
		id: '018d1a2b-3c4e-7f89-ab07-234567890ac2',
		title: 'Loft en San Telmo',
		price: 210000,
		priceLabel: 'USD 210.000',
		currency: 'USD',
		location: 'San Telmo, Buenos Aires',
		address: 'Defensa 1024',
		image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
		propertyType: 'apartment',
		attributes: { bedrooms: 1, bathrooms: 1, area: 65 },
		operation: 'buy'
	},
	{
		id: '018d1a2b-3c4e-7f89-ab08-234567890ac3',
		title: 'Chalet en Carmen de Areco',
		price: 280000,
		priceLabel: 'USD 280.000',
		currency: 'USD',
		location: 'Carmen de Areco, Buenos Aires',
		address: 'Belgrano 456',
		image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
		propertyType: 'house',
		attributes: { bedrooms: 5, bathrooms: 4, area: 420 },
		operation: 'buy',
		featured: true
	},
	{
		id: '018d1a2b-3c4e-7f89-ab09-234567890ac4',
		title: 'Departamento en Las Cañitas',
		price: 1200000,
		priceLabel: '$ 1.200.000/mes',
		currency: 'ARS',
		location: 'Las Cañitas, Buenos Aires',
		address: 'Báez 156',
		image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
		propertyType: 'apartment',
		attributes: { bedrooms: 2, bathrooms: 2, area: 90 },
		operation: 'rent'
	},
	{
		id: '018d1a2b-3c4e-7f89-ab0a-234567890ac5',
		title: 'Terreno en Nordelta',
		price: 195000,
		priceLabel: 'USD 195.000',
		currency: 'USD',
		location: 'Nordelta, Tigre',
		address: 'Manzana 45 Lote 12',
		image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
		propertyType: 'terrain',
		attributes: { bedrooms: 0, bathrooms: 0, area: 850 },
		operation: 'buy'
	},
	{
		id: '018d1a2b-3c4e-7f89-ab0b-234567890ac6',
		title: 'Penthouse en Puerto Madero',
		price: 1200000,
		priceLabel: 'USD 1.200.000',
		currency: 'USD',
		location: 'Puerto Madero, Buenos Aires',
		address: 'Alicia Moreau de Justo 1088',
		image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
		propertyType: 'penthouse',
		attributes: { bedrooms: 4, bathrooms: 5, area: 380 },
		operation: 'buy',
		featured: true
	},
	{
		id: '018d1a2b-3c4e-7f89-ab0c-234567890ac7',
		title: 'Casa moderna en Olivos',
		price: 450000,
		priceLabel: 'USD 450.000',
		currency: 'USD',
		location: 'Olivos, Vicente López',
		address: 'Av. Maipú 2350',
		image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
		propertyType: 'house',
		attributes: { bedrooms: 3, bathrooms: 2, area: 200 },
		operation: 'buy'
	},
	{
		id: '018d1a2b-3c4e-7f89-ab0d-234567890ac8',
		title: 'Studio en Almagro',
		price: 680000,
		priceLabel: '$ 680.000/mes',
		currency: 'ARS',
		location: 'Almagro, Buenos Aires',
		address: 'Av. Rivadavia 4200',
		image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
		propertyType: 'apartment',
		attributes: { bedrooms: 1, bathrooms: 1, area: 28 },
		operation: 'rent'
	},
	{
		id: '018d1a2b-3c4e-7f89-ab0e-234567890ac9',
		title: 'Dúplex en Núñez',
		price: 290000,
		priceLabel: 'USD 290.000',
		currency: 'USD',
		location: 'Núñez, Buenos Aires',
		address: 'Cuba 2100',
		image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
		propertyType: 'apartment',
		attributes: { bedrooms: 2, bathrooms: 2, area: 110 },
		operation: 'buy'
	},
	{
		id: '018d1a2b-3c4e-7f89-ab0f-234567890aca',
		title: 'Local comercial en Flores',
		price: 145000,
		priceLabel: 'USD 145.000',
		currency: 'USD',
		location: 'Flores, Buenos Aires',
		address: 'Av. Rivadavia 6800',
		image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80',
		propertyType: 'commercial',
		attributes: { bedrooms: 0, bathrooms: 1, area: 95 },
		operation: 'buy'
	}
];
