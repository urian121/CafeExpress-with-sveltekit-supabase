<script>
import { onMount } from 'svelte';
import { obtenerProductos, crearManejadorCarrito } from '$lib/cartService.js';
import SkeletonCards from '$lib/components/SkeletonCards.svelte';

import "../css/skeleton.css";

let productos = [];
let error = null;
let loading = true;
let showSkeleton = true; // Nuevo estado para controlar el esqueleto
let loadedImages = new Set(); // Para trackear imágenes cargadas
let loadingButtons = new Set(); // Estado para controlar qué botón está cargando


// Función para disparar reactividad del Set
const triggerLoadingUpdate = () => {
  loadingButtons = loadingButtons;
};

// Crear el manejador del carrito con el estado de carga
const manejarAgregarAlCarrito = crearManejadorCarrito(loadingButtons, triggerLoadingUpdate);

onMount(async () => {
  // Mostramos el esqueleto durante 3 segundos
  setTimeout(() => {
    showSkeleton = false;
  }, 500);

  const { data, error: err } = await obtenerProductos();
  if (err) {
    error = err.message;
  } else {
    productos = data;
  }
  loading = false;
});

// Función para manejar cuando una imagen se carga
function handleImageLoad(productoId) {
  loadedImages.add(productoId);
  loadedImages = loadedImages; // Trigger reactivity en Svelte 5
}
</script>

<svelte:head>
  <title>Kiosco CafeExpress en SvelteKit y Supabase</title>
  <meta name="description" content="Kiosco CafeExpress en SvelteKit y Supabase" />
</svelte:head>

{#if showSkeleton || loading}
  <SkeletonCards />
{:else}
  <div class="row g-4">
    {#each productos as producto (producto.id)}
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 border-0 custom-item-card">
          <img 
            src={producto.image}
            alt={producto.name}
            class="card-img-top fade-in {loadedImages.has(producto.id) ? 'loaded' : ''}"
            onload={() => handleImageLoad(producto.id)}
            loading="lazy"
          >
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">{producto.name}</h6>
            <p class="card-text">Categoría: <strong>{producto.category}</strong></p>
            <p class="card-text">Precio: <strong class="text-success fs-5">${producto.price}</strong></p>
            <button 
                class="btn btn-order mt-auto w-100" 
                class:loading={loadingButtons.has(producto.id)}
                disabled={loadingButtons.has(producto.id)}
                onclick={() => manejarAgregarAlCarrito(producto.id)}
              >
              {#if loadingButtons.has(producto.id)}
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Agregando...
              {:else}
                Ordenar ahora <i class="bi bi-bag-plus"></i>
              {/if}
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
<style>
/* Fade-in animation para imágenes */
.fade-in {
	opacity: 0;
	transition: opacity 0.5s ease-in;
}
.fade-in.loaded {
  opacity: 1;
}
</style>