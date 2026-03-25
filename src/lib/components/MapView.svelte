<script lang="ts">
	import type { Property } from '$lib/data/properties';

	export let properties: Property[] = [];

	const MERCEDES_CENTER = { lat: -34.6504, lng: -59.4307 };
	const DEFAULT_ZOOM = 13;

	const coordMap: Record<string, { lat: number; lng: number }> = {
		Centro: { lat: -34.6504, lng: -59.4307 },
		'Barrio Norte': { lat: -34.6389, lng: -59.4189 },
		'Barrio Sur': { lat: -34.6667, lng: -59.4422 },
		'Zona del Club': { lat: -34.6556, lng: -59.4489 },
		Mercedes: { lat: -34.6504, lng: -59.4307 }
	};

	function getCoords(location: string): { lat: number; lng: number } | null {
		for (const [area, coords] of Object.entries(coordMap)) {
			if (location.toLowerCase().includes(area.toLowerCase())) {
				return coords;
			}
		}
		return null;
	}

	function buildMapsUrl(): string {
		const searchQuery = encodeURIComponent('Mercedes, Buenos Aires, Argentina');
		return `https://www.google.com/maps?q=${searchQuery}&t=&z=${DEFAULT_ZOOM}&ie=UTF8&output=embed&ll=${MERCEDES_CENTER.lat},${MERCEDES_CENTER.lng}`;
	}

	$: markers = properties
		.map((p) => ({
			property: p,
			coords: getCoords(p.location)
		}))
		.filter((m) => m.coords !== null);

	$: mapUrl = buildMapsUrl();
</script>

<div class="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-gray-200">
	<iframe
		title="Ubicación de propiedades"
		width="100%"
		height="100%"
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
		style="border: 0;"
		src={mapUrl}
	></iframe>

	{#if markers.length > 0}
		<div
			class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 text-sm font-medium text-gray-700 z-[9999]"
		>
			{markers.length}
			{markers.length === 1 ? 'propiedad' : 'propiedades'} en el mapa
		</div>
	{/if}
</div>
