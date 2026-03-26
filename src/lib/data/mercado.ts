export interface PropertyTypeData {
	name: string;
	count: number;
	percentage: number;
}

export interface NeighborhoodData {
	name: string;
	count: number;
}

export interface PriceRangeData {
	label: string;
	count: number;
	min: number;
	max: number;
}

export interface MarketData {
	totalProperties: number;
	forSale: number;
	forRent: number;
	agencies: number;
	avgSalePrice: number;
	avgRentPrice: number;
	propertyTypes: PropertyTypeData[];
	neighborhoods: NeighborhoodData[];
	priceRanges: PriceRangeData[];
}

export const mercadoData: MarketData = {
	totalProperties: 847,
	forSale: 623,
	forRent: 224,
	agencies: 12,
	avgSalePrice: 285000,
	avgRentPrice: 450,
	propertyTypes: [
		{ name: 'Casa', count: 312, percentage: 37 },
		{ name: 'Departamento', count: 198, percentage: 23 },
		{ name: 'Casa quinta', count: 156, percentage: 18 },
		{ name: 'Lote', count: 124, percentage: 15 },
		{ name: 'Campo', count: 35, percentage: 4 },
		{ name: 'Local comercial', count: 22, percentage: 3 }
	],
	neighborhoods: [
		{ name: 'Centro', count: 187 },
		{ name: 'Zona Rural', count: 142 },
		{ name: 'Barrio Las Acacias', count: 98 },
		{ name: 'Barrio San Miguel', count: 76 },
		{ name: 'Barrio Villa María', count: 54 }
	],
	priceRanges: [
		{ label: 'Hasta USD 100.000', count: 89, min: 0, max: 100000 },
		{ label: 'USD 100.000 – 200.000', count: 187, min: 100000, max: 200000 },
		{ label: 'USD 200.000 – 300.000', count: 215, min: 200000, max: 300000 },
		{ label: 'Más de USD 300.000', count: 132, min: 300000, max: Infinity }
	]
};
