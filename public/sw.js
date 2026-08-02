const CACHE_NAME = "diariamente-shell-v4";
const SHELL_ASSETS = ["/offline", "/icon-192x192.png", "/icon-512x512.png"];

const NETWORK_ONLY_PREFIXES = [
  "/login",
  "/registro",
  "/recuperar-password",
  "/onboarding",
  "/inicio",
  "/pacientes",
  "/perfil",
  "/mis-registros",
  "/nuevo-registro",
  "/ajustes",
];

function isNetworkOnly(pathname) {
  if (pathname === "/") {
    return true;
  }

  return NETWORK_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

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
    isNetworkOnly(url.pathname) ||
    url.pathname.startsWith("/_next/") ||
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font"
  ) {
    return;
  }

  if (request.destination !== "document") {
    return;
  }

  event.respondWith(
    fetch(request).catch(() => caches.match("/offline")),
  );
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {
    title: "¿Deseas crear algún registro?",
    body: "Es hora de registrar tu estado emocional del día.",
    url: "/nuevo-registro",
  };

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          client.postMessage({ type: "realtime-refresh", topic: data.topic });
        }

        const hasVisibleClient = clients.some(
          (client) => client.visibilityState === "visible",
        );

        if (hasVisibleClient) {
          return null;
        }

        return self.registration.showNotification(data.title, {
          body: data.body,
          icon: "/icon-192x192.png",
          data: { url: data.url ?? "/" },
        });
      }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";

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
