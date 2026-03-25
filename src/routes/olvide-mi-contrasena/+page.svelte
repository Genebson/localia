<script lang="ts">
	import { Mail, ArrowLeft } from 'lucide-svelte';
	import { requestPasswordReset } from '$lib/api/auth';
	import { base } from '$app/paths';

	let email = '';
	let success = false;
	let isLoading = false;
	let error = '';

	async function handleSubmit() {
		if (!email) return;
		isLoading = true;
		error = '';
		try {
			await requestPasswordReset(email);
			success = true;
		} catch {
			error = 'Ocurrió un error. Intentá de nuevo.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Olvidé mi contraseña | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background flex items-center justify-center px-4">
	<div class="w-full max-w-md">
		<a href="{base}/" class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
			<ArrowLeft class="w-4 h-4" />
			Volver al inicio
		</a>

		<div class="bg-white rounded-2xl shadow-sm p-8">
			{#if success}
				<div class="text-center">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Mail class="w-8 h-8 text-green-600" />
					</div>
					<h1 class="text-2xl font-bold text-gray-900 mb-2">Revisá tu correo</h1>
					<p class="text-gray-500 mb-6">
						Si tu email está registrado, recibirás un enlace para restablecer tu contraseña.
					</p>
					<a
						href="{base}/"
						class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
					>
						Volver al inicio
					</a>
				</div>
			{:else}
				<div class="text-center mb-6">
					<h1 class="text-2xl font-bold text-gray-900 mb-2">Olvidé mi contraseña</h1>
					<p class="text-gray-500">
						Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
					</p>
				</div>

				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email</label>
						<div class="relative">
							<Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								id="email"
								type="email"
								bind:value={email}
								placeholder="tu@email.com"
								class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
								required
							/>
						</div>
					</div>

					{#if error}
						<p class="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
					{/if}

					<button
						type="submit"
						disabled={isLoading}
						class="w-full py-3 bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
					>
						{#if isLoading}
							<span class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
							Enviando...
						{:else}
							Enviar enlace
						{/if}
					</button>
				</form>

				<div class="mt-6 text-center">
					<p class="text-gray-500 text-sm">
						¿Recordaste tu contraseña?
						<a href="{base}/" class="text-primary hover:text-primary-light font-medium">
							Iniciá sesión
						</a>
					</p>
				</div>
			{/if}
		</div>
	</div>
</main>
