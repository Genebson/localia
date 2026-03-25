<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Property } from '$lib/data/properties';
	import { Loader } from '@googlemaps/js-api-loader';

	export let properties: Property[] = [];

	let mapContainer: HTMLDivElement;
	let map: google.maps.Map | null = null;
	let markers: google.maps.Marker[] = [];
	let infoWindow: google.maps.InfoWindow | null = null;

	const MERCEDES_CENTER = { lat: -34.6504, lng: -59.4307 };

	const coordMap: Record<string, { lat: number; lng: number }> = {
		Centro: { lat: -34.6504, lng: -59.4307 },
		'Barrio Norte': { lat: -34.6389, lng: -59.4189 },
		'Barrio Sur': { lat: -34.6667, lng: -59.4422 },
		'Zona del Club': { lat: -34.6556, lng: -59.4489 },
		Mercedes: { lat: -34.6504, lng: -59.4307 }
	};

	async function initMap() {
		const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

		if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
			console.warn(
				'Google Maps API key not configured. Set VITE_GOOGLE_MAPS_API_KEY in .env'
			);
			return;
		}

		const loader = new Loader({
			apiKey,
			version: 'weekly',
			libraries: ['places', 'marker']
		});

		try {
			const google = await loader.load();

			if (map) return;

			map = new google.maps.Map(mapContainer, {
				center: MERCEDES_CENTER,
				zoom: 13,
				mapTypeControl: false,
				streetViewControl: false,
				fullscreenControl: true,
				zoomControl: true,
				styles: getMapStyles()
			});

			infoWindow = new google.maps.InfoWindow();

			addMarkers(properties);

			google.maps.event.addListener(map, 'idle', () => {
				const bounds = map!.getBounds();
				const zoom = map!.getZoom();
				if (bounds && zoom) {
					console.log('Map moved:', { center: map!.getCenter()?.toString(), zoom });
				}
			});
		} catch (error) {
			console.error('Failed to load Google Maps:', error);
		}
	}

	function getCoords(location: string): { lat: number; lng: number } | null {
		for (const [area, coords] of Object.entries(coordMap)) {
			if (location.toLowerCase().includes(area.toLowerCase())) {
				return coords;
			}
		}
		return MERCEDES_CENTER;
	}

	function addMarkers(props: Property[]) {
		if (!map) return;

		markers.forEach((m) => m.setMap(null));
		markers = [];

		const bounds = new google.maps.LatLngBounds();

		props.forEach((p) => {
			const coords = getCoords(p.location);
			if (coords) {
				const marker = new google.maps.Marker({
					position: coords,
					map: map!,
					title: p.title,
					animation: google.maps.Animation.DROP
				});

				const contentString = `
					<div style="padding: 8px; min-width: 200px;">
						<a href="/localia/property/${p.id}" style="text-decoration: none; color: #1E3A5F;">
							<strong style="font-size: 14px;">${p.title}</strong><br/>
							<span style="color: #E8A838; font-weight: bold; font-size: 13px;">${p.priceLabel}</span><br/>
							<span style="font-size: 12px; color: #666;">${p.location}</span><br/>
							<span style="font-size: 11px; color: #888;">${p.attributes.bedrooms} dorm. · ${p.attributes.bathrooms} baños</span>
						</a>
					</div>
				`;

				marker.addListener('click', () => {
					if (infoWindow) {
						infoWindow.setContent(contentString);
						infoWindow.open(map, marker);
					}
				});

				markers.push(marker);
				bounds.extend(coords);
			}
		});

		if (markers.length > 0) {
			map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
			if (markers.length === 1) {
				map.setZoom(15);
			}
		}
	}

	function getMapStyles(): google.maps.MapTypeStyle[] {
		return [
			{
				featureType: 'poi',
				elementType: 'labels',
				stylers: [{ visibility: 'off' }]
			},
			{
				featureType: 'transit',
				stylers: [{ visibility: 'simplified' }]
			}
		];
	}

	$: if (map && typeof window !== 'undefined') {
		addMarkers(properties);
	}

	onMount(() => {
		initMap();
	});

	onDestroy(() => {
		markers.forEach((m) => m.setMap(null));
		markers = [];
		map = null;
	});
</script>

<div class="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden">
	{#if !import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE'}
		<div class="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
			<div class="text-center p-6">
				<p class="text-gray-500 mb-2">Google Maps no configurado</p>
				<p class="text-sm text-gray-400">
					Agrega VITE_GOOGLE_MAPS_API_KEY a tu archivo .env
				</p>
			</div>
		</div>
	{/if}
	<div bind:this={mapContainer} class="w-full h-full min-h-[400px]"></div>
</div>

<style>
	:global(.gm-style-iw) {
		border-radius: 8px !important;
	}
	:global(.gm-style-iw-c) {
		padding: 0 !important;
	}
	:global(.gm-style-iw-d) {
		overflow: hidden !important;
	}
</style>
