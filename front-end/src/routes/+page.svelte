<script>
const productos = (async () => {
  const URL = 'https://devsapihub.com/api-fast-food';
  try {
    const response = await fetch(URL);
    const data = await response.json();
	return data; 
  } catch (err) {
    console.log('Error al cargar la API:', err);
  } finally {
    console.log('Carga de API finalizada');
  }
})();
</script>

<svelte:head>
	<title>Kiosco CafeExpress en SvelteKit, PHP, MySQL (Supabase)</title>
	<meta name="description" content="Kiosco CafeExpress en SvelteKit, PHP, MySQL (Supabase)" />
</svelte:head>
  
	<div class="row g-4">
	  {#await productos}
		<div class="loader-container">
		  <div class="loader">Cargando...</div>
		</div>
	  {:then data}
		{#each data as producto (producto.id)}
		  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
			<div class="card h-100 border-0">
			  <img src={producto.image} alt={producto.name} class="card-img-top">
			  <div class="card-body d-flex flex-column">
				<h6 class="card-title">{producto.name}</h6>
				<p class="card-text">Categoría: <strong>{producto.category}</strong></p>
				<p class="card-text">Precio: <strong class="text-success">{producto.price}</strong></p>
				<button class="btn btn-order mt-auto w-100">
				  Ordenar ahora <i class="bi bi-bag-plus"></i>
				</button>
			  </div>
			</div>
		  </div>
		{/each}
	  {/await}
	</div>
  