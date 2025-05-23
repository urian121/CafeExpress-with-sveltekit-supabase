import { writable } from 'svelte/store';

// Store para el contador de productos en el carrito
export const cartCount = writable(0);

// Función para actualizar el contador
export function actualizarContador(cantidad) {
    cartCount.set(cantidad);
}
