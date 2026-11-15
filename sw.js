/* =====================================================================
   MODO SIN INTERNET (Service Worker)
   Este archivo funciona "detrás" de la app: guarda una copia de todos
   sus archivos en el teléfono. Si no hay señal, entrega esa copia.
   Si hay señal, trae la versión nueva y actualiza la copia.

   IMPORTANTE: cada vez que subas cambios a GitHub, cambia la fecha de VERSION
   (por ejemplo "2026-11-20"). Así el teléfono sabe que hay algo nuevo.
   Cada versión de la app (cada carpeta) tiene sus propias copias: así dos versiones
   en el mismo sitio no se borran entre ellas.
   ===================================================================== */
const BASE = "prevencion:" + self.registration.scope + ":";
const VERSION = BASE + "2026-11-15e";
const ARCHIVOS = ["./", "./index.html", "./plantillas.js", "./pdf-lib.min.js", "./xlsx.full.min.js",
                  "./manifest.json", "./icono-192.png", "./icono-512.png"];
// "reload"/"no-cache": se pide SIEMPRE al servidor (si no cambió, responde rápido), nunca una copia vieja del navegador
const fresco = url => new Request(url, { cache: "reload" });
const ESPERA_RED = 4000;   // con señal mala, a los 4 segundos usamos la copia guardada

// Al instalarse: guardamos todos los archivos
self.addEventListener("install", evento => {
  // Los archivos de la app, y si existe (versión de una empresa) el paquete de formatos incluido
  evento.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS.map(fresco)).then(() => c.add(fresco("./paquete-incluido.js")).catch(() => {}))));
  self.skipWaiting();
});

// Al activarse: borramos SOLO nuestras copias antiguas (las de otras versiones de la app no se tocan)
self.addEventListener("activate", evento => {
  evento.waitUntil((async () => {
    for (const k of await caches.keys()) {
      if (k === VERSION) continue;
      if (k.startsWith(BASE)) { await caches.delete(k); continue; }
      if (/^prevencion-20\d\d/.test(k)) {   // nombre antiguo (sin carpeta): se borra solo si es de esta carpeta
        const dentro = await (await caches.open(k)).keys();
        if (dentro.length && dentro[0].url.startsWith(self.registration.scope)) await caches.delete(k);
      }
    }
  })());
  self.clients.claim();
});

// Cada vez que la app pide un archivo: primero la red (para tener lo último);
// si no hay señal o tarda mucho, la copia guardada.
self.addEventListener("fetch", evento => {
  const pedido = evento.request;
  if (pedido.method !== "GET") return;
  const url = new URL(pedido.url);
  if (url.origin !== self.location.origin) return;   // todo lo de la app es propio (también el lector de Excel)

  evento.respondWith((async () => {
    const cache = await caches.open(VERSION);
    try {
      const respuesta = await Promise.race([
        fetch(pedido, { cache: "no-cache" }),
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

// Aviso diario con la app cerrada (Chrome en Android, con la app instalada). La app deja en IndexedDB
// una copia de lo que vence (el service worker no puede leer localStorage). Nada sale del teléfono.
const BD_AVISOS = "prevencion-avisos:" + new URL(self.registration.scope).pathname;
function bdAvisos(modo, accion) {
  return new Promise((ok, falla) => {
    const p = indexedDB.open(BD_AVISOS, 1);
    p.onupgradeneeded = () => p.result.createObjectStore("datos");
    p.onerror = () => falla(p.error);
    p.onsuccess = () => {
      const bd = p.result, tx = bd.transaction("datos", modo), pedido = accion(tx.objectStore("datos"));
      tx.oncomplete = () => { ok(pedido.result); bd.close(); };
      tx.onerror = () => { falla(tx.error); bd.close(); };
    };
  });
}
async function avisoDiario() {
  const hoy = new Date().toLocaleDateString("sv-SE");
  if (await bdAvisos("readonly", s => s.get("ultima")) === hoy) return;   // máximo un aviso al día
  const lista = (await bdAvisos("readonly", s => s.get("vencimientos"))) || [];
  const dias = f => Math.round((new Date(f + "T12:00:00") - new Date(hoy + "T12:00:00")) / 86400000);
  const items = lista.filter(x => x && x.vence && dias(x.vence) <= Math.max(...(x.avisos || [30]))).sort((a, b) => a.vence.localeCompare(b.vence));
  if (!items.length) return;
  const venc = items.filter(x => dias(x.vence) < 0).length;
  const linea = x => { const d = dias(x.vence); return `${x.texto}: ${d < 0 ? "venció hace " + -d + " día(s)" : d === 0 ? "vence hoy" : "vence en " + d + " día(s)"}`; };
  await self.registration.showNotification(venc ? `⛔ ${venc} vencido(s) · ${items.length - venc} por vencer` : `⏰ ${items.length} por vencer`, {
    body: items.slice(0, 3).map(linea).join("\n") + (items.length > 3 ? `\n…y ${items.length - 3} más` : ""),
    tag: "prevencion-vencimientos", icon: "icono-192.png", badge: "icono-192.png"
  });
  await bdAvisos("readwrite", s => s.put(hoy, "ultima"));
}
self.addEventListener("periodicsync", evento => {
  if (evento.tag === "revisar-vencimientos") evento.waitUntil(avisoDiario().catch(() => {}));
});
// Tocar el aviso abre la app (o la trae al frente si ya está abierta)
self.addEventListener("notificationclick", evento => {
  evento.notification.close();
  evento.waitUntil((async () => {
    for (const c of await self.clients.matchAll({ type: "window", includeUncontrolled: true }))
      if (c.url.startsWith(self.registration.scope)) return c.focus();
    return self.clients.openWindow(self.registration.scope);
  })());
});
