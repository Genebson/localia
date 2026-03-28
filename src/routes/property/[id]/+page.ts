import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { PropertyResponse } from '$lib/api/properties';

export const load: PageLoad = async ({ fetch, params }) => {
	try {
		const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
		const res = await fetch(`${baseUrl}/property/${params.id}`, {
			credentials: 'include'
		});

		if (!res.ok) {
			error(404, 'Property not found');
		}

		const data = await res.json();
		return { property: data.property as PropertyResponse };
	} catch {
		error(404, 'Property not found');
	}
};
