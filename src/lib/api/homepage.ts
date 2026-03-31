import { API_BASE_URL } from '$lib/config';
import { propertiesStore } from '$lib/stores/properties';
import type { Property } from '$lib/data/properties';
import type { PropertyResponse } from '$lib/api/properties';

export interface PageData {
	currentPage: number;
	totalItems: number;
	totalPages: number;
	items: Property[];
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

function mapPropertyResponse(p: PropertyResponse): Property {
	return {
		id: p.id,
		title: p.title,
		description: p.description ?? undefined,
		price: p.price,
		priceLabel: p.priceLabel,
		currency: p.currency,
		location: p.location,
		address: p.address ?? '',
		image: p.image ?? '',
		images: p.images,
		propertyType: p.propertyType,
		attributes: p.attributes,
		operation: p.operation,
		featured: p.featured,
		agentId: p.agentId,
		publishedAt: p.createdAt,
		isFinancingEligible: p.isFinancingEligible,
	};
}

export async function loadHomepageProperties(
	page: number = 1,
	limit: number = 12,
): Promise<PageData> {
	const params = new URLSearchParams({ page: String(page), limit: String(limit) });
	const res = await fetch(`${API_BASE_URL}/properties/featured?${params}`, {
		credentials: 'include',
	});
	if (!res.ok) {
		return {
			currentPage: 1,
			totalItems: 0,
			totalPages: 0,
			items: [],
			hasNextPage: false,
			hasPrevPage: false,
		};
	}
	const data = await res.json();

	return {
		currentPage: data.currentPage,
		totalItems: data.totalItems,
		totalPages: data.totalPages,
		items: (data.items ?? []).map(mapPropertyResponse),
		hasNextPage: !!data.links?.next,
		hasPrevPage: !!data.links?.prev,
	};
}

export async function loadFeaturedProperties(): Promise<Property[]> {
	const res = await fetch(`${API_BASE_URL}/properties/featured`, {
		credentials: 'include',
	});
	if (!res.ok) return [];
	const data = await res.json();
	const props: PropertyResponse[] = data.items ?? [];

	return props.map(mapPropertyResponse);
}
