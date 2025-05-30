<script>
	import { onMount } from 'svelte';
	import { mostrarOcultarOffcanvas } from '$lib/stores/toggleOffcanvas';
	import { obtenerTotalProductos } from '$lib/services/cartService';
	import { cartCount } from '$lib/stores/cartCountStore';

	// Función para mostrar/ocultar offcanvas y actualizar contador
	async function abrirCarrito() {
		// Actualizar contador antes de mostrar
		await obtenerTotalProductos();
		mostrarOcultarOffcanvas();
	}

	// Cargar contador inicial
	onMount(async () => {
		await obtenerTotalProductos();
	});
</script>

<!-- Botón del carrito -->
<button
	type="button"
	class="btn position-relative btn-icon-cart"
	aria-label="Carrito de compras"
	onclick={abrirCarrito}
>
	<i class="bi bi-cart"></i>
	<span
	class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
	>
	{$cartCount || 0}
	</span>
</button>
