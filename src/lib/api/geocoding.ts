/**
 * Geocoding utility using Nominatim (OpenStreetMap)
 * Free, no API key required
 */

export interface GeocodingResult {
	lat: number;
	lng: number;
}

export async function geocodeAddress(
	address: string,
	location: string
): Promise<GeocodingResult | null> {
	const query = `${address}, ${location}, Mercedes, Buenos Aires, Argentina`;
	const encoded = encodeURIComponent(query);

	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&addressdetails=1`,
			{
				headers: {
					'User-Agent': 'Localia/1.0 (Mercedes Real Estate Platform)'
				}
			}
		);

		if (!response.ok) return null;

		const data = await response.json();
		if (data && data.length > 0) {
			return {
				lat: parseFloat(data[0].lat),
				lng: parseFloat(data[0].lon)
			};
		}
	} catch {
		// Geocoding failed, return null
	}

	return null;
}
