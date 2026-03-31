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
		const [propertyRes, featuredRes] = await Promise.all([
			getProperty(params.id),
			axiosInstance.get('/properties/featured').then(r => r.data).catch(() => ({ properties: [] }))
		]);
		
		return { 
			property: propertyRes.property as PropertyResponse,
			allProperties: featuredRes.properties as PropertyResponse[]
		};
	} catch (e) {
		error(404, 'Property not found');
	}
};
