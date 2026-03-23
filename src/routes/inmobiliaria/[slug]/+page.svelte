<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { MapPin, Phone, Mail, Building2, Plus } from 'lucide-svelte';
	import { allAgencies } from '$lib/stores/agencies';
	import { allProperties } from '$lib/stores/properties';
	import { isAgent, currentUser } from '$lib/stores/auth';

	$: slug = ($page.params as any).slug || '';
	$: inmob = $allAgencies.find(i => i.slug === slug);

	$: whatsappMsg = inmob ? `Hola! Vi la inmobiliaria ${inmob.name} en Localia y me interesa conocer sus propiedades.` : '';

	$: properties = inmob
		? $allProperties.filter((p: any) => {
			if (!inmob.agentId) return false;
			return p.agentId === inmob.agentId;
		})
		: [];
</script>

<svelte:head>
	<title>{inmob?.name || 'Inmobiliaria'} | Localia</title>
</svelte:head>

<main class="min-h-screen bg-background">
	{#if !inmob}
		<div class="max-w-7xl mx-auto px-4 py-16 text-center">
			<h1 class="text-3xl font-bold text-gray-900 mb-4">Inmobiliaria no encontrada</h1>
			<p class="text-gray-500 mb-8">La inmobiliaria que buscas no existe.</p>
			<a href="{base}/" class="px-6 py-3 bg-primary text-white font-semibold rounded-lg">Volver al inicio</a>
		</div>
	{:else}
		<div class="relative h-64 md:h-80">
			<img src={inmob.banner} alt={inmob.name} class="w-full h-full object-cover" />
			<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
			<div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
				<div class="max-w-7xl mx-auto flex items-end gap-4">
					<img src={inmob.logo} alt={inmob.name} class="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-white p-1 shadow-lg" />
					<div class="text-white">
						<h1 class="text-2xl md:text-3xl font-bold">{inmob.name}</h1>
						<p class="text-white/80">{inmob.tagline}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div class="lg:col-span-2">
					<div class="mb-8">
						<h2 class="text-xl font-bold text-gray-900 mb-2">Sobre nosotros</h2>
						<p class="text-gray-600">{inmob.description}</p>
					</div>

					<div class="mb-8">
						<h2 class="text-xl font-bold text-gray-900 mb-4">Propiedades destacadas</h2>
						{#if properties.length > 0}
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{#each properties.slice(0, 6) as prop}
									<a href="{base}/property/{prop.id}" class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
										<div class="aspect-[16/10] overflow-hidden">
											<img src={prop.image} alt={prop.title} class="w-full h-full object-cover" />
										</div>
										<div class="p-4">
											<h3 class="font-semibold text-gray-900 truncate">{prop.title}</h3>
											<p class="text-accent font-bold">{prop.priceLabel}</p>
											<p class="text-sm text-gray-500 flex items-center gap-1 mt-1">
												<MapPin class="w-3 h-3" />
												{prop.location}
											</p>
										</div>
									</a>
								{/each}
							</div>
						{:else}
							<p class="text-gray-500">No hay propiedades disponibles.</p>
						{/if}
					</div>
				</div>

				<div class="lg:col-span-1">
					<div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
						<h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
							<Building2 class="w-5 h-5 text-primary" />
							Nuestro equipo
						</h3>
						<div class="space-y-4 mb-6">
							{#each inmob.team as member}
								<div class="flex items-center gap-3">
									<div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
										<span class="text-primary font-semibold">{member.name.split(' ').map(n => n[0]).join('')}</span>
									</div>
									<div>
										<p class="font-medium text-gray-900">{member.name}</p>
										<p class="text-sm text-gray-500">{member.role}</p>
									</div>
								</div>
							{/each}
						</div>
						{#if $isAgent}
							<a href="{base}/publicar" class="flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors mb-4">
								<Plus class="w-5 h-5" />
								Publicar propiedad
							</a>
						{/if}
						<div class="space-y-3">
							<a href="tel:{inmob.phone}" class="flex items-center gap-2 w-full px-4 py-3 border border-gray-200 hover:border-primary hover:bg-primary/5 rounded-lg transition-colors">
								<Phone class="w-5 h-5 text-gray-400" />
								<span class="text-gray-700">Llamar</span>
							</a>
							<a href="mailto:{inmob.email}" class="flex items-center gap-2 w-full px-4 py-3 border border-gray-200 hover:border-primary hover:bg-primary/5 rounded-lg transition-colors">
								<Mail class="w-5 h-5 text-gray-400" />
								<span class="text-gray-700">{inmob.email}</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		{#if inmob.whatsapp}
			<a
				href="https://wa.me/{inmob.whatsapp}?text={encodeURIComponent(whatsappMsg)}"
				target="_blank"
				rel="noopener noreferrer"
				class="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-lg transition-colors z-40"
			>
				<Phone class="w-5 h-5" />
				<span class="hidden sm:inline">Contactar por WhatsApp</span>
			</a>
		{/if}
	{/if}
</main>