/* =====================================================================
   MODO SIN INTERNET (Service Worker)
   Este archivo funciona "detrás" de la app: guarda una copia de todos
   sus archivos en el teléfono. Si no hay señal, entrega esa copia.
   Si hay señal, trae la versión nueva y actualiza la copia.

   IMPORTANTE: cada vez que subas cambios a GitHub, cambia VERSION
   (por ejemplo "2026-11-20"). Así el teléfono sabe que hay algo nuevo.
   ===================================================================== */
const VERSION = "prevencion-2026-11-13j";
const ARCHIVOS = ["./", "./index.html", "./irl-datos.js", "./plantillas.js", "./pdf-lib.min.js",
                  "./manifest.json", "./icono-192.png", "./icono-512.png"];
const ESPERA_RED = 4000;   // con señal mala, a los 4 segundos usamos la copia guardada

// Al instalarse: guardamos todos los archivos
self.addEventListener("install", evento => {
  evento.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

// Al activarse: borramos copias de versiones antiguas
self.addEventListener("activate", evento => {
  evento.waitUntil(caches.keys().then(claves =>
    Promise.all(claves.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Cada vez que la app pide un archivo: primero la red (para tener lo último);
// si no hay señal o tarda mucho, la copia guardada.
self.addEventListener("fetch", evento => {
  const pedido = evento.request;
  if (pedido.method !== "GET") return;
  const url = new URL(pedido.url);
  const esNuestro = url.origin === self.location.origin;
  const esLibreria = url.hostname === "cdnjs.cloudflare.com";   // la librería para leer el Excel
  if (!esNuestro && !esLibreria) return;

  evento.respondWith((async () => {
    const cache = await caches.open(VERSION);
    try {
      const respuesta = await Promise.race([
        fetch(pedido),
        new Promise((_, falla) => setTimeout(() => falla(new Error("lenta")), ESPERA_RED))
      ]);
      if (respuesta && respuesta.ok) cache.put(pedido, respuesta.clone());
      return respuesta;
    } catch {
      const guardada = await cache.match(pedido, { ignoreSearch: true });
      if (guardada) return guardada;
      if (pedido.mode === "navigate") return cache.match("./index.html");
      return Response.error();
    }
  })());
});
