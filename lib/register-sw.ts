export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[v0] SW registrado:', registration);
        })
        .catch((error) => {
          console.error('[v0] Error registrando SW:', error);
        });
    });
  }
}
