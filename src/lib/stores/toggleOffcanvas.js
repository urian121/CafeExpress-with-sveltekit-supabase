const getOffcanvas = () => document.getElementById('offcanvasRight');
const getBackdrop = () => document.querySelector('.offcanvas-backdrop');

export function mostrarOcultarOffcanvas() {
	const offcanvas = getOffcanvas();
	if (!offcanvas) return;

	const mostrar = !offcanvas.classList.contains('show');
	offcanvas.classList.add('transition');
	offcanvas.classList.toggle('show', mostrar);

	if (!mostrar) getBackdrop()?.remove();
}

export function cerrarOffcanvas() {
	const offcanvas = getOffcanvas();
	if (!offcanvas) return;

	offcanvas.classList.add('transition', 'hiding');
	offcanvas.classList.remove('show');

	const backdrop = getBackdrop();
	if (backdrop) {
		backdrop.classList.add('fade-out');
		setTimeout(() => backdrop.remove(), 300);
	}

	setTimeout(() => {
		offcanvas.classList.remove('hiding', 'transition');
	}, 500);
}
