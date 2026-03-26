<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { Phone, Send, CheckCircle, Bot, User, Building2 } from 'lucide-svelte';
	import { isAgent, currentUser, auth } from '$lib/stores/auth';
	import { authModalOpen } from '$lib/stores/authModal';
	import { messages } from '$lib/stores/messages';

	$: isAuthorized = $currentUser && $isAgent;

	onMount(async () => {
		try {
			await auth.init();
		} catch {
			// ignore auth errors
		}

		if (!$currentUser) {
			authModalOpen.set(true);
			goto(base + '/');
		} else if (!$isAgent) {
			goto(base + '/');
		}

		if ($messages.length === 0) {
			for (const conv of seedConversations) {
				messages.addConversation(
					{
						id: conv.id,
						name: conv.name,
						phone: conv.phone,
						lastMessage: conv.lastMessage,
						propertyId: '',
						propertyTitle: '',
						messages: conv.messages
					},
					true
				);
			}
		}
	});

	const seedConversations = [
		{
			id: 'seed-1',
			name: 'María García',
			phone: '5492345123456',
			lastMessage: 'Tengo presupuesto USD 150.000',
			messages: [
				{
					id: '1-1',
					text: 'Hola! Vi la propiedad en Localia. Está disponible?',
					sender: 'prospect',
					timestamp: '10:30'
				},
				{
					id: '1-2',
					text: '¡Hola María! Soy ChePibe, el asistente de Localia. Sí, la propiedad está disponible. Para poder ayudarte mejor, ¿cuál es tu presupuesto approximate?',
					sender: 'bot',
					timestamp: '10:31'
				},
				{
					id: '1-3',
					text: 'Tengo presupuesto USD 150.000',
					sender: 'prospect',
					timestamp: '10:32'
				},
				{
					id: '1-4',
					text: '¡Perfecto! Según tu presupuesto, te encontré 3 propiedades que pueden interesarte. ¿Querés que te las envíe?',
					sender: 'bot',
					timestamp: '10:33'
				},
				{ id: '1-5', text: 'Sí por favor!', sender: 'prospect', timestamp: '10:34' },
				{
					id: '1-6',
					text: 'Aquí van:\n\n1. Departamento 2 ambientes en Centro - USD 185.000\n2. PH en Barrio Sur - USD 165.000\n3. Loft en Centro - USD 210.000\n\n¿Querés coordinar una visita?',
					sender: 'bot',
					timestamp: '10:35'
				}
			]
		},
		{
			id: 'seed-2',
			name: 'Carlos Agent',
			phone: '5491145678901',
			lastMessage: 'Pasale la casa de San Martín a Juan',
			messages: [
				{
					id: '2-1',
					text: 'ChePibe, pasale la casa de calle San Martín a Juan',
					sender: 'prospect',
					timestamp: '14:20'
				},
				{
					id: '2-2',
					text: '¡Listo! Te genero el mensaje para Juan:\n\n"Hola Juan! Te paso la info de la casa en San Martín 1234. Casa de 3 dormitorios, 2 baños, 150m². USD 280.000. Link: localia.com.ar/property/018d1a2b\n\n¿Lo envío?',
					sender: 'bot',
					timestamp: '14:21'
				},
				{ id: '2-3', text: 'Sí, envío.', sender: 'prospect', timestamp: '14:22' },
				{
					id: '2-4',
					text: '✅ Mensaje enviado a Juan. También lo guardé en el CRM como "Lead en seguimiento".',
					sender: 'bot',
					timestamp: '14:22'
				}
			]
		},
		{
			id: 'seed-3',
			name: 'Laura Agent',
			phone: '5491123456789',
			lastMessage: '¿Tenemos algo de 2 dormitorios por menos de USD 50.000?',
			messages: [
				{
					id: '3-1',
					text: 'ChePibe, ¿tenemos algo de 2 dormitorios por menos de USD 50.000?',
					sender: 'prospect',
					timestamp: '16:45'
				},
				{
					id: '3-2',
					text: 'Buscando en la base de Localia...\n\nNo hay propiedades que matcheen esos filtros actualmente. Pero te ofrezco alternativas:\n\n1. Terreno en Zona del Club - USD 45.000 (0 dormitorios, pero 850m²)\n2. Lofts desde USD 65.000 (1 dormitorio)\n\n¿Ampliás el rango?',
					sender: 'bot',
					timestamp: '16:46'
				}
			]
		}
	];

	$: conversations = $messages;
	$: selectedConversation = conversations[0] || null;
	let newMessage = '';

	function selectConversation(conv: any) {
		selectedConversation = conv;
		messages.markRead(conv.id);
	}

	function sendMessage() {
		if (!newMessage.trim() || !selectedConversation) return;
		messages.addMessage(selectedConversation.id, {
			text: newMessage,
			sender: 'agent'
		});
		newMessage = '';
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}
</script>

