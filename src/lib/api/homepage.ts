import { API_BASE_URL } from '$lib/config';
import { propertiesStore } from '$lib/stores/properties';
import type { Property } from '$lib/data/properties';
import type { PropertyResponse } from '$lib/api/properties';

export async function loadFeaturedProperties(): Promise<Property[]> {
	const res = await fetch(`${API_BASE_URL}/properties/featured`, {
		credentials: 'include'
	});
	if (!res.ok) return [];
	const data = await res.json();
	const props: PropertyResponse[] = data.properties ?? [];

	return props.map(
		(p): Property => ({
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
			isFinancingEligible: p.isFinancingEligible
		})
	);
}

export async function loadHomepageProperties() {
	const apiProps = await loadFeaturedProperties();
	propertiesStore.set(apiProps);
}
