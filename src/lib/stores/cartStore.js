import { writable, derived } from 'svelte/store';
import { obtenerCarrito, eliminarDelCarrito } from '$lib/services/cartService';

export const cartStore = writable([]);

// Contador total de productos (sumando cantidades)
export const cartCount = derived(cartStore, ($cartStore) =>
	$cartStore.reduce((total, item) => total + item.amount, 0)
);

// Subtotal total $
export const cartSubtotal = derived(cartStore, ($cartStore) =>
	$cartStore.reduce((total, item) => total + (item.products?.price || 0) * item.amount, 0)
);

// Cargar carrito desde backend
export async function cargarCarrito() {
    const data = await obtenerCarrito();
	cartStore.set(data || []);
}

// Reemplazar el carrito manualmente (opcional)
export function setCarrito(productos) {
	cartStore.set(productos);
}

// Eliminar producto del carrito
export async function eliminarProductoDelCarrito(product_id) {
	const res = await eliminarDelCarrito(product_id);
	if (res.success) {
		cargarCarrito(); // vuelve a cargar para reflejar cambios
	}
}
