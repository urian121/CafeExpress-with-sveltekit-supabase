<script>
	export let productos = [];
	export let subtotalCarrito = 0;

	function generateWhatsAppMessage() {
		// Construir el mensaje con los productos del carrito
		const cartItems = productos
			.map((item) => {
				return `${item.products?.name || 'Producto'} - ${item.amount}x $${item.products?.price || 0}`;
			})
			.join('\n'); // Une todos los productos con salto de línea

		const message = `¡Hola! Quiero hacer el siguiente pedido:\n\n${cartItems}\n\nSubtotal: $${subtotalCarrito.toFixed(2)}\n\n¡Gracias!`;

		// Codificar el mensaje para usarlo en una URL
		return encodeURIComponent(message);
	}

	function enviarPedido() {
		const message = generateWhatsAppMessage();
		const phoneNumber = '+573213872648';
		const url = `https://wa.me/${phoneNumber}?text=${message}`;
		window.open(url, '_blank');
	}
</script>

<button
	disabled={productos.length === 0}
	class="btn btn-order mt-auto w-100"
	onclick={enviarPedido}
>
	Procesar compra <i class="bi bi-whatsapp ms-2"></i>
</button>
