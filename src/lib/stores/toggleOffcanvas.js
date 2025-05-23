/**
 * Alterna la visibilidad del offcanvas (mostrar/ocultar)
 * Esta función detecta automáticamente el estado actual y lo invierte
 */
export function mostrarOcultarOffcanvas() {
	const offcanvas = document.getElementById('offcanvasRight');
	if (!offcanvas) return;

	// Determinar si se debe mostrar u ocultar
	let mostrar = !offcanvas.classList.contains('show');

	// Añadir transiciones para el efecto visual
	offcanvas.classList.add('transition');

	// Mostrar u ocultar el offcanvas
	if (mostrar) {
		offcanvas.classList.add('show');
	} else {
		offcanvas.classList.remove('show');
		removerBackdrop();
	}
}

/**
 * Remueve el backdrop (fondo oscuro) del offcanvas si existe
 * Esta función se usa cuando se cierra el offcanvas
 */
function removerBackdrop() {
	const backdrop = document.querySelector('.offcanvas-backdrop');
	if (backdrop) {
		backdrop.remove();
	}
}

/**
 * Función para compatibilidad con código existente
 */
/*export function toggleOffcanvas(show) {
	const offcanvas = document.getElementById('offcanvasRight');
	if (!offcanvas) return;

	// Añadir transiciones para el efecto visual
	offcanvas.classList.add('transition');

	// Mostrar u ocultar según el parámetro
	if (show) {
		offcanvas.classList.add('show');
	} else {
		offcanvas.classList.remove('show');
		removerBackdrop();
	}
}*/

/**
 * Cierra el offcanvas con animación
 */
export function cerrarOffcanvas() {
	const offcanvas = document.getElementById('offcanvasRight');
	if (!offcanvas) return;

	// Añadir clases para la animación de cierre
	offcanvas.classList.add('transition');
	offcanvas.classList.add('hiding');

	// Quitar la clase show para iniciar el cierre
	offcanvas.classList.remove('show');

	// Quitar el backdrop
	const backdrop = document.querySelector('.offcanvas-backdrop');
	if (backdrop) {
		// Añadir fade-out al backdrop
		backdrop.classList.add('fade-out');

		// Remover después de la animación
		setTimeout(() => {
			backdrop.remove();
		}, 300);
	}

	// Quitar clase hiding después de completar la animación
	setTimeout(() => {
		if (offcanvas) {
			offcanvas.classList.remove('hiding');
			offcanvas.classList.remove('transition');
		}
	}, 500);
}
