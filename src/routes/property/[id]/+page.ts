import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getProperty } from '$lib/api/properties';
import { API_BASE_URL } from '$lib/config';
import type { PropertyResponse } from '$lib/api/properties';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const [propertyRes, featuredRes] = await Promise.all([
			getProperty(params.id),
			fetch(`${API_BASE_URL}/properties/featured`, { credentials: 'include' }).then(r => r.ok ? r.json() : { properties: [] }).catch(() => ({ properties: [] }))
		]);
		
		return { 
			property: propertyRes.property as PropertyResponse,
			allProperties: featuredRes.properties as PropertyResponse[]
		};
	} catch (e) {
		error(404, 'Property not found');
	}
};
