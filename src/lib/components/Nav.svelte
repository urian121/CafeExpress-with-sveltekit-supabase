<script>
  import { searchTerm } from '$lib/stores/searchStore';
  import BtnCart from './BtnCart.svelte';
</script>

<nav class="navbar navbar-expand-lg bg-custom-navbar fixed-top px-3 mb-5">
  <div class="container-fluid">
    <a class="navbar-brand" href="./">
      <img src="logo.png" alt="Logo" class="img-fluid" style="width: 40px;">
    </a>

    <!-- Botón para colapsar en móviles -->
    <button class="navbar-toggler custom-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" 
      aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
      <i class="bi bi-list fs-3"></i>
    </button>

    <!-- Contenido colapsable -->
    <div class="collapse navbar-collapse justify-content-between" id="navbarContent">
      
      <!-- Buscador centrado -->
      <form class="d-flex mx-auto my-2 my-lg-0" role="search" style="max-width: 500px; width: 100%;">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Buscar un producto"
          aria-label="Buscar"
          style="border-radius: 5px;"
          bind:value={$searchTerm}
        >
      </form>

      <!-- Enlaces + botón de carrito -->
      <div class="d-flex align-items-center gap-3 mt-3 mt-lg-0">
        <a class="nav-link d-flex align-items-center" href="./">
          <i class="bi bi-person me-1"></i> Login
        </a>

        <BtnCart />
      </div>
    </div>
  </div>
</nav>
