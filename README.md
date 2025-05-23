```bash
npm install @supabase/supabase-js
```
Clave BD: x1nXcoh2Oc7kcUII

// https://supabase.com/dashboard/project/vorkqgwvnizclwjdpodu


<script>
  let nombre = '';
  let precio = '';
  let categoria = '';

  const guardarProducto = async () => {
    const res = await fetch('/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio, categoria })
    });

    const data = await res.json();
    if (data.success) {
      alert('Producto guardado!');
    } else {
      alert('Error: ' + data.error);
    }
  };
</script>

<form on:submit|preventDefault={guardarProducto}>
  <input bind:value={nombre} placeholder="Nombre" />
  <input bind:value={precio} placeholder="Precio" type="number" />
  <input bind:value={categoria} placeholder="Categoría" />
  <button type="submit">Guardar</button>
</form>



	async function agregarAlCarrito(product_id) {
    const { error } = await supabase.from('tbl_cart_items').insert([{ product_id, amount: 1 }]);
    if (error) {
		console.log("Error al agregar al carrito:", error.message);
    } else {
		console.log("Producto agregado al carrito!");
    }
  }




  async function eliminarDelCarrito(product_id) {
  try {
    const { error } = await supabase
      .from('tbl_cart_items')
      .delete()
      .eq('product_id', product_id);
    if (error) throw error;
    console.log("Producto eliminado del carrito!");
  } catch (err) {
    console.log("Error al eliminar del carrito:", err.message);
  }
}

<button on:click={() => eliminarDelCarrito(producto.id)}>
  Eliminar del carrito
</button>