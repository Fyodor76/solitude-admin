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

const PUSH_NAVIGATE_MESSAGE = 'admin-push-navigate'

function resolveAdminUrl(href: string): string {
  const normalized = href.startsWith('/') ? href : `/${href}`
  return new URL(normalized, self.registration.scope).toString()
}

function withPushHash(targetUrl: string, href: string): string {
  const url = new URL(targetUrl)
  url.hash = `push-nav=${encodeURIComponent(href)}`
  return url.toString()
}

async function focusClientWithNavigation(client: WindowClient, href: string, targetUrl: string) {
  if ('navigate' in client && typeof client.navigate === 'function') {
    await client.focus()
    await client.navigate(withPushHash(targetUrl, href))
    client.postMessage({ type: PUSH_NAVIGATE_MESSAGE, href })
    return true
  }

  await client.focus()
  client.postMessage({ type: PUSH_NAVIGATE_MESSAGE, href })
  return true
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
  const launchUrl = withPushHash(targetUrl, href)

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      })

      for (const client of clients) {
        try {
          const handled = await focusClientWithNavigation(client, href, targetUrl)
          if (handled) {
            return
          }
        } catch {
          // try next client or open a new window
        }
      }

      await self.clients.openWindow(launchUrl)
    })()
  )
})

self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil(Promise.resolve())
})
