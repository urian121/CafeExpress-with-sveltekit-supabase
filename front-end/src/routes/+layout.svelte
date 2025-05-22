<script>
	import "bootstrap/dist/css/bootstrap.min.css";
  	import "bootstrap-icons/font/bootstrap-icons.css";


	import Header from './Header.svelte';
	//import '../css/global.css';
	import '../css/home.css';
	import Footer from "$lib/components/Footer.svelte";

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<div class="container my-5">
	<Header />

	{@render children()}
</div>
	<Footer />


