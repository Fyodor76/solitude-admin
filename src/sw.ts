/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

type AdminPushMessage = {
  title?: string
  body?: string
  href?: string
  tag?: string
  kind?: string
}

function resolveAdminUrl(href: string): string {
  const normalized = href.startsWith('/') ? href : `/${href}`
  return new URL(normalized, self.registration.scope).toString()
}

self.addEventListener('push', event => {
  const payload = (event.data?.json() ?? {}) as AdminPushMessage
  const title = payload.title?.trim() || 'Solitude Admin'
  const body = payload.body?.trim() || 'Новое уведомление'
  const href = payload.href?.trim() || '/'
  const tag = payload.tag?.trim() || 'admin-notification'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      data: {
        href,
        kind: payload.kind ?? 'system',
      },
      icon: `${self.registration.scope}icons/web-app-manifest-192x192.png`,
      badge: `${self.registration.scope}icons/favicon-96x96.png`,
      renotify: true,
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  const href = (event.notification.data?.href as string | undefined) ?? '/'
  const targetUrl = resolveAdminUrl(href)

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const client of clients) {
        if ('focus' in client) {
          void client.focus()
          if ('navigate' in client && typeof client.navigate === 'function') {
            return client.navigate(targetUrl)
          }
          return undefined
        }
      }

      return self.clients.openWindow(targetUrl)
    })
  )
})

self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil(Promise.resolve())
})