<svelte:head>
	<title>ChePibe CRM | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background">
	{#if !isAuthorized}
		<div class="max-w-md mx-auto px-4 py-16 text-center">
			<div
				class="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
			>
				<Building2 class="w-8 h-8 text-accent" />
			</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Acceso restringido</h1>
			<p class="text-gray-500 mb-6">
				Solo los agentes inmobiliarios pueden acceder a ChePibe CRM.
			</p>
			<a
				href="{base}/"
				class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
			>
				Volver al inicio
			</a>
		</div>
	{:else}
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="mb-6 flex items-center justify-between">
				<div>
					<h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1">ChePibe CRM</h1>
					<p class="text-gray-500">Asistente de WhatsApp para inmobiliarias</p>
				</div>
				<div
					class="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
				>
					<CheckCircle class="w-4 h-4" />
					CRM Conectado
				</div>
			</div>

			<div
				class="bg-white rounded-xl shadow-sm overflow-hidden"
				style="height: calc(100vh - 220px); min-height: 500px;"
			>
				<div class="grid grid-cols-1 md:grid-cols-3 h-full">
					<div class="border-r border-gray-100 overflow-y-auto">
						<div class="p-4 border-b border-gray-100">
							<h2 class="font-semibold text-gray-900">Conversaciones</h2>
						</div>
						{#if conversations.length === 0}
							<div class="p-8 text-center text-gray-400 text-sm">
								No hay conversaciones aún.
							</div>
						{:else}
							{#each conversations as conv}
								<button
									on:click={() => selectConversation(conv)}
									class="w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors {selectedConversation?.id ===
									conv.id
										? 'bg-primary/5 border-l-4 border-l-primary'
										: ''}"
								>
									<div class="flex items-center gap-3">
										<div
											class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
										>
											{#if conv.messages[0]?.sender === 'bot'}
												<Bot class="w-5 h-5 text-primary" />
											{:else}
												<span class="text-primary font-semibold text-sm"
													>{conv.name
														.split(' ')
														.map((n) => n[0])
														.join('')}</span
												>
											{/if}
										</div>
										<div class="flex-1 min-w-0">
											<div class="flex items-center justify-between">
												<span class="font-medium text-gray-900 truncate"
													>{conv.name}</span
												>
												<span class="text-xs text-gray-400"
													>{conv.messages[conv.messages.length - 1]
														?.timestamp}</span
												>
											</div>
											<p class="text-sm text-gray-500 truncate">
												{conv.lastMessage}
											</p>
										</div>
									</div>
								</button>
							{/each}
						{/if}
					</div>

					<div class="md:col-span-2 flex flex-col">
						<div class="p-4 border-b border-gray-100 flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div
									class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
								>
									<Bot class="w-5 h-5 text-primary" />
								</div>
								<div>
									<h3 class="font-semibold text-gray-900">
										{selectedConversation?.name || 'Sin conversación'}
									</h3>
									<p class="text-xs text-gray-500">ChePibe CRM · En línea</p>
								</div>
							</div>
							<div
								class="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
							>
								<CheckCircle class="w-3 h-3" />
								CRM Conectado
							</div>
						</div>

						<div class="flex-1 overflow-y-auto p-4 space-y-4">
							{#if !selectedConversation}
								<div
									class="flex items-center justify-center h-full text-gray-400 text-sm"
								>
									Seleccioná una conversación
								</div>
							{:else}
								{#each selectedConversation.messages as msg}
									<div
										class="flex {msg.sender === 'prospect'
											? 'justify-start'
											: 'justify-end'}"
									>
										<div
											class="max-w-[80%] {msg.sender === 'prospect'
												? 'order-1'
												: 'order-2'}"
										>
											<div
												class="flex items-end gap-2 {msg.sender ===
												'prospect'
													? 'flex-row'
													: 'flex-row-reverse'}"
											>
												<div
													class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 {msg.sender ===
													'bot'
														? 'bg-primary/10'
														: 'bg-gray-100'}"
												>
													{#if msg.sender === 'bot'}
														<Bot class="w-4 h-4 text-primary" />
													{:else}
														<User class="w-4 h-4 text-gray-500" />
													{/if}
												</div>
												<div
													class="px-4 py-2.5 rounded-2xl {msg.sender ===
													'prospect'
														? 'bg-gray-100 text-gray-900'
														: 'bg-primary text-white'}"
												>
													<p class="text-sm whitespace-pre-wrap">
														{msg.text}
													</p>
												</div>
											</div>
											<p
												class="text-xs text-gray-400 mt-1 {msg.sender ===
												'prospect'
													? 'ml-10'
													: 'mr-10 text-right'}"
											>
												{msg.timestamp}
											</p>
										</div>
									</div>
								{/each}
							{/if}
						</div>

						<div class="p-4 border-t border-gray-100">
							<div class="flex items-center gap-3">
								<input
									type="text"
									bind:value={newMessage}
									on:keypress={handleKeyPress}
									placeholder="Escribí un mensaje..."
									class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								/>
								<button
									on:click={sendMessage}
									disabled={!newMessage.trim() || !selectedConversation}
									class="p-3 bg-primary hover:bg-primary-light text-white rounded-xl transition-colors disabled:opacity-50"
								>
									<Send class="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>
