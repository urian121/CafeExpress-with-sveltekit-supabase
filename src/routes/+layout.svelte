<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';
	import '../css/home.css';

	import { onMount } from 'svelte';
	import { useScrollToTop } from '$lib/hooks/useScrollToTop';
	import { showFooter } from '$lib/stores/visibilityStore'; 
	import { cartStore, cartSubtotal, eliminarProductoDelCarrito, cargarCarrito } from '$lib/stores/cartStore';

	import Nav from '../lib/components/Nav.svelte'
	import Header from './Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ApiWhatApp from '$lib/components/ApiWhatApp.svelte';
	import { cerrarOffcanvas } from '$lib/stores/toggleOffcanvas';

	let { children } = $props();

	const { showButton, scrollToTop, init } = useScrollToTop();

	onMount(() => {
		cargarCarrito();
		const cleanup = init();
		return cleanup;
	});
</script>

<Nav/>


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
		{#if $cartStore.length === 0}
			<div class="text-center py-5">
				<i class="bi bi-cart-x fs-1 text-muted"></i>
				<p class="mt-3">El carrito está vacío</p>
			</div>
		{:else}
			{#each $cartStore as item}
				<div class="container mb-3" id="item-cart" key={item.id}>
					<div class="row align-items-center border-bottom py-2">
						<div class="col-3">
							<img
								src={item.products.image}
								alt={item.products.name}
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
								onclick={() => eliminarProductoDelCarrito(item.product_id)}
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
			<span class="fw-bold float-end px-2 fs-2"> ${$cartSubtotal.toFixed(2)} </span>
		</h5>
		<div class="text-center mb-5 px-3">
			<ApiWhatApp productos={$cartStore} subtotalCarrito={$cartSubtotal} />
		</div>
	</div>
</div>

<div class="container my-5">
	<Header />

	{@render children()}
</div>

{#if $showButton}
<button
  aria-label="Volver arriba"
  class="scroll-to-top d-flex align-items-center justify-content-center border-0 {showButton ? 'visible' : ''}"
  title="Volver arriba"
  onclick={scrollToTop}
>
  <i class="bi bi-arrow-up-short"></i>
</button>
{/if}

{#if $showFooter}
<Footer />
{/if}