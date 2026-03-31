import axios from 'axios';
import { API_BASE_URL } from '$lib/config';

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
	propertyType: PropertyTypeDto;
	price: number;
	currency: 'USD' | 'ARS';
	location: string;
	address: string | null;
	attributes: PropertyAttributes;
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

export function getPriceLabel(property: PropertyResponse): string {
	const formatted =
		property.currency === 'USD'
			? `USD ${property.price.toLocaleString('en-US')}`
			: `$ ${property.price.toLocaleString('es-AR')}`;
	return property.operation === 'rent' ? `${formatted}/mes` : formatted;
}

export type OperationDto = 'buy' | 'rent';
export type PropertyTypeDto =
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
export type CurrencyDto = 'USD' | 'ARS';

export interface CreatePropertyRequest {
	title: string;
	description?: string;
	operation: OperationDto;
	propertyType: PropertyTypeDto;
	price: number;
	currency: CurrencyDto;
	location: string;
	address?: string;
	attributes: {
		bedrooms: number;
		bathrooms: number;
		area: number;
	};
	images: string[];
	featured?: boolean;
	distributedTo?: string[];
	isFinancingEligible?: boolean;
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
	condition?: 'new' | 'good' | 'needs-renovation';
	furnishings?: 'furnished' | 'equipped-kitchen';
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

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	try {
		const response = await axiosInstance({
			url: endpoint,
			method: options.method || 'GET',
			data: options.body ? JSON.parse(options.body) : undefined,
			headers: options.headers as Record<string, string> | undefined
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			const data = error.response.data;
			const msg = Array.isArray(data.message)
				? formatValidationError(data.message)
				: (data.message || `HTTP ${error.response.status}`);
			throw new Error(msg);
		}
		throw error;
	}
}

export async function createProperty(data: CreatePropertyRequest): Promise<{ property: PropertyResponse }> {
	return apiFetch<{ property: PropertyResponse }>('/property', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function listMyProperties(): Promise<{ properties: PropertyResponse[] }> {
	return apiFetch<{ properties: PropertyResponse[] }>('/my-properties');
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

export async function getProperty(id: string): Promise<{ property: PropertyResponse }> {
	return apiFetch<{ property: PropertyResponse }>(`/property/${id}`);
}

export async function uploadImage(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result);
			} else {
				reject(new Error('Failed to read file'));
			}
		};
		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}

export async function incrementViews(_id: string): Promise<void> {
	// No-op for API version — views tracked server-side
}
