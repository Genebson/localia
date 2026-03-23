export interface TeamMember {
	name: string;
	role: string;
	phone: string;
	photo?: string;
}

export interface Inmobiliaria {
	id: string;
	slug: string;
	name: string;
	logo: string;
	banner: string;
	tagline: string;
	description: string;
	phone: string;
	email: string;
	team: TeamMember[];
	agentId?: string;
	whatsapp?: string;
}

export const inmobiliarias: Inmobiliaria[] = [
	{
		id: '1',
		slug: 'inmobiliaria-perez',
		name: 'Inmobiliaria Pérez',
		logo: 'https://ui-avatars.com/api/?name=Perez&background=1E3A5F&color=fff&size=128',
		banner: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
		tagline: 'Tu hogar ideal está acá',
		description: 'Con más de 20 años en el mercado, somos la inmobiliaria de confianza en la zona.',
		phone: '5492345123456',
		email: 'contacto@inmobiliariaperez.com',
		whatsapp: '5492345123456',
		team: [
			{ name: 'Roberto Pérez', role: 'Director', phone: '5492345123456' },
			{ name: 'Ana Martínez', role: 'Asesora comercial', phone: '5492345654321' }
		]
	},
	{
		id: '2',
		slug: 'bienes-raices-del-centro',
		name: 'Bienes Raíces del Centro',
		logo: 'https://ui-avatars.com/api/?name=BR&background=E8A838&color=fff&size=128',
		banner: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
		tagline: 'Expertos en el centro y alrededores',
		description: 'Especialistas en propiedades comerciales y residenciales en el centro de la ciudad.',
		phone: '5491123456789',
		email: 'info@bienesraicesdelcentro.com',
		whatsapp: '5491123456789',
		team: [
			{ name: 'Carlos García', role: 'Gerente', phone: '5491123456789' }
		]
	},
	{
		id: '3',
		slug: 'tu-hogar-ideal',
		name: 'Tu Hogar Ideal',
		logo: 'https://ui-avatars.com/api/?name=TH&background=10B981&color=fff&size=128',
		banner: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
		tagline: 'Encontramos tu lugar en el mundo',
		description: 'Una inmobiliaria familiar comprometida con encontrar tu hogar ideal.',
		phone: '5491145678901',
		email: 'hola@tuhogarideal.com',
		whatsapp: '5491145678901',
		team: [
			{ name: 'María López', role: 'Fundadora', phone: '5491145678901' },
			{ name: 'Juan Torres', role: 'Asesor', phone: '5491145789012' }
		]
	}
];