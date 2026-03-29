export interface Agency {
	id: string;
	name: string;
	slug: string;
	logo: string;
	verified: boolean;
	description: string;
	propertyCount: number;
	website: string;
	phone?: string;
	email?: string;
	location?: string;
	tagline?: string;
	banner?: string;
	whatsapp?: string;
	agentId?: string;
	team?: { name: string; role: string; phone: string }[];
}

export const agencies: Agency[] = [
	{
		id: '1',
		name: 'Fabricio Stagno Propiedades',
		slug: 'fabricio-stagno-propiedades',
		logo: 'https://ui-avatars.com/api/?name=FS&background=1E5F4A&color=fff&size=128',
		verified: true,
		description:
			'Staff con trayectoria especializado en desarrollos inmobiliarios, compra, venta y permutas de casas, terrenos, departamentos y más en Mercedes.',
		propertyCount: 45,
		website: 'https://www.fabriciostagnopropiedades.com.ar',
		phone: '+54 2324 42-1234',
		email: 'info@fabriciostagnopropiedades.com.ar',
		location: 'Mercedes, Buenos Aires'
	},
	{
		id: '2',
		name: 'Cristina Propiedades',
		slug: 'cristina-propiedades',
		logo: 'https://www.cristinapropiedades.com.ar/wp-content/uploads/2025/08/logo-05.png',
		verified: true,
		description:
			'Inmobiliaria con amplia experiencia en el mercado de Mercedes. Especialistas en casas, departamentos, terrenos y propiedades rurales.',
		propertyCount: 38,
		website: 'https://www.cristinapropiedades.com.ar',
		phone: '+54 2324 42-5678',
		email: 'contacto@cristinapropiedades.com.ar',
		location: 'Mercedes, Buenos Aires'
	},
	{
		id: '3',
		name: 'Cámpora Propiedades',
		slug: 'campora-propiedades',
		logo: 'https://i0.wp.com/camporapropiedades.com.ar/wp-content/uploads/2021/10/cropped-logo190.png?fit=190%2C90&ssl=1',
		verified: true,
		description:
			'Especialistas en ventas, alquiler y tasaciones de propiedades urbanas, semi urbanas y rurales. Matrícula 3885.',
		propertyCount: 52,
		website: 'http://camporapropiedades.com.ar',
		phone: '+54 2324 42-9012',
		email: 'matias@camporapropiedades.com.ar',
		location: 'Mercedes, Buenos Aires'
	},
	{
		id: '4',
		name: 'Martini Propiedades',
		slug: 'martini-propiedades',
		logo: 'https://storage.googleapis.com/portales-prod-images/3514/web-images/2024/1/35302ea8-4b83-4dff-8d5b-9d7ded30dce9.png',
		verified: true,
		description:
			'Staff con trayectoria en desarrollos inmobiliarios, compra, venta, alquileres y tasaciones. Comprometidos con encontrar la propiedad ideal.',
		propertyCount: 28,
		website: 'https://www.martinipropiedades.com.ar',
		phone: '+54 2324 42-3456',
		email: 'info@martinipropiedades.com.ar',
		location: 'Mercedes, Buenos Aires'
	},
	{
		id: '5',
		name: 'Moner Propiedades',
		slug: 'moner-propiedades',
		logo: 'https://www.monerpropiedades.com/content/empresas/mnr/imagenes/logo.png',
		verified: true,
		description:
			'Inmobiliaria líder en Mercedes con más de 20 años de experiencia. Especialistas en propiedades comerciales y residenciales.',
		propertyCount: 67,
		website: 'https://monerpropiedades.com',
		phone: '+54 2324 42-7890',
		email: 'patricio@monerpropiedades.com',
		location: 'Mercedes, Buenos Aires'
	},
	{
		id: '6',
		name: 'Ricardo Cabana Propiedades',
		slug: 'ricardo-cabana-propiedades',
		logo: 'https://ui-avatars.com/api/?name=RC&background=1E5F4A&color=fff&size=128',
		verified: false,
		description:
			'Inmobiliaria tradicional en el centro de Mercedes. Atención personalizada y conocimiento profundo del mercado local.',
		propertyCount: 15,
		website: '',
		phone: '+54 2324 42-xx',
		location: 'Mercedes, Buenos Aires'
	},
	{
		id: '7',
		name: 'Inmobiliaria Mercedes',
		slug: 'inmobiliaria-mercedes',
		logo: 'https://ui-avatars.com/api/?name=IM&background=1E5F4A&color=fff&size=128',
		verified: false,
		description:
			'Firma con marcada impronta personal, liderada por el Martillero y Corredor Público Sergio Salinas (Matrícula 3366 DJM).',
		propertyCount: 22,
		website: '',
		phone: '+54 2324 43-4444',
		email: 'salinasinmobiliaria@yahoo.com.ar',
		location: 'Mercedes, Buenos Aires'
	},
	{
		id: '8',
		name: 'Farfaglia Propiedades',
		slug: 'farfaglia-propiedades',
		logo: 'https://ui-avatars.com/api/?name=FP&background=1E5F4A&color=fff&size=128',
		verified: true,
		description:
			'Familia con tradición y trayectoria en el rubro inmobiliario desde 1946. Especialistas en campos, Chacras y propiedades rurales.',
		propertyCount: 89,
		website: 'https://farfagliapropiedades.com',
		phone: '+54 2324 15-699226',
		email: 'farfagliapropiedades@hotmail.com',
		location: 'Mercedes, Buenos Aires'
	},
	{
		id: '9',
		name: 'Iribarne Inmobiliaria',
		slug: 'iribarne-inmobiliaria',
		logo: 'https://ui-avatars.com/api/?name=II&background=1E5F4A&color=fff&size=128',
		verified: true,
		description:
			'Grupo de profesionales apasionados en encontrar la propiedad perfecta. Amplia cartera de propiedades en Mercedes y zona.',
		propertyCount: 39,
		website: 'https://iribarneinmobiliaria.com.ar',
		phone: '+54 2324 42-9430',
		email: 'info@iribarneinmobiliaria.com.ar',
		location: 'Mercedes, Buenos Aires'
	},
	{
		id: '11',
		name: 'GP Ghelfi Propiedades',
		slug: 'gp-ghelfi-propiedades',
		logo: 'https://www.ghelfipropiedades.com.ar/uploads/avatar/1715382075fa9w6-ghelfipropiedadeslogoweb.png',
		verified: true,
		description:
			'Encontrá la propiedad de tus sueños. Especialistas en casas, departamentos y terrenos en Mercedes.',
		propertyCount: 31,
		website: 'https://www.ghelfipropiedades.com.ar',
		phone: '+54 2324 42-1111',
		email: 'info@ghelfipropiedades.com.ar',
		location: 'Mercedes, Buenos Aires'
	}
];

export function getAgencyBySlug(slug: string): Agency | undefined {
	return agencies.find((a) => a.slug === slug);
}

export function searchAgencies(query: string): Agency[] {
	const q = query.toLowerCase();
	return agencies.filter(
		(a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
	);
}
