/* Minimal service worker to prevent stale SW crashes in dev.
   This file intentionally avoids caching and simply proxies fetches. */

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  try {
    const url = new URL(event.request.url)
    // Avoid intercepting cross-origin requests (e.g. Google Fonts) which can
    // fail under CSP and produce unhandled rejection events in the SW.
    if (url.origin !== self.location.origin) return

    event.respondWith(
      fetch(event.request).catch(() => new Response('', { status: 504 }))
    )
  } catch {
    // If URL parsing fails for any reason, don't intercept.
    return
  }
})

