import { supabase } from '$lib/supabaseClient';

/**
 * Obtiene los productos de la base de datos
 */
export async function obtenerProductos() {
    const { data, error } = await supabase.from('tbl_products').select('*');
    return { data, error };
}
  

/**
 * Agrega un producto al carrito
 */
export async function agregarAlCarrito(product_id) {
    try {
        const { data } = await supabase
          .from('tbl_cart_items')
          .select('id, amount')
          .eq('product_id', product_id)
          .single();
    
        if (data) {
          // Actualiza la cantidad si ya existe
          const { error } = await supabase
            .from('tbl_cart_items')
            .update({ amount: data.amount + 1 })
            .eq('id', data.id);
          if (error) throw error;
          console.log("Cantidad actualizada en el carrito!");
        } else {
          // Inserta si no existe
          const { error } = await supabase
            .from('tbl_cart_items')
            .insert([{ product_id, amount: 1 }]);
          if (error) throw error;
          console.log("Producto agregado al carrito!");
        }
      } catch (err) {
        console.log("Error al agregar/actualizar en el carrito:", err.message);
    }
}

/**
 * Elimina un producto del carrito
 */
export async function eliminarDelCarrito(product_id) {
  try {
    const { error } = await supabase
      .from('tbl_cart_items')
      .delete()
      .eq('product_id', product_id);
    if (error) throw error;
    return { success: true, message: "Producto eliminado del carrito!" };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Obtiene el carrito de la base de datos
 */
export async function obtenerCarrito() {
  const { data, error } = await supabase
    .from('tbl_cart_items')
    .select(`
      id,
      amount,
      product_id,
      created_at,
      tbl_products (
        id,
        name,
        price,
        image,
        category
      )
    `);

  if (error) {
    return [];
  }
  return data;
}

// import { agregarAlCarrito, eliminarDelCarrito, obtenerCarrito } from '$lib/cartService.js';