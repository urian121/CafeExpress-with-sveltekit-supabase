import { supabase } from '$lib/supabaseClient';
import { actualizarContador } from './stores/cartCountStore';

/**
 * Obtiene los productos de la base de datos
 */
export async function obtenerProductos() {
	const { data, error } = await supabase.from('tbl_products').select('*');
	return { data, error };
}

/**
 * Retorna una función manejadora para agregar productos al carrito con estado de carga
 */
export const crearManejadorCarrito = (loadingButtons, triggerUpdate) => 
  async (productoId) => {
    loadingButtons.add(productoId);
    triggerUpdate(); // Actualiza el estado del carrito

    try {
      const res = await agregarAlCarrito(productoId);
      if (!res?.success) console.error('Error:', res?.message);
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
    } finally {
      loadingButtons.delete(productoId);
      triggerUpdate();
    }
};

/**
 * Agrega un producto al carrito
 */
export async function agregarAlCarrito(product_id) {
	try {
		const { data } = await supabase
			.from('tbl_cart_items')
			.select('id, amount')
			.eq('product_id', product_id)
			.maybeSingle();

		if (data) {
			// Actualiza la cantidad si ya existe
			const { error } = await supabase
				.from('tbl_cart_items')
				.update({ amount: data.amount + 1 })
				.eq('id', data.id);
			if (error) throw error;
			console.log('Cantidad actualizada en el carrito!');
		} else {
			// Inserta si no existe
			const { error } = await supabase.from('tbl_cart_items').insert([{ product_id, amount: 1 }]);
			if (error) throw error;
			console.log('Producto agregado al carrito!');
		}

		// Actualizar el contador global
		const total = await obtenerTotalProductos();
		console.log('Total de productos en el carrito:', total)
		actualizarContador(total);

		return { success: true };
	} catch (err) {
		console.log('Error al agregar/actualizar en el carrito:', err.message);
		return { success: false };
	}
}

/**
 * Reduce la cantidad de un producto en el carrito
 */
export async function eliminarDelCarrito(product_id) {
	try {
		const { data: itemActual } = await supabase
			.from('tbl_cart_items')
			.select('id, amount')
			.eq('product_id', product_id)
			.single();

		if (!itemActual) {
			return { success: false, message: 'Producto no encontrado en el carrito' };
		}

		if (itemActual.amount > 1) {
			const { error } = await supabase
				.from('tbl_cart_items')
				.update({ amount: itemActual.amount - 1 })
				.eq('id', itemActual.id);

			if (error) throw error;
		} else {
			const { error } = await supabase.from('tbl_cart_items').delete().eq('id', itemActual.id);
			if (error) throw error;
		}

		// Actualiza el contador global después de modificar el carrito
		const total = await obtenerTotalProductos();
		actualizarContador(total);

		return { success: true, message: 'Carrito actualizado correctamente' };
	} catch (err) {
		console.error('Error al eliminar del carrito:', err);
		return { success: false, message: err.message };
	}
}


/**
 * Obtiene el carrito de la base de datos con información completa de los productos
 */
export async function obtenerCarrito() {
  try {
    const { data, error } = await supabase
      .from('tbl_cart_items')
      .select(`
        id,
        amount,
        product_id,
        created_at,
        products:tbl_products(id, name, price, image, category)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    return [];
  }
}

/**
 * Obtiene el total de productos en el carrito
 */
export async function obtenerTotalProductos() {
	try {
		const { error, count } = await supabase
			.from('tbl_cart_items')
			.select('id', { count: 'exact', head: true });

		if (error) {
			console.error('Error al obtener total de productos:', error);
			return 0;
		}

		console.log('Total de productos distintos en el carrito:', count);
		actualizarContador(count || 0);
		return count || 0;
	} catch (err) {
		console.error('Error en obtenerTotalProductos:', err);
		actualizarContador(0);
		return 0;
	}
}