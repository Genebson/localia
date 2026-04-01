import axios from 'axios';
import { API_BASE_URL } from '$lib/config';

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

export async function addFavorite(propertyId: string): Promise<void> {
	await axiosInstance.post('/favorites', { propertyId });
}

export async function removeFavorite(propertyId: string): Promise<void> {
	await axiosInstance.delete(`/favorites/${propertyId}`);
}

export async function listFavorites(): Promise<{ favorites: string[] }> {
	const response = await axiosInstance.get<{ favorites: string[] }>('/favorites');
	return response.data;
}
