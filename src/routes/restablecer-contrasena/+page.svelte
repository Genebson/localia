<script lang="ts">
	import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-svelte';
	import { resetPassword } from '$lib/api/auth';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	let token = '';
	let password = '';
	let confirmPassword = '';
	let showPassword = false;
	let showConfirmPassword = false;
	let success = false;
	let isLoading = false;
	let error = '';

	$: {
		token = $page.url.searchParams.get('token') ?? '';
	}

	function validatePasswords(): boolean {
		if (password.length < 8) {
			error = 'La contraseña debe tener al menos 8 caracteres.';
			return false;
		}
		if (password !== confirmPassword) {
			error = 'Las contraseñas no coinciden.';
			return false;
		}
		return true;
	}

	async function handleSubmit() {
		error = '';
		if (!token) {
			error = 'Token no proporcionado';
			return;
		}
		if (!validatePasswords()) return;
		isLoading = true;
		try {
			await resetPassword(token, password);
			success = true;
			setTimeout(() => goto(`${base}/`), 2000);
		} catch (e) {
			error = e instanceof Error ? e.message : 'El enlace ha expirado o ya fue utilizado.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Restablecer contraseña | Localia</title>
</svelte:head>

<main class="pt-16 md:pt-20 min-h-screen bg-background flex items-center justify-center px-4">
	<div class="w-full max-w-md">
		<a href="{base}/" class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
			<ArrowLeft class="w-4 h-4" />
			Volver al inicio
		</a>

		<div class="bg-white rounded-2xl shadow-sm p-8">
			{#if !token}
				<div class="text-center">
					<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Lock class="w-8 h-8 text-red-600" />
					</div>
					<h1 class="text-2xl font-bold text-gray-900 mb-2">Token no proporcionado</h1>
					<p class="text-gray-500 mb-6">
						El enlace de restablecimiento no es válido o ha expirado.
					</p>
					<a
						href="{base}/olvide-mi-contrasena"
						class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
					>
						Solicitar nuevo enlace
					</a>
				</div>
			{:else if success}
				<div class="text-center">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Lock class="w-8 h-8 text-green-600" />
					</div>
					<h1 class="text-2xl font-bold text-gray-900 mb-2">Contraseña actualizada</h1>
					<p class="text-gray-500 mb-6">
						Ya podés iniciar sesión con tu nueva contraseña.
					</p>
					<a
						href="{base}/"
						class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors"
					>
						Iniciar sesión
					</a>
				</div>
			{:else}
				<div class="text-center mb-6">
					<h1 class="text-2xl font-bold text-gray-900 mb-2">Nueva contraseña</h1>
					<p class="text-gray-500">
						Ingresá tu nueva contraseña.
					</p>
				</div>

				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1" for="password">Nueva contraseña</label>
						<div class="relative">
							<Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							{#if showPassword}
								<input
									id="password"
									type="text"
									bind:value={password}
									placeholder="Mínimo 8 caracteres"
									class="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
									required
								/>
							{:else}
								<input
									id="password"
									type="password"
									bind:value={password}
									placeholder="Mínimo 8 caracteres"
									class="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
									required
								/>
							{/if}
							<button
								type="button"
								on:click={() => (showPassword = !showPassword)}
								class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{#if showPassword}
									<EyeOff class="w-5 h-5" />
								{:else}
									<Eye class="w-5 h-5" />
								{/if}
							</button>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1" for="confirm-password">Confirmar contraseña</label>
						<div class="relative">
							<Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							{#if showConfirmPassword}
								<input
									id="confirm-password"
									type="text"
									bind:value={confirmPassword}
									placeholder="Repetí tu contraseña"
									class="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
									required
								/>
							{:else}
								<input
									id="confirm-password"
									type="password"
									bind:value={confirmPassword}
									placeholder="Repetí tu contraseña"
									class="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
									required
								/>
							{/if}
							<button
								type="button"
								on:click={() => (showConfirmPassword = !showConfirmPassword)}
								class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{#if showConfirmPassword}
									<EyeOff class="w-5 h-5" />
								{:else}
									<Eye class="w-5 h-5" />
								{/if}
							</button>
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
							Guardando...
						{:else}
							Restablecer contraseña
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</div>
</main>
