<script>
	import "bootstrap/dist/css/bootstrap.min.css";
  	import "bootstrap-icons/font/bootstrap-icons.css";

	import Header from './Header.svelte';
	import '../css/global.css';
	import '../css/home.css';
	import Footer from "$lib/components/Footer.svelte";


	import Cart from "$lib/components/Cart.svelte";
	import OffcanvasHeader from "$lib/components/OffcanvasHeader.svelte";

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<Cart />

<div
  class="offcanvas offcanvas-end"
  tabindex="-1"
  id="offcanvasRight"
  aria-labelledby="offcanvasRightLabel"
>
  <OffcanvasHeader />

  <div class="offcanvas-body border-bottom">
   lista de productos
  </div>

  <div class="offcanvas-footer mt-4">
    subtotal
    <div class="text-center mb-5 px-3">
      api whatsa
    </div>
  </div>
</div>

<div class="container my-5">
	<Header />

	{@render children()}
</div>



<Footer />


