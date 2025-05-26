<script>
import { onMount } from 'svelte';
import { obtenerProductos, crearManejadorCarrito } from '$lib/services/cartService.js';
import SkeletonCards from '$lib/components/SkeletonCards.svelte';
import { searchTerm } from '$lib/stores/searchStore'; // Import the store

import "../css/skeleton.css";

let productos = [];
let loading = true;
let showSkeleton = true; // Nuevo estado para controlar el esqueleto
let loadedImages = new Set(); // Para trackear imágenes cargadas
let loadingButtons = new Set(); // Estado para controlar qué botón está cargando
let error = null; // State to hold error messages

// Función para disparar reactividad del Set
const triggerLoadingUpdate = () => {
  loadingButtons = loadingButtons;
};

// Crear el manejador del carrito con el estado de carga
const manejarAgregarAlCarrito = crearManejadorCarrito(loadingButtons, triggerLoadingUpdate);

onMount(async () => {
  // Mostramos el esqueleto durante 0.5 seconds
  setTimeout(() => {
    showSkeleton = false;
  }, 500);

  const { data, error: err } = await obtenerProductos();
  if (err) {
    error = err.message;
    loading = false; // Set loading to false even if there's an error
  } else {
    productos = data;
    loading = false;
  }
});

// Function to handle image loading
function handleImageLoad(productoId) {
  loadedImages.add(productoId);
  loadedImages = loadedImages; // Trigger reactivity in Svelte 5
}

// Function to normalize strings (remove accents and convert to lowercase)
function normalizeString(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Reactive block to filter products based on searchTerm
$: filteredProductos = productos.filter(producto => {
  const normalizedSearch = normalizeString($searchTerm);
  const normalizedProductName = normalizeString(producto.name);

  // Filter by normalized product name (case-insensitive and accent-insensitive)
  return normalizedProductName.includes(normalizedSearch);
});
</script>

<svelte:head>
  <title>Kiosco CafeExpress en SvelteKit y Supabase</title>
  <meta name="description" content="Kiosco CafeExpress en SvelteKit y Supabase" />
</svelte:head>

{#if showSkeleton || loading}
  <SkeletonCards />
{:else if error}
  <div class="alert alert-danger" role="alert">
    Error al cargar productos: {error}
  </div>
{:else}
  <div class="row g-4">
    {#each filteredProductos as producto (producto.id)} 
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