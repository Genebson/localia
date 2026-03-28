import { API_BASE_URL } from '$lib/config';

// Types matching backend DTOs
export interface PropertyAttributes {
	bedrooms: number;
	bathrooms: number;
	area: number;
}

	export interface PropertyResponse {
		id: string;
		title: string;
		description: string | null;
		operation: 'buy' | 'rent';
		propertyType: 'apartment' | 'house' | 'penthouse' | 'terrain' | 'commercial';
		price: number;
		currency: 'USD' | 'ARS';
		location: string;
		address: string | null;
		attributes: PropertyAttributes;
		images: string[];
		priceLabel: string;
		image: string | null;
		featured: boolean;
		agentId: string;
		createdAt: string;
		updatedAt: string;
	}

	export function getPriceLabel(property: PropertyResponse): string {
		const formatted =
			property.currency === 'USD'
				? `USD ${property.price.toLocaleString('en-US')}`
				: `$ ${property.price.toLocaleString('es-AR')}`;
		return property.operation === 'rent' ? `${formatted}/mes` : formatted;
	}

export interface CreatePropertyRequest {
	title: string;
	description?: string;
	operation: 'buy' | 'rent';
	propertyType: 'apartment' | 'house' | 'penthouse' | 'terrain' | 'commercial';
	price: number;
	currency: 'USD' | 'ARS';
	location: string;
	address?: string;
	attributes: PropertyAttributes;
	images: string[];
	featured?: boolean;
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {}

	function formatValidationError(message: string | string[]): string {
		if (!Array.isArray(message)) return message;
		const fieldLabels: Record<string, string> = {
			title: 'título',
			description: 'descripción',
			operation: 'operación',
			propertyType: 'tipo de propiedad',
			price: 'precio',
			currency: 'moneda',
			location: 'ubicación',
			address: 'dirección',
			attributes: 'atributos',
			bedrooms: 'dormitorios',
			bathrooms: 'baños',
			area: 'superficie',
			images: 'fotos',
			featured: 'destacada',
		};
		const errors = message.map((msg) => {
			const match = msg.match(/^(\w+)\s/);
			const field = match ? fieldLabels[match[1]] || match[1] : msg;
			const spanish = msg
				.replace('must be one of the following values', 'debe ser uno de los siguientes valores')
				.replace('must be a string', 'debe ser un texto')
				.replace('must be a number', 'debe ser un número')
				.replace('must be a boolean', 'debe ser sí o no')
				.replace('should not be empty', 'no puede estar vacío')
				.replace('is not valid', 'no es válido');
			return `${field}: ${spanish}`;
		});
		return errors.join('\n');
	}

	async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${API_BASE_URL}${endpoint}`;
		const response = await fetch(url, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			credentials: 'include'
		});

		if (!response.ok) {
			const text = await response.text();
			try {
				const error = JSON.parse(text);
				const msg = Array.isArray(error.message)
					? formatValidationError(error.message)
					: (error.message || `HTTP ${response.status}`);
				throw new Error(msg);
			} catch (e) {
				if (e instanceof Error) throw e;
				throw new Error(`HTTP ${response.status}`);
			}
		}

		const text = await response.text();
		if (!text) return {} as T;
		return JSON.parse(text);
	}

export async function createProperty(data: CreatePropertyRequest): Promise<{ property: PropertyResponse }> {
	return apiFetch<{ property: PropertyResponse }>('/property', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function listMyProperties(): Promise<{ properties: PropertyResponse[] }> {
	return apiFetch<{ properties: PropertyResponse[] }>('/properties');
}

export async function updateProperty(id: string, data: UpdatePropertyRequest): Promise<{ property: PropertyResponse }> {
	return apiFetch<{ property: PropertyResponse }>(`/property/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

export async function deleteProperty(id: string): Promise<void> {
	await apiFetch(`/property/${id}`, { method: 'DELETE' });
}
