<script lang="ts">
	export let location: string = '';

	const MERCEDES_CENTER = { lat: -34.6504, lng: -59.4307 };

	const coordMap: Record<string, { lat: number; lng: number }> = {
		Centro: { lat: -34.6504, lng: -59.4307 },
		'Barrio Norte': { lat: -34.6389, lng: -59.4189 },
		'Barrio Sur': { lat: -34.6667, lng: -59.4422 },
		'Zona del Club': { lat: -34.6556, lng: -59.4489 },
		Mercedes: { lat: -34.6504, lng: -59.4307 }
	};

	function getCoords(loc: string): { lat: number; lng: number } | null {
		for (const [area, coords] of Object.entries(coordMap)) {
			if (loc.toLowerCase().includes(area.toLowerCase())) {
				return coords;
			}
		}
		return null;
	}

	$: coords = getCoords(location) || MERCEDES_CENTER;
	$: mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(location + ', Mercedes, Buenos Aires, Argentina')}&t=&z=15&ie=UTF8&output=embed&ll=${coords.lat},${coords.lng}`;
</script>

<div class="w-full h-64 rounded-xl overflow-hidden border border-gray-200">
	<iframe
		title="Ubicación de {location}"
		width="100%"
		height="100%"
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
		style="border: 0;"
		src={mapUrl}
	></iframe>
</div>
