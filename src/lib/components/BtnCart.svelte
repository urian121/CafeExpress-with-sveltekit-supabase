<script>
	import { mostrarOcultarOffcanvas } from '$lib/stores/toggleOffcanvas';
	import { onMount } from 'svelte';
	import { obtenerTotalProductos } from '$lib/cartService';
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
<div class="position-relative">
	<button
		type="button"
		class="btn btn_shopping cart-badge position-fixed top-0 end-0 me-4 mt-3 swing-on-hover border bg-white"
		aria-label="Carrito de compras"
		onclick={abrirCarrito}
	>
		<i class="bi bi-bag-heart"></i>
		<span
			id="contador-carrito"
			class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger"
		>
			{$cartCount || 0}
		</span>
	</button>
</div>
