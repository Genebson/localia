<script lang="ts">
	import { Home, Mail, Phone, Instagram, Facebook, Linkedin } from 'lucide-svelte';
</script>

<footer class="bg-primary text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
			<div class="lg:col-span-1">
				<a href="/" class="flex items-center gap-2 mb-4">
					<div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
						<Home class="w-5 h-5 text-primary" />
					</div>
					<span class="text-xl font-bold">Localia</span>
				</a>
				<p class="text-blue-200 text-sm leading-relaxed">
					Tu próximo hogar está en Localia. Encontrá casas, departamentos y más en las mejores zonas.
				</p>
			</div>

			<div>
				<h3 class="font-semibold mb-4">Explorar</h3>
				<ul class="space-y-2.5 text-blue-200 text-sm">
					<li><a href="#" class="hover:text-white transition-colors">Comprar</a></li>
					<li><a href="#" class="hover:text-white transition-colors">Alquilar</a></li>
					<li><a href="/publicar" class="hover:text-white transition-colors">Publicar propiedad</a></li>
					<li><a href="#" class="hover:text-white transition-colors">Agentes</a></li>
				</ul>
			</div>

			<div>
				<h3 class="font-semibold mb-4">Empresa</h3>
				<ul class="space-y-2.5 text-blue-200 text-sm">
					<li><a href="#" class="hover:text-white transition-colors">Sobre nosotros</a></li>
					<li><a href="#" class="hover:text-white transition-colors">Términos y condiciones</a></li>
					<li><a href="#" class="hover:text-white transition-colors">Política de privacidad</a></li>
					<li><a href="#" class="hover:text-white transition-colors">Contacto</a></li>
				</ul>
			</div>

			<div>
				<h3 class="font-semibold mb-4">Contacto</h3>
				<ul class="space-y-3 text-blue-200 text-sm">
					<li class="flex items-center gap-2">
						<Mail class="w-4 h-4" />
						<a href="mailto:hola@localia.com" class="hover:text-white transition-colors">hola@localia.com</a>
					</li>
					<li class="flex items-center gap-2">
						<Phone class="w-4 h-4" />
						<a href="tel:+541145678900" class="hover:text-white transition-colors">+54 11 4567 8900</a>
					</li>
				</ul>
				<div class="flex gap-3 mt-4">
					<a href="#" class="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors" aria-label="Instagram">
						<Instagram class="w-5 h-5" />
					</a>
					<a href="#" class="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors" aria-label="Facebook">
						<Facebook class="w-5 h-5" />
					</a>
					<a href="#" class="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors" aria-label="LinkedIn">
						<Linkedin class="w-5 h-5" />
					</a>
				</div>
			</div>
		</div>

		<div class="border-t border-white/10 mt-10 pt-8 text-center text-blue-200 text-sm">
			<p>© 2026 Localia. Todos los derechos reservados.</p>
		</div>
	</div>
</footer>
