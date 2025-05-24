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
			console.log('Cantidad actualizada en el carrito!');
		} else {
			// Inserta si no existe
			const { error } = await supabase.from('tbl_cart_items').insert([{ product_id, amount: 1 }]);
			if (error) throw error;
			console.log('Producto agregado al carrito!');
		}

		// Actualizar el contador global
		const total = await obtenerTotalProductos();
		actualizarContador(total);

		return { success: true };
	} catch (err) {
		console.log('Error al agregar/actualizar en el carrito:', err.message);
		return { success: false };
	}
}

/**
 * Reduce la cantidad de un producto en el carrito
 * Si la cantidad llega a cero, elimina el producto
 * @param {string} product_id - ID del producto a eliminar
 */
export async function eliminarDelCarrito(product_id) {
	try {
		// Primero obtenemos el ítem actual para ver su cantidad
		const { data: itemActual } = await supabase
			.from('tbl_cart_items')
			.select('id, amount')
			.eq('product_id', product_id)
			.single();

		// Si no existe el ítem, retornamos error
		if (!itemActual) {
			return { success: false, message: 'Producto no encontrado en el carrito' };
		}

		// Si la cantidad es mayor a 1, disminuimos en 1
		if (itemActual.amount > 1) {
			const { error } = await supabase
				.from('tbl_cart_items')
				.update({ amount: itemActual.amount - 1 })
				.eq('id', itemActual.id);

			if (error) throw error;
			return { success: true, message: 'Cantidad reducida en el carrito' };
		} else {
			// Si la cantidad es 1, eliminamos el ítem completamente
			const { error } = await supabase.from('tbl_cart_items').delete().eq('id', itemActual.id);
			if (error) throw error;
			return { success: true, message: 'Producto eliminado del carrito' };
		}
	} catch (err) {
		console.error('Error al eliminar del carrito:', err);
		return { success: false, message: err.message };
	}
}

/**
 * Obtiene el carrito de la base de datos con información completa de los productos
 */
export async function obtenerCarrito() {
	const { data, error } = await supabase
		.from('tbl_cart_items')
		.select(`
      id,
      amount,
      product_id,
      created_at,
      products:tbl_products(id, name, price, image, category)
    `);

	if (error) {
		console.error('Error al obtener el carrito:', error);
		return [];
	}

	// Verificar que los datos existan
	if (!data || data.length === 0) {
		return [];
	}

	return data;
}

/**
 * Obtiene el total de productos en el carrito
 * @returns {Promise<number>} Total de productos
 */
export async function obtenerTotalProductos() {
	try {
		const { data, error } = await supabase
			.from('tbl_cart_items')
			.select('amount');

		if (error) {
			console.error('Error al obtener total de productos:', error);
			return 0;
		}

		// Sumar todas las cantidades
		const total = data.reduce((sum, item) => sum + item.amount, 0);
		// Actualizar el contador global
		actualizarContador(total);
		return total;
	} catch (err) {
		console.error('Error en obtenerTotalProductos:', err);
		actualizarContador(0);
		return 0;
	}
}
