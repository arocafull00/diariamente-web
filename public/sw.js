const SHELL_CACHE = "diariamente-shell-v6";
const STATIC_CACHE = "diariamente-static-v1";
const OFFLINE_URL = "/offline";
const HOME_KEY = "/__app-home";
const SHELL_ASSETS = [
  OFFLINE_URL,
  "/icon-192x192.png?v=5",
  "/icon-512x512.png?v=5",
  "/caras/01_gradiente.svg",
  "/caras/02_azul_rosa.svg",
  "/caras/03_verde_morado.svg",
  "/caras/04_naranja_amarillo.svg",
  "/caras/05_rosa_verde.svg",
  "/caras/alegria.svg",
  "/caras/ansiedad.svg",
  "/caras/rabia.svg",
  "/caras/tristeza.svg",
];
const APP_SHELL_PATHS = ["/inicio", "/mis-registros", "/perfil"];
const MAX_STATIC_ENTRIES = 300;
const STATIC_URL_PATTERN = /\/_next\/static\/[^"'\\s)]+/g;

function getStaticUrls(html) {
  return [...new Set(html.match(STATIC_URL_PATTERN) ?? [])].sort();
}

async function trimStaticCache(cache) {
  const keys = await cache.keys();
  const excess = keys.length - MAX_STATIC_ENTRIES;

  if (excess <= 0) {
    return;
  }

  await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
}

async function precacheStaticUrls(urls) {
  const cache = await caches.open(STATIC_CACHE);

  await Promise.all(
    urls.map(async (url) => {
      if (await cache.match(url)) {
        return;
      }

      const response = await fetch(url).catch(() => null);

      if (response?.ok) {
        await cache.put(url, response);
      }
    }),
  );
  await trimStaticCache(cache);
}

async function storeAppShell(pathname, response) {
  const html = await response.clone().text();
  const cache = await caches.open(SHELL_CACHE);

  await cache.put(pathname, response);
  await precacheStaticUrls(getStaticUrls(html));

  return html;
}

async function notifyClients(message) {
  const clients = await self.clients.matchAll({ type: "window" });

  for (const client of clients) {
    client.postMessage(message);
  }
}

async function revalidateAppShell(pathname, cached) {
  const response = await fetch(pathname).catch(() => null);

  if (!response?.ok || response.redirected) {
    return;
  }

  const [previousHtml, html] = await Promise.all([
    cached.text(),
    storeAppShell(pathname, response),
  ]);

  if (getStaticUrls(previousHtml).join() !== getStaticUrls(html).join()) {
    await notifyClients({ type: "app-updated" });
  }
}

function fetchDocument(request) {
  return fetch(request).catch(() => caches.match(OFFLINE_URL));
}

async function openAppShell(event, pathname) {
  const cached = await caches.match(pathname, { cacheName: SHELL_CACHE });

  if (cached) {
    event.waitUntil(revalidateAppShell(pathname, cached.clone()));
    return cached;
  }

  try {
    const response = await fetch(event.request);

    if (response.ok && !response.redirected) {
      event.waitUntil(storeAppShell(pathname, response.clone()));
    }

    return response;
  } catch {
    return caches.match(OFFLINE_URL);
  }
}

async function openHome(request) {
  const home = await caches.match(HOME_KEY, { cacheName: SHELL_CACHE });

  if (!home) {
    return fetchDocument(request);
  }

  return Response.redirect(new URL(await home.text(), self.location.origin), 302);
}

async function openStaticAsset(event) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(event.request);

  if (cached) {
    return cached;
  }

  const response = await fetch(event.request);

  if (response.ok) {
    event.waitUntil(cache.put(event.request, response.clone()));
  }

  return response;
}

async function cacheAppShell(home, paths) {
  const cache = await caches.open(SHELL_CACHE);

  await cache.put(HOME_KEY, new Response(home));
  await Promise.all(
    paths
      .filter((path) => APP_SHELL_PATHS.includes(path))
      .map(async (path) => {
        if (await cache.match(path)) {
          return;
        }

        const response = await fetch(path).catch(() => null);

        if (response?.ok && !response.redirected) {
          await storeAppShell(path, response);
        }
      }),
  );
}

async function clearAppShell() {
  const cache = await caches.open(SHELL_CACHE);

  await Promise.all(
    [HOME_KEY, ...APP_SHELL_PATHS].map((key) => cache.delete(key)),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && key !== STATIC_CACHE)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  const { data } = event;

  if (data?.type === "cache-app-shell") {
    event.waitUntil(cacheAppShell(data.home, data.paths));
    return;
  }

  if (data?.type === "clear-app-shell") {
    event.waitUntil(clearAppShell());
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(openStaticAsset(event));
    return;
  }

  if (url.pathname.startsWith("/caras/")) {
    event.respondWith(
      caches
        .match(url.pathname, { cacheName: SHELL_CACHE })
        .then((cached) => cached ?? fetch(request)),
    );
    return;
  }

  if (request.mode !== "navigate") {
    return;
  }

  if (!url.search && url.pathname === "/") {
    event.respondWith(openHome(request));
    return;
  }

  if (!url.search && APP_SHELL_PATHS.includes(url.pathname)) {
    event.respondWith(openAppShell(event, url.pathname));
    return;
  }

  event.respondWith(fetchDocument(request));
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
          icon: "/icon-192x192.png?v=5",
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
