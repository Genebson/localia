import axios from 'axios';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getProperty } from '$lib/api/properties';
import { API_BASE_URL } from '$lib/config';
import type { PropertyResponse } from '$lib/api/properties';
import type { PublicUser } from '$lib/api/auth';

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

		const property = propertyRes.property as PropertyResponse;

		let agent: PublicUser['data'] | null = null;
		if (property?.agentId) {
			try {
				const agentRes = await axiosInstance.get<PublicUser>(`/users/${property.agentId}`);
				agent = agentRes.data.data;
			} catch {
			}
		}

		return {
			property,
			allProperties: (allPropsRes.properties as PropertyResponse[]) || [],
			agent,
		};
	} catch (e) {
		error(404, 'Property not found');
	}
};
