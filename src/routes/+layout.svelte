<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';
	import '../css/home.css';

	import { onMount } from 'svelte';
	import { obtenerCarrito, eliminarDelCarrito } from '$lib/cartService.js';

	import Header from './Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ApiWhatApp from '$lib/components/ApiWhatApp.svelte';

	import BtnCart from '$lib/components/BtnCart.svelte';
	import { cerrarOffcanvas } from '$lib/stores/toggleOffcanvas';

	let { children } = $props();

	// Variables para el carrito
	let productosCarrito = $state([]);
	let subtotal = $state(0);

	// Cargar productos del carrito al iniciar
	onMount(async () => {
		await cargarProductosCarrito();
	});

	// Función para cargar los productos del carrito
	async function cargarProductosCarrito() {
		productosCarrito = await obtenerCarrito();
		console.log(productosCarrito);
		calcularSubtotal();
	}

	// Función para calcular el subtotal
	function calcularSubtotal() {
		subtotal = productosCarrito.reduce((total, item) => {
			return total + (item.products?.price || 0) * item.amount;
		}, 0);
	}

	// Función para eliminar un producto del carrito
	async function eliminarProducto(product_id) {
		const resultado = await eliminarDelCarrito(product_id);
		if (resultado.success) {
			// Actualizar la lista de productos
			await cargarProductosCarrito();
		}
	}
</script>

<BtnCart />

<div
	class="offcanvas offcanvas-end"
	data-bs-scroll="true"
	data-bs-backdrop="false"
	tabindex="-1"
	id="offcanvasRight"
	aria-labelledby="offcanvasRightLabel"
>
	<div class="offcanvas-header border-bottom">
		<h4 class="offcanvas-title w-100 text-center fw-bold">Carrito de compras</h4>
		<button
			type="button"
			class="btn-close"
			data-bs-dismiss="offcanvas"
			aria-label="Close"
			onclick={cerrarOffcanvas}
		></button>
	</div>

	<div class="offcanvas-body border-bottom">
		{#if productosCarrito.length === 0}
			<div class="text-center py-5">
				<i class="bi bi-cart-x fs-1 text-muted"></i>
				<p class="mt-3">El carrito está vacío</p>
			</div>
		{:else}
			{#each productosCarrito as item}
				<div class="container mb-3" id="item-cart">
					<div class="row align-items-center border-bottom py-2">
						<div class="col-3">
							<img
								src={item.products?.image || 'assets/imgs/product.png'}
								alt={item.products?.name || 'Producto'}
								class="img-fluid rounded"
							/>
						</div>
						<div class="col-6">
							<h6 class="mb-1 title-product">{item.products?.name || 'Producto sin nombre'}</h6>
						</div>
						<div class="col-3 text-end">
							<span class="fs-5">{item.amount}x</span>
							<strong class="fs-4 opacity-75">${item.products?.price || 0}</strong>
							<button
								aria-label="Borrar"
								class="btn btn-danger-cart mt-2"
								onclick={() => eliminarProducto(item.product_id)}
							>
								<i class="bi bi-trash3"></i>
							</button>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<div class="offcanvas-footer mt-4">
		<h5 class="justify-content-between mb-4">
			<span class="fw-bold px-3">SUBTOTAL:</span>
			<span class="fw-bold float-end px-2 fs-2"> ${subtotal.toFixed(2)} </span>
		</h5>
		<div class="text-center mb-5 px-3">
			<ApiWhatApp productos={productosCarrito} subtotalCarrito={subtotal} />
		</div>
	</div>
</div>

<div class="container my-5">
	<Header />

	{@render children()}
</div>

<Footer />
