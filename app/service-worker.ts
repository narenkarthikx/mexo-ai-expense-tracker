const CACHE_NAME = "expenseai-v1"
const urlsToCache = ["/", "/dashboard", "/expenses", "/budget", "/analytics", "/manifest.json"]

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }),
  )
})
