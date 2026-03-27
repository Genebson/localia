<script lang="ts">
	import { X, Mail, Lock, User, Building2, Home, Eye, EyeOff } from 'lucide-svelte';
	import { auth } from '$lib/stores/auth';
	import { authModalMode } from '$lib/stores/authModal';
	import { signInWithGoogle } from '$lib/api/auth';
	import { base } from '$app/paths';

	export let isOpen = false;
	export let onClose: () => void = () => {};

	let selectedRole: 'seeker' | 'agent' = 'seeker';
	let showPassword = false;

	let email = '';
	let password = '';
	let name = '';
	let licenseNumber = '';
	let error = '';
	let isLoading = false;

	$: mode = $authModalMode;

	function switchMode() {
		authModalMode.set(mode === 'login' ? 'register' : 'login');
		error = '';
	}

	function selectRole(role: 'seeker' | 'agent') {
		selectedRole = role;
	}

	async function handleGoogleSignIn() {
		await signInWithGoogle(`${window.location.origin}${base}/`);
	}

	async function handleSubmit() {
		error = '';
		isLoading = true;

		try {
			if (!email || !password) {
				error = 'Completá todos los campos';
				return;
			}

			if (mode === 'register') {
				if (!name) {
					error = 'El nombre es obligatorio';
					return;
				}
				if (selectedRole === 'agent' && !licenseNumber) {
					error = 'La matrícula profesional es obligatoria para agentes';
					return;
				}
				if (selectedRole === 'agent' && licenseNumber.length < 5) {
					error = 'La matrícula debe tener al menos 5 caracteres';
					return;
				}
			}

			await auth.login(email, password, selectedRole, name || undefined, licenseNumber || undefined);
			onClose();
			resetForm();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error al iniciar sesión';
		} finally {
			isLoading = false;
		}
	}

	function resetForm() {
		email = '';
		password = '';
		name = '';
		licenseNumber = '';
		error = '';
		selectedRole = 'seeker';
		authModalMode.set('login');
		isLoading = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		on:keydown={handleKeydown}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="absolute inset-0 bg-black/60 backdrop-blur-sm"
			on:click={onClose}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Escape' && onClose()}
		></div>

		<div
			class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
		>
			<button
				on:click={onClose}
				class="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
				aria-label="Cerrar"
			>
				<X class="w-5 h-5 text-gray-500" />
			</button>

			<div class="p-8">
				<div class="text-center mb-6">
					<h2 class="text-2xl font-bold text-gray-900">
						{mode === 'login' ? 'Bienvenido' : 'Crear cuenta'}
					</h2>
					<p class="text-gray-500 mt-1">
						{mode === 'login' ? 'Ingresá a tu cuenta' : 'Unite a Localia'}
					</p>
				</div>

				{#if mode === 'register'}
					<div class="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
						<button
							type="button"
							on:click={() => selectRole('user')}
							class="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 {selectedRole ===
							'user'
								? 'bg-primary text-white'
								: 'text-gray-600 hover:text-gray-900'}"
						>
							<Home class="w-4 h-4" />
							Buscador
						</button>
						<button
							type="button"
							on:click={() => selectRole('agent')}
							class="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 {selectedRole ===
							'agent'
								? 'bg-primary text-white'
								: 'text-gray-600 hover:text-gray-900'}"
						>
							<Building2 class="w-4 h-4" />
							Agente
						</button>
					</div>
				{/if}

				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					{#if mode === 'register'}
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1"
								>Nombre completo</label
							>
							<div class="relative">
								<User
									class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
								/>
								<input
									type="text"
									bind:value={name}
									placeholder="Tu nombre"
									class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
								/>
							</div>
						</div>
					{/if}

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<div class="relative">
							<Mail
								class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
							/>
							<input
								type="email"
								bind:value={email}
								placeholder="tu@email.com"
								class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
							/>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1"
							>Contraseña</label
						>
						<div class="relative">
							<Lock
								class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
							/>
							{#if showPassword}
								<input
									type="text"
									bind:value={password}
									placeholder="••••••••"
									class="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
								/>
							{:else}
								<input
									type="password"
									bind:value={password}
									placeholder="••••••••"
									class="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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

					{#if mode === 'login'}
						<div class="text-right">
							<a
								href="{base}/olvide-mi-contrasena"
								class="text-sm text-primary hover:text-primary-light"
								on:click={onClose}
							>
								¿Olvidaste tu contraseña?
							</a>
						</div>
					{/if}

					{#if mode === 'register' && selectedRole === 'agent'}
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Matrícula profesional
								<span class="text-xs text-gray-400">(validación manual)</span>
							</label>
							<div class="relative">
								<Building2
									class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
								/>
								<input
									type="text"
									bind:value={licenseNumber}
									placeholder="ej: COL-2024-12345"
									class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
								/>
							</div>
							<p class="text-xs text-gray-400 mt-1">
								Tu matrícula será verificada por nuestro equipo
							</p>
						</div>
					{/if}

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
							{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
						{/if}
					</button>
				</form>

				<div class="mt-6">
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-gray-200"></div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="px-2 bg-white text-gray-500">O continuá con</span>
						</div>
					</div>
				</div>

				<button
					type="button"
					on:click={handleGoogleSignIn}
					class="w-full mt-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-200 transition-colors flex items-center justify-center gap-3"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24">
						<path
							fill="#4285F4"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="#EA4335"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					Continuar con Google
				</button>

				<div class="mt-6 text-center">
					<p class="text-gray-500 text-sm">
						{mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}
						<button
							type="button"
							on:click={switchMode}
							class="text-primary hover:text-primary-light font-medium"
						>
							{mode === 'login' ? 'Crear una' : 'Iniciá sesión'}
						</button>
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}
