import { agregarAlCarrito } from './cartService.js';

/**
 * Retorna una función manejadora para agregar productos al carrito con estado de carga
 */
export const crearManejadorCarrito = (loadingButtons, triggerUpdate) => 
  async (productoId) => {
    loadingButtons.add(productoId);
    triggerUpdate();

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
