type AppShellMessage =
  | { type: "cache-app-shell"; home: string; paths: string[] }
  | { type: "clear-app-shell" };

function postToServiceWorker(message: AppShellMessage) {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  void navigator.serviceWorker.ready.then((registration) => {
    registration.active?.postMessage(message);
  });
}

export function cacheAppShell(home: string, paths: string[]) {
  postToServiceWorker({ type: "cache-app-shell", home, paths });
}

export function clearAppShell() {
  postToServiceWorker({ type: "clear-app-shell" });
}
