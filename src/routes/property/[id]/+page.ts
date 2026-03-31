import axios from 'axios';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getProperty } from '$lib/api/properties';
import { API_BASE_URL } from '$lib/config';
import type { PropertyResponse } from '$lib/api/properties';

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true
});

export const load: PageLoad = async ({ params }) => {
	try {
		const [propertyRes, allPropsRes] = await Promise.all([
			getProperty(params.id),
			axiosInstance.get('/properties').then(r => r.data).catch(() => ({ properties: [] }))
		]);
		
		return { 
			property: propertyRes.property as PropertyResponse,
			allProperties: allPropsRes.properties as PropertyResponse[]
		};
	} catch (e) {
		error(404, 'Property not found');
	}
};
