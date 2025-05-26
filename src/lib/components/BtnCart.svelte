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
	class="btn position-relative border rounded"
	aria-label="Carrito de compras"
	onclick={abrirCarrito}
	style="width: 40px; height: 40px;"
>
	<i class="bi bi-cart"></i>
	<span
	class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
	>
	{$cartCount || 0}
	</span>
</button>
