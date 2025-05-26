import { writable } from 'svelte/store';

// true si el footer debe mostrarse, false si debe ocultarse
export const showFooter = writable(true);
