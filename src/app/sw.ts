/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { NetworkFirst, Serwist } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Bulletins, schedule, and the kitchen order page: network-first with a
      // cached fallback so they remain readable offline.
      matcher: ({ request, url }) =>
        request.destination === 'document' &&
        (url.pathname.startsWith('/bulletins') ||
          url.pathname.startsWith('/schedule') ||
          url.pathname.startsWith('/kitchen')),
      handler: new NetworkFirst({
        cacheName: 'stmark-pages',
        networkTimeoutSeconds: 5,
      }),
    },
    // Static assets (fonts, icons, CSS/JS) are cache-first by default.
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document'
        },
      },
    ],
  },
})

serwist.addEventListeners()

self.addEventListener('push', (event) => {
  if (!event.data) return
  let payload: { title?: string; body?: string; url?: string } = {}
  try {
    payload = event.data.json() as typeof payload
  } catch {
    payload = { body: event.data.text() }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title ?? 'St. Mark Coptic Orthodox Center', {
      body: payload.body ?? '',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: { url: payload.url ?? '/' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const data = event.notification.data as { url?: string } | undefined
  const targetUrl = data?.url ?? '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus()
      }
      return self.clients.openWindow(targetUrl)
    }),
  )
})
