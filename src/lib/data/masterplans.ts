export interface Parcel {
	id: string;
	manzana: string;
	lote: string;
	price: number;
	status: 'available' | 'reserved' | 'sold';
	size: number;
}

export interface Loteo {
	id: string;
	name: string;
	description: string;
	location: string;
	image: string;
	parcels: Parcel[];
}

export const loteos: Loteo[] = [
	{
		id: 'el-sol',
		name: 'Loteo El Sol',
		description: 'Loteo premium en zona tranquila, ideal para familias',
		location: 'Carmen de Areco, Buenos Aires',
		image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
		parcels: [
			{ id: 'es-1', manzana: 'A', lote: '1', price: 45000, status: 'sold', size: 500 },
			{ id: 'es-2', manzana: 'A', lote: '2', price: 48000, status: 'available', size: 520 },
			{ id: 'es-3', manzana: 'A', lote: '3', price: 52000, status: 'available', size: 550 },
			{ id: 'es-4', manzana: 'A', lote: '4', price: 55000, status: 'reserved', size: 580 },
			{ id: 'es-5', manzana: 'A', lote: '5', price: 58000, status: 'available', size: 600 },
			{ id: 'es-6', manzana: 'B', lote: '1', price: 42000, status: 'available', size: 480 },
			{ id: 'es-7', manzana: 'B', lote: '2', price: 46000, status: 'sold', size: 510 },
			{ id: 'es-8', manzana: 'B', lote: '3', price: 50000, status: 'available', size: 540 },
			{ id: 'es-9', manzana: 'B', lote: '4', price: 53000, status: 'available', size: 560 },
			{ id: 'es-10', manzana: 'B', lote: '5', price: 56000, status: 'reserved', size: 590 },
			{ id: 'es-11', manzana: 'C', lote: '1', price: 40000, status: 'available', size: 450 },
			{ id: 'es-12', manzana: 'C', lote: '2', price: 44000, status: 'available', size: 490 },
			{ id: 'es-13', manzana: 'C', lote: '3', price: 48000, status: 'sold', size: 530 },
			{ id: 'es-14', manzana: 'C', lote: '4', price: 51000, status: 'available', size: 570 },
			{ id: 'es-15', manzana: 'C', lote: '5', price: 54000, status: 'available', size: 600 },
			{ id: 'es-16', manzana: 'D', lote: '1', price: 38000, status: 'available', size: 420 },
			{ id: 'es-17', manzana: 'D', lote: '2', price: 41000, status: 'reserved', size: 460 },
			{ id: 'es-18', manzana: 'D', lote: '3', price: 45000, status: 'available', size: 500 },
			{ id: 'es-19', manzana: 'D', lote: '4', price: 49000, status: 'available', size: 540 },
			{ id: 'es-20', manzana: 'D', lote: '5', price: 52000, status: 'sold', size: 580 }
		]
	},
	{
		id: 'la-esperanza',
		name: 'Loteo La Esperanza',
		description: 'Loteo económico con excelentes accesos',
		location: 'San Antonio de Areco, Buenos Aires',
		image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
		parcels: [
			{ id: 'le-1', manzana: '1', lote: '1', price: 35000, status: 'available', size: 400 },
			{ id: 'le-2', manzana: '1', lote: '2', price: 38000, status: 'sold', size: 430 },
			{ id: 'le-3', manzana: '1', lote: '3', price: 40000, status: 'available', size: 460 },
			{ id: 'le-4', manzana: '1', lote: '4', price: 42000, status: 'available', size: 490 },
			{ id: 'le-5', manzana: '1', lote: '5', price: 45000, status: 'reserved', size: 520 },
			{ id: 'le-6', manzana: '2', lote: '1', price: 33000, status: 'available', size: 380 },
			{ id: 'le-7', manzana: '2', lote: '2', price: 36000, status: 'available', size: 410 },
			{ id: 'le-8', manzana: '2', lote: '3', price: 39000, status: 'available', size: 440 },
			{ id: 'le-9', manzana: '2', lote: '4', price: 41000, status: 'sold', size: 470 },
			{ id: 'le-10', manzana: '2', lote: '5', price: 44000, status: 'available', size: 500 },
			{ id: 'le-11', manzana: '3', lote: '1', price: 32000, status: 'available', size: 360 },
			{ id: 'le-12', manzana: '3', lote: '2', price: 35000, status: 'reserved', size: 390 },
			{ id: 'le-13', manzana: '3', lote: '3', price: 38000, status: 'available', size: 420 },
			{ id: 'le-14', manzana: '3', lote: '4', price: 40000, status: 'available', size: 450 },
			{ id: 'le-15', manzana: '3', lote: '5', price: 43000, status: 'available', size: 480 },
			{ id: 'le-16', manzana: '4', lote: '1', price: 30000, status: 'available', size: 340 },
			{ id: 'le-17', manzana: '4', lote: '2', price: 33000, status: 'available', size: 370 },
			{ id: 'le-18', manzana: '4', lote: '3', price: 36000, status: 'sold', size: 400 },
			{ id: 'le-19', manzana: '4', lote: '4', price: 39000, status: 'available', size: 430 },
			{ id: 'le-20', manzana: '4', lote: '5', price: 42000, status: 'available', size: 460 }
		]
	},
	{
		id: 'las-palmeras',
		name: 'Loteo Las Palmeras',
		description: 'Barrio privado con seguridad 24hs y amenities exclusivos',
		location: 'Lobos, Buenos Aires',
		image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
		parcels: [
			{ id: 'lp-1', manzana: 'A', lote: '1', price: 55000, status: 'available', size: 600 },
			{ id: 'lp-2', manzana: 'A', lote: '2', price: 58000, status: 'available', size: 620 },
			{ id: 'lp-3', manzana: 'A', lote: '3', price: 60000, status: 'reserved', size: 650 },
			{ id: 'lp-4', manzana: 'A', lote: '4', price: 62000, status: 'sold', size: 680 },
			{ id: 'lp-5', manzana: 'A', lote: '5', price: 65000, status: 'available', size: 700 },
			{ id: 'lp-6', manzana: 'B', lote: '1', price: 52000, status: 'available', size: 580 },
			{ id: 'lp-7', manzana: 'B', lote: '2', price: 55000, status: 'available', size: 610 },
			{ id: 'lp-8', manzana: 'B', lote: '3', price: 58000, status: 'sold', size: 640 },
			{ id: 'lp-9', manzana: 'B', lote: '4', price: 60000, status: 'available', size: 670 },
			{ id: 'lp-10', manzana: 'B', lote: '5', price: 63000, status: 'reserved', size: 700 }
		]
	},
	{
		id: 'el-ombu',
		name: 'El Ombú',
		description: 'Loteo convencional en zona urbana, cerca de escuelas y comercio',
		location: 'Exaltación de la Cruz, Buenos Aires',
		image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
		parcels: [
			{ id: 'eo-1', manzana: '1', lote: '1', price: 28000, status: 'available', size: 350 },
			{ id: 'eo-2', manzana: '1', lote: '2', price: 30000, status: 'available', size: 380 },
			{ id: 'eo-3', manzana: '1', lote: '3', price: 32000, status: 'sold', size: 400 },
			{ id: 'eo-4', manzana: '1', lote: '4', price: 34000, status: 'available', size: 420 },
			{ id: 'eo-5', manzana: '1', lote: '5', price: 36000, status: 'available', size: 450 },
			{ id: 'eo-6', manzana: '2', lote: '1', price: 26000, status: 'reserved', size: 330 },
			{ id: 'eo-7', manzana: '2', lote: '2', price: 29000, status: 'available', size: 360 },
			{ id: 'eo-8', manzana: '2', lote: '3', price: 31000, status: 'available', size: 390 },
			{ id: 'eo-9', manzana: '2', lote: '4', price: 33000, status: 'sold', size: 410 },
			{ id: 'eo-10', manzana: '2', lote: '5', price: 35000, status: 'available', size: 440 }
		]
	},
	{
		id: 'villa-del-parque',
		name: 'Villa del Parque',
		description: 'Desarrollo residencial premium en Pilar',
		location: 'Pilar, Buenos Aires',
		image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
		parcels: [
			{ id: 'vp-1', manzana: 'A', lote: '1', price: 75000, status: 'available', size: 800 },
			{ id: 'vp-2', manzana: 'A', lote: '2', price: 80000, status: 'reserved', size: 850 },
			{ id: 'vp-3', manzana: 'A', lote: '3', price: 85000, status: 'available', size: 900 },
			{ id: 'vp-4', manzana: 'A', lote: '4', price: 90000, status: 'sold', size: 950 },
			{ id: 'vp-5', manzana: 'A', lote: '5', price: 95000, status: 'available', size: 1000 },
			{ id: 'vp-6', manzana: 'B', lote: '1', price: 72000, status: 'available', size: 780 },
			{ id: 'vp-7', manzana: 'B', lote: '2', price: 77000, status: 'available', size: 830 },
			{ id: 'vp-8', manzana: 'B', lote: '3', price: 82000, status: 'sold', size: 880 },
			{ id: 'vp-9', manzana: 'B', lote: '4', price: 87000, status: 'available', size: 930 },
			{ id: 'vp-10', manzana: 'B', lote: '5', price: 92000, status: 'reserved', size: 980 }
		]
	}
];
