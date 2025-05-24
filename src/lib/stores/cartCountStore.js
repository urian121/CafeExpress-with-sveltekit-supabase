import { writable } from 'svelte/store';

export const cartCount = writable(0);

export function actualizarContador(cantidad) {
	cartCount.set(cantidad);
}