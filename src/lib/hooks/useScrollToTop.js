import { writable } from 'svelte/store';

export function useScrollToTop(offset = 300) {
  const showButton = writable(false);

  const handleScroll = () => {
    showButton.set(window.scrollY > offset);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const init = () => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // por si ya está scrolleado al montar
    return () => window.removeEventListener('scroll', handleScroll);
  };

  return { showButton, scrollToTop, init };
}
