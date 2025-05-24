<div class="row g-4">
    {#each Array(8) as _, index}
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 border-0 skeleton-card">
          <!-- Skeleton para imagen -->
          <div class="skeleton-img"></div>
          
          <div class="card-body d-flex flex-column">
            <!-- Skeleton para título -->
            <div class="skeleton skeleton-title mb-2"></div>
            
            <!-- Skeleton para categoría -->
            <div class="skeleton skeleton-category mb-2"></div>
            
            <!-- Skeleton para precio -->
            <div class="skeleton skeleton-price mb-3"></div>
            
            <!-- Skeleton para botón -->
            <div class="skeleton skeleton-button mt-auto"></div>
          </div>
        </div>
      </div>
    {/each}
  </div>