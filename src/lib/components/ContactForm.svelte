<script lang="ts">
	import { Check, Phone } from 'lucide-svelte';
	import { messages } from '$lib/stores/messages';

	export let propertyId: string;
	export let propertyTitle: string;

	let name = '';
	let email = '';
	let phone = '';
	let message = `¡Hola! Quiero que se comuniquen conmigo por esta propiedad que vi en Localia: ${propertyTitle}`;
	let acceptTerms = false;
	let acceptPrivacy = false;
	let isSubmitting = false;
	let isSubmitted = false;

	async function handleSubmit() {
		if (!name || !email || !phone) return;
		if (!acceptTerms || !acceptPrivacy) return;

		isSubmitting = true;

		messages.addConversation({
			id: crypto.randomUUID(),
			name,
			email,
			phone,
			propertyId,
			propertyTitle,
			lastMessage: message,
			messages: [
				{
					id: crypto.randomUUID(),
					text: message,
					sender: 'prospect',
					timestamp: new Date().toLocaleTimeString('es-AR', {
						hour: '2-digit',
						minute: '2-digit'
					})
				}
			]
		});

		isSubmitting = false;
		isSubmitted = true;
	}

	function handleWhatsApp() {
		const text = encodeURIComponent(
			`¡Hola! Me comunico por la propiedad: ${propertyTitle}\n${message}`
		);
		window.open(`https://wa.me/54${phone}?text=${text}`, '_blank');
	}
</script>

<div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
	<h3 class="text-base font-semibold text-gray-900 mb-4">Contactá al anunciante</h3>

	{#if isSubmitted}
		<div class="text-center py-6">
			<div
				class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
			>
				<Check class="w-7 h-7 text-green-600" />
			</div>
			<p class="text-green-700 font-medium">¡Mensaje enviado!</p>
			<p class="text-gray-500 text-sm mt-1">Te responderemos a la brevedad.</p>
		</div>
	{:else}
		<form on:submit|preventDefault={handleSubmit} class="space-y-3">
			<div class="flex gap-3">
				<div class="flex-1" style="flex-basis: 37%;">
					<label for="contact-name" class="block text-xs font-medium text-gray-700 mb-1"
						>Nombre</label
					>
					<input
						id="contact-name"
						type="text"
						bind:value={name}
						required
						class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						placeholder="Tu nombre"
					/>
				</div>
				<div class="flex-1" style="flex-basis: 63%;">
					<label for="contact-email" class="block text-xs font-medium text-gray-700 mb-1"
						>Email</label
					>
					<input
						id="contact-email"
						type="email"
						bind:value={email}
						required
						class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						placeholder="tu@email.com"
					/>
				</div>
			</div>

			<div>
				<label for="contact-phone" class="block text-xs font-medium text-gray-700 mb-1"
					>Teléfono</label
				>
				<div class="flex items-center gap-2">
					<div
						class="flex items-center gap-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
					>
						<span class="font-medium"><Phone class="w-4 h-4" /></span>
					</div>
					<input
						id="contact-phone"
						type="tel"
						inputmode="numeric"
						pattern="[0-9]*"
						bind:value={phone}
						required
						class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						placeholder="Ej: 11 5555 1234"
					/>
				</div>
			</div>

			<div>
				<label for="contact-message" class="block text-xs font-medium text-gray-700 mb-1"
					>Mensaje</label
				>
				<textarea
					id="contact-message"
					bind:value={message}
					rows="3"
					class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
				></textarea>
			</div>

			<div class="space-y-2">
				<label class="flex items-start gap-2 cursor-pointer">
					<input
						type="checkbox"
						bind:checked={acceptTerms}
						class="mt-0.5 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
					/>
					<span class="text-xs text-gray-600">
						Acepto los <button
							type="button"
							class="text-primary hover:underline text-xs"
							>Términos y Condiciones de Uso</button
						>.</span
					>
				</label>
				<label class="flex items-start gap-2 cursor-pointer">
					<input
						type="checkbox"
						bind:checked={acceptPrivacy}
						class="mt-0.5 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
					/>
					<span class="text-xs text-gray-600"
						>Acepto la <button
							type="button"
							class="text-primary hover:underline text-xs"
							>Política de Privacidad</button
						>.</span
					>
				</label>
			</div>

			<div class="flex gap-2 pt-1">
				<button
					type="submit"
					disabled={isSubmitting ||
						!name ||
						!email ||
						!phone ||
						!acceptTerms ||
						!acceptPrivacy}
					class="flex-1 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isSubmitting ? 'Enviando...' : 'Contactar'}
				</button>
				<button
					type="button"
					on:click={handleWhatsApp}
					disabled={!phone}
					class="flex-1 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 15 15"
						fill="currentColor"
						class="inline"
					>
						<path
							d="M7.49874 1.5C9.25874 1.5 10.9187 2.27 12.0587 3.61C13.2187 4.97 13.6987 6.7 13.4187 8.5C13.0187 11.04 10.9487 13.07 8.38874 13.44C8.08874 13.48 7.78874 13.51 7.49874 13.51C6.36874 13.51 5.26874 13.19 4.30874 12.58L3.70874 12.2L3.03874 12.42L2.52874 12.59L2.94874 11.47L2.51874 10.83C1.71874 9.63 1.37874 8.24 1.54874 6.79C1.85874 4.04 4.17874 1.78 6.93874 1.53C7.12874 1.51 7.31874 1.5 7.50874 1.5M7.49874 0C7.26874 0 7.02874 0.00999997 6.78874 0.03C3.30874 0.35 0.43874 3.14 0.0487397 6.62C-0.16126 8.5 0.31874 10.25 1.26874 11.67L0.0387397 15L3.50874 13.84C4.66874 14.57 6.02874 15 7.49874 15C7.85874 15 8.22874 14.97 8.60874 14.92C11.7987 14.46 14.3987 11.91 14.8987 8.73C15.6387 4.05 12.0387 0 7.49874 0Z"
							fill="white"
						/>
					</svg>
					WhatsApp
				</button>
			</div>
		</form>
	{/if}
</div>
