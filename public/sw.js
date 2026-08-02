const CACHE_NAME = "diariamente-shell-v1";
const SHELL_ASSETS = ["/", "/offline", "/icon-192x192.png", "/icon-512x512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    return;
  }

  if (
    url.pathname.startsWith("/inicio") ||
    url.pathname.startsWith("/pacientes") ||
    url.pathname.startsWith("/registro") ||
    url.pathname.startsWith("/perfil") ||
    url.pathname.startsWith("/mis-registros") ||
    url.pathname.startsWith("/nuevo-registro")
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request)
        .then((response) => {
          if (
            response.ok &&
            (request.destination === "style" ||
              request.destination === "script" ||
              request.destination === "font" ||
              request.destination === "image")
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }

          return response;
        })
        .catch(() => caches.match("/offline"));
    }),
  );
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {
    title: "¿Deseas crear algún registro?",
    body: "Es hora de registrar tu estado emocional del día.",
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192x192.png",
      data: { url: "/nuevo-registro" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/nuevo-registro";

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      return self.clients.openWindow(url);
    }),
  );
});
