export interface Search {
	id: string;
	name: string;
	type: string;
	zone: string;
	budget: string;
	message: string;
	timestamp: number;
	phone: string;
}

export const searches: Search[] = [
	{
		id: '1',
		name: 'María García',
		type: 'Casa',
		zone: 'Carmen de Areco',
		budget: 'USD 200.000',
		message: 'Busco casa de 3 dormitorios con jardín para familia con dos hijos',
		timestamp: 2,
		phone: '5492345123456'
	},
	{
		id: '2',
		name: 'Juan Pérez',
		type: 'Terreno',
		zone: 'San Antonio de Areco',
		budget: 'USD 50.000',
		message: 'Necesito terreno mínimo 500m² para construir vivienda',
		timestamp: 5,
		phone: '5492345765432'
	},
	{
		id: '3',
		name: 'Laura Martínez',
		type: 'Galpón',
		zone: 'Avellaneda',
		budget: 'USD 300.000',
		message: 'Busco galpón para taller mecánico, con playón de carga',
		timestamp: 1,
		phone: '5491123456789'
	},
	{
		id: '4',
		name: 'Carlos Rodríguez',
		type: 'Casa',
		zone: 'Olivos',
		budget: 'USD 450.000',
		message: 'Casa de 4 ambientes, con garage y pileta',
		timestamp: 3,
		phone: '5491145678901'
	},
	{
		id: '5',
		name: 'Ana Fernández',
		type: 'Departamento',
		zone: 'Palermo',
		budget: 'USD 150.000',
		message: 'Depto 2 ambientes, cerca de subte, para sola',
		timestamp: 7,
		phone: '5491156789012'
	},
	{
		id: '6',
		name: 'Miguel Torres',
		type: 'Chacra',
		zone: 'Lobos',
		budget: 'USD 400.000',
		message: 'Chacra para finca, mínimo 5 hectáreas, con casa principal',
		timestamp: 10,
		phone: '5492345987654'
	},
	{
		id: '7',
		name: 'Sofia López',
		type: 'Terreno',
		zone: 'Nordelta',
		budget: 'USD 80.000',
		message: 'Lote en barrio cerrado, para construir',
		timestamp: 4,
		phone: '5491143210987'
	},
	{
		id: '8',
		name: 'Diego Ramírez',
		type: 'Local',
		zone: 'Centro',
		budget: 'ARS 50.000.000',
		message: 'Local comercial en zona céntrica, mínimo 100m²',
		timestamp: 6,
		phone: '5491154321098'
	},
	{
		id: '9',
		name: 'Patricia Sánchez',
		type: 'Quinta',
		zone: 'Pilar',
		budget: 'USD 250.000',
		message: 'Quinta para eventos, con pileta y quincho',
		timestamp: 8,
		phone: '5491145671234'
	},
	{
		id: '10',
		name: 'Roberto Díaz',
		type: 'Casa',
		zone: 'Martínez',
		budget: 'USD 600.000',
		message: 'Casa de 5 dormitorios, con jardín grande',
		timestamp: 12,
		phone: '5491145789012'
	}
];
