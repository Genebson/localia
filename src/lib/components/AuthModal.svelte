<script lang="ts">
	import { X, Mail, Lock, User, Building2, Home, Eye, EyeOff } from 'lucide-svelte';
	import { auth, type UserRole } from '$lib/stores/auth';
	import { authModalMode } from '$lib/stores/authModal';
	import { onMount } from 'svelte';

	export let isOpen = false;
	export let onClose: () => void = () => {};

	let selectedRole: UserRole = 'user';
	let showPassword = false;

	let email = '';
	let password = '';
	let name = '';
	let matricula = '';
	let error = '';

	$: mode = $authModalMode;

	function switchMode() {
		authModalMode.set(mode === 'login' ? 'register' : 'login');
		error = '';
	}

	function selectRole(role: UserRole) {
		selectedRole = role;
	}

	async function handleSubmit() {
		error = '';

		if (!email || !password) {
			error = 'Completá todos los campos';
			return;
		}

		if (mode === 'register') {
			if (!name) {
				error = 'El nombre es obligatorio';
				return;
			}
			if (selectedRole === 'agent' && !matricula) {
				error = 'La matrícula profesional es obligatoria para agentes';
				return;
			}
			if (selectedRole === 'agent' && matricula.length < 5) {
				error = 'La matrícula debe tener al menos 5 caracteres';
				return;
			}
		}

		auth.login(email, password, selectedRole, name || undefined, matricula || undefined);
		onClose();
		resetForm();
	}

	function resetForm() {
		email = '';
		password = '';
		name = '';
		matricula = '';
		error = '';
		selectedRole = 'user';
		authModalMode.set('login');
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
									bind:value={matricula}
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
						class="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
					>
						{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
					</button>
				</form>

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
