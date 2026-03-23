<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let location: string = '';

	let mapContainer: HTMLDivElement;
	let map: L.Map | null = null;

	const coordMap: Record<string, [number, number]> = {
		Centro: [-34.6504, -59.4307],
		'Barrio Norte': [-34.6389, -59.4189],
		'Barrio Sur': [-34.6667, -59.4422],
		'Zona del Club': [-34.6556, -59.4489],
		Mercedes: [-34.6504, -59.4307]
	};

	function getCoords(loc: string): [number, number] | null {
		for (const [area, coords] of Object.entries(coordMap)) {
			if (loc.toLowerCase().includes(area.toLowerCase())) {
				return coords;
			}
		}
		return null;
	}

	async function initMap() {
		if (!mapContainer || map) return;

		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');

		const coords = getCoords(location) || [-34.6504, -59.4307];

		map = L.map(mapContainer).setView(coords as L.LatLngExpression, 15);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 19
		}).addTo(map);

		L.marker(coords as L.LatLngExpression).addTo(map);
	}

	onMount(() => {
		initMap();
	});

	onDestroy(() => {
		if (map) {
			map.remove();
			map = null;
		}
	});
</script>

<div bind:this={mapContainer} class="w-full h-64 rounded-xl overflow-hidden"></div>
