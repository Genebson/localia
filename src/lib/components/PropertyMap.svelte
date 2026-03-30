<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Property } from '$lib/data/properties';
	import { base } from '$app/paths';

	export let properties: Property[] = [];
	export let height: string = '400px';

	let mapContainer: HTMLDivElement;
	let map: any;
	let L: any;

	onMount(async () => {
		// Dynamically import Leaflet to avoid SSR issues
		const leaflet = await import('leaflet');
		L = leaflet.default;

		// Import Leaflet CSS
		await import('leaflet/dist/leaflet.css');

		// Initialize map centered on Mercedes, Buenos Aires
		map = L.map(mapContainer).setView([-34.6499, -59.43], 13);

		// Add OpenStreetMap tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19
		}).addTo(map);

		// Add markers for properties with coordinates
		updateMarkers();
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});

	function updateMarkers() {
		if (!map || !L) return;

		// Clear existing markers
		map.eachLayer((layer: any) => {
			if (layer instanceof L.Marker) {
				map.removeLayer(layer);
			}
		});

		// Add markers for properties with coordinates
		properties.forEach((property) => {
			if (property.lat && property.lng) {
				const marker = L.marker([property.lat, property.lng], {
					icon: L.divIcon({
						className: 'custom-marker',
						html: `<div style="background-color: #1E5F4A; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
						</div>`,
						iconSize: [32, 32],
						iconAnchor: [16, 32]
					})
				});

				const popupContent = `
					<div style="min-width: 200px; font-family: system-ui, sans-serif;">
						<img src="${property.image}" alt="${property.title}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
						<h3 style="font-size: 14px; font-weight: 600; margin: 0 0 4px 0; color: #1a1a1a;">${property.title}</h3>
						<p style="font-size: 13px; font-weight: 700; color: #1E5F4A; margin: 0 0 8px 0;">${property.priceLabel}</p>
						<p style="font-size: 11px; color: #666; margin: 0 0 8px 0;">${property.location}</p>
						<a href="${base}/property/${property.id}" style="display: inline-block; background-color: #1E5F4A; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">Ver propiedad</a>
					</div>
				`;

				marker.bindPopup(popupContent, {
					maxWidth: 250,
					className: 'property-popup'
				});

				marker.addTo(map);
			}
		});

		// Fit map to markers if there are any
		const validProperties = properties.filter((p) => p.lat && p.lng);
		if (validProperties.length > 0) {
			const bounds = L.latLngBounds(validProperties.map((p) => [p.lat!, p.lng!]));
			map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
		}
	}

	// Update markers when properties change
	$: if (map && L && properties) {
		updateMarkers();
	}
</script>

<div class="relative">
	<div
		bind:this={mapContainer}
		style="height: {height}; width: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);"
		class="z-0"
	></div>

	<!-- Map Overlay Title -->
	<div
		class="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
	>
		<p class="text-sm font-semibold text-gray-900">Propiedades en el mapa</p>
		<p class="text-xs text-gray-500">
			{properties.filter((p) => p.lat && p.lng).length} propiedades
		</p>
	</div>
</div>

<style>
	:global(.property-popup .leaflet-popup-content-wrapper) {
		border-radius: 12px;
		padding: 0;
		overflow: hidden;
	}

	:global(.property-popup .leaflet-popup-content) {
		margin: 8px;
	}

	:global(.property-popup .leaflet-popup-tip) {
		background: white;
	}
</style>
