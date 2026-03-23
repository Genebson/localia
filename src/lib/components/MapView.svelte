<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Property } from '$lib/data/properties';

	export let properties: Property[] = [];

	let mapContainer: HTMLDivElement;
	let map: L.Map | null = null;
	let markers: L.Marker[] = [];

	async function initMap() {
		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');

		if (map) return;

		map = L.map(mapContainer).setView([-34.6, -58.45], 12);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 19
		}).addTo(map);

		addMarkers(L, properties);
	}

	function addMarkers(L: typeof import('leaflet'), props: Property[]) {
		markers.forEach((m) => m.remove());
		markers = [];

		const bounds: L.LatLngTuple[] = [];

		props.forEach((p) => {
			const coords = getCoords(p.location);
			if (coords) {
				const marker = L.marker(coords as L.LatLngTuple).addTo(map!);
				marker.bindPopup(`
					<a href="/localia/property/${p.id}" style="text-decoration:none;color:#1E3A5F;">
						<strong>${p.title}</strong><br/>
						<span style="color:#E8A838;font-weight:bold;">${p.priceLabel}</span><br/>
						<span style="font-size:12px;color:#666;">${p.location}</span>
					</a>
				`);
				markers.push(marker);
				bounds.push(coords as L.LatLngTuple);
			}
		});

		if (bounds.length > 0) {
			(map as any).fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
		}
	}

	function getCoords(location: string): [number, number] | null {
		const coordMap: Record<string, [number, number]> = {
			Centro: [-34.6504, -59.4307],
			'Barrio Norte': [-34.6389, -59.4189],
			'Barrio Sur': [-34.6667, -59.4422],
			'Zona del Club': [-34.6556, -59.4489],
			Mercedes: [-34.6504, -59.4307]
		};

		for (const [area, coords] of Object.entries(coordMap)) {
			if (location.toLowerCase().includes(area.toLowerCase())) {
				return coords;
			}
		}
		return null;
	}

	$: if (map && typeof window !== 'undefined') {
		import('leaflet').then((L) => addMarkers(L, properties));
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

<div bind:this={mapContainer} class="w-full h-full min-h-[400px] rounded-xl overflow-hidden"></div>

<style>
	:global(.leaflet-popup-content-wrapper) {
		border-radius: 8px;
	}
	:global(.leaflet-popup-content) {
		margin: 8px 12px;
	}
</style>
