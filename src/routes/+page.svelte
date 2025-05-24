<script>
import { onMount } from 'svelte';
import { obtenerProductos, agregarAlCarrito } from '$lib/cartService.js';
import SkeletonCards from '$lib/components/SkeletonCards.svelte';

import "../css/skeleton.css";

let productos = [];
let error = null;
let loading = true;

onMount(async () => {
  const { data, error: err } = await obtenerProductos();
  if (err) {
    error = err.message;
  } else {
    productos = data;
  }
  loading = false;
});
</script>

<svelte:head>
  <title>Kiosco CafeExpress en SvelteKit, PHP, MySQL (Supabase)</title>
  <meta name="description" content="Kiosco CafeExpress en SvelteKit, PHP, MySQL (Supabase)" />
</svelte:head>

{#if loading}
  <!-- Skeleton Cards -->
  <SkeletonCards />

{:else if error}
  <div class="alert alert-danger">Error de conexión: {error}</div>

{:else}
  <!-- Cards reales -->
  <div class="row g-4">
    {#each productos as producto (producto.id)}
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 border-0 custom-item-card">
          <img src={producto.image} alt={producto.name} class="card-img-top">
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">{producto.name}</h6>
            <p class="card-text">Categoría: <strong>{producto.category}</strong></p>
            <p class="card-text">Precio: <strong class="text-success fs-5">${producto.price}</strong></p>
            <button class="btn btn-order mt-auto w-100" onclick={() => agregarAlCarrito(producto.id)}>
              Ordenar ahora <i class="bi bi-bag-plus"></i>
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}