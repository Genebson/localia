<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Menu, X, User, LogOut, Building2, ChevronDown } from 'lucide-svelte';
	import { auth, isAgent, currentUser } from '$lib/stores/auth';
	import { filters } from '$lib/stores/filters';
	import { base } from '$app/paths';
	import { openAuthModal } from '$lib/stores/authModal';

	let isMenuOpen = false;
	let isScrolled = false;
	let isUserMenuOpen = false;

	function handleScroll() {
		isScrolled = window.scrollY > 20;
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function toggleUserMenu() {
		isUserMenuOpen = !isUserMenuOpen;
	}

	function handleLogout() {
		auth.logout();
		isUserMenuOpen = false;
	}

	function setOperation(operation: 'buy' | 'rent' | 'all') {
		filters.setOperation(operation);
		isMenuOpen = false;
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function handleWindowClick(e: MouseEvent) {
		if (isUserMenuOpen && e.target instanceof Element && !e.target.closest('.user-menu')) {
			isUserMenuOpen = false;
		}
	}
</script>

<svelte:window on:click={handleWindowClick} />

<header
	class="fixed top-0 left-0 right-0 z-40 transition-all duration-200 {isScrolled
		? 'bg-white/95 backdrop-blur-md shadow-sm'
		: 'bg-transparent'}"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 md:h-20">
			<a href="{base}/" class="flex items-center gap-2">
				<img src="/localia/localia.svg" alt="Localia" class="h-10 w-10 object-contain" />
				<span class="text-xl font-bold text-primary">Localia</span>
			</a>

			<nav class="hidden md:flex items-center gap-4">
				{#if $isAgent}
					<a
						href="{base}/publicar"
						class="px-4 py-2 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
					>
						Publicar propiedad
					</a>
				{/if}

				{#if $currentUser}
					<div class="relative user-menu">
						<button
							on:click={toggleUserMenu}
							class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<div
								class="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
							>
								{#if $currentUser.role === 'agent'}
									<Building2 class="w-4 h-4 text-white" />
								{:else}
									<User class="w-4 h-4 text-white" />
								{/if}
							</div>
							<span class="text-gray-700 font-medium">{$currentUser.name}</span>
							<ChevronDown class="w-4 h-4 text-gray-400" />
						</button>

						{#if isUserMenuOpen}
							<div
								class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
							>
								<div class="px-4 py-2 border-b border-gray-100">
									<p class="text-sm font-medium text-gray-900">
										{$currentUser.name}
									</p>
									<p class="text-xs text-gray-500">{$currentUser.email}</p>
									{#if $currentUser.matricula}
										<p class="text-xs text-accent mt-1">
											Matrícula: {$currentUser.matricula}
										</p>
									{/if}
								</div>
								<a
									href="{base}/perfil"
									on:click={() => (isUserMenuOpen = false)}
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
								>
									Mi Perfil
								</a>
								{#if $isAgent}
									<a
										href="{base}/mis-propiedades"
										on:click={() => (isUserMenuOpen = false)}
										class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
									>
										Mis Propiedades
									</a>
								{/if}
								<div class="border-t border-gray-100 my-1"></div>
								<a
									href="{base}/masterplan"
									on:click={() => (isUserMenuOpen = false)}
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
								>
									Masterplan
								</a>
								<a
									href="{base}/tablero"
									on:click={() => (isUserMenuOpen = false)}
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
								>
									Tablero de Búsquedas
								</a>
								{#if $isAgent}
									<a
										href="{base}/furnisher"
										on:click={() => (isUserMenuOpen = false)}
										class="block px-4 py-2 m-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
									>
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-2">
												<span class="text-lg">✨</span>
												<span class="font-semibold">Furnisher</span>
											</div>
											<span
												class="text-xs bg-white/20 px-2 py-0.5 rounded-full"
												>Nuevo</span
											>
										</div>
									</a>
									<a
										href="{base}/chepibe"
										on:click={() => (isUserMenuOpen = false)}
										class="block px-4 py-2 m-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
									>
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-2">
												<span>💬</span>
												<span class="font-semibold">ChePibe</span>
											</div>
											<span
												class="text-xs bg-white/20 px-2 py-0.5 rounded-full"
												>Nuevo</span
											>
										</div>
									</a>
								{/if}
								<div class="border-t border-gray-100 my-1"></div>
								<button
									on:click={handleLogout}
									class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
								>
									<LogOut class="w-4 h-4" />
									Cerrar sesión
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<div class="flex items-center gap-2">
						<button
							on:click={() => openAuthModal('login')}
							class="px-4 py-2 text-primary hover:bg-primary/5 font-medium rounded-lg transition-colors"
						>
							Iniciar sesión
						</button>
						<button
							on:click={() => openAuthModal('register')}
							class="px-4 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
						>
							Registrarse
						</button>
					</div>
				{/if}
			</nav>

			<button
				on:click={toggleMenu}
				class="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
				aria-label="Menu"
			>
				{#if isMenuOpen}
					<X class="w-6 h-6 text-gray-700" />
				{:else}
					<Menu class="w-6 h-6 text-gray-700" />
				{/if}
			</button>
		</div>
	</div>

	{#if isMenuOpen}
		<div class="md:hidden bg-white border-t border-gray-100 shadow-lg">
			<nav class="px-4 py-4 space-y-3">
				{#if $isAgent}
					<a
						href="{base}/publicar"
						on:click={() => (isMenuOpen = false)}
						class="block py-3 bg-accent text-white font-semibold text-center rounded-lg"
					>
						Publicar propiedad
					</a>
				{/if}

				{#if $currentUser}
					<div class="pt-3 border-t border-gray-100">
						<div class="flex items-center gap-3 mb-3">
							<div
								class="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
							>
								{#if $currentUser.role === 'agent'}
									<Building2 class="w-5 h-5 text-white" />
								{:else}
									<User class="w-5 h-5 text-white" />
								{/if}
							</div>
							<div>
								<p class="font-medium text-gray-900">{$currentUser.name}</p>
								<p class="text-sm text-gray-500">{$currentUser.email}</p>
							</div>
						</div>
						<a
							href="{base}/perfil"
							on:click={() => (isMenuOpen = false)}
							class="block py-2 text-gray-700">Mi Perfil</a
						>
						{#if $isAgent}
							<a
								href="{base}/mis-propiedades"
								on:click={() => (isMenuOpen = false)}
								class="block py-2 text-gray-700">Mis Propiedades</a
							>
						{/if}
						<div class="border-t border-gray-100 my-2"></div>
						<a
							href="{base}/masterplan"
							on:click={() => (isMenuOpen = false)}
							class="block py-2 text-gray-700">Masterplan</a
						>
						<a
							href="{base}/tablero"
							on:click={() => (isMenuOpen = false)}
							class="block py-2 text-gray-700">Tablero de Búsquedas</a
						>
						{#if $isAgent}
							<a
								href="{base}/furnisher"
								on:click={() => (isMenuOpen = false)}
								class="block py-2 px-3 mx-0 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold text-center"
							>
								✨ Furnisher <span
									class="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1"
									>Nuevo</span
								>
							</a>
							<a
								href="{base}/chepibe"
								on:click={() => (isMenuOpen = false)}
								class="block py-2 px-3 mx-0 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold text-center"
							>
								💬 ChePibe <span
									class="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1"
									>Nuevo</span
								>
							</a>
						{/if}
						<div class="border-t border-gray-100 my-2"></div>
						<button
							on:click={handleLogout}
							class="block py-2 text-red-600 w-full text-left"
						>
							Cerrar sesión
						</button>
					</div>
				{:else}
					<div class="pt-3 border-t border-gray-100 space-y-2">
						<button
							on:click={() => {
								openAuthModal('login');
								isMenuOpen = false;
							}}
							class="block w-full py-3 border-2 border-primary text-primary font-semibold text-center rounded-lg"
						>
							Iniciar sesión
						</button>
						<button
							on:click={() => {
								openAuthModal('register');
								isMenuOpen = false;
							}}
							class="block w-full py-3 bg-primary text-white font-semibold text-center rounded-lg"
						>
							Registrarse
						</button>
					</div>
				{/if}
			</nav>
		</div>
	{/if}
</header>
