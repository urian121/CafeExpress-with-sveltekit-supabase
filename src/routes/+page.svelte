<script>
  import { onMount } from 'svelte';
  import { obtenerProductos, crearManejadorCarrito } from '$lib/services/cartService.js';
  import SkeletonCards from '$lib/components/SkeletonCards.svelte';
  import { searchTerm } from '$lib/stores/searchStore';
  import { showFooter } from '$lib/stores/visibilityStore'; 
  import "../css/skeleton.css";
  
  let productos = [];
  let loading = true;
  let showSkeleton = true; // Nuevo estado para controlar el esqueleto
  let loadedImages = new Set(); // Para trackear imágenes cargadas
  let loadingButtons = new Set(); // Estado para controlar qué botón está cargando
  let error = null; // State to hold error messages
  
  // Estados para la búsqueda
  let isSearching = false;
  let searchTimeout;
  let filteredProductos = [];
  
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
      filteredProductos = data; // Inicializar productos filtrados
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
  
  // Función para filtrar productos con delay
  function filterProductos(searchValue) {
    const normalizedSearch = normalizeString(searchValue);
    
    if (normalizedSearch === '') {
      return productos; // Retornar todos los productos si no hay búsqueda
    }
    
    return productos.filter(producto => {
      const normalizedProductName = normalizeString(producto.name);
      return normalizedProductName.includes(normalizedSearch);
    });
  }
  
  // Reactive block para manejar la búsqueda con debounce
  $: {
    if (productos.length > 0) { // Solo procesar si ya tenemos productos cargados
      clearTimeout(searchTimeout);
      const trimmedSearchTerm = $searchTerm.trim();

      if (trimmedSearchTerm.length <= 2) {
        // Si hay 2 o menos caracteres, o está vacío, mostrar todos los productos y no buscar.
        isSearching = false;
        filteredProductos = productos;
      } else {
        // Si hay más de 2 caracteres, proceder con la búsqueda y el debounce.
        isSearching = true;
        searchTimeout = setTimeout(() => {
          filteredProductos = filterProductos(trimmedSearchTerm);
          isSearching = false;
        }, 400); // 300ms de delay para simular búsqueda
      }
    }
  }
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
  <!-- Contenido principal después de la carga inicial y sin errores -->

  <!-- Indicador de carga para la búsqueda -->
  {#if isSearching}
    <div class="d-flex justify-content-center align-items-center" style="min-height: 80px;">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Buscando...</span>
        </div>
        <p class="text-muted">Buscando productos...</p>
      </div>
    </div>
  {/if}

  <!-- Lista de productos o mensajes alternativos -->
  {#if filteredProductos.length > 0}
  { showFooter.set(true) }
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
  {:else if !isSearching && $searchTerm.trim() !== ''}
  { showFooter.set(false) }
    <div class="text-center py-5">
      <div class="mb-4">
        <i class="bi bi-search fs-1 text-muted"></i>
      </div>
      <h4 class="text-muted">No se encontraron productos</h4>
      <p class="text-muted mb-0">
        No hay productos que coincidan con "<strong>{$searchTerm}</strong>"
      </p>
      <p class="text-muted small">Intenta con otros términos de búsqueda</p>
    </div>
  {:else if !isSearching && $searchTerm.trim() === '' && productos.length === 0}
    <!-- Mensaje: No hay término de búsqueda, la búsqueda no está activa, y no hay productos en general -->
    <div class="text-center py-5">
      <h4 class="text-muted">Aún no hay productos disponibles.</h4>
      <p class="text-muted small">Vuelve a intentarlo más tarde.</p>
    </div>
  {/if}

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