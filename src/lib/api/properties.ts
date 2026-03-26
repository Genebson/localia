import type { Property } from '$lib/data/properties';
import { propertiesStore } from '$lib/stores/properties';
import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';

export type OperationDto = 'buy' | 'rent';
export type PropertyTypeDto = 'apartment' | 'house' | 'penthouse' | 'terrain' | 'commercial';
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
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {}

interface ApiPropertyAttributes {
	title: string;
	description: string | null;
	operation: OperationDto;
	propertyType: PropertyTypeDto;
	price: number;
	currency: CurrencyDto;
	location: string;
	address: string | null;
	attributes: {
		bedrooms: number;
		bathrooms: number;
		area: number;
	};
	images: string[];
	featured: boolean;
	agentId: string;
}

interface ApiPropertyResponse {
	data: {
		type: 'property';
		id: string;
		attributes: ApiPropertyAttributes;
	};
}

interface ApiPropertyListResponse {
	data: Array<{
		type: 'property';
		id: string;
		attributes: ApiPropertyAttributes;
	}>;
}

function mapApiToProperty(data: ApiPropertyAttributes, id: string): Property {
	const priceNum = data.price;
	const currency = data.currency;
	const operation = data.operation;
	const priceLabel = `${currency === 'USD' ? 'USD' : '$'} ${priceNum.toLocaleString('es-AR')}${operation === 'rent' ? '/mes' : ''}`;

	return {
		id,
		title: data.title,
		description: data.description ?? undefined,
		price: data.price,
		priceLabel,
		currency: data.currency,
		location: data.location,
		address: data.address ?? '',
		image:
			data.images[0] ??
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
		images: data.images,
		propertyType: data.propertyType,
		attributes: data.attributes,
		operation: data.operation,
		featured: data.featured,
		agentId: data.agentId,
		agentEmail: undefined,
		isUserProperty: true
	};
}

export async function createProperty(data: CreatePropertyRequest): Promise<Property> {
	const user = get(auth);
	const priceNum = data.price;
	const currency = data.currency;
	const operation = data.operation;
	const priceLabel = `${currency === 'USD' ? 'USD' : '$'} ${priceNum.toLocaleString('es-AR')}${operation === 'rent' ? '/mes' : ''}`;

	const listingCounter = parseInt(localStorage.getItem('localia_listing_counter') || '0') + 1;
	localStorage.setItem('localia_listing_counter', listingCounter.toString());
	const listingCode = `LCL-${new Date().getFullYear()}-${listingCounter.toString().padStart(4, '0')}`;

	const newProperty = propertiesStore.add({
		title: data.title,
		description: data.description,
		price: data.price,
		priceLabel,
		currency: data.currency,
		location: data.location,
		address: data.address || '',
		image:
			data.images[0] ||
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
		images: data.images,
		propertyType: data.propertyType,
		attributes: data.attributes,
		operation: data.operation,
		featured: data.featured ?? true,
		agentId: user?.id || 'anonymous',
		agentEmail: user?.email,
		distributedTo: data.distributedTo ?? [],
		listingCode,
		published: true,
		views: 0,
		publishedAt: new Date().toISOString(),
		lastUpdatedAt: new Date().toISOString()
	});

	return newProperty;
}

export async function listMyProperties(): Promise<Property[]> {
	const user = get(auth);
	if (!user) return [];

	const allProps = get(propertiesStore);
	return allProps.filter((p) => p.agentId === user.id);
}

export async function updateProperty(id: string, data: UpdatePropertyRequest): Promise<Property> {
	const priceNum = data.price ?? 0;
	const currency = data.currency ?? 'USD';
	const operation = data.operation ?? 'buy';
	const priceLabel = `${currency === 'USD' ? 'USD' : '$'} ${priceNum.toLocaleString('es-AR')}${operation === 'rent' ? '/mes' : ''}`;

	propertiesStore.update(id, {
		...data,
		priceLabel,
		lastUpdatedAt: new Date().toISOString()
	});

	const updated = get(propertiesStore).find((p) => p.id === id);
	if (!updated) {
		throw new Error('Propiedad no encontrada');
	}
	return updated;
}

export async function deleteProperty(id: string): Promise<void> {
	propertiesStore.delete(id);
}

export async function incrementViews(id: string): Promise<void> {
	const prop = get(propertiesStore).find((p) => p.id === id);
	if (prop) {
		propertiesStore.update(id, {
			views: (prop.views || 0) + 1
		});
	}
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
